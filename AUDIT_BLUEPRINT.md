# Three Lines: Architectural Audit and Remediation Blueprint

Read-only architectural review. No source files were modified. Scope: performance, security, scaling, and codebase health across the Next.js 14 App Router application and its Supabase (Postgres) backend.

Reviewer role: principal security engineer / software architect.
Verdict summary: the application is well-structured and unusually thoughtful for its size (clear module boundaries, real rate limiting, RLS enabled everywhere, careful client/server data splitting). It has one critical privilege-escalation flaw in the database policy layer and a small number of medium-severity issues. None of the rest is alarming; most are optimizations and hygiene.

---

## 1. Architecture map

### 1.1 Stack
- **Framework:** Next.js 14.2.3 (App Router), React 18, TypeScript (strict).
- **Styling:** Tailwind CSS, class-based dark mode set pre-paint by an inline script.
- **Data/auth:** Supabase (Postgres + Auth). Browser uses the anon key with RLS; server routes use the service-role key.
- **External providers:** ESV API (Crossway) and API.Bible for passage text; Resend for reply emails; Google Sheets (service-account JWT) for feedback/visit logging.
- **Hosting:** Vercel. CDN caching driven by `Cache-Control` headers on API responses.

### 1.2 Module boundaries (a genuine strength)
- `lib/data.ts` (~4,430 lines, the whole-Bible pericope dataset) is **server-only**. The browser instead imports `lib/books-index.ts`, a lightweight metadata file. `app/notebook/[book]/[chapter]/page.tsx` resolves the active book server-side and passes only that book to `NotebookClient`. This is the single most important scaling decision in the codebase and it is done correctly.
- The large `NotebookClient` is decomposed into focused hooks (`useNotes`, `useCommunity`, `usePassages`, `useChapterScroll`, `useNoteSearch`, `useBookmarks`, `useBookProgress`) and presentational components. Good separation.
- `lib/site.ts`, `lib/rate-limit.ts`, `lib/google-sheets.ts`, `lib/request-geo.ts` are small, single-purpose, and documented.

### 1.3 Primary execution paths

**Read a passage (core loop).**
`NotebookClient` renders all chapters of the active book. `usePassages` uses an `IntersectionObserver` (600px rootMargin) to lazily fetch each chunk from `GET /api/passage`. That route: blocks cross-site fetches via `sec-fetch-site`, applies a per-IP rate limit (240/60s), then for ESV fetches fresh from Crossway every time (their terms forbid storage) while non-ESV translations are cached in the `passages` table for 30 days. CDN caching (`s-maxage=86400, stale-while-revalidate=604800`) absorbs repeat hits.

**Write a note.**
`StudyLines` textarea -> `useNotes.handleNoteChange` updates local state immediately and debounces an 800ms upsert directly to Supabase (`notes` table, RLS-guarded, composite key `user_id,passage_ref,track_id`). Emptying a line deletes the row. Visibility (`is_public`) is per passage-chunk.

**Community + replies.**
`useCommunity` reads public notes (per-book, global feed with pagination, and a `top_passages` RPC aggregation). Replies post through `POST /api/comment` (service role), which authenticates the bearer token, rate-limits (20/hr/user), inserts the comment, and fires in-app + email notifications best-effort.

**Auth.**
Supabase Google OAuth + email/password, plus a dev-only anonymous login (`/api/dev-auth`, gated on `NODE_ENV === 'development'`). `useUser` centralizes session state.

**Moderation.**
`/api/admin/reports` gates on `profiles.is_admin`. Admins can remove notes or dismiss reports.

**Telemetry.**
`TrackVisit` fires one `POST /api/track` per session; the contact form posts to `/api/contact`. Both append rows to Google Sheets and are IP-rate-limited.

---

## 2. Findings, ranked

Severity: **CRITICAL** (exploitable now, real impact) > **HIGH** > **MEDIUM** > **LOW** > **NIT**.

