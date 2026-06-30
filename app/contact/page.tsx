import type { Metadata } from 'next'
import ContactClient from './ContactClient'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Questions, comments, feedback? I read every note personally.',
}

export default function ContactPage() {
  return <ContactClient />
}
