'use client'
import { useState } from 'react'

export default function ContactClient() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '', website: '' })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(false)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setSent(true)
    } catch {
      setError(true)
    }
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-3xl font-serif font-medium text-gray-900 dark:text-gray-100 mb-2">Contact</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
        Questions, feedback, or just want to get in touch.
      </p>

      {sent ? (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 rounded-md text-sm text-green-700 dark:text-green-400">
          Thanks. I'll be in touch soon.
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          {/* honeypot — hidden from humans, filled by bots */}
          <div style={{ position: 'absolute', left: '-9999px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }} aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              id="website" type="text" tabIndex={-1} autoComplete="off"
              value={form.website}
              onChange={e => setForm(p => ({ ...p, website: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Name</label>
            <input
              type="text" required
              className="w-full border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-sm outline-none focus:border-gray-400 dark:focus:border-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Email</label>
            <input
              type="email" required
              className="w-full border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-sm outline-none focus:border-gray-400 dark:focus:border-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Message</label>
            <textarea
              required rows={5}
              className="w-full border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-sm outline-none focus:border-gray-400 dark:focus:border-gray-500 resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              value={form.message}
              onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-40">
            {loading ? 'Sending…' : 'Send message'}
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
