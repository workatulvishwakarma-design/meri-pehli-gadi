'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Shield, ShieldCheck, ShieldHalf, ShieldAlert, Check, CheckCircle2,
  ArrowRight, Phone, Mail, User, MapPin, Clock, HelpCircle,
  FileText, Car, Award, Zap, HeadphonesIcon, RefreshCcw, CircleDot,
  AlertTriangle, Search, FileCheck, ClipboardList, ThumbsUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
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

// ─── Schema ──────────────────────────────────────────────────────────

const insuranceFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  registrationNumber: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  year: z.string().optional(),
  previousExpiry: z.string().optional(),
  claimHistory: z.string().optional(),
})

type InsuranceFormData = z.infer<typeof insuranceFormSchema>

// ─── Data ────────────────────────────────────────────────────────────

const years = Array.from({ length: 25 }, (_, i) => String(2025 - i))

const insuranceTypes = [
  {
    icon: ShieldCheck,
    title: 'Comprehensive Insurance',
    desc: 'Complete coverage for your vehicle including third-party liability, own damage, theft, fire, and natural disasters. Best overall protection.',
    features: ['Third-Party Liability', 'Own Damage Cover', 'Theft Protection', 'Natural Calamities', 'Personal Accident Cover'],
    color: 'from-emerald-500 to-green-600',
    badge: 'Most Popular',
  },
  {
    icon: Shield,
    title: 'Third-Party Insurance',
    desc: 'Mandatory by law. Covers damage to third-party property and injuries. Basic protection at an affordable price.',
    features: ['Third-Party Liability', 'Legal Compliance', 'Personal Accident', 'Affordable Premium'],
    color: 'from-blue-500 to-cyan-600',
    badge: 'Mandatory',
  },
  {
    icon: ShieldHalf,
    title: 'Zero Depreciation',
    desc: 'Get full claim amount without depreciation deduction. Ideal for new and luxury cars. No out-of-pocket expenses.',
    features: ['No Depreciation Cut', 'Full Claim Amount', 'New Parts Coverage', 'Higher Premium Value'],
    color: 'from-violet-500 to-purple-600',
    badge: 'Recommended',
  },
  {
    icon: ShieldAlert,
    title: 'Own Damage',
    desc: 'Covers damage to your own vehicle due to accidents, fire, theft, and natural calamities. Standalone damage protection.',
    features: ['Accident Cover', 'Fire & Theft', 'Natural Disasters', 'Faster Claims'],
    color: 'from-orange-500 to-amber-600',
    badge: 'Flexible',
  },
]

const benefits = [
  { icon: Zap, title: 'Quick Claims', desc: 'Get your claims processed within 7 working days', color: 'bg-amber-100 text-amber-600' },
  { icon: CheckCircle2, title: 'Cashless Network', desc: '1500+ network garages across India', color: 'bg-green-100 text-green-600' },
  { icon: HeadphonesIcon, title: '24/7 Support', desc: 'Round-the-clock assistance for emergencies', color: 'bg-blue-100 text-blue-600' },
  { icon: RefreshCcw, title: 'Renewal Assistance', desc: 'Timely reminders and hassle-free renewal', color: 'bg-purple-100 text-purple-600' },
]

const claimSteps = [
  {
    step: 1,
    icon: AlertTriangle,
    title: 'Report Incident',
    desc: 'Call our 24/7 helpline or report online. Keep all documents ready.',
  },
  {
    step: 2,
    icon: Search,
    title: 'Inspection',
    desc: 'Our surveyor will inspect your vehicle and assess the damage within 48 hours.',
  },
  {
    step: 3,
    icon: FileCheck,
    title: 'Documentation',
    desc: 'Submit required documents — FIR copy (if any), photos, registration certificate.',
  },
  {
    step: 4,
    icon: ThumbsUp,
    title: 'Claim Settlement',
    desc: 'Get your claim approved and amount credited within 7 working days.',
  },
]

