'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'

// Small flag/report control shown on community notes. Opens an inline reason
// field and posts to /api/report. Self-contained so it can drop into any feed.
export default function ReportButton({ noteId }: { noteId: string }) {
  const supabase = createClient()
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

  const submit = async () => {
    setStatus('sending')
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { setStatus('error'); return }
    const res = await fetch('/api/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
      body: JSON.stringify({ note_id: noteId, reason: reason.trim() }),
    })
    if (res.ok) {
      setStatus('done')
      setOpen(false)
    } else {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return <span className="text-[11px] text-gray-400">Reported</span>
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-[11px] text-gray-400 hover:text-red-500"
      >
        Report
      </button>
    )
  }

  return (
    <div className="flex items-center gap-2 w-full mt-1">
      <input
        autoFocus
        className="flex-1 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 text-[11px] outline-none bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
        placeholder="Reason (optional)"
        value={reason}
        onChange={e => setReason(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && submit()}
        maxLength={1000}
      />
      <button
        onClick={submit}
        disabled={status === 'sending'}
        className="text-[11px] px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-40"
      >
        {status === 'sending' ? 'Sending…' : 'Send'}
      </button>
      <button
        onClick={() => { setOpen(false); setStatus('idle') }}
        className="text-[11px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      >
        Cancel
      </button>
      {status === 'error' && <span className="text-[11px] text-red-500">Failed</span>}
    </div>
  )
}
