import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'What Three Lines collects, why, and how to remove it.',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-serif font-medium text-gray-900 dark:text-gray-100 mb-8">Privacy</h1>

      <div className="space-y-8 text-base text-gray-600 dark:text-gray-400 leading-relaxed">
        <section>
          <h2 className="text-lg font-serif font-medium text-gray-900 dark:text-gray-100 mb-2">Your account</h2>
          <p>
            Signing in with Google sets up your account using your email and the display
            name Google provides. This is what keeps your notes saved to you and lets your
            name appear on notes you choose to make public.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-serif font-medium text-gray-900 dark:text-gray-100 mb-2">Your notes and comments</h2>
          <p>
            You control whether each note is visible to others. New notes follow the
            sharing preference you set on your <Link href="/profile" className="text-gray-900 dark:text-gray-200 underline underline-offset-2 hover:text-gray-500 dark:hover:text-gray-400">profile</Link> page,
            and a note is only ever shown to others when it is marked public, which you can
            change per passage. Comments are visible to others by design. You can edit or
            delete anything you have written at any time.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-serif font-medium text-gray-900 dark:text-gray-100 mb-2">Deleting your data</h2>
          <p>
            You can delete your account at any time from your <Link href="/profile" className="text-gray-900 dark:text-gray-200 underline underline-offset-2 hover:text-gray-500 dark:hover:text-gray-400">profile</Link> page.
            Doing so removes your profile, notes, and comments.{' '}
            <Link href="/contact" className="text-gray-900 dark:text-gray-200 underline underline-offset-2 hover:text-gray-500 dark:hover:text-gray-400">Reach out</Link> with any questions or for help.
          </p>
        </section>
      </div>
    </div>
  )
}
