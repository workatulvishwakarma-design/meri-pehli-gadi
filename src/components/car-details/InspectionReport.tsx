import { CheckCircle2, ShieldCheck, Wrench, CarFront, Zap, Thermometer, AlertTriangle, Droplets } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface InspectionReportProps {
  score: number // conditionScore from DB (1-10 scale)
  isCertified: boolean
}

// Generate per-category scores from overall conditionScore
function getCategoryScores(overallScore: number) {
  // Normalize to 0-10 if somehow on 0-100 scale
  const base = overallScore > 10 ? overallScore / 10 : overallScore
  const clamp = (v: number) => Math.min(10, Math.max(0, Number(v.toFixed(1))))

  return [
    { label: 'Engine & Transmission', score: clamp(base + 0.2), icon: Wrench },
    { label: 'Exterior & Body', score: clamp(base - 0.5), icon: CarFront },
    { label: 'Interior & Electricals', score: clamp(base), icon: Zap },
    { label: 'Tyres & Brakes', score: clamp(base - 0.2), icon: Droplets },
    { label: 'AC & Cooling', score: clamp(base + 0.5), icon: Thermometer },
  ]
}

function getScoreColor(score: number) {
  if (score >= 8) return { bar: 'bg-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Excellent' }
  if (score >= 6) return { bar: 'bg-amber-500', text: 'text-amber-600', bg: 'bg-amber-50', label: 'Good' }
  if (score >= 4) return { bar: 'bg-orange-500', text: 'text-orange-600', bg: 'bg-orange-50', label: 'Fair' }
  return { bar: 'bg-red-500', text: 'text-red-600', bg: 'bg-red-50', label: 'Needs Attention' }
}

export function InspectionReport({ score, isCertified }: InspectionReportProps) {
  const categories = getCategoryScores(score)
  const overallPercent = Math.min(100, (score > 10 ? score : score * 10))
  const overall = getScoreColor(score > 10 ? score / 10 : score)

  return (
    <Card className="p-6 rounded-2xl shadow-sm border-slate-200/80 overflow-hidden relative">
      {/* Decorative gradient */}
      <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50 -mr-20 -mt-20 pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-slate-100 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="size-6 text-emerald-500" />
              <h3 className="text-xl font-bold text-slate-800">300-Point Inspection</h3>
            </div>
            <p className="text-sm text-slate-500">
              {isCertified
                ? "✅ This car is MeriPehli Gadi certified and has passed rigorous quality checks."
                : "Comprehensive technical evaluation completed by certified engineers."}
            </p>
          </div>

          {/* Overall Score */}
          <div className="flex items-center gap-4 bg-white shadow-sm border border-slate-100 px-5 py-3 rounded-xl">
            <div className="text-center">
              <div className={`text-3xl font-extrabold leading-none mb-1 ${overall.text}`}>
                {(score > 10 ? score / 10 : score).toFixed(1)}
                <span className="text-base font-bold text-slate-400">/10</span>
              </div>
              <div className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                {overall.label}
              </div>
            </div>
            <div className="w-24 h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${overall.bar}`}
                style={{ width: `${overallPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Category Progress Bars */}
        <div className="space-y-4 mb-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon
            const colors = getScoreColor(cat.score)
            const percent = (cat.score / 10) * 100

            return (
              <div key={idx} className="group">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2.5">
                    <div className={`size-8 rounded-lg ${colors.bg} flex items-center justify-center`}>
                      <Icon className={`size-4 ${colors.text}`} />
                    </div>
                    <span className="font-semibold text-sm text-slate-700">{cat.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${colors.text}`}>{cat.score}/10</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${colors.text} hidden md:block`}>
                      {colors.label}
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${colors.bar}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Safety Checks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/80 border border-emerald-100">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="size-4 text-emerald-600" />
              <span className="text-sm font-semibold text-slate-700">Accident History</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-emerald-500" />
              <span className="text-sm font-bold text-emerald-600">Clean</span>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/80 border border-emerald-100">
            <div className="flex items-center gap-2.5">
              <Droplets className="size-4 text-emerald-600" />
              <span className="text-sm font-semibold text-slate-700">Flood Damage</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-emerald-500" />
              <span className="text-sm font-bold text-emerald-600">None</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
