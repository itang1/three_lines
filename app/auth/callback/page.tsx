'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code')
    if (!code) {
      router.replace('/login')
      return
    }
    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (error) {
        console.error('[auth/callback]', error.message)
        router.replace('/login')
      } else {
        router.replace('/notebook')
      }
    })
  }, [])

  return (
    <div className="max-w-sm mx-auto px-6 py-20 text-sm text-gray-400">Signing in…</div>
  )
}
