import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 dark:border-gray-800 mt-16">
      <div className="max-w-3xl mx-auto px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          Have thoughts on Three Lines? I read every note personally.{' '}
          <Link
            href="/contact?feedback"
            className="text-gray-900 dark:text-gray-200 underline underline-offset-2 hover:text-gray-500 dark:hover:text-gray-400"
          >
            Share feedback
          </Link>
        </p>
        <p className="mt-3">
          <Link
            href="/privacy"
            className="text-gray-400 dark:text-gray-500 underline underline-offset-2 hover:text-gray-600 dark:hover:text-gray-300"
          >
            Privacy
          </Link>
        </p>
      </div>
    </footer>
  )
}
