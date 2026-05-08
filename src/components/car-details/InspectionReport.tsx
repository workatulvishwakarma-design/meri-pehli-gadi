import { CheckCircle2, ShieldCheck, Wrench, CarFront, Zap, Thermometer } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface InspectionReportProps {
  score: number
  isCertified: boolean
}

export function InspectionReport({ score, isCertified }: InspectionReportProps) {
  const points = [
    { label: 'Engine & Transmission', status: 'Perfect', icon: Wrench },
    { label: 'Exterior & Body', status: 'Perfect', icon: CarFront },
    { label: 'Electricals & Interior', status: 'Perfect', icon: Zap },
    { label: 'AC & Cooling', status: 'Perfect', icon: Thermometer },
  ]

  return (
    <Card className="p-6 rounded-16 shadow-soft border-slate-200/80 overflow-hidden relative">
      {/* Decorative gradient */}
      <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50 -mr-20 -mt-20 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-slate-100 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="size-6 text-emerald-500" />
              <h3 className="text-xl font-bold text-slate-800">300-Point Inspection</h3>
            </div>
            <p className="text-sm text-slate-500">
              {isCertified 
                ? "This car is certified and has passed our rigorous quality checks."
                : "Comprehensive technical evaluation completed."}
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white shadow-sm border border-slate-100 px-5 py-3 rounded-12">
            <div className="text-center">
              <div className="text-3xl font-extrabold text-emerald-500 leading-none mb-1">{score}/100</div>
              <div className="text-[10px] font-bold tracking-wider uppercase text-slate-400">Condition Score</div>
            </div>
            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: `${score}%` }} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {points.map((point, idx) => {
            const Icon = point.icon
            return (
              <div key={idx} className="flex items-center justify-between p-3 rounded-12 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-emerald-50 flex items-center justify-center">
                    <Icon className="size-4 text-emerald-600" />
                  </div>
                  <span className="font-semibold text-sm text-slate-700">{point.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  <span className="text-sm font-bold text-emerald-600">{point.status}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
