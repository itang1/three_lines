'use client'
import { useState } from 'react'

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setSent(true)
    } catch {
      alert('Something went wrong. Please try emailing theworkingcell+threelines@gmail.com directly.')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-3xl font-serif font-medium text-gray-900 mb-2">Contact</h1>
      <p className="text-sm text-gray-500 mb-8">
        Questions, feedback, or just want to get in touch.
      </p>

      {sent ? (
        <div className="p-4 bg-green-50 border border-green-100 rounded-md text-sm text-green-700">
          Thanks. I'll be in touch soon.
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
            <input
              type="text" required
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-gray-400"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
            <input
              type="email" required
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-gray-400"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Message</label>
            <textarea
              required rows={5}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm outline-none focus:border-gray-400 resize-none"
              value={form.message}
              onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-40">
            {loading ? 'Sending…' : 'Send message'}
          </button>
        </form>
      )}
    </div>
  )
}
