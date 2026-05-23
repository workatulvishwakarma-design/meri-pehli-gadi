import React from 'react'
import type { Metadata } from 'next'
import { FAQPage } from '@/components/pages/FAQPage'

export const metadata: Metadata = {
  title: 'FAQ | Frequently Asked Questions | MeriPehli Gadi',
  description: 'Find answers to common questions about buying, selling, financing and insuring used cars in Assam with MeriPehli Gadi.',
  keywords: [
    'used car FAQ', 'car buying questions', 'car loan FAQ Assam',
    'MeriPehli Gadi help', 'used car insurance questions',
  ],
}

export default function FAQRoute() {
  return <FAQPage />
}
