'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Shield, ShieldCheck, ShieldAlert, ShieldX, ShieldPlus, ArrowUpRight,
  Check, Car, FileText, Phone, MapPin, Mail, Send, Truck,
  BadgeCheck, Heart, AlertTriangle, Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form'
import { useAppStore } from '@/lib/store'

// ─── Animation Helpers ──────────────────────────────────────────────

function FadeInSection({ children, className = '', delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Insurance Schema ───────────────────────────────────────────────

const insuranceSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  registrationNumber: z.string().min(1, 'Registration number is required'),
  carBrand: z.string().min(1, 'Brand is required'),
  carModel: z.string().min(1, 'Model is required'),
  carYear: z.string().min(1, 'Year is required'),
})

type InsuranceFormData = z.infer<typeof insuranceSchema>

// ─── Data ────────────────────────────────────────────────────────────

const years = Array.from({ length: 25 }, (_, i) => String(2025 - i))
const brands = [
  'Maruti Suzuki', 'Hyundai', 'Honda', 'Toyota', 'Tata', 'Mahindra',
  'Kia', 'MG', 'Volkswagen', 'Skoda', 'BMW', 'Mercedes-Benz', 'Audi', 'Other'
]

// ─── Insurance Types ────────────────────────────────────────────────

const insuranceTypes = [
  {
    icon: Shield,
    title: 'Comprehensive',
    tagline: 'Complete Protection',
    color: 'bg-emerald-100 text-emerald-600',
    borderColor: 'border-emerald-200',
    badgeColor: 'bg-emerald-500',
    features: [
      'Third-party liability coverage',
      'Own damage coverage',
      'Personal accident cover',
      'Natural disaster protection',
      'Theft & burglary cover',
      'Zero depreciation add-on',
    ],
  },
  {
    icon: ShieldAlert,
    title: 'Third Party',
    tagline: 'Mandatory Coverage',
    color: 'bg-blue-100 text-blue-600',
    borderColor: 'border-blue-200',
    badgeColor: 'bg-blue-500',
    features: [
      'Third-party liability cover',
      'Legal liability protection',
      'Personal accident cover',
      'Mandatory by law',
      'Affordable premium',
      'Basic protection',
    ],
  },
  {
    icon: ShieldPlus,
    title: 'Zero Depreciation',
    tagline: 'Full Claim Value',
    color: 'bg-purple-100 text-purple-600',
    borderColor: 'border-purple-200',
    badgeColor: 'bg-purple-500',
    features: [
      'No depreciation deduction',
      'Full claim on parts',
      'Higher claim amount',
      'Best for new cars',
      'Peace of mind',
      'Reduces out-of-pocket cost',
    ],
  },
  {
    icon: ShieldX,
    title: 'Own Damage',
    tagline: 'Protect Your Car',
    color: 'bg-orange-100 text-orange-600',
    borderColor: 'border-orange-200',
    badgeColor: 'bg-orange-500',
    features: [
      'Damage to your own car',
      'Accident coverage',
      'Fire & explosion cover',
      'Flood & natural calamity',
      'Theft protection',
      'Standalone policy',
    ],
  },
]

// ─── Coverage Comparison Data ───────────────────────────────────────

const coverageData = [
  { feature: 'Third-Party Liability', comprehensive: true, thirdParty: true, zeroDep: true, ownDamage: false },
  { feature: 'Own Damage Cover', comprehensive: true, thirdParty: false, zeroDep: true, ownDamage: true },
  { feature: 'Personal Accident', comprehensive: true, thirdParty: true, zeroDep: true, ownDamage: false },
  { feature: 'Zero Depreciation', comprehensive: true, thirdParty: false, zeroDep: true, ownDamage: false },
  { feature: 'Theft Protection', comprehensive: true, thirdParty: false, zeroDep: true, ownDamage: true },
  { feature: 'Natural Disaster', comprehensive: true, thirdParty: false, zeroDep: true, ownDamage: true },
  { feature: 'Fire & Explosion', comprehensive: true, thirdParty: false, zeroDep: true, ownDamage: true },
  { feature: 'Engine Protection', comprehensive: false, thirdParty: false, zeroDep: true, ownDamage: false },
  { feature: 'Roadside Assistance', comprehensive: true, thirdParty: false, zeroDep: true, ownDamage: false },
  { feature: 'Return to Invoice', comprehensive: false, thirdParty: false, zeroDep: true, ownDamage: false },
]

// ─── Claim Process Steps ────────────────────────────────────────────

