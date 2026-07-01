'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Fires one POST to /api/track per browser session (sessionStorage flag).
// Renders nothing; exists only to capture the first page the user lands on.
export default function TrackVisit() {
  const pathname = usePathname()

  useEffect(() => {
    // Record when this session began, so other features (e.g. the feedback
    // form) can report how long the visitor has been browsing.
    if (!sessionStorage.getItem('three-lines:start')) {
      sessionStorage.setItem('three-lines:start', String(Date.now()))
    }

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