const faqs = [
  {
    q: 'What is the difference between comprehensive and third-party insurance?',
    a: 'Third-party insurance only covers damage to third-party persons/property and is mandatory by law. Comprehensive insurance covers both third-party liability AND damage to your own vehicle due to accidents, theft, fire, floods, etc.',
  },
  {
    q: 'Is zero depreciation cover worth it?',
    a: 'Zero depreciation is highly recommended for new cars (under 5 years). It ensures you get the full claim amount without any depreciation deduction, which can save you 20-40% on claim settlement.',
  },
  {
    q: 'How long does it take to get an insurance claim settled?',
    a: 'With Shani Finserve, most claims are processed within 7 working days. Cashless claims at network garages are even faster. Complex cases may take up to 15 days.',
  },
  {
    q: 'Can I transfer my existing insurance to a new car?',
    a: 'Yes, you can transfer your No Claim Bonus (NCB) to your new car. The NCB discount can range from 20% to 50% depending on your claim-free years.',
  },
  {
    q: 'What happens if my policy expires?',
    a: 'If your policy expires, you lose benefits like NCB and may face legal issues. A lapsed policy also means your vehicle is uninsured. We recommend renewing at least 30 days before expiry.',
  },
]

// ─── Coverage Comparison Table Data ──────────────────────────────────

const coverageData = [
  { feature: 'Third-Party Liability', comprehensive: true, thirdParty: true, zeroDep: true },
  { feature: 'Own Damage', comprehensive: true, thirdParty: false, zeroDep: true },
  { feature: 'Theft Coverage', comprehensive: true, thirdParty: false, zeroDep: true },
  { feature: 'Fire Damage', comprehensive: true, thirdParty: false, zeroDep: true },
  { feature: 'Natural Calamities', comprehensive: true, thirdParty: false, zeroDep: true },
  { feature: 'Personal Accident', comprehensive: true, thirdParty: true, zeroDep: true },
  { feature: 'Zero Depreciation', comprehensive: false, thirdParty: false, zeroDep: true },
  { feature: 'Engine Protection', comprehensive: false, thirdParty: false, zeroDep: true },
  { feature: 'Roadside Assistance', comprehensive: false, thirdParty: false, zeroDep: true },
  { feature: 'No Claim Bonus', comprehensive: true, thirdParty: true, zeroDep: true },
  { feature: 'Cashless Claims', comprehensive: true, thirdParty: true, zeroDep: true },
]

// ─── Get Quote Form Component ────────────────────────────────────────

