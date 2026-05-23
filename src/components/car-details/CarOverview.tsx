import { MapPin, Calendar, Fuel, Settings2, Shield, Gauge, Users, Car, Banknote } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface CarOverviewProps {
  car: {
    year: number
    kmDriven: number
    fuelType: string
    transmission: string
    ownerType: string
    city: string
    rto?: string | null
    bodyType: string
    price: number
    color?: string | null
  }
}

function formatOwnerType(owner: string): string {
  const lower = owner.toLowerCase()
  if (lower === 'first') return '1st Owner'
  if (lower === 'second') return '2nd Owner'
  if (lower === 'third') return '3rd Owner'
  if (lower === 'fourth_plus') return '4th+ Owner'
  return owner.charAt(0).toUpperCase() + owner.slice(1).toLowerCase() + ' Owner'
}

function capitalize(s: string): string {
  if (!s) return ''
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

function estimateEmi(price: number): string {
  const principal = price * 0.8 // 20% down
  const rate = 9.5 / 12 / 100
  const tenure = 60
  const emi = Math.round(
    (principal * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1)
  )
  return `₹${emi.toLocaleString('en-IN')}/mo`
}

export function CarOverview({ car }: CarOverviewProps) {
  const specs = [
    { label: 'Registration Year', value: car.year.toString(), icon: Calendar },
    { label: 'KM Driven', value: `${car.kmDriven.toLocaleString()} km`, icon: Gauge },
    { label: 'Fuel Type', value: capitalize(car.fuelType), icon: Fuel },
    { label: 'Transmission', value: capitalize(car.transmission), icon: Settings2 },
    { label: 'Ownership', value: formatOwnerType(car.ownerType), icon: Users },
    { label: 'Body Type', value: capitalize(car.bodyType), icon: Car },
    { label: 'Location', value: car.city, icon: MapPin },
    ...(car.rto ? [{ label: 'RTO', value: car.rto, icon: Shield }] : []),
    ...(car.color ? [{ label: 'Color', value: capitalize(car.color), icon: Car }] : []),
    { label: 'Est. EMI', value: estimateEmi(car.price), icon: Banknote },
  ]

  return (
    <Card className="p-6 rounded-2xl shadow-sm border-slate-200/80">
      <h3 className="text-xl font-bold text-slate-800 mb-6">Car Overview</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-5 gap-x-4">
        {specs.map((spec, idx) => {
          const Icon = spec.icon
          return (
            <div key={idx} className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Icon className="size-4" />
                <span className="text-[10px] uppercase tracking-wider font-semibold">{spec.label}</span>
              </div>
              <p className="text-[15px] font-bold text-slate-700">{spec.value}</p>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
