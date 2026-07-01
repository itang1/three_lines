import type { Metadata } from 'next'
import ContactClient from './ContactClient'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Questions, comments, or feedback about Three Lines.',
}

export default function ContactPage() {
  return <ContactClient />
}
