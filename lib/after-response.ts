import { waitUntil } from '@vercel/functions'

// Runs best-effort background work after the HTTP response is sent, so slow
// third-party calls (e.g. Google Sheets logging) don't block the user. On
// Vercel, waitUntil keeps the serverless function alive until the promise
// settles; outside a Vercel request context (local dev, tests) it falls back to
// a floating promise. Errors are always swallowed so nothing rejects unhandled.
export function afterResponse(promise: Promise<unknown>): void {
  const safe = Promise.resolve(promise).catch(err =>
    console.error('[after-response] background task failed:', err),
  )
  try {
    waitUntil(safe)
  } catch {
    void safe
  }
}
