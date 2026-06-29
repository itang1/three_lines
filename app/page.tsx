import Link from 'next/link'
import { metadata } from './layout'

export default function Home() {
  return (
    <div className="max-w-lg mx-auto px-6 py-20">

      <div className="mb-16">
        <h1 className="text-3xl font-serif font-medium text-gray-900 dark:text-gray-100 mb-5 leading-snug">
          {metadata.title as string}
        </h1>
        <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed mb-8"> {metadata.description}
        </p>
        <div className="flex gap-3">
          <Link href="/notebook" className="btn-primary">Open your notebook →</Link>
          <Link href="/instructions" className="btn-secondary">How it works</Link>
        </div>
      </div>

    </div>
  )
}
