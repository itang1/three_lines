import type { Metadata } from 'next'
import { headers } from 'next/headers'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ProfileProvider } from '@/components/ProfileProvider'
import TrackVisit from '@/components/TrackVisit'
import { SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Three Lines',
    template: '%s | Three Lines',
  },
  description: 'A tool for studying Scripture through different analytical lenses, including: what events occur, how the characters respond, your own reflections, historical context, literary style, and more.',
  openGraph: {
    siteName: 'Three Lines',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Nonce minted per request by middleware.ts; applied to the inline theme
  // script so it is allowed under the nonce-based CSP without 'unsafe-inline'.
  const nonce = headers().get('x-nonce') ?? undefined
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Set dark class before first paint to avoid flash */}
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}})()` }} />
        {/* GoatCounter, shared with itang1.github.io. Paths are prefixed with the host
            so this site's "/" doesn't merge with the portfolio's. Loaded from this nonced
            script because 'strict-dynamic' ignores host allowlists. */}
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: `(function(){window.goatcounter={path:function(p){return location.host+p}};var s=document.createElement('script');s.async=true;s.dataset.goatcounter='https://itang1.goatcounter.com/count';s.src='https://gc.zgo.at/count.js';document.head.appendChild(s)})()` }} />
      </head>
      <body className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans">
        <ThemeProvider>
          <ProfileProvider>
            <TrackVisit />
            <Navbar />
            <main>{children}</main>
            <Footer />
          </ProfileProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
