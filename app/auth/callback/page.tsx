'use client'
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase'

export default function AuthCallback() {
  const supabase = createClient()

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code')
    if (!code) {
      window.location.href = '/login?error=no_code&url=' + encodeURIComponent(window.location.href)
      return
    }
    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (error) {
        window.location.href = '/login?error=' + encodeURIComponent(error.message)
      } else {
        window.location.href = '/notebook'
      }
    })
  }, [])

  return (
    <div className="max-w-sm mx-auto px-6 py-20 text-sm text-gray-400">Signing in…</div>
  )
}
