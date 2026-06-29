# Future Improvements

A running list of ideas organized as discrete commits. Add to this as new ideas come up.

### P1 — Required before sharing widely

**feat(seo): the site is effectively invisible to search and unshareable on social**
There is no `public/` directory, no favicon, no `robots.txt`, no `sitemap.xml`, no Open Graph
or Twitter card tags, and no `metadataBase`. Every page also shares the single title
"Three Lines" because the content pages are `'use client'` and can't export `metadata`.
Concretely:
- Add `metadataBase` + default `openGraph` / `twitter` blocks in `app/layout.tsx`, plus an
  OG image (a shared `/notebook/john/1` link currently previews as a blank card).
- Give each page its own title/description. Split the client pages: keep a server
  `page.tsx` that exports `metadata` and renders a client child for the interactive part.
- Add `app/robots.ts`, `app/sitemap.ts`, and `app/icon.png` (Next.js generates the routes).
- "Earl Palmer three lines method" is a low-competition term this site could own — none of
  that ranks without the above.

**fix(privacy): notes are forced public with no way to opt out**
`handleNoteChange` always writes `is_public: true`, and the Instructions page tells users
their notes are "visible to others by default." There is no per-note or per-account control,
yet the schema default is `is_public false`. People write personal, sometimes raw reflections
on Scripture — silently publishing them will scare off exactly the thoughtful users this is
for. Ship at least an account-level "keep my notes private" default before promoting the site.
(The per-note and global-default toggles already exist under Privacy and Sharing — this is the
consent gap, not just a feature.)

**feat(security): the contact form is an open spam relay**
`app/api/contact/route.ts` accepts any JSON and emails it with no validation, no honeypot,
no rate limiting, and no email-format check. Once the URL is public this will get abused. Add
a honeypot field, basic length/format validation, and rate limiting (ties into the existing
"rate limiting on community posts" item — do them together). Also move off
`from: onboarding@resend.dev` to a verified domain or messages will land in spam.

### P2 — Polish that affects trust and conversion

**fix(a11y): controls are unlabeled and color-only**
The translation and book `<select>`s have no associated label, the verse-numbers toggle is a
bare `<button>` with no `aria-label`/`aria-pressed`, and tracks are distinguished only by a
colored dot (a problem for color-blind users and screen readers). Add labels, `aria-*`
attributes, and a text/shape cue alongside the dot.


**feat(onboarding): the empty notebook doesn't teach the method**
A first-time, signed-out visitor lands on John 1 with six empty text boxes and no example of
what a filled-in note looks like. Pre-fill one passage with a short worked example (or a
dismissible "see an example" overlay) so people grasp the three-lines method in five seconds
instead of having to read Instructions first. This is the biggest conversion lever after the
P0 fixes.

---

## User Feedback — Things to Test

Questions to ask when soliciting feedback from early users.

**Passages and chunking**
- Do the passage chunks feel like natural units, or do they cut off at awkward places?
- Is each chunk the right length — long enough to have something to say, short enough to write about on three lines?
- Are the pericope names (e.g. "The Wedding at Cana") helpful or distracting?

**The lines**
- Are the six line labels self-explanatory, or did any of them confuse you?
- Did you find yourself wanting a line that doesn't exist?
- Did any of the lines feel redundant or unnecessary?
- Did you use the optional lines (Historical context, Literary observation, Connections to other texts), or did you stick to the core three?
- Did toggling lines on and off feel useful, or would you rather just always see all six?

**Navigation**
- Could you find your way around the book easily?
- Was the sidebar chapter list helpful? Did the subtitles tell you anything useful?
- Did the progress dots (filled when you have written notes) help orient you?

**Community mode**
- Did you look at other people's notes? Was it useful or distracting?
- Did the track filter help you find what you were looking for?
- Did you feel like replying to anyone's note? If not, why not?
- Did seeing other people's notes influence what you wrote in your own?

**Saving and accounts**
- Did your notes save correctly across sessions?
- Was sign-in easy enough?
- Did you feel comfortable knowing your notes are visible to others by default?

**Overall**
- What did you do first when you opened the app?
- Was there anything you expected to find that wasn't there?
- Was there anything you found that you didn't expect?
- Would you use this for a personal Bible study? Why or why not?
- Would you use this in a group setting?

---

## In Progress

**Passage text via ESV API**
Fetching passage text dynamically from ESV API and caching in Supabase passages table.
Key and caching logic in place. Run `npm run warm` (or `npm run warm -- --base-url=<prod-url>`)
to pre-populate the cache for all books and non-ESV translations.

---

## Commits — Notebook Features

**feat(notebook): search your own notes**
Full-text search across everything the user has written, across all books and tracks.
Supabase supports full-text search natively with to_tsvector. A search bar above the
passage list that filters or highlights matching chunks.

