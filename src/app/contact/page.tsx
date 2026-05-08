import React from 'react'
import type { Metadata } from 'next'
import { ContactPage } from '@/components/pages/ContactPage'

export const metadata: Metadata = {
  title: 'Contact Us | MeriPehli Gadi Assam Support',
  description: 'Reach out to MeriPehli Gadi for any car buying or selling queries in Assam. We are here to help you.',
}

export default function ContactRoute() {
  return <ContactPage />
}
