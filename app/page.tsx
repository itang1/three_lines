import Link from 'next/link'
import { metadata } from './layout'

export default function Home() {
  return (
    <div className="max-w-lg mx-auto px-6 py-20">

      <div className="mb-16">
        <h1 className="text-3xl font-serif font-medium text-gray-900 mb-5 leading-snug">
          {metadata.title}
        </h1>
        <p className="text-base text-gray-500 leading-relaxed mb-8"> {metadata.description}
        </p>
        <div className="flex gap-3">
          <Link href="/notebook" className="btn-primary">Open your notebook →</Link>
          <Link href="/instructions" className="btn-secondary">How it works</Link>
        </div>
      </div>

      <blockquote className="border-l-2 border-gray-200 pl-5">
        <p className="text-sm font-serif leading-relaxed text-gray-400 italic">
          Put a quote here about John being the intimate gospel.
        </p>
        <cite className="block mt-3 text-xs text-gray-400 not-italic">
          — Rev. Dr. Earl Palmer
        </cite>
      </blockquote>

    </div>
  )
}