**feat(notebook): export notes**
Download all notes for a book (or all books) as a formatted PDF or plain text file.
Useful for printing, archiving, or bringing notes into a study group.

**feat(notebook): theme trace track**
A user-named optional track where the user specifies a thread they are following
(e.g. "covenant", "exile", "light") and that label appears as a custom line throughout
their reading. Stored as a user preference in the profiles table.

**feat(notebook): reading plan layer**
An optional structure overlaid on the notebook, e.g. Palmer's six-week John study,
or a chapter-a-day plan. Shows which passages are assigned for today and tracks completion.

---

## Commits — Community

**feat(community): filter community notes by book/chapter**
A way to browse all community notes across the whole Bible, not just the chapter you
are currently reading. Useful for discovering what passages others are spending time on.

**feat(community): most discussed passages**
A page or sidebar widget showing which passages have the most community notes or replies.
Simple SQL query: SELECT passage_ref, COUNT(*) FROM notes WHERE is_public = true GROUP BY
passage_ref ORDER BY COUNT DESC.

**feat(community): moderation tools**
A flag/report button on community notes. An admin view for the site owner to review
flagged notes and remove them. Currently there is no moderation layer.

---

## Commits — Privacy and Sharing

**feat(privacy): per-note public/private toggle**
A small lock/globe icon next to each note line so users can control what appears in
Community mode. The is_public column already exists in the schema. This is UI only.

**feat(privacy): global account default for note visibility**
A profile page setting that lets users choose whether new notes default to public or
private. Currently all notes are public by default.

**feat(privacy): private study mode**
An explicit "studying privately" mode that sets all notes to private for that session,
without changing the account default.

---

## Commits — Account and Profile

**feat(account): display name prompt on signup**
Currently display name defaults to the name from Google auth or "Anonymous" for
magic link signups. A prompt on first login to set a display name improves the
community experience.

**feat(account): profile page**
A page where users can update their display name, set privacy defaults, and see
stats on their reading (chapters covered, notes written).

**feat(account): account deletion**
A way for users to delete their account and all associated notes. Required for GDPR
compliance if the site ever has users in the EU.

---

## Commits — Design and UX

**feat(ux): dark mode**
A meditative reading tool lends itself to dark mode. Tailwind supports this with the
dark: variant and a class toggle on the root element.

---

## Commits — iOS App

Three realistic paths from easiest to hardest.

**feat(mobile): Progressive Web App (PWA) [recommended first step]**
Add a manifest file and service worker to the existing Next.js app. Users can then
"Add to Home Screen" on iPhone and it behaves like an app — full screen, icon on the
home screen, no browser chrome. Does not appear in the App Store. Shares 100% of the
existing codebase. Roughly one day of work. Best starting point before investing in
a native app.

**feat(mobile): Capacitor wrapper**
Wraps the existing Next.js web app in a native shell with minimal code changes. Gets
the app into the App Store faster than React Native. The result is more "wrapped web
app" than true native but is appropriate for a reading and note-taking tool. Good
middle path if the PWA feels too limited.

**feat(mobile): React Native with Expo**
Rewrites the UI layer in React Native (different components, no Tailwind) while reusing
all Supabase backend logic and data structure. True native iOS app. Takes longer to
build but produces the best mobile experience. Expo is the easiest starting point.
Realistically a few months of work to reach feature parity with the web app.

---

## Marketing and Growth

The real competitors are pen and paper, Notion, and Word documents — not YouVersion.
The people who want this are doing analytical Bible reading already, just without a
dedicated tool.

**Phase 1 — Personal network (first 50 users)**
- Share with people you know personally first
- Seminary students and Bible study leaders are the best early users — they are
  already doing this kind of reading, just on paper
- Collect feedback using the questions in the User Feedback section above

**Phase 2 — Content**
- Write up the three-lines method as a standalone article or blog post, showing what
  filled-in notes actually look like on a real passage
- The origin story (Don's group, graph paper, 1985) is genuinely interesting and worth
  telling in full
- Post on Substack or a personal blog with a link to the app
- The About page already has the bones of this story

**Phase 3 — Community outreach**
- Find communities where this audience already gathers: seminary subreddits, Bible
  study Facebook groups, church small group leader forums
- Participate genuinely before mentioning the app
- Reach out directly to one or two professors or pastors whose work you respect and
  ask if they would be willing to try it — a single endorsement from a credible voice
  in this space is worth more than any ad

**Phase 4 — SEO and discoverability**
- The Instructions and About pages already contain good natural language about the
  method — this is a foundation for search
- A blog with regular posts about Bible study method will build organic traffic over time
- "Earl Palmer three lines method" is a low-competition search term that this site
  could realistically own

**Things not worth doing yet**
- Paid advertising before the product is stable and users are retaining
- Social media presence before there is content to point to
- App Store submission before there is clear demand from mobile users
