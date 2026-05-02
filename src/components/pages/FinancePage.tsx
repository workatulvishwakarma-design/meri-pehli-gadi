'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Banknote, Zap, ShieldCheck, FileText, ArrowUpRight, Calculator,
  Check, CheckCircle2, Clock, HelpCircle, ChevronDown, ChevronUp,
  Building2, Briefcase, Users, CircleDollarSign, Phone, Mail, User,
  MapPin, CreditCard, Handshake, Award, BadgeCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
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

const financeFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  city: z.string().min(1, 'City required'),
  employmentType: z.string().min(1, 'Employment type required'),
  monthlyIncome: z.string().min(1, 'Monthly income required'),
  loanAmount: z.string().min(1, 'Loan amount required'),
  existingEMI: z.string().optional(),
})

type FinanceFormData = z.infer<typeof financeFormSchema>

// ─── Data ────────────────────────────────────────────────────────────

const employmentTypes = ['Salaried', 'Self-Employed', 'Business', 'Freelancer']
const faqs = [
  {
    q: 'What is the minimum income required for a car loan?',
    a: 'Generally, a minimum monthly income of ₹15,000 is required for salaried individuals. Self-employed individuals should have a minimum annual income of ₹2,00,000. However, this may vary based on the bank and loan amount.',
  },
  {
    q: 'How long does loan approval take?',
    a: 'With Shani Finserve, most loan applications are approved within 24 hours. Once approved, the disbursement happens within 2-3 business days after completing all documentation.',
  },
  {
    q: 'Can I get a loan for a used car older than 5 years?',
    a: 'Yes, most banks and NBFCs provide loans for cars up to 10 years old at the time of loan application. However, the loan tenure may be shorter for older cars.',
  },
  {
    q: 'What is the maximum loan amount I can get?',
    a: 'You can get up to 80-85% of the car\'s value as a loan. For salaried individuals, loan amounts up to ₹20 Lakhs are easily available. Higher amounts may require additional documentation.',
  },
  {
    q: 'What documents are required for loan application?',
    a: 'Basic documents include ID proof (Aadhaar/PAN), Address proof, Income proof (salary slips/ITR), Bank statements (6 months), and photograph. Employment-related documents may be needed.',
  },
  {
    q: 'Can I prepay my car loan?',
    a: 'Yes, most banks allow prepayment after a certain period (usually 6-12 months). Some banks may charge a small prepayment penalty, while others allow it free of charge.',
  },
]

const partnerBanks = [
  { name: 'SBI', color: 'bg-blue-900 text-white' },
  { name: 'HDFC', color: 'bg-blue-600 text-white' },
  { name: 'ICICI', color: 'bg-yellow-500 text-white' },
  { name: 'Axis', color: 'bg-red-600 text-white' },
  { name: 'Kotak', color: 'bg-red-500 text-white' },
  { name: 'BOB', color: 'bg-yellow-600 text-white' },
  { name: 'PNB', color: 'bg-orange-600 text-white' },
  { name: 'IndusInd', color: 'bg-indigo-700 text-white' },
]

// ─── EMI Calculator Component ────────────────────────────────────────

