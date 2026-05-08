import React from 'react'
import type { Metadata } from 'next'
import HomePage from '@/components/pages/HomePage'

export const metadata: Metadata = {
  title: 'MeriPehli Gadi - Used Cars in Assam',
  description: 'Find the best used cars in Assam. Verified listings, transparent pricing, and easy financing.',
}

export default function Home() {
  return <HomePage />
}
