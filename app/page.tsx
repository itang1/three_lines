import Link from 'next/link'

export default function Home() {
  return (
    <div className="max-w-lg mx-auto px-6 py-20">

      <div className="mb-10">
        <h1 className="text-3xl font-serif font-medium text-gray-900 dark:text-gray-100 mb-5 leading-snug">
          Study Scripture across six lines at once
        </h1>
        <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
          Three Lines is a study notebook for reading a passage from six angles side by side: what happens, how people respond, your own reflections, and its historical, literary, and comparative context. Free to use.
        </p>
        <div className="flex gap-3">
          <Link href="/notebook" className="btn-primary">Open your notebook →</Link>
          <Link href="/instructions" className="btn-secondary">How it works</Link>
        </div>
      </div>

      <div className="space-y-5 border-t border-gray-100 dark:border-gray-800 pt-8 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
        <p>
          <span className="font-medium text-gray-700 dark:text-gray-300">You are never reading alone.</span>{' '}
          Notes are shared with the community by default, so you can see how others have read the same
          passage and add your voice to theirs. Any note can be made private in one click whenever you want it kept to yourself.
        </p>
        <p>
          <span className="font-medium text-gray-700 dark:text-gray-300">Grounded in a real method.</span>{' '}
          The approach draws on Rev. Dr. Earl Palmer&apos;s three-line note-taking practice and Bart Ehrman&apos;s
          analytical framework for studying the text. <Link href="/about" className="text-gray-900 dark:text-gray-200 underline underline-offset-2 hover:text-gray-500 dark:hover:text-gray-400">Read the story</Link>.
        </p>
      </div>

    </div>
  )
}
