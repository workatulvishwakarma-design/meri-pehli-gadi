'use client'

import { useState } from 'react'
import { Calculator, Award } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface FinanceBoxProps {
  price: number
  emiPrice?: number | null
}

export function FinanceBox({ price, emiPrice }: FinanceBoxProps) {
  const [downpayment, setDownpayment] = useState(price * 0.2) // Default 20% down
  const [tenure, setTenure] = useState(60) // Default 5 years

  // Simple EMI calculation if emiPrice is not explicitly provided
  const principal = price - downpayment
  const ratePerMonth = 9.5 / 12 / 100 // assuming 9.5% PA
  const calculatedEmi = Math.round(
    (principal * ratePerMonth * Math.pow(1 + ratePerMonth, tenure)) /
      (Math.pow(1 + ratePerMonth, tenure) - 1)
  )

  const displayEmi = emiPrice || calculatedEmi

  return (
    <Card className="p-6 rounded-16 shadow-soft border-slate-200/80 bg-gradient-to-br from-white to-slate-50 relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute left-0 top-0 w-full h-1 bg-gradient-to-r from-accent-blue via-accent-orange to-accent-blue" />

      <div className="flex items-center gap-2 mb-6">
        <div className="size-10 rounded-full bg-accent-orange/10 flex items-center justify-center shrink-0">
          <Calculator className="size-5 text-accent-orange" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">Finance this Car</h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Award className="size-3 text-slate-400" />
            <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Powered by Shani Finserve</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="p-4 rounded-12 bg-white shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Estimated EMI</div>
            <div className="text-2xl font-extrabold text-brand leading-none">
              ₹{displayEmi.toLocaleString('en-IN')}
              <span className="text-sm font-semibold text-slate-400 ml-1">/mo</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Interest Rate</div>
            <div className="text-lg font-bold text-slate-700 leading-none">9.5% p.a.</div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <span className="text-slate-600">Down Payment</span>
              <span className="text-slate-800">₹{Math.round(downpayment).toLocaleString('en-IN')}</span>
            </div>
            <input 
              type="range" 
              min={price * 0.1} 
              max={price * 0.8} 
              value={downpayment} 
              onChange={(e) => setDownpayment(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent-orange"
            />
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mt-1">
              <span>10%</span>
              <span>80%</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <span className="text-slate-600">Loan Tenure</span>
              <span className="text-slate-800">{tenure} Months</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[12, 24, 36, 48, 60].map((t) => (
                <button
                  key={t}
                  onClick={() => setTenure(t)}
                  className={`py-1.5 text-xs font-bold rounded-md transition-colors ${
                    tenure === t 
                      ? 'bg-slate-800 text-white shadow-sm' 
                      : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {t}m
                </button>
              ))}
            </div>
          </div>
        </div>

        <Button className="w-full h-12 rounded-12 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-base shadow-md">
          Check Loan Eligibility
        </Button>
      </div>
    </Card>
  )
}
