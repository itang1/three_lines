'use client'
import { useEffect, useState } from 'react'

type Mode = 'message' | 'feedback'

const inputClass =
  'w-full border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-sm outline-none focus:border-gray-400 dark:focus:border-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'

export default function ContactClient() {
  const [mode, setMode] = useState<Mode>('message')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', message: '', worked: '', missing: '', website: '',
  })

  // Footer and other links can open straight into feedback with ?feedback or #feedback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.has('feedback') || window.location.hash === '#feedback') {
      setMode('feedback')
    }
  }, [])

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm(p => ({ ...p, [key]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(false)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: mode, ...form }),
      })
      if (!res.ok) throw new Error()
      setSent(true)
    } catch {
      setError(true)
    }
    setLoading(false)
  }

  const switchMode = (next: Mode) => {
    setMode(next)
    setSent(false)
    setError(false)
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-3xl font-serif font-medium text-gray-900 dark:text-gray-100 mb-2">Contact</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Questions, comments, feedback? I read every note personally.
      </p>

      {/* Mode toggle */}
      <div className="inline-flex rounded-md border border-gray-200 dark:border-gray-700 p-0.5 mb-8" role="tablist" aria-label="Contact mode">
        {(['message', 'feedback'] as Mode[]).map(m => (
          <button
            key={m}
            role="tab"
            aria-selected={mode === m}
            onClick={() => switchMode(m)}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              mode === m
                ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
            }`}
          >
            {m === 'message' ? 'Send a message' : 'Share feedback'}
          </button>
        ))}
      </div>

      {sent ? (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 rounded-md text-sm text-green-700 dark:text-green-400">
          {mode === 'feedback'
            ? 'Thank you for taking the time. I read every piece of feedback that comes in.'
            : 'Thanks for reaching out. I read every message that comes in.'}
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          {/* honeypot: hidden from humans, filled by bots */}
          <div style={{ position: 'absolute', left: '-9999px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }} aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              id="website" type="text" tabIndex={-1} autoComplete="off"
              value={form.website}
              onChange={set('website')}
            />
          </div>

          {mode === 'message' ? (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Name</label>
                <input type="text" required className={inputClass} value={form.name} onChange={set('name')} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Email</label>
                <input type="email" required className={inputClass} value={form.email} onChange={set('email')} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Message</label>
                <textarea required rows={5} className={`${inputClass} resize-none`} value={form.message} onChange={set('message')} />
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                As you used Three Lines, a few things to consider: whether the
                passage chunks felt like natural stopping points, whether the line
                labels made sense intuitively, whether you could find your way
                around, and whether community notes could be structured better.
              </p>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">What worked well?</label>
                <textarea rows={4} className={`${inputClass} resize-none`} value={form.worked} onChange={set('worked')} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">What could be improved or is missing?</label>
                <textarea rows={4} className={`${inputClass} resize-none`} value={form.missing} onChange={set('missing')} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Email <span className="text-gray-400 dark:text-gray-500 font-normal">(optional, in case I want to follow up)</span></label>
                <input type="email" className={inputClass} value={form.email} onChange={set('email')} />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading || (mode === 'feedback' && !form.worked.trim() && !form.missing.trim())}
            className="btn-primary w-full disabled:opacity-40"
          >
            {loading ? 'Sending…' : mode === 'feedback' ? 'Send feedback' : 'Send message'}
          </button>
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">
              Something went wrong. Please email{' '}
              <a href="mailto:theworkingcell+threelines@gmail.com" className="underline">
                theworkingcell+threelines@gmail.com
              </a>{' '}
              directly.
            </p>
          )}
        </form>
      )}
    </div>
  )
}
