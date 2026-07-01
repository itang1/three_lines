'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

export default function LoginClient() {
  const [devError, setDevError] = useState('')
  const [devLoading, setDevLoading] = useState(false)
  const [callbackError, setCallbackError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [pwLoading, setPwLoading] = useState(false)
  const [pwError, setPwError] = useState('')
  const supabase = createClient()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const err = params.get('error')
    if (err) setCallbackError(decodeURIComponent(err))
  }, [])

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/notebook` }
    })
  }

  const signInWithPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwError('')
    setPwLoading(true)
    const { data, error } = mode === 'signup'
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })
    setPwLoading(false)
    if (error) { setPwError(error.message); return }
    // With "Confirm email" disabled in Supabase, signUp returns a session
    // immediately. If it doesn't, confirmation is still on for this project.
    if (!data.session) {
      setPwError('Check your email to confirm your account, then sign in.')
      return
    }
    window.location.href = '/notebook'
  }

  const signInAsGuest = async () => {
    setDevError('')
    setDevLoading(true)
    const res = await fetch('/api/dev-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ origin: window.location.origin }),
    })
    const json = await res.json()
    if (!res.ok || json.error) { setDevError(json.error ?? JSON.stringify(json)); setDevLoading(false); return }
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: json.email,
      token: json.otp,
      type: 'email',
    })
    if (verifyError) { setDevError(verifyError.message); setDevLoading(false); return }
    window.location.href = '/notebook/john/1'
  }

  return (
    <div className="max-w-sm mx-auto px-6 py-20">
      <h1 className="text-2xl font-serif font-medium text-gray-900 dark:text-gray-100 mb-2">Sign in</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
        Save your notes and study alongside the community. Notes are shared by default so everyone
        can learn from one another, and you can make any note private in one click. All that&apos;s stored is
        your email and display name.
      </p>

      {process.env.NODE_ENV === 'development' && (
        <div className="mb-6">
          <button
            onClick={signInAsGuest}
            disabled={devLoading}
            className="w-full border border-gray-800 bg-gray-900 text-white rounded-md px-4 py-2.5 text-sm hover:bg-gray-700 disabled:opacity-50"
          >
            {devLoading ? 'Signing in…' : 'Dev: sign in as anonymous user'}
          </button>
          {devError && <p className="mt-2 text-xs text-red-500">{devError}</p>}
        </div>
      )}

      {callbackError && (
        <p className="mb-4 text-xs text-red-500 break-words">{callbackError}</p>
      )}

      <button
        onClick={signInWithGoogle}
        className="w-full flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-700 rounded-md px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </button>

      <div className="flex items-center gap-3 my-5" aria-hidden="true">
        <span className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
        <span className="text-xs text-gray-400 dark:text-gray-500">or</span>
        <span className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
      </div>

      <form onSubmit={signInWithPassword} className="space-y-3">
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          className="w-full border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2.5 text-sm outline-none focus:border-gray-400 dark:focus:border-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          className="w-full border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2.5 text-sm outline-none focus:border-gray-400 dark:focus:border-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
        <button
          type="submit"
          disabled={pwLoading}
          className="w-full border border-gray-200 dark:border-gray-700 rounded-md px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
        >
          {pwLoading ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in with email'}
        </button>
        {pwError && <p className="text-xs text-red-500">{pwError}</p>}
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {mode === 'signup' ? 'Already have an account? ' : 'New here? '}
          <button
            type="button"
            onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setPwError('') }}
            className="text-gray-900 dark:text-gray-200 underline underline-offset-2 hover:text-gray-500 dark:hover:text-gray-400"
          >
            {mode === 'signup' ? 'Sign in' : 'Create one'}
          </button>
        </p>
      </form>
    </div>
  )
}