function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState(500000)
  const [interestRate, setInterestRate] = useState(9.5)
  const [tenure, setTenure] = useState(5)

  const calculateEMI = () => {
    const principal = loanAmount
    const monthlyRate = interestRate / 12 / 100
    const months = tenure * 12
    if (monthlyRate === 0) return principal / months
    const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1)
    return emi
  }

  const emi = calculateEMI()
  const totalPayment = emi * tenure * 12
  const totalInterest = totalPayment - loanAmount
  const principalPercentage = (loanAmount / totalPayment) * 100
  const interestPercentage = (totalInterest / totalPayment) * 100

  return (
    <Card className="rounded-2xl shadow-lg border-0 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#3b82f6] p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="size-10 bg-white/15 rounded-xl flex items-center justify-center">
            <Calculator className="size-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg">EMI Calculator</h3>
            <p className="text-xs text-blue-200">Calculate your monthly installment</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* EMI Display */}
        <div className="text-center mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5">
          <p className="text-sm text-slate-500 mb-1">Monthly EMI</p>
          <p className="text-4xl font-extrabold text-brand">
            ₹{Math.round(emi).toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-slate-400 mt-1">for {tenure} year{tenure > 1 ? 's' : ''}</p>
        </div>

        {/* Loan Amount Slider */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-2">
            <Label className="text-sm font-medium text-slate-600">Loan Amount</Label>
            <span className="text-sm font-bold text-brand">₹{(loanAmount / 100000).toFixed(1)} Lakh</span>
          </div>
          <input
            type="range"
            min={100000}
            max={2000000}
            step={50000}
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>₹1L</span>
            <span>₹20L</span>
          </div>
        </div>

        {/* Interest Rate Slider */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-2">
            <Label className="text-sm font-medium text-slate-600">Interest Rate</Label>
            <span className="text-sm font-bold text-brand">{interestRate}% p.a.</span>
          </div>
          <input
            type="range"
            min={8}
            max={18}
            step={0.5}
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>8%</span>
            <span>18%</span>
          </div>
        </div>

        {/* Tenure Slider */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <Label className="text-sm font-medium text-slate-600">Loan Tenure</Label>
            <span className="text-sm font-bold text-brand">{tenure} Year{tenure > 1 ? 's' : ''}</span>
          </div>
          <input
            type="range"
            min={1}
            max={7}
            step={1}
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>1 Year</span>
            <span>7 Years</span>
          </div>
        </div>

        {/* Pie Chart (CSS) */}
        <div className="flex items-center gap-6 mb-4">
          <div className="relative size-32 flex-shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="3.2" />
              <circle
                cx="18" cy="18" r="15.9" fill="none"
                stroke="#3b82f6" strokeWidth="3.2"
                strokeDasharray={`${principalPercentage} ${100 - principalPercentage}`}
                strokeLinecap="round"
              />
              <circle
                cx="18" cy="18" r="15.9" fill="none"
                stroke="#f97316" strokeWidth="3.2"
                strokeDasharray={`${interestPercentage} ${100 - interestPercentage}`}
                strokeDashoffset={`-${principalPercentage}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-[10px] text-slate-400">Total</p>
                <p className="text-xs font-bold text-brand">₹{(totalPayment / 100000).toFixed(1)}L</p>
              </div>
            </div>
          </div>
          <div className="space-y-3 flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-accent-blue" />
                <span className="text-sm text-slate-600">Principal</span>
              </div>
              <span className="text-sm font-bold text-brand">₹{(loanAmount / 100000).toFixed(1)}L</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-accent-orange" />
                <span className="text-sm text-slate-600">Interest</span>
              </div>
              <span className="text-sm font-bold text-red-500">₹{(totalInterest / 100000).toFixed(1)}L</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">Total Amount</span>
              <span className="text-sm font-bold text-brand">₹{(totalPayment / 100000).toFixed(1)}L</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

// ─── Loan Application Form Component ────────────────────────────────

function LoanApplicationForm() {
  const [cities, setCities] = useState<{ id: string; name: string; slug: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/cities').then(r => r.json()).then(d => setCities(d.cities || [])).catch(() => {})
  }, [])

  const form = useForm<FinanceFormData>({
    resolver: zodResolver(financeFormSchema),
    defaultValues: { name: '', email: '', phone: '', city: '', employmentType: '', monthlyIncome: '', loanAmount: '', existingEMI: '' },
  })

  const onSubmit = async (data: FinanceFormData) => {
    setLoading(true)
    setError('')

    try {
      const payload = {
        name: data.name,
        email: data.email || undefined,
        phone: data.phone,
        city: data.city,
        loanAmount: Number(data.loanAmount.replace(/[^0-9]/g, '')),
        tenure: 60,
        employmentType: data.employmentType,
        monthlyIncome: Number(data.monthlyIncome.replace(/[^0-9]/g, '')),
        downPayment: 0,
        existingEMI: data.existingEMI ? Number(data.existingEMI.replace(/[^0-9]/g, '')) : undefined,
      }

      const res = await fetch('/api/leads/finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.error || 'Failed to submit application')
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
        <h3 className="text-xl font-bold text-brand mb-2">Application Submitted!</h3>
        <p className="text-sm text-slate-500 mb-4">
          Our finance team from Shani Finserve will contact you within 24 hours with the best loan options.
        </p>
        <Button
          onClick={() => useAppStore.getState().navigateTo('home')}
          className="bg-accent-blue hover:bg-blue-600 text-white rounded-xl"
        >
          Back to Home
        </Button>
      </motion.div>
    )
  }

  return (
    <Card className="p-6 rounded-2xl shadow-sm border-slate-200/60">
      <div className="flex items-center gap-3 mb-6">
        <div className="size-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <Handshake className="size-5 text-accent-blue" />
        </div>
        <div>
          <h3 className="font-bold text-brand text-lg">Apply for Car Loan</h3>
          <p className="text-xs text-slate-400">Fill in your details, we&apos;ll find the best deal</p>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3 mb-4">{error}</motion.div>
        )}
      </AnimatePresence>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl><Input placeholder="Your full name" {...field} /></FormControl>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="phone" render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl><Input type="tel" placeholder="10-digit mobile number" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="city" render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Select City" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {cities.map((c) => (<SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <FormField control={form.control} name="employmentType" render={({ field }) => (
            <FormItem>
              <FormLabel>Employment Type</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select Employment Type" /></SelectTrigger></FormControl>
                <SelectContent>
                  {employmentTypes.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="monthlyIncome" render={({ field }) => (
              <FormItem>
                <FormLabel>Monthly Income (₹)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input type="number" placeholder="e.g. 50000" className="pl-10" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="loanAmount" render={({ field }) => (
              <FormItem>
                <FormLabel>Loan Amount Required (₹)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input type="number" placeholder="e.g. 500000" className="pl-10" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <FormField control={form.control} name="existingEMI" render={({ field }) => (
            <FormItem>
              <FormLabel>Existing EMI (₹) <span className="text-slate-400 font-normal">- Optional</span></FormLabel>
              <FormControl>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <Input type="number" placeholder="e.g. 5000" className="pl-10" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-accent-blue hover:bg-blue-600 text-white rounded-xl h-12 text-base font-semibold gap-2"
          >
            {loading ? (
              <>
                <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting Application...
              </>
            ) : (
              <>
                <CreditCard className="size-4" />
                Apply for Loan
              </>
            )}
          </Button>
        </form>
      </Form>

      <p className="text-[10px] text-slate-400 text-center mt-3">
        By submitting, you agree to be contacted by Shani Finserve finance team.
      </p>
    </Card>
  )
}

// ─── IndianRupee helper ──────────────────────────────────────────────

function IndianRupee({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 3h12"/><path d="M6 8h12"/><path d="M6 13l6.5 6.5"/><path d="M18 13c0 3.5-2.5 6.5-6 7h-2c-.7 0-1.4-.1-2-.3"/>
    </svg>
  )
}

// ─── Main FinancePage Export ─────────────────────────────────────────

export function FinancePage() {
  const navigateTo = useAppStore((s) => s.navigateTo)

  const benefits = [
    {
      icon: BadgeCheck,
      title: 'Low Interest Rates',
      desc: 'Starting from 8.5% p.a. Get the most competitive rates from top banks and NBFCs.',
      color: 'from-emerald-500 to-green-500',
    },
    {
      icon: Clock,
      title: 'Quick Approval',
      desc: 'Loan approval within 24 hours. Minimal documentation and fast processing.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: FileText,
      title: 'Minimal Documents',
      desc: 'Just 4-5 basic documents needed. We handle all the paperwork for you.',
      color: 'from-violet-500 to-purple-500',
    },
    {
      icon: Building2,
      title: 'All Banks & NBFCs',
      desc: 'Compare and choose from 15+ banks including SBI, HDFC, ICICI, Axis and more.',
      color: 'from-orange-500 to-amber-500',
    },
  ]

  const documents = [
    { icon: BadgeCheck, title: 'ID Proof', desc: 'Aadhaar Card, PAN Card, Voter ID, or Passport' },
    { icon: MapPin, title: 'Address Proof', desc: 'Aadhaar, Utility Bill, Rental Agreement, or Bank Passbook' },
    { icon: Briefcase, title: 'Income Proof', desc: 'Salary Slips (3 months), ITR, or Business Turnover Certificate' },
    { icon: BankIcon, title: 'Bank Statements', desc: 'Last 6 months bank statements from your salary/business account' },
    { icon: User, title: 'Photographs', desc: '2 passport-size photographs (recent)' },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1e3a5f] via-[#2d5a8e] to-[#3b82f6]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 size-60 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-20 size-40 bg-white rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10 py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Badge className="bg-white/15 text-white border-0 mb-4 text-xs">
              <Banknote className="size-3 mr-1" />
              Powered by Shani Finserve
            </Badge>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
              Easy Car Finance by Shani Finserve
            </h1>
            <p className="text-blue-100/90 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
              Get used car loan, insurance and documentation support from our trusted finance team.
              Low EMI starting ₹8,999/month with quick 24-hour approval.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-brand mb-2">Why Choose Our Finance?</h2>
              <p className="text-slate-500 text-sm">Best-in-class car loan services for your dream car</p>
            </div>
          </FadeInSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {benefits.map((b, i) => (
              <FadeInSection key={b.title} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all"
                >
                  <div className={`size-12 rounded-xl bg-gradient-to-br ${b.color} flex items-center justify-center mb-4`}>
                    <b.icon className="size-6 text-white" />
                  </div>
                  <h3 className="font-bold text-brand mb-2">{b.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{b.desc}</p>
                </motion.div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* EMI Calculator + Apply Form */}
      <section className="py-12 md:py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-brand mb-2">EMI Calculator & Apply</h2>
              <p className="text-slate-500 text-sm">Calculate your EMI and apply for a loan instantly</p>
            </div>
          </FadeInSection>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <FadeInSection delay={0.1}>
              <EMICalculator />
            </FadeInSection>
            <FadeInSection delay={0.2}>
              <LoanApplicationForm />
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Required Documents */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-brand mb-2">Required Documents</h2>
              <p className="text-slate-500 text-sm">Keep these documents ready for quick loan processing</p>
            </div>
          </FadeInSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
            {documents.map((doc, i) => (
              <FadeInSection key={doc.title} delay={i * 0.06}>
                <motion.div whileHover={{ y: -2 }} className="bg-slate-50 rounded-2xl p-4 text-center hover:bg-blue-50 transition-colors border border-slate-100">
                  <div className="size-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <doc.icon className="size-5 text-accent-blue" />
                  </div>
                  <h3 className="font-semibold text-brand text-sm mb-1">{doc.title}</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{doc.desc}</p>
                </motion.div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Banks */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-brand mb-2">Our Partner Banks</h2>
              <p className="text-slate-500 text-sm">We work with top banks and NBFCs for best loan offers</p>
            </div>
          </FadeInSection>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 max-w-4xl mx-auto">
            {partnerBanks.map((bank, i) => (
              <FadeInSection key={bank.name} delay={i * 0.05}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`${bank.color} rounded-xl p-4 text-center font-bold text-sm shadow-sm hover:shadow-md transition-shadow`}
                >
                  {bank.name}
                </motion.div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-brand mb-2">Frequently Asked Questions</h2>
              <p className="text-slate-500 text-sm">Common queries about car finance answered</p>
            </div>
          </FadeInSection>
          <FadeInSection delay={0.1}>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-3">
                {faqs.map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="border border-slate-200 rounded-xl px-4 data-[state=open]:border-accent-blue/30 data-[state=open]:bg-blue-50/30 transition-colors"
                  >
                    <AccordionTrigger className="text-sm font-semibold text-brand hover:no-underline py-4">
                      <span className="text-left flex items-start gap-2">
                        <HelpCircle className="size-4 mt-0.5 text-accent-blue flex-shrink-0" />
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
      <section className="py-8 bg-gradient-to-r from-[#1e3a5f] to-[#3b82f6]">
        <div className="container mx-auto px-4 text-center">
          <FadeInSection>
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3">
              <Award className="size-6 text-yellow-400" />
              <div className="text-left">
                <p className="text-white font-bold text-sm">Finance support by</p>
                <p className="text-blue-200 text-xs">Shani Finserve - Trusted Financial Partner</p>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>
    </div>
  )
}

// ─── Bank Icon helper ────────────────────────────────────────────────

function BankIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 21h18"/><path d="M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7"/><path d="M21 7H3l9-4 9 4Z"/><path d="M12 7v14"/>
    </svg>
  )
}
