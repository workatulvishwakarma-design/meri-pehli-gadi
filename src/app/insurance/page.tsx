import React from 'react'
import type { Metadata } from 'next'
import { InsurancePage } from '@/components/pages/InsurancePage'

export const metadata: Metadata = {
  title: 'Used Car Insurance | Compare & Renew in Assam | Gadi.com',
  description: 'Protect your car with trusted insurance options. Comprehensive, third-party and zero depreciation plans powered by Shani Finserve.',
}

export default function InsuranceRoute() {
  return <InsurancePage />
}
