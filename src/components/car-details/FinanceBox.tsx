'use client'

import { useState } from 'react'
import { Calculator, Award, TrendingUp, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface FinanceBoxProps {
  price: number
  emiPrice?: number | null
  onApply?: () => void  // trigger lead modal
}

export function FinanceBox({ price, emiPrice, onApply }: FinanceBoxProps) {
  const [downpayment, setDownpayment] = useState(price * 0.2)
  const [tenure, setTenure] = useState(60)
  const [rate, setRate] = useState(9.5)

  const principal = price - downpayment
  const ratePerMonth = rate / 12 / 100
  const calculatedEmi = principal > 0 ? Math.round(
    (principal * ratePerMonth * Math.pow(1 + ratePerMonth, tenure)) /
      (Math.pow(1 + ratePerMonth, tenure) - 1)
  ) : 0

  const displayEmi = emiPrice || calculatedEmi
  const totalPayment = displayEmi * tenure
  const totalInterest = totalPayment - principal

  return (
    <Card className="p-6 rounded-2xl shadow-sm border-slate-200/80 bg-gradient-to-br from-white to-slate-50 relative overflow-hidden">
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

      <div className="space-y-5">
        {/* EMI Display */}
        <div className="p-4 rounded-xl bg-white shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Monthly EMI</div>
              <div className="text-2xl font-extrabold text-brand leading-none">
                ₹{displayEmi.toLocaleString('en-IN')}
                <span className="text-sm font-semibold text-slate-400 ml-1">/mo</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Rate</div>
              <div className="text-lg font-bold text-slate-700 leading-none">{rate}% p.a.</div>
            </div>
          </div>

          {/* Summary Row */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Loan Amount</div>
              <div className="text-sm font-bold text-slate-700">₹{Math.round(principal).toLocaleString('en-IN')}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Total Interest</div>
              <div className="text-sm font-bold text-amber-600">₹{Math.max(0, Math.round(totalInterest)).toLocaleString('en-IN')}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Total Payment</div>
              <div className="text-sm font-bold text-slate-700">₹{Math.round(totalPayment).toLocaleString('en-IN')}</div>
            </div>
          </div>
        </div>

        {/* Down Payment Slider */}
        <div>
          <div className="flex justify-between text-sm font-semibold mb-2">
            <span className="text-slate-600">Down Payment</span>
            <span className="text-slate-800">₹{Math.round(downpayment).toLocaleString('en-IN')}</span>
          </div>
          <input
            type="range"
            min={price * 0.1}
            max={price * 0.8}
            step={1000}
            value={downpayment}
            onChange={(e) => setDownpayment(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent-orange"
          />
          <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mt-1">
            <span>10%</span>
            <span>80%</span>
          </div>
        </div>

        {/* Interest Rate Slider */}
        <div>
          <div className="flex justify-between text-sm font-semibold mb-2">
            <span className="text-slate-600">Interest Rate</span>
            <span className="text-slate-800">{rate}% p.a.</span>
          </div>
          <input
            type="range"
            min={8}
            max={14}
            step={0.5}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent-orange"
          />
          <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mt-1">
            <span>8%</span>
            <span>14%</span>
          </div>
        </div>

        {/* Tenure Buttons */}
        <div>
          <div className="flex justify-between text-sm font-semibold mb-2">
            <span className="text-slate-600">Loan Tenure</span>
            <span className="text-slate-800">{tenure} Months</span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[12, 24, 36, 48, 60].map((t) => (
              <button
                key={t}
                onClick={() => setTenure(t)}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  tenure === t
                    ? 'bg-slate-800 text-white shadow-sm scale-105'
                    : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {t}m
              </button>
            ))}
          </div>
        </div>

        {/* Apply CTA */}
        <Button
          onClick={onApply}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-accent-orange to-orange-600 hover:from-accent-orange/90 hover:to-orange-600/90 text-white font-semibold text-base shadow-lg shadow-accent-orange/20 hover:shadow-accent-orange/30 transition-all"
        >
          <TrendingUp className="size-4 mr-2" />
          Apply for Loan Approval
          <ArrowRight className="size-4 ml-2" />
        </Button>
      </div>
    </Card>
  )
}
