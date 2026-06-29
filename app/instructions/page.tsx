'use client'
import { TRACKS } from '@/lib/data'

export default function InstructionsPage() {
  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-serif font-medium text-gray-900 dark:text-gray-100 mb-3">Instructions</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-10 leading-relaxed">
        Each passage has lines beneath it for you to write in. You do not have to fill every line; this tool was built to help you focus on the lines that are most useful to you. You can also toggle lines on and off to reduce visual clutter.
      </p>

      <section className="mb-10">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-5">The lines</h2>
        <div className="space-y-6">
          {TRACKS.map(t => (
            <div key={t.id} className="flex gap-3">
              <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: t.dot }} />
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">{t.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{t.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-4">Example</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
          John 1:1-18, The Prologue. Three of the six lines filled in.
        </p>
        <div className="border border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden">
          {[
            {
              track: TRACKS[0],
              content: 'John opens with a declaration, not a story: the Word (logos) existed before creation, was with God, and was God. The Word entered the world but the world did not recognize him. He came to his own people and they did not receive him. John the Baptist appears as a witness to the light, explicitly not the light himself. Those who did receive the Word were given the right to become children of God. The Word became flesh and dwelt among us.',
            },
            {
              track: TRACKS[1],
              content: "John the Baptist deflects: \"I am not the light, I bear witness to it.\" The world's response is non-recognition - indifference rather than hostility at first. His own people's response is rejection. The contrast between those who receive and those who do not structures the entire prologue.",
            },
            {
              track: TRACKS[2],
              content: '"In the beginning" is deliberate - John is writing his own Genesis. The Word becoming flesh (eskēnōsen, "pitched his tent") is tabernacle language; God dwelling with his people again, but now in a body. Everything in the gospel will flow from this hinge.',
            },
          ].map(({ track, content }, i) => (
            <div key={track.id} className={`flex items-stretch ${i > 0 ? 'border-t border-gray-100 dark:border-gray-800' : ''}`}>
              <div className="w-36 flex-shrink-0 flex items-center gap-1.5 px-3 py-2 bg-gray-50 dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700">
                <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: track.dot }} />
                <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500">{track.label}</span>
              </div>
              <p className="flex-1 text-sm p-2.5 text-gray-600 dark:text-gray-400 leading-relaxed bg-white dark:bg-gray-900">{content}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-4">Community</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          Switch to Community mode to read what other users have written in their notebooks for the same passage. You can reply to anyone&apos;s note. Your own notes are visible to others by default once you sign in.
        </p>
      </section>

    </div>
  )
}
