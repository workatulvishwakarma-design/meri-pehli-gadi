'use client'

import {
  Fuel,
  Settings2,
  Car,
  Users,
  Package,
  Gauge,
  ArrowUpDown,
  Droplets,
  CheckCircle2,
} from 'lucide-react'

// ─── Types ──────────────────────────────────────────────────────────────

interface SpecsAndFeaturesProps {
  features: { id: string; name: string }[]
  car: {
    fuelType: string
    transmission: string
    bodyType: string
    year: number
    kmDriven: number
    color?: string | null
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────

function capitalize(s: string): string {
  if (!s) return ''
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

function getSeatingCapacity(bodyType: string): string {
  const bt = bodyType.toLowerCase()
  if (bt === 'suv' || bt === 'mpv' || bt === 'muv') return '7 Seater'
  return '5 Seater'
}

function getBootSpace(bodyType: string): string {
  const bt = bodyType.toLowerCase()
  if (bt === 'hatchback') return '320 L'
  if (bt === 'sedan') return '460 L'
  if (bt === 'suv' || bt === 'muv' || bt === 'mpv') return '500 L'
  if (bt === 'coupe') return '350 L'
  return '400 L'
}

function getMileage(fuelType: string): string {
  const ft = fuelType.toLowerCase()
  if (ft === 'petrol') return '15-18 kmpl'
  if (ft === 'diesel') return '18-22 kmpl'
  if (ft === 'cng') return '25-28 km/kg'
  if (ft === 'electric') return '300-400 km'
  if (ft === 'hybrid') return '20-25 kmpl'
  return '15-20 kmpl'
}

function getGroundClearance(bodyType: string): string {
  const bt = bodyType.toLowerCase()
  if (bt === 'hatchback') return '165 mm'
  if (bt === 'sedan') return '170 mm'
  if (bt === 'suv' || bt === 'muv' || bt === 'mpv') return '200 mm'
  if (bt === 'coupe') return '155 mm'
  return '175 mm'
}

function getFuelTank(bodyType: string): string {
  const bt = bodyType.toLowerCase()
  if (bt === 'hatchback') return '35 L'
  if (bt === 'sedan') return '45 L'
  if (bt === 'suv' || bt === 'muv' || bt === 'mpv') return '55 L'
  if (bt === 'coupe') return '50 L'
  return '42 L'
}

const DEFAULT_FEATURES = [
  'AC',
  'Power Steering',
  'Power Windows',
  'Central Locking',
  'ABS',
  'Airbags',
  'Music System',
  'Rear Defogger',
]

// ─── Component ─────────────────────────────────────────────────────────

export function SpecsAndFeatures({ features, car }: SpecsAndFeaturesProps) {
  const specs = [
    {
      icon: Fuel,
      label: 'Engine Type',
      value: capitalize(car.fuelType),
    },
    {
      icon: Settings2,
      label: 'Transmission',
      value: capitalize(car.transmission),
    },
    {
      icon: Car,
      label: 'Body Type',
      value: capitalize(car.bodyType),
    },
    {
      icon: Users,
      label: 'Seating Capacity',
      value: getSeatingCapacity(car.bodyType),
    },
    {
      icon: Package,
      label: 'Boot Space',
      value: getBootSpace(car.bodyType),
    },
    {
      icon: Gauge,
      label: 'Mileage',
      value: getMileage(car.fuelType),
    },
    {
      icon: ArrowUpDown,
      label: 'Ground Clearance',
      value: getGroundClearance(car.bodyType),
    },
    {
      icon: Droplets,
      label: 'Fuel Tank',
      value: getFuelTank(car.bodyType),
    },
  ]

  const hasDbFeatures = features.length > 0

  return (
    <div className="space-y-8">
      {/* ─── Section 1: Key Specifications ─── */}
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-5">
          Key Specifications
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {specs.map((spec) => {
            const Icon = spec.icon
            return (
              <div
                key={spec.label}
                className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex flex-col items-start gap-2"
              >
                <div className="size-9 rounded-lg bg-slate-50 flex items-center justify-center">
                  <Icon className="size-[18px] text-slate-500" />
                </div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                  {spec.label}
                </span>
                <span className="text-[15px] font-bold text-slate-800 -mt-0.5">
                  {spec.value}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ─── Section 2: Features ─── */}
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-5">Features</h3>

        <div className="flex flex-wrap gap-2.5">
          {hasDbFeatures
            ? features.map((feature) => (
                <span
                  key={feature.id}
                  className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-3 py-1.5 text-sm font-medium"
                >
                  <CheckCircle2 className="size-3.5 shrink-0" />
                  {feature.name}
                </span>
              ))
            : DEFAULT_FEATURES.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 rounded-full px-3 py-1.5 text-sm font-medium"
                >
                  <CheckCircle2 className="size-3.5 shrink-0 text-slate-400" />
                  {name}
                </span>
              ))}
        </div>
      </div>
    </div>
  )
}
