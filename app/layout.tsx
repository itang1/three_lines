import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'Three Lines',
  description: 'A tool for studying Scripture through different analytical lenses, including: what events occur, how the characters respond, your own reflections, historical context, literary style, and more.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 font-sans">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}
