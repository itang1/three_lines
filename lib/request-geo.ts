// Server-side request geography, derived from Vercel's edge headers. These are
// absent in local dev, so every field falls back to null.

// Vercel encodes city names with percent-encoding (e.g. "San%20Francisco").
function decodeVercelHeader(value: string | null): string | null {
  if (!value) return null
  try { return decodeURIComponent(value) } catch { return value }
}

export type RequestGeo = {
  country: string | null
  region: string | null
  city: string | null
  timezone: string | null
  language: string | null
}

export function requestGeo(req: Request): RequestGeo {
  return {
    country:  req.headers.get('x-vercel-ip-country'),
    // Region is `x-vercel-ip-country-region` (ISO subdivision), not `x-vercel-ip-region`.
    region:   req.headers.get('x-vercel-ip-country-region'),
    city:     decodeVercelHeader(req.headers.get('x-vercel-ip-city')),
    timezone: req.headers.get('x-vercel-ip-timezone'),
    // Preferred UI language, primary tag only (e.g. "en-US,en;q=0.9" -> "en-US").
    language: req.headers.get('accept-language')?.split(',')[0]?.trim() || null,
  }
}
