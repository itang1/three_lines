import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'What Three Lines collects, why, and how to remove it. Plain language, no surprises.',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-serif font-medium text-gray-900 dark:text-gray-100 mb-3">Privacy</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
        Three Lines is a place to study Scripture and write honest reflections. That only
        works if you trust it, so here is exactly what it collects and why, in plain language.
      </p>

      <div className="space-y-8 text-base text-gray-600 dark:text-gray-400 leading-relaxed">
        <section>
          <h2 className="text-lg font-serif font-medium text-gray-900 dark:text-gray-100 mb-2">Your account</h2>
          <p>
            If you sign in with Google, I store your email address and the name Google
            shares, so your notes can be saved to your account and your display name can
            appear next to notes you choose to make public. That is all the account holds.
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
          <h2 className="text-lg font-serif font-medium text-gray-900 dark:text-gray-100 mb-2">Visit analytics</h2>
          <p>
            To understand how the site is used, I log a single record the first time you
            arrive in a browsing session: the page you landed on, where you were referred
            from, your browser and operating system, your approximate location (country,
            region, and city estimated from your IP address), your timezone, and your
            preferred language. This is used in aggregate to improve the site. It is never
            sold, and there are no advertising trackers or third-party advertising cookies.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-serif font-medium text-gray-900 dark:text-gray-100 mb-2">Email</h2>
          <p>
            If someone replies to a note you wrote, I may send you a one-line email letting
            you know, using <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="text-gray-900 dark:text-gray-200 underline underline-offset-2 hover:text-gray-500 dark:hover:text-gray-400">Resend</a>.
            If you send feedback through the contact form, I keep what you wrote and, only
            if you provide it, your email, so I can reply.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-serif font-medium text-gray-900 dark:text-gray-100 mb-2">Where it lives</h2>
          <p>
            Accounts, notes, and comments are stored in <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-gray-900 dark:text-gray-200 underline underline-offset-2 hover:text-gray-500 dark:hover:text-gray-400">Supabase</a> (a
            hosted PostgreSQL database). The site is hosted on <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-gray-900 dark:text-gray-200 underline underline-offset-2 hover:text-gray-500 dark:hover:text-gray-400">Vercel</a>.
            I do not sell your data to anyone.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-serif font-medium text-gray-900 dark:text-gray-100 mb-2">Deleting your data</h2>
          <p>
            You can delete your account at any time from your <Link href="/profile" className="text-gray-900 dark:text-gray-200 underline underline-offset-2 hover:text-gray-500 dark:hover:text-gray-400">profile</Link> page.
            Doing so removes your profile, notes, and comments. If you would rather I handle
            it, or you have any question about your data, just{' '}
            <Link href="/contact" className="text-gray-900 dark:text-gray-200 underline underline-offset-2 hover:text-gray-500 dark:hover:text-gray-400">reach out</Link>.
          </p>
        </section>
      </div>
    </div>
  )
}