---

### HIGH-1: IP rate limiting keys on a client-spoofable value

**Evidence:** `lib/rate-limit.ts:18`
```js
req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? req.headers.get('x-real-ip') ?? 'unknown'
```
The **leftmost** `X-Forwarded-For` entry is attacker-controlled. A caller can send `X-Forwarded-For: <random>` on every request; Vercel appends the real IP but does not strip client-supplied entries, so `split(',')[0]` returns the spoofed value. Every counter (`passage:`, `contact:`, `track:`, `top-passages:`) is therefore trivially bypassable by rotating that header.

**Impact:** The per-IP caps that protect the ESV / API.Bible quotas and the Sheets logging (CRITICAL business constraint: Crossway quota) can be defeated. This undermines the main non-DB rate limiter in the app.

**Fix:** Prefer the platform-trusted header. On Vercel, `x-real-ip` is set to the actual client IP and cannot be spoofed. Use it first and only fall back to the **rightmost** `X-Forwarded-For` segment:
```js
export function clientIp(req: Request): string {
  const real = req.headers.get('x-real-ip')?.trim()
  if (real) return real
  const xff = req.headers.get('x-forwarded-for')
  if (xff) { const parts = xff.split(','); return parts[parts.length - 1].trim() }
  return 'unknown'
}
```

---

### MEDIUM-1: Module-level Supabase clients throw at import time on missing env; inconsistent with the lazy pattern used elsewhere

**Evidence:** `app/api/passage/route.ts:11`, `app/api/report/route.ts:4`, `app/api/account/route.ts:4`, `app/api/top-passages/route.ts:10`, `app/api/admin/reports/route.ts:4` all do:
```js
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
```
at module scope with non-null assertions. Meanwhile `app/api/comment/route.ts:8` and `lib/rate-limit.ts:8` deliberately use a **lazy** `getSupabase()` with the documented rationale that a missing env var should fail one request rather than break the build. The pattern is applied inconsistently.

**Impact:** If an env var is ever missing/misnamed in an environment, these routes fail at import (harder to diagnose, can affect build/prerender) instead of returning a clean 500. Low likelihood in a correctly configured Vercel project, but it is avoidable inconsistency.

**Fix:** Extract one shared `lib/supabase-admin.ts` exporting a lazy service-role client and use it in every route. Removes five duplicated initializations and the non-null assertions.

---

### MEDIUM-4: Google Sheets logging runs inline on the request path

**Evidence:** `app/api/contact/route.ts:64` and `app/api/track/route.ts:24` both `await appendRow(...)`. `appendRow` (`lib/google-sheets.ts:154`) can perform a token exchange, a header-ensure round trip (`ensureHeader`, up to two Sheets calls), and the append; three-plus external HTTP calls to Google on a cold container.

**Impact:** `/api/track` fires on first paint for every new session. When the Sheets token is cold or `ensureHeader` needs a structural edit, the visitor's tracking request (and, for contact, the user's submit) blocks on multiple Google API round trips. Latency and a hard dependency on Google availability sit on the user path. Sheets is also a poor primitive for analytics volume.

**Fix:** Decouple logging from the response. Either return `202` immediately and do the Sheets write in a fire-and-forget task (acceptable on Vercel for best-effort logging), or move telemetry to an append-friendly store (a Postgres `events` table, or a queue). At minimum, cache the `getSheetId`/header check so `ensureHeader` is a no-op after the first call per container (it partially is, but the values read still happens every append).

---

### MEDIUM-5: `sitemap.ts` imports the full Bible dataset and emits ~1,190 URLs

**Evidence:** `app/sitemap.ts` iterates `BOOKS.flatMap(book => book.chapters.map(...))`. This pulls the 4,430-line `lib/data.ts` and generates one URL per chapter across 66 books.

