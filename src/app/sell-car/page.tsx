import React from 'react'
import type { Metadata } from 'next'
import { SellCarPage } from '@/components/pages/SellCarPage'

export const metadata: Metadata = {
  title: 'Sell Your Car | Get Best Valuation & Instant Payment | Gadi.com',
  description: 'Sell your used car for the best price in Assam. Free valuation, verified buyers and instant payment support.',
}

export default function SellCarRoute() {
  return <SellCarPage />
}
