import React from 'react'
import type { Metadata } from 'next'
import { FinancePage } from '@/components/pages/FinancePage'

export const metadata: Metadata = {
  title: 'Used Car Loan | Low EMI Used Car Loans in Assam | MeriPehli Gadi',
  description: 'Get instant approval for used car loans in Assam. Low EMI starting ₹8,999/month with quick disbursal. Powered by Shani Finserve.',
  keywords: [
    'used car loan assam',
    'car finance guwahati',
    'low emi car loan',
    'shani finserve',
    'meri pehli gadi loan',
    'second hand car finance',
    'car loan dibrugarh',
  ],
}

export default function UsedCarLoanRoute() {
  return <FinancePage />
}
