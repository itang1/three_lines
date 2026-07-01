'use client'
import { useState } from 'react'

const inputClass =
  'w-full border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-sm outline-none focus:border-gray-400 dark:focus:border-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'

export default function ContactClient() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [rateLimited, setRateLimited] = useState(false)
  const [form, setForm] = useState({
    email: '', worked: '', missing: '', comments: '', website: '',
  })

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm(p => ({ ...p, [key]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(false)
    setRateLimited(false)
    const start = Number(sessionStorage.getItem('three-lines:start')) || 0
    const meta = {
      page: window.location.pathname,
      referrer: document.referrer || null,
      ua: navigator.userAgent,
      screen: `${window.screen.width}x${window.screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      sessionMs: start ? Date.now() - start : null,
    }
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, ...meta }),
      })
      if (res.status === 429) { setRateLimited(true); setLoading(false); return }
      if (!res.ok) throw new Error()
      setSent(true)
    } catch {
      setError(true)
    }
    setLoading(false)
  }

  const nothingEntered = !form.worked.trim() && !form.missing.trim() && !form.comments.trim()

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-3xl font-serif font-medium text-gray-900 dark:text-gray-100 mb-2">Contact</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
        Questions, comments, or feedback?
      </p>

      {sent ? (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 rounded-md text-sm text-green-700 dark:text-green-400">
          Thank you for taking the time.
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
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Anything else? <span className="text-gray-400 dark:text-gray-500 font-normal">(questions, comments, or a message)</span></label>
            <textarea rows={4} className={`${inputClass} resize-none`} value={form.comments} onChange={set('comments')} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Email <span className="text-gray-400 dark:text-gray-500 font-normal">(optional, in case I want to follow up)</span></label>
            <input type="email" className={inputClass} value={form.email} onChange={set('email')} />
          </div>

          <button
            type="submit"
            disabled={loading || nothingEntered}
            className="btn-primary w-full disabled:opacity-40"
          >
            {loading ? 'Sending…' : 'Send'}
          </button>
          {rateLimited && (
            <p className="text-sm text-amber-600 dark:text-amber-400">
              You are sending these a little too quickly. Please wait a few minutes and try again.
            </p>
          )}
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
