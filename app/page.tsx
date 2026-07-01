import Link from 'next/link'
import { TRACKS } from '@/lib/books-index'

export default function Home() {
  return (
    <div className="max-w-lg mx-auto px-6 pt-12 pb-6">

      <div className="mb-8">
        <h1 className="text-3xl font-serif font-medium text-gray-900 dark:text-gray-100 mb-5 leading-snug">
          Study Scripture across six lines at once
        </h1>
        <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
          Three Lines is a study notebook for reading a passage from six angles: what happens, how people respond, your own reflections, and its historical, literary, and comparative context. Free to use, and you can start reading without an account.
        </p>
        <div className="flex gap-3">
          <Link href="/notebook" className="btn-primary">Open your notebook →</Link>
          <Link href="/instructions" className="btn-secondary">How it works</Link>
        </div>
      </div>

      <div className="mb-8 border-t border-gray-100 dark:border-gray-800 pt-8">
        <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-4">
          A glimpse: John 1, the Prologue
        </p>
        <div className="space-y-3 mb-4">
          {[
            { t: TRACKS[0], note: 'The "Word" exists eternally with God. John the Baptist appears as a witness to the light.' },
            { t: TRACKS[3], note: 'The Greek term Logos was already familiar to Stoic philosophers as the rational principle that orders the universe.' },
            { t: TRACKS[5], note: '"In the beginning" mirrors the opening of Genesis.' },
          ].map(({ t, note }) => (
            <div key={t.id} className="flex gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: t.dot }} />
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                <span className="font-medium text-gray-700 dark:text-gray-300">{t.label}.</span> {note}
              </p>
            </div>
          ))}
        </div>
        <Link href="/instructions" className="text-sm text-gray-900 dark:text-gray-200 underline underline-offset-2 hover:text-gray-500 dark:hover:text-gray-400">
          See the full example →
        </Link>
      </div>

    </div>
  )
}