**Impact:** Server-only, so no client cost, but it is a large synchronous data pull on the sitemap route and a very large sitemap. Fine at current scale; worth noting for build time and crawler budget.

**Fix:** Acceptable as-is. If build time becomes a concern, generate the sitemap from `BOOKS_INDEX` (chapter counts) instead of the full pericope dataset, avoiding the heavy import.

---

### LOW-1: Rate limiter fails open

**Evidence:** `lib/rate-limit.ts:34` returns `true` (allow) on any RPC error. Documented intentionally so a DB blip does not take routes down.

**Impact:** If Supabase is degraded, all IP limits silently disappear, exactly when the app is most vulnerable to quota drain. Reasonable trade-off but worth a conscious decision.

**Fix:** Keep fail-open for `/api/track` and `/api/contact`; consider fail-closed (or a low static cap) for `/api/passage`, which guards a paid external quota.

---

### LOW-2: Duplicated profile fetches across components

**Evidence:** `Navbar.tsx:95`, `NotebookClient.tsx:104`, and `ProfileClient.tsx:55` each independently `select` from `profiles` for the same user on mount. Three round trips for overlapping data on a notebook page load.

**Impact:** Minor extra latency and DB reads per navigation. Not a correctness issue.

**Fix:** Lift profile into a shared context/hook (mirroring `useUser`) so display name, admin flag, and preferences are fetched once and shared.

---

### LOW-3: `dangerouslySetInnerHTML` theme script forces CSP to allow `unsafe-inline`/`unsafe-eval`

**Evidence:** `app/layout.tsx:31` injects the inline no-flash theme script; `next.config.js:9` consequently allows `script-src 'unsafe-inline' 'unsafe-eval'`.

**Impact:** The CSP is weaker than it could be. Actual XSS risk is low because user content is rendered as **text** (`whitespace-pre-line` / `pre-wrap`, never `dangerouslySetInnerHTML` for user data), so there is no obvious injection sink. Still, `unsafe-inline` scripts negate much of the CSP's value.

**Fix:** Move to a nonce-based CSP (Next.js middleware can generate a per-request nonce and attach it to the inline script), then drop `unsafe-inline` for `script-src`. `unsafe-eval` is only needed by the dev runtime and can be limited to development.

---

### LOW-4: `.single()` on cache lookups and profile reads

**Evidence:** `app/api/passage/route.ts:98` and several client reads use `.single()`, which errors when zero rows exist. The passage route ignores the error and proceeds (correct), but `.maybeSingle()` expresses intent better and avoids noisy error objects.

**Fix:** Use `.maybeSingle()` where "zero rows" is a valid, expected outcome (cache miss, missing profile).

---

### LOW-5: `parent_id` polymorphism relies on two speculative lookups per reply

**Evidence:** `app/api/comment/route.ts:66` fires both `createInAppNotification` (queries `notes`) and `notifyReplyAuthor` (queries `comments`) for every reply, because `parent_id` may point at either table. Each aborts if its table does not match.

**Impact:** Extra query per reply and a design smell (untyped polymorphic FK). Low volume, low impact.

**Fix:** Add a `parent_type` discriminator column (`'note' | 'comment'`) set at insert, and branch on it instead of probing both tables. Documents intent and halves the lookups.

---

### NIT-level

- **Dead file:** `docs/index.html` is a static meta-refresh redirect stub to the Vercel URL, unrelated to the Next.js app. If GitHub Pages is not in use, remove it to avoid a second, stale entry point.
- **Hardcoded values:** `SPREADSHEET_ID` (`lib/google-sheets.ts:13`) and the Resend `from` address `onboarding@resend.dev` (`app/api/comment/route.ts:133`) are literals. Move to env for portability; the Resend sandbox sender will not deliver to arbitrary recipients in production.
- **ESLint `exhaustive-deps` disabled widely** across hooks. Each suppression is defensible individually, but the blanket pattern hides genuine stale-closure risks. Consider annotating why per case, or refactoring the effects.
- **Test coverage is thin:** only `lib/data.test.ts` and `lib/passage-ref.test.ts`. The security-sensitive surface (rate limiting, auth gating, RLS assumptions) has no tests.
- **`clientIp` returns the literal `'unknown'`** as a shared bucket, so all header-less callers share one rate-limit counter. Fine, but note it in local dev.

