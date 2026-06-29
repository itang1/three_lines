import type { Metadata } from 'next'
import ContactClient from './ContactClient'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Questions, feedback, or just want to get in touch.',
}

export default function ContactPage() {
  return <ContactClient />
}
