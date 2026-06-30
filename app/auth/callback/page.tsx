'use client'
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase'

export default function AuthCallback() {
  const supabase = createClient()

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code')
    if (!code) {
      window.location.href = '/login'
      return
    }
    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (error) {
        console.error('[auth/callback]', error.message)
        window.location.href = '/login'
      } else {
        window.location.href = '/notebook'
      }
    })
  }, [])

  return (
    <div className="max-w-sm mx-auto px-6 py-20 text-sm text-gray-400">Signing in…</div>
  )
}
