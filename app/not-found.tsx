import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-serif font-medium text-gray-900 dark:text-gray-100 mb-4">Page not found</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
        That page doesn&apos;t exist. It may have moved or the link may be wrong.
      </p>
      <Link href="/notebook/john/1" className="btn-primary">
        Go to the notebook
      </Link>
    </div>
  )
}