---

## 3. What is done well (keep it)

- Server/client data split for the Bible dataset is exemplary and is the reason this app scales on the client.
- RLS is enabled on every table, with a documented "no policy = service-role only" convention for `rate_limits` and `notifications`.
- The rate limiter is backed by an atomic `SECURITY DEFINER` Postgres function with row locking (`check_rate_limit`, `supabase-schema.sql:166`), correctly surviving serverless cold starts. The **only** weakness is the spoofable key (HIGH-1), not the mechanism.
- Aggregations that must not leak `user_id` (`top_passages`) run server-side in the DB and are enriched with server-only pericope data in the route.
- Input validation in `/api/contact` and `/api/comment` is careful (type checks before string methods, length caps, honeypot field, email regex).
- CDN cache headers are set deliberately per route with sensible `stale-while-revalidate` windows.
- Idempotent, re-runnable schema with `NOT VALID` length constraints for safe rollout on populated tables.

---

## 4. Prioritized remediation plan

Do them in this order.

Already fixed and committed to the codebase (re-run `supabase-schema.sql` in the Supabase SQL editor to apply the DB-side changes):
- Admin self-promotion via the `profiles` UPDATE policy (column-scoped grants + guard trigger).
- Bypassable `comments` insert policy (removed; writes go only through the service-role route).
- Over-broad `profiles` read policy (column-scoped read grants + `get_my_profile()` RPC; client own-profile reads moved to the RPC).
- `comment_likes` liker-identity exposure (own-rows-only select policy + `reply_like_counts()` aggregate RPC; `loadReplies` updated).

Remaining:

| # | Severity | Action | Effort | File(s) |
|---|---|---|---|---|
| 1 | HIGH | Rekey rate limiting on `x-real-ip` (or rightmost XFF) | S | `lib/rate-limit.ts:18` |
| 2 | MEDIUM | Move Sheets logging off the request path (202 + fire-and-forget, or a queue/table) | M | `app/api/track/route.ts`, `app/api/contact/route.ts`, `lib/google-sheets.ts` |
| 3 | MEDIUM | Consolidate service-role client into one lazy `lib/supabase-admin.ts` | S | 5 route files |
| 4 | LOW | Shared profile context to dedupe fetches | S | `Navbar`, `NotebookClient`, `ProfileClient` |
| 5 | LOW | Nonce-based CSP; drop `unsafe-inline` for scripts | M | `app/layout.tsx`, `next.config.js` |
| 6 | LOW | Fail-closed (or low static cap) for `/api/passage` when the limiter errors | S | `lib/rate-limit.ts`, `app/api/passage/route.ts` |
| 7 | LOW | `parent_type` discriminator to replace polymorphic double-lookup | M | `supabase-schema.sql`, `app/api/comment/route.ts` |
| 8 | NIT | Remove `docs/index.html`; move `SPREADSHEET_ID` and Resend sender to env; add tests for auth/rate-limit gating | S-M | various |

Effort: S = under an hour, M = a few hours.

---

## 5. Bottom line

The application is not "vibe-coded." It shows deliberate architecture: correct client/server data partitioning, real DB-backed rate limiting, RLS on every table, and careful input validation. All four database-layer security findings (admin self-promotion, bypassable comment inserts, over-broad profile reads, and liker-identity exposure) are now closed in code; re-run `supabase-schema.sql` to apply the DB side. The highest-value remaining fix is the spoofable rate-limit key (item 1). Everything after that is optimization and hygiene, not firefighting.
