/** @type {import('next').NextConfig} */

// The Content-Security-Policy is set per-request in middleware.ts so it can
// carry a fresh nonce (replacing script-src 'unsafe-inline'). The remaining
// headers are static and stay here.
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

const nextConfig = {
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}

module.exports = nextConfig
