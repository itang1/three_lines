// Canonical site origin. Any trailing slash is stripped so callers can safely
// append paths like `${SITE_URL}/about` without producing a double slash.
// Centralized here so the fallback URL isn't duplicated across the codebase.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://three-lines-sepia.vercel.app'
).replace(/\/+$/, '')
