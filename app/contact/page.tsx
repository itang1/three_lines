import type { Metadata } from 'next'
import ContactClient from './ContactClient'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Questions or feedback on Three Lines? Send a message or share what worked and what felt off. I read every note personally.',
}

export default function ContactPage() {
  return <ContactClient />
}
