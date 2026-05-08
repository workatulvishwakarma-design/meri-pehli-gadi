'use client'

import React from 'react'
import LeadCRM from './LeadCRM'
import { Card, CardContent } from '@/components/ui/card'
import { DollarSign, FileText, TrendingUp, Building2 } from 'lucide-react'

interface FinanceModuleProps {
  user: { id: string; name: string | null; email: string; role: string }
}

export default function FinanceModule({ user }: FinanceModuleProps) {
  return (
    <div className="space-y-6">
      {/* Finance Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Loan Applications', icon: <DollarSign size={18} />, color: 'from-emerald-500 to-emerald-600' },
          { label: 'Approved', icon: <FileText size={18} />, color: 'from-blue-500 to-blue-600' },
          { label: 'Disbursed', icon: <TrendingUp size={18} />, color: 'from-green-500 to-green-600' },
          { label: 'Bank Partners', icon: <Building2 size={18} />, color: 'from-violet-500 to-violet-600' },
        ].map(s => (
          <Card key={s.label} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${s.color} text-white`}>{s.icon}</div>
                <div>
                  <p className="text-xs text-slate-500">{s.label}</p>
                  <p className="text-lg font-bold">—</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Finance Lead CRM */}
      <LeadCRM user={user} filterType="FINANCE" />
    </div>
  )
}
