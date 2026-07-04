import { describe, it, expect } from 'vitest'
import { clientIp } from './rate-limit'

// Importing clientIp is safe without env vars: the service-role client is
// created lazily and only when rateLimit() actually runs, not on import.
function reqWith(headers: Record<string, string>): Request {
  return new Request('http://localhost/api/track', { headers })
}

describe('clientIp', () => {
  it('prefers the unspoofable x-real-ip', () => {
    expect(clientIp(reqWith({ 'x-real-ip': '203.0.113.7' }))).toBe('203.0.113.7')
  })

  it('ignores a spoofed leftmost x-forwarded-for when x-real-ip is present', () => {
    const req = reqWith({
      'x-forwarded-for': '1.1.1.1, 203.0.113.7',
      'x-real-ip': '203.0.113.7',
    })
    expect(clientIp(req)).toBe('203.0.113.7')
  })

  it('falls back to the rightmost (closest-hop) x-forwarded-for entry', () => {
    // The leftmost entry is attacker-controlled; the rightmost is added by the
    // trusted proxy, so a rotating leftmost value cannot fragment the counter.
    const req = reqWith({ 'x-forwarded-for': '9.9.9.9, 203.0.113.7' })
    expect(clientIp(req)).toBe('203.0.113.7')
  })

  it('returns "unknown" when no forwarding headers are present', () => {
    expect(clientIp(reqWith({}))).toBe('unknown')
  })
})
