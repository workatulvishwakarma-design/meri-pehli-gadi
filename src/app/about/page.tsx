import React from 'react'
import type { Metadata } from 'next'
import { AboutPage } from '@/components/pages/AboutPage'

export const metadata: Metadata = {
  title: 'About Us | MeriPehli Gadi - Assam\'s Trusted Used Car Marketplace',
  description: 'Learn about MeriPehli Gadi — Assam\'s most trusted used car marketplace powered by Shani Finserve. Our mission is to make car ownership accessible for every family in Northeast India.',
  keywords: [
    'about MeriPehli Gadi', 'Shani Finserve', 'used car marketplace Assam',
    'car dealership Dibrugarh', 'trusted used cars Northeast India',
  ],
}

export default function AboutRoute() {
  return <AboutPage />
}
