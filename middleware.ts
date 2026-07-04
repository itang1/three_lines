import { NextRequest, NextResponse } from 'next/server'

// Per-request nonce CSP. Replaces the static script-src 'unsafe-inline' policy
// that used to live in next.config.js: each request gets a fresh nonce, Next.js
// automatically applies it to its own inline/bootstrap scripts (it reads the
// nonce from the CSP request header), and the inline theme script in
// app/layout.tsx picks it up via headers().get('x-nonce'). 'strict-dynamic'
// lets those nonced scripts load the rest, so no host allowlist is needed;
// 'self' is kept only as a fallback for browsers without strict-dynamic support.
// 'unsafe-eval' is required by the dev runtime and is scoped to development.
export function middleware(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID())
  const isDev = process.env.NODE_ENV === 'development'

  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''}`,
    // Styles still need 'unsafe-inline' (Tailwind/Next inject inline styles and
    // style nonces are not wired through); this policy hardens scripts only.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; ')

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('content-security-policy', csp)

  const response = NextResponse.next({ request: { headers: requestHeaders } })
  response.headers.set('content-security-policy', csp)
  return response
}

export const config = {
  matcher: [
    // Run on everything except Next internals and static assets, and skip
    // prefetch requests so cached prefetches aren't tied to a stale nonce.
    {
      source: '/((?!_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
