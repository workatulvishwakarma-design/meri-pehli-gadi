'use client'

import { Shield, ShieldCheck, AlertTriangle, Car, Wrench, RefreshCw, Award, Umbrella, LifeBuoy, Zap, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface InsuranceTabProps {
  insuranceValidTill?: Date | string | null
  price: number
  carTitle: string
  onGetQuote: () => void
}

export function InsuranceTab({ insuranceValidTill, price, carTitle, onGetQuote }: InsuranceTabProps) {
  // Determine insurance status
  const today = new Date()
  let isValid = false
  let isExpired = false
  let statusText = 'Status Unknown'
  let statusColor = 'text-amber-600 bg-amber-50 border-amber-200'
  let StatusIcon = AlertTriangle

  if (insuranceValidTill) {
    const validDate = new Date(insuranceValidTill)
    if (validDate > today) {
      isValid = true
      statusText = `Active until ${validDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}`
      statusColor = 'text-emerald-700 bg-emerald-50 border-emerald-200'
      StatusIcon = ShieldCheck
    } else {
      isExpired = true
      statusText = 'Expired — Renewal Required'
      statusColor = 'text-red-700 bg-red-50 border-red-200'
      StatusIcon = AlertTriangle
    }
  }

  // Estimate prices
  const compEstimate = Math.round(price * 0.035) // Rough 3.5% estimate
  const tpEstimate = Math.round(compEstimate * 0.3) // Rough 30% of comp

  const addons = [
    { name: 'Zero Depreciation', icon: Shield, desc: 'Full claim without deduction for parts depreciation.' },
    { name: 'Roadside Assistance', icon: LifeBuoy, desc: '24/7 breakdown support and towing services.' },
    { name: 'Engine Protection', icon: Wrench, desc: 'Covers engine damage due to water ingression or oil leaks.' },
    { name: 'Return to Invoice', icon: RefreshCw, desc: 'Get original invoice value in case of total loss or theft.' },
  ]

  return (
    <Card className="p-6 rounded-2xl shadow-sm border-slate-200/80 bg-white/80 backdrop-blur-md">
      
      {/* Header & Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Umbrella className="size-6 text-brand" />
            Insurance & Protection
          </h3>
          <p className="text-slate-500 text-sm mt-1">Secure your {carTitle} with comprehensive coverage.</p>
        </div>
        
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${statusColor}`}>
          <StatusIcon className="size-4" />
          <span className="font-semibold text-sm">{statusText}</span>
        </div>
      </div>

      {/* Coverage Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Third Party */}
        <div className="border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors">
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="font-bold text-slate-800">Third Party (TP)</div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Mandatory by Law</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-slate-700">~₹{tpEstimate.toLocaleString('en-IN')}</div>
              <div className="text-[10px] text-slate-400">/year</div>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
              Covers damage to others (property/life)
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
              Legal protection
            </li>
            <li className="flex items-start gap-2 text-slate-400">
              <X className="size-4 text-slate-300 shrink-0 mt-0.5" />
              Does not cover your car's damage
            </li>
          </ul>
        </div>

        {/* Comprehensive */}
        <div className="border-2 border-brand bg-brand/5 rounded-xl p-5 relative">
          <div className="absolute -top-3 right-4 bg-brand text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
            Recommended
          </div>
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="font-bold text-brand">Comprehensive</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Maximum Protection</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-brand">~₹{compEstimate.toLocaleString('en-IN')}</div>
              <div className="text-[10px] text-slate-500">/year</div>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="size-4 text-brand shrink-0 mt-0.5" />
              Includes Third Party coverage
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="size-4 text-brand shrink-0 mt-0.5" />
              Damage from accidents, fire, theft
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="size-4 text-brand shrink-0 mt-0.5" />
              Natural calamities (flood, earthquake)
            </li>
          </ul>
        </div>
      </div>

      {/* Add-ons Grid */}
      <div className="mb-8">
        <h4 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wide">Popular Add-ons Available</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {addons.map((addon, idx) => {
            const Icon = addon.icon
            return (
              <div key={idx} className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex flex-col gap-2">
                <div className="size-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-brand mb-1">
                  <Icon className="size-4" />
                </div>
                <div className="font-bold text-slate-800 text-sm leading-tight">{addon.name}</div>
                <div className="text-xs text-slate-500">{addon.desc}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-slate-800 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 text-white">
        <div>
          <div className="font-bold text-lg">Compare & Buy Insurance Instantly</div>
          <div className="text-slate-300 text-sm mt-1">Get quotes from top providers with Shani Finserve.</div>
        </div>
        <Button 
          onClick={onGetQuote}
          className="w-full md:w-auto bg-white text-slate-800 hover:bg-slate-100 font-bold px-8 h-12 rounded-lg"
        >
          Get Insurance Quote <ArrowRight className="size-4 ml-2" />
        </Button>
      </div>

    </Card>
  )
}

function CheckCircle2(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  )
}

function X(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
}
