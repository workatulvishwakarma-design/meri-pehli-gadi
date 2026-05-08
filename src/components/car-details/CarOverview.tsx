import { MapPin, Calendar, Fuel, Settings2, ShieldCheck, Gauge, Users } from 'lucide-react'
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
  }
}

export function CarOverview({ car }: CarOverviewProps) {
  const specs = [
    { label: 'Registration Year', value: car.year.toString(), icon: Calendar },
    { label: 'Kilometers Driven', value: `${car.kmDriven.toLocaleString()} km`, icon: Gauge },
    { label: 'Fuel Type', value: car.fuelType.charAt(0).toUpperCase() + car.fuelType.slice(1), icon: Fuel },
    { label: 'Transmission', value: car.transmission.charAt(0).toUpperCase() + car.transmission.slice(1), icon: Settings2 },
    { label: 'Ownership', value: `${car.ownerType.charAt(0).toUpperCase() + car.ownerType.slice(1).toLowerCase()} Owner`, icon: Users },
    { label: 'Body Type', value: car.bodyType.charAt(0).toUpperCase() + car.bodyType.slice(1).toLowerCase(), icon: ShieldCheck },
    { label: 'Location', value: car.city, icon: MapPin },
    ...(car.rto ? [{ label: 'RTO', value: car.rto, icon: ShieldCheck }] : []),
  ]

  return (
    <Card className="p-6 rounded-16 shadow-soft border-slate-200/80">
      <h3 className="text-xl font-bold text-slate-800 mb-6">Car Overview</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
        {specs.map((spec, idx) => {
          const Icon = spec.icon
          return (
            <div key={idx} className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Icon className="size-4" />
                <span className="text-xs uppercase tracking-wider font-semibold">{spec.label}</span>
              </div>
              <p className="text-[15px] font-bold text-slate-700">{spec.value}</p>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
