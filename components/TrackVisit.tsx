'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Fires one POST to /api/track per browser session (sessionStorage flag).
// Renders nothing; exists only to capture the first page the user lands on.
export default function TrackVisit() {
  const pathname = usePathname()

  useEffect(() => {
    const KEY = 'three-lines:visited'
    if (sessionStorage.getItem(KEY)) return
    sessionStorage.setItem(KEY, '1')

    fetch('/api/track', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        page:     pathname,
        referrer: document.referrer || null,
        ua:       navigator.userAgent,
      }),
    }).catch(() => {})
  }, [])

  return null
}
