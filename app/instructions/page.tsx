import type { Metadata } from 'next'
import { TRACKS } from '@/lib/books-index'

export const metadata: Metadata = {
  title: 'How It Works',
  description: 'Six analytical lines for studying Scripture: what happens, how people respond, your thoughts, historical context, literary style, and connections to other texts.',
}

export default function InstructionsPage() {
  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-serif font-medium text-gray-900 dark:text-gray-100 mb-3">Instructions</h1>
      <p className="text-base text-gray-500 dark:text-gray-400 mb-10 leading-relaxed">
        Each passage has lines beneath it for you to write in. You do not have to fill every line; just focus on the lines that are most useful to you. You can also toggle lines on and off to reduce visual clutter.
      </p>

      <section className="mb-10">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-5">The lines</h2>
        <div className="space-y-6">
          {TRACKS.map(t => (
            <div key={t.id} className="flex gap-3">
              <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: t.dot }} />
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">{t.label}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{t.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-4">Example</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
          John 1:1-18, The Prologue.
        </p>
        <div className="border border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden">
          {[
            {
              track: TRACKS[0],
              content: 'An entity called the "Word" exists eternally with God. A man named John the Baptist appears as a witness to testify about this light.',
            },
            {
              track: TRACKS[1],
              content: 'There is active rejection of the Word.',
            },
            {
              track: TRACKS[2],
              content: 'Receiving the Word is not an intellectual exercise but a personal encounter/reflection with the person Jesus.',
            },
            {
              track: TRACKS[3],
              content: 'The Greek term Logos was already familiar to philosophers like the Stoics, who used it for the rational principle that orders the universe.',
            },
            {
              track: TRACKS[4],
              content: 'Structured as a chiasm. The tone is authoritative.',
            },
            {
              track: TRACKS[5],
              content: '"In the beginning" mirrors Genesis.',
            },
          ].map(({ track, content }, i) => (
            <div key={track.id} className={`flex items-stretch ${i > 0 ? 'border-t border-gray-100 dark:border-gray-800' : ''}`}>
              <div className="w-36 flex-shrink-0 flex items-center gap-1.5 px-3 py-2 bg-gray-50 dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700">
                <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: track.dot }} />
                <span className="text-xs font-medium text-gray-500 dark:text-gray-500">{track.label}</span>
              </div>
              <p className="flex-1 text-base p-2.5 text-gray-600 dark:text-gray-400 leading-relaxed bg-white dark:bg-gray-900">{content}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-4">Community</h2>
        <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
          Switch to Community mode to read what other users have written in their notebooks for the same passage. You can reply to anyone&apos;s note. Your own notes are shared with the community by default once you sign in.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-4">Keyboard shortcuts</h2>
        <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
          While reading, press <kbd className="px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-mono">?</kbd> to see the full list of keyboard shortcuts for moving between chapters, switching translations, and jumping to the book selector.
        </p>
      </section>

    </div>
  )
}
