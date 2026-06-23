'use client'
import { TRACKS } from '@/lib/data'

export default function InstructionsPage() {
  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-serif font-medium text-gray-900 mb-3">Instructions</h1>
      <p className="text-sm text-gray-500 mb-10 leading-relaxed">
        Each passage has lines beneath it for you to write in. You do not have to fill every line; this tool was built to help you focus on the lines that are most useful to you. You can also toggle lines on and off to reduce visual clutter.
      </p>

      <section className="mb-10">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-5">The lines</h2>
        <div className="space-y-6">
          {TRACKS.map(t => (
            <div key={t.id} className="flex gap-3">
              <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: t.dot }} />
              <div>
                <p className="text-sm font-medium text-gray-800 mb-1">{t.label}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{t.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-4">Community</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          Switch to Community mode to read what other users have written in their notebooks for the same passage. You can reply to anyone&apos;s note. Your own notes are visible to others by default once you sign in.
        </p>
      </section>

    </div>
  )
}
