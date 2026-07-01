// Canonical site origin. Any trailing slash is stripped so callers can safely
// append paths like `${SITE_URL}/about` without producing a double slash.
// Centralized here so the fallback URL isn't duplicated across the codebase.
// Use || (not ??) so an env var set to an empty string on the host falls back
// to the default instead of producing '' and crashing new URL(SITE_URL).
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://three-lines-sepia.vercel.app'
).replace(/\/+$/, '')
