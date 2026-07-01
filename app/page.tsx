import Link from 'next/link'
import { TRACKS } from '@/lib/books-index'
import { PROLOGUE_EXAMPLE } from '@/lib/prologue-example'

// A few of the worked example's lines, shown as a teaser on the landing page.
const TEASER_TRACK_IDS = ['event', 'historical', 'comparative']

export default function Home() {
  return (
    <div className="max-w-lg mx-auto px-6 pt-12 pb-6">

      <div className="mb-8">
        <h1 className="text-3xl font-serif font-medium text-gray-900 dark:text-gray-100 mb-5 leading-snug">
          Study Scripture across six lines, plus your own
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
          {PROLOGUE_EXAMPLE.filter(e => TEASER_TRACK_IDS.includes(e.trackId)).map(({ trackId, content }) => {
            const t = TRACKS.find(tr => tr.id === trackId)
            if (!t) return null
            return (
              <div key={trackId} className="flex gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: t.dot }} />
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{t.label}.</span> {content}
                </p>
              </div>
            )
          })}
        </div>
        <Link href="/instructions" className="text-sm text-gray-900 dark:text-gray-200 underline underline-offset-2 hover:text-gray-500 dark:hover:text-gray-400">
          See the full example →
        </Link>
      </div>

    </div>
  )
}