const claimSteps = [
  {
    icon: Phone,
    title: 'Report the Claim',
    desc: 'Call the insurance helpline or file online within 24 hours of the incident',
  },
  {
    icon: FileText,
    title: 'Submit Documents',
    desc: 'Provide required documents like FIR copy, photos, and claim form',
  },
  {
    icon: Car,
    title: 'Vehicle Inspection',
    desc: 'Surveyor will inspect your vehicle and assess the damage',
  },
  {
    icon: BadgeCheck,
    title: 'Claim Settlement',
    desc: 'Once approved, the claim amount is disbursed directly to you or garage',
  },
]

// ─── Main InsurancePage Component ───────────────────────────────────

export function InsurancePage() {
  const [brandsData, setBrandsData] = useState<{ id: string; name: string }[]>([])
  const [modelsData, setModelsData] = useState<{ id: string; name: string }[]>([])
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const form = useForm<InsuranceFormData>({
    resolver: zodResolver(insuranceSchema),
    defaultValues: { name: '', email: '', phone: '', registrationNumber: '', carBrand: '', carModel: '', carYear: '' },
  })

  const selectedBrand = form.watch('carBrand')

  useEffect(() => {
    fetch('/api/brands').then(r => r.json()).then(d => setBrandsData(d.brands || [])).catch(() => {})
  }, [])

  useEffect(() => {
    if (selectedBrand) {
      fetch(`/api/models?brandId=${selectedBrand}`)
        .then(r => r.json())
        .then(d => setModelsData(d.models || []))
        .catch(() => setModelsData([]))
    } else {
      setModelsData([])
    }
  }, [selectedBrand])

  const handleFormSubmit = async () => {
    const valid = await form.trigger()
    if (!valid) return

    setLoading(true)
    setError('')

    try {
      const vals = form.getValues()
      const payload = {
        name: vals.name,
        email: vals.email || undefined,
        phone: vals.phone,
        registrationNumber: vals.registrationNumber,
        carBrand: vals.carBrand,
        carModel: vals.carModel,
        carYear: Number(vals.carYear),
      }

      const res = await fetch('/api/leads/insurance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.error || 'Failed to submit')
      }

      setFormSubmitted(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-green-500 to-teal-400 py-16 md:py-24 px-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYyaDR2MmgtNHYyem0wLTE2aC0ydi00aDJ2Mmg0djJoLTR2MnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="bg-white/20 text-white border-white/30 mb-4 text-sm px-4 py-1">
                <Shield className="size-3.5 mr-1.5" />
                Powered by Shani Finserve
              </Badge>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
                Car <span className="text-emerald-100">Insurance</span> by Shani Finserve
              </h1>
              <p className="text-white/90 text-lg md:text-xl">
                Protect your car with the best insurance plans. Compare, choose, and get instant quotes.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Insurance Types Section */}
      <section className="py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-brand mb-3">
                Choose Your Insurance Type
              </h2>
              <p className="text-slate-500 max-w-lg mx-auto">
                We offer all types of car insurance to suit your needs and budget
              </p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {insuranceTypes.map((item, i) => (
              <FadeInSection key={item.title} delay={i * 0.1}>
                <Card className={`p-6 rounded-2xl border ${item.borderColor} hover:shadow-lg transition-all duration-300 group`}>
                  <div className={`size-14 ${item.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <item.icon className="size-7" />
                  </div>
                  <h3 className="font-bold text-brand text-lg mb-1">{item.title}</h3>
                  <p className="text-xs text-slate-400 mb-4">{item.tagline}</p>
                  <ul className="space-y-2">
                    {item.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-slate-600">
                        <Check className="size-3.5 text-green-500 mt-0.5 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Card>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Get Quote Form Section */}
      <section className="py-12 md:py-16 px-4 bg-slate-50/50">
        <div className="max-w-3xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-brand mb-3">
                Get Insurance Quote
              </h2>
              <p className="text-slate-500 max-w-lg mx-auto">
                Enter your car details and get a free insurance quote from Shani Finserve
              </p>
            </div>
          </FadeInSection>

          <FadeInSection delay={0.1}>
            {formSubmitted ? (
              <Card className="p-8 rounded-2xl border-slate-200/60 text-center">
                <div className="size-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="size-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-brand mb-3">Quote Request Submitted!</h3>
                <p className="text-slate-500 mb-6">
                  Thank you! Shani Finserve will contact you within 24 hours with customized insurance quotes for your car.
                </p>
                <Button
                  onClick={() => { setFormSubmitted(false); form.reset() }}
                  variant="outline"
                  className="rounded-xl"
                >
                  Get Another Quote
                </Button>
              </Card>
            ) : (
              <Card className="p-6 md:p-8 rounded-2xl border-slate-200/60">
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3 mb-4"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <Form {...form}>
                  <div className="space-y-4">
                    <FormField control={form.control} name="registrationNumber" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registration Number</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. AS 01 AB 1234" className="uppercase" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="10-digit mobile number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="carBrand" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brand</FormLabel>
                          <Select value={field.value} onValueChange={(v) => { field.onChange(v); form.setValue('carModel', '') }}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select Brand" /></SelectTrigger></FormControl>
                            <SelectContent>
                              {brandsData.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="carModel" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Model</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange} disabled={!selectedBrand}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select Model" /></SelectTrigger></FormControl>
                            <SelectContent>
                              {modelsData.map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="carYear" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select Year" /></SelectTrigger></FormControl>
                            <SelectContent>
                              {years.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email (Optional)</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="your@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <Button
                      type="button"
                      onClick={handleFormSubmit}
                      disabled={loading}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-12 text-base font-semibold btn-shine"
                    >
                      {loading ? (
                        <>
                          <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="size-4 mr-2" />
                          Get Free Quote
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              </Card>
            )}
          </FadeInSection>
        </div>
      </section>

      {/* Coverage Comparison Table */}
      <section className="py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-brand mb-3">
                Coverage Comparison
              </h2>
              <p className="text-slate-500 max-w-lg mx-auto">
                Compare different insurance types to choose the right one for you
              </p>
            </div>
          </FadeInSection>

          <FadeInSection delay={0.1}>
            <Card className="rounded-2xl border-slate-200/60 overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="font-semibold text-brand">Coverage</TableHead>
                      <TableHead className="font-semibold text-center text-emerald-700">Comprehensive</TableHead>
                      <TableHead className="font-semibold text-center text-blue-700">Third Party</TableHead>
                      <TableHead className="font-semibold text-center text-purple-700">Zero Dep</TableHead>
                      <TableHead className="font-semibold text-center text-orange-700">Own Damage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coverageData.map((row) => (
                      <TableRow key={row.feature}>
                        <TableCell className="font-medium text-slate-700">{row.feature}</TableCell>
                        <TableCell className="text-center">
                          {row.comprehensive ? <Check className="size-4 text-green-600 mx-auto" /> : <span className="text-slate-300">—</span>}
                        </TableCell>
                        <TableCell className="text-center">
                          {row.thirdParty ? <Check className="size-4 text-green-600 mx-auto" /> : <span className="text-slate-300">—</span>}
                        </TableCell>
                        <TableCell className="text-center">
                          {row.zeroDep ? <Check className="size-4 text-green-600 mx-auto" /> : <span className="text-slate-300">—</span>}
                        </TableCell>
                        <TableCell className="text-center">
                          {row.ownDamage ? <Check className="size-4 text-green-600 mx-auto" /> : <span className="text-slate-300">—</span>}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </FadeInSection>
        </div>
      </section>

      {/* Claim Process Section */}
      <section className="py-12 md:py-16 px-4 bg-slate-50/50">
        <div className="max-w-6xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-brand mb-3">
                Claim Process
              </h2>
              <p className="text-slate-500 max-w-lg mx-auto">
                Simple 4-step process to get your claim settled quickly
              </p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {claimSteps.map((step, i) => (
              <FadeInSection key={step.title} delay={i * 0.1}>
                <Card className="p-6 rounded-2xl border-slate-200/60 hover:shadow-lg transition-all duration-300 text-center group relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 size-7 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </div>
                  <div className="size-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 mt-2 group-hover:scale-110 transition-transform">
                    <step.icon className="size-7 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-brand mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                </Card>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Powered By Badge */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <FadeInSection>
            <Card className="p-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white flex flex-col md:flex-row items-center justify-center gap-4">
              <div className="size-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Shield className="size-6" />
              </div>
              <div className="text-center md:text-left">
                <h3 className="font-bold text-lg">Powered by Shani Finserve</h3>
                <p className="text-white/70 text-sm">Your trusted partner for car insurance solutions across Northeast India</p>
              </div>
              <Badge className="bg-white/20 text-white border-white/30 ml-0 md:ml-auto">
                Verified Partner
              </Badge>
            </Card>
          </FadeInSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <FadeInSection>
            <Card className="p-8 md:p-12 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Still Uninsured? Don&apos;t Risk It!
              </h2>
              <p className="text-white/80 mb-6 max-w-lg mx-auto">
                Get comprehensive car insurance starting from just ₹2,000/year. Protect your car and your family today.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => document.getElementById('quote-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-white text-emerald-600 hover:bg-slate-100 rounded-xl h-12 px-8 text-base font-semibold"
                >
                  Get Free Quote
                  <ArrowUpRight className="size-4 ml-2" />
                </Button>
                <Button
                  onClick={() => useAppStore.getState().navigateTo('contact')}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 rounded-xl h-12 px-8 text-base font-semibold"
                >
                  Talk to Expert
                </Button>
              </div>
            </Card>
          </FadeInSection>
        </div>
      </section>
    </div>
  )
}