function GetQuoteForm() {
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([])
  const [models, setModels] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/brands').then(r => r.json()).then(d => setBrands(d.brands || [])).catch(() => {})
  }, [])

  const form = useForm<InsuranceFormData>({
    resolver: zodResolver(insuranceFormSchema),
    defaultValues: { name: '', email: '', phone: '', registrationNumber: '', brand: '', model: '', year: '', previousExpiry: '', claimHistory: '' },
  })

  const selectedBrand = form.watch('brand')

  useEffect(() => {
    if (selectedBrand) {
      fetch(`/api/models?brandId=${selectedBrand}`).then(r => r.json()).then(d => setModels(d.models || [])).catch(() => setModels([]))
    } else {
      setModels([])
    }
  }, [selectedBrand])

  const onSubmit = async (data: InsuranceFormData) => {
    setLoading(true)
    setError('')

    try {
      const payload = {
        name: data.name,
        email: data.email || undefined,
        phone: data.phone,
        registrationNumber: data.registrationNumber || undefined,
        carBrand: data.brand || undefined,
        carModel: data.model || undefined,
        carYear: data.year ? Number(data.year) : undefined,
        existingPolicy: !!data.previousExpiry,
        previousClaim: data.claimHistory === 'yes',
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

      setSubmitted(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
        <div className="size-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="size-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-brand mb-2">Quote Request Submitted!</h3>
        <p className="text-sm text-slate-500 mb-4">
          Our insurance team from Shani Finserve will contact you within 24 hours with the best insurance quotes.
        </p>
        <Button
          onClick={() => useAppStore.getState().navigateTo('home')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
        >
          Back to Home
        </Button>
      </motion.div>
    )
  }

  return (
    <Card className="p-6 rounded-2xl shadow-sm border-slate-200/60">
      <div className="flex items-center gap-3 mb-6">
        <div className="size-10 bg-emerald-100 rounded-xl flex items-center justify-center">
          <ShieldCheck className="size-5 text-emerald-600" />
        </div>
        <div>
          <h3 className="font-bold text-brand text-lg">Get Insurance Quote</h3>
          <p className="text-xs text-slate-400">Compare quotes from top insurers instantly</p>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3 mb-4">{error}</motion.div>
        )}
      </AnimatePresence>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl><Input placeholder="Your name" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl><Input type="email" placeholder="your@email.com" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl><Input type="tel" placeholder="10-digit number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <FormField control={form.control} name="registrationNumber" render={({ field }) => (
            <FormItem>
              <FormLabel>Car Registration Number</FormLabel>
              <FormControl><Input placeholder="e.g. AS 01 AB 1234" className="uppercase" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField control={form.control} name="brand" render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <Select value={field.value || ''} onValueChange={(v) => { field.onChange(v); form.setValue('model', '') }}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select Brand" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {brands.map((b) => (<SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="model" render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <Select value={field.value || ''} onValueChange={field.onChange} disabled={!selectedBrand}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select Model" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {models.map((m) => (<SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="year" render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <Select value={field.value || ''} onValueChange={field.onChange}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {years.map((y) => (<SelectItem key={y} value={y}>{y}</SelectItem>))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="previousExpiry" render={({ field }) => (
              <FormItem>
                <FormLabel>Previous Policy Expiry</FormLabel>
                <FormControl>
                  <input type="date" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="claimHistory" render={({ field }) => (
              <FormItem>
                <FormLabel>Previous Claim History</FormLabel>
                <Select value={field.value || ''} onValueChange={field.onChange}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Any previous claims?" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="no">No Claims</SelectItem>
                    <SelectItem value="yes">Had Claims</SelectItem>
                    <SelectItem value="new">First Time Insurance</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-12 text-base font-semibold gap-2"
          >
            {loading ? (
              <>
                <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Getting Quotes...
              </>
            ) : (
              <>
                <ShieldCheck className="size-4" />
                Get Insurance Quotes
              </>
            )}
          </Button>
        </form>
      </Form>

      <p className="text-[10px] text-slate-400 text-center mt-3">
        Your information is secure. We only share it with verified insurance partners.
      </p>
    </Card>
  )
}

// ─── Main InsurancePage Export ───────────────────────────────────────

export function InsurancePage() {
  const navigateTo = useAppStore((s) => s.navigateTo)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 size-60 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 size-40 bg-white rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10 py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Badge className="bg-white/20 text-white border-0 mb-4 text-xs">
              <ShieldHalf className="size-3 mr-1" />
              Insurance Partner: Shani Finserve
            </Badge>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
              Car Insurance by Shani Finserve
            </h1>
            <p className="text-green-100/90 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
              Secure your car before your first drive. Get comprehensive coverage, third-party insurance, zero depreciation plans from top insurers at the best rates.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Insurance Types */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-brand mb-2">Insurance Types</h2>
              <p className="text-slate-500 text-sm">Choose the right coverage for your vehicle</p>
            </div>
          </FadeInSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
            {insuranceTypes.map((ins, i) => (
              <FadeInSection key={ins.title} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all relative overflow-hidden"
                >
                  <Badge className={`absolute top-4 right-4 text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r ${ins.color} text-white border-0`}>
                    {ins.badge}
                  </Badge>
                  <div className={`size-12 rounded-xl bg-gradient-to-br ${ins.color} flex items-center justify-center mb-4`}>
                    <ins.icon className="size-6 text-white" />
                  </div>
                  <h3 className="font-bold text-brand text-lg mb-2">{ins.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">{ins.desc}</p>
                  <div className="space-y-2">
                    {ins.features.map((f) => (
                      <div key={f} className="flex items-center gap-2">
                        <Check className="size-3.5 text-emerald-500 flex-shrink-0" />
                        <span className="text-xs text-slate-600">{f}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 md:py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-brand mb-2">Insurance Benefits</h2>
              <p className="text-slate-500 text-sm">Why choose Shani Finserve for your car insurance</p>
            </div>
          </FadeInSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {benefits.map((b, i) => (
              <FadeInSection key={b.title} delay={i * 0.08}>
                <motion.div whileHover={{ y: -3 }} className="bg-white rounded-2xl p-5 text-center border border-slate-100 shadow-sm hover:shadow-md transition-all">
                  <div className={`size-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${b.color}`}>
                    <b.icon className="size-6" />
                  </div>
                  <h3 className="font-semibold text-brand text-sm mb-1">{b.title}</h3>
                  <p className="text-xs text-slate-400">{b.desc}</p>
                </motion.div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Get Quote Form */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-brand mb-2">Get Insurance Quote</h2>
              <p className="text-slate-500 text-sm">Fill in your car details to get quotes from top insurers</p>
            </div>
          </FadeInSection>
          <FadeInSection delay={0.1}>
            <div className="max-w-2xl mx-auto">
              <GetQuoteForm />
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Coverage Comparison Table */}
      <section className="py-12 md:py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-brand mb-2">Coverage Comparison</h2>
              <p className="text-slate-500 text-sm">Compare different insurance types side by side</p>
            </div>
          </FadeInSection>
          <FadeInSection delay={0.1}>
            <div className="max-w-3xl mx-auto overflow-x-auto">
              <Card className="rounded-2xl shadow-sm border-slate-200/60 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                      <TableHead className="font-bold text-brand text-sm">Coverage</TableHead>
                      <TableHead className="font-bold text-center text-sm">
                        <div className="flex flex-col items-center">
                          <ShieldCheck className="size-4 text-emerald-500 mb-1" />
                          Comprehensive
                        </div>
                      </TableHead>
                      <TableHead className="font-bold text-center text-sm">
                        <div className="flex flex-col items-center">
                          <Shield className="size-4 text-blue-500 mb-1" />
                          Third Party
                        </div>
                      </TableHead>
                      <TableHead className="font-bold text-center text-sm">
                        <div className="flex flex-col items-center">
                          <ShieldHalf className="size-4 text-violet-500 mb-1" />
                          Zero Dep
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coverageData.map((row, i) => (
                      <TableRow key={row.feature} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                        <TableCell className="text-sm font-medium text-slate-700">{row.feature}</TableCell>
                        <TableCell className="text-center">
                          {row.comprehensive ? (
                            <Check className="size-4 text-emerald-500 mx-auto" />
                          ) : (
                            <span className="text-slate-300 text-sm">&mdash;</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {row.thirdParty ? (
                            <Check className="size-4 text-emerald-500 mx-auto" />
                          ) : (
                            <span className="text-slate-300 text-sm">&mdash;</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {row.zeroDep ? (
                            <Check className="size-4 text-emerald-500 mx-auto" />
                          ) : (
                            <span className="text-slate-300 text-sm">&mdash;</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Claim Process Steps */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-brand mb-2">Claim Process</h2>
              <p className="text-slate-500 text-sm">Simple 4-step claim settlement process</p>
            </div>
          </FadeInSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {claimSteps.map((s, i) => (
              <FadeInSection key={s.step} delay={i * 0.1}>
                <motion.div whileHover={{ y: -3 }} className="relative text-center">
                  {/* Connector Line */}
                  {i < claimSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-emerald-200 z-0" />
                  )}
                  <div className="relative z-10 size-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <s.icon className="size-7 text-white" />
                  </div>
                  <div className="size-6 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2 -mt-2 border-2 border-white">
                    <span className="text-xs font-bold text-emerald-600">{s.step}</span>
                  </div>
                  <h3 className="font-bold text-brand text-sm mb-1">{s.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                </motion.div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-brand mb-2">Insurance FAQ</h2>
              <p className="text-slate-500 text-sm">Common questions about car insurance</p>
            </div>
          </FadeInSection>
          <FadeInSection delay={0.1}>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-3">
                {faqs.map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="border border-slate-200 rounded-xl px-4 data-[state=open]:border-emerald-300 data-[state=open]:bg-emerald-50/30 transition-colors"
                  >
                    <AccordionTrigger className="text-sm font-semibold text-brand hover:no-underline py-4">
                      <span className="text-left flex items-start gap-2">
                        <HelpCircle className="size-4 mt-0.5 text-emerald-500 flex-shrink-0" />
                        {faq.q}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-slate-500 leading-relaxed pb-4 pl-6">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Shani Finserve Badge */}
      <section className="py-8 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600">
        <div className="container mx-auto px-4 text-center">
          <FadeInSection>
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3">
              <Award className="size-6 text-yellow-400" />
              <div className="text-left">
                <p className="text-white font-bold text-sm">Insurance support powered by</p>
                <p className="text-green-200 text-xs">Shani Finserve - Your Trusted Insurance Partner</p>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>
    </div>
  )
}
