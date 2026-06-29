'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-serif font-medium text-gray-900 dark:text-gray-100 mb-4">Something went wrong</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
        An unexpected error occurred. You can try again or return to the notebook.
      </p>
      <div className="flex gap-3">
        <button onClick={reset} className="btn-primary">
          Try again
        </button>
        <a href="/notebook/john/1" className="btn-secondary">
          Go to the notebook
        </a>
      </div>
    </div>
  )
}
