import React from 'react'
import type { Metadata } from 'next'
import { BlogPage } from '@/components/pages/BlogPage'

export const metadata: Metadata = {
  title: 'Blog | Car Buying Tips, Finance Guides & Industry News | MeriPehli Gadi',
  description: 'Read the latest articles on car buying tips, used car finance guides, insurance advice, and automobile industry news from MeriPehli Gadi.',
  keywords: [
    'car buying tips', 'used car guide', 'car finance blog',
    'automobile news', 'MeriPehli Gadi blog', 'car maintenance tips',
  ],
}

export default function BlogRoute() {
  return <BlogPage />
}
