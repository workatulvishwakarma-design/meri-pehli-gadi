'use client'

import React from 'react'
import LeadCRM from './LeadCRM'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, FileText, TrendingUp, Users } from 'lucide-react'

interface InsuranceModuleProps {
  user: { id: string; name: string | null; email: string; role: string }
}

export default function InsuranceModule({ user }: InsuranceModuleProps) {
  return (
    <div className="space-y-6">
      {/* Insurance Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Insurance Leads', icon: <Shield size={18} />, color: 'from-sky-500 to-sky-600' },
          { label: 'Policies Active', icon: <FileText size={18} />, color: 'from-emerald-500 to-emerald-600' },
          { label: 'Conversion Rate', icon: <TrendingUp size={18} />, color: 'from-violet-500 to-violet-600' },
          { label: 'Agents Assigned', icon: <Users size={18} />, color: 'from-amber-500 to-amber-600' },
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

      {/* Insurance Lead CRM */}
      <LeadCRM user={user} filterType="INSURANCE" />
    </div>
  )
}
