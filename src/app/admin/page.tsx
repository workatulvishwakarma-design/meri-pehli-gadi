import React from 'react'
import type { Metadata } from 'next'
import AdminDashboard from '@/components/pages/AdminDashboard'

export const metadata: Metadata = {
  title: 'Admin Dashboard | Gadi.com',
  description: 'Manage inventory, leads, and platform settings for Gadi.com.',
}

export default function AdminRoute() {
  return <AdminDashboard />
}
