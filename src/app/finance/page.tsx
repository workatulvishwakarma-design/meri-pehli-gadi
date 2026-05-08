import React from 'react'
import type { Metadata } from 'next'
import { FinancePage } from '@/components/pages/FinancePage'

export const metadata: Metadata = {
  title: 'Car Loan & Finance | Low EMI Used Car Loans | Gadi.com',
  description: 'Get instant approval for used car loans. Partnered with Shani Finserve for the lowest EMI options and quick disbursal.',
}

export default function FinanceRoute() {
  return <FinancePage />
}
