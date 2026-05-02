'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Banknote, Clock, FileCheck, Building2, IndianRupee, Percent,
  Calendar, ChevronDown, ChevronUp, Check, ArrowUpRight, Shield,
  Users, Sparkles, Send, Landmark, CreditCard, FileText, User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
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

// ─── EMI Calculator ─────────────────────────────────────────────────

function calculateEMI(principal: number, annualRate: number, tenureMonths: number) {
  if (principal <= 0 || annualRate <= 0 || tenureMonths <= 0) return { emi: 0, totalInterest: 0, totalPayment: 0 }
  const monthlyRate = annualRate / 12 / 100
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths) / (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  const totalPayment = emi * tenureMonths
  const totalInterest = totalPayment - principal
  return { emi: Math.round(emi), totalInterest: Math.round(totalInterest), totalPayment: Math.round(totalPayment) }
}

// ─── Finance Schema ─────────────────────────────────────────────────

const financeSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  city: z.string().min(1, 'City is required'),
  employmentType: z.string().min(1, 'Employment type is required'),
  monthlyIncome: z.string().min(1, 'Monthly income is required'),
  loanAmount: z.string().optional(),
})

type FinanceFormData = z.infer<typeof financeSchema>

// ─── Finance FAQ Data ───────────────────────────────────────────────

const financeFAQs = [
  {
    question: 'What is the minimum and maximum loan amount I can get?',
    answer: 'Through Shani Finserve, you can get car loans ranging from ₹1 Lakh to ₹50 Lakh depending on the car value, your income, and credit profile.',
  },
  {
    question: 'How long does the loan approval process take?',
    answer: 'With Shani Finserve, most loan applications are approved within 24-48 hours. In some cases, instant approval is available for pre-qualified customers.',
  },
  {
    question: 'What documents are required for a car loan?',
    answer: 'You typically need Aadhaar card, PAN card, 3 months bank statement, latest salary slip, and a passport-size photo. Additional documents may be required for self-employed individuals.',
  },
  {
    question: 'Can I get a loan for a used car?',
    answer: 'Yes, Shani Finserve offers financing for both new and used cars. The loan amount and interest rate may vary based on the car\'s age, model, and condition.',
  },
  {
    question: 'What is the typical interest rate for car loans?',
    answer: 'Interest rates start from 8.5% per annum and go up to 15% depending on your credit score, income, loan amount, and the car model.',
  },
  {
    question: 'Can I prepay my car loan?',
    answer: 'Yes, most lenders allow prepayment after a certain period. Some may charge a small prepayment penalty. Shani Finserve will help you find the best terms.',
  },
]

// ─── Main FinancePage Component ─────────────────────────────────────

export function FinancePage() {
  const [loanAmount, setLoanAmount] = useState(500000)
  const [interestRate, setInterestRate] = useState(10)
  const [tenure, setTenure] = useState(5)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const form = useForm<FinanceFormData>({
    resolver: zodResolver(financeSchema),
    defaultValues: { name: '', email: '', phone: '', city: '', employmentType: '', monthlyIncome: '', loanAmount: '' },
  })

  const tenureMonths = tenure * 12
  const { emi, totalInterest, totalPayment } = calculateEMI(loanAmount, interestRate, tenureMonths)
  const principalRatio = loanAmount / totalPayment * 100

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
        city: vals.city,
        employmentType: vals.employmentType,
        monthlyIncome: Number(vals.monthlyIncome.replace(/[^0-9]/g, '')),
        loanAmount: loanAmount,
        tenure: tenureMonths,
      }

      const res = await fetch('/api/leads/finance', {
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

  const employmentTypes = ['Salaried', 'Self-Employed', 'Business Owner', 'Freelancer', 'Student']
  const cities = ['Dibrugarh', 'Guwahati', 'Jorhat', 'Tinsukia', 'Nagaon', 'Tezpur', 'Silchar', 'Other']

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 py-16 md:py-24 px-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYyaDR2MmgtNHYyem0wLTE2aC0ydi00aDJ2Mmg0djJoLTR2MnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="bg-white/20 text-white border-white/30 mb-4 text-sm px-4 py-1">
                <Landmark className="size-3.5 mr-1.5" />
                Powered by Shani Finserve
              </Badge>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
                Easy Car <span className="text-sky-200">Finance</span> by Shani Finserve
              </h1>
              <p className="text-white/90 text-lg md:text-xl">
                Get the best car loan deals with lowest interest rates. Quick approval, minimal documentation.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Percent, title: 'Low Interest Rates', desc: 'Starting from 8.5% per annum with flexible repayment options', color: 'bg-blue-100 text-blue-600' },
              { icon: Clock, title: 'Quick Approval', desc: 'Get loan approval within 24-48 hours with minimal paperwork', color: 'bg-emerald-100 text-emerald-600' },
              { icon: FileCheck, title: 'Minimal Documents', desc: 'Just 5 basic documents needed to process your loan application', color: 'bg-amber-100 text-amber-600' },
              { icon: Building2, title: 'All Major Banks', desc: 'Compare and choose from 15+ leading banks and NBFCs', color: 'bg-purple-100 text-purple-600' },
            ].map((item, i) => (
              <FadeInSection key={item.title} delay={i * 0.1}>
                <Card className="p-6 rounded-2xl border-slate-200/60 hover:shadow-lg transition-all duration-300 text-center group">
                  <div className={`size-14 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <item.icon className="size-7" />
                  </div>
                  <h3 className="font-bold text-brand mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </Card>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* EMI Calculator Section */}
      <section className="py-12 md:py-16 px-4 bg-slate-50/50">
        <div className="max-w-6xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-brand mb-3">
                EMI Calculator
              </h2>
              <p className="text-slate-500 max-w-lg mx-auto">
                Calculate your monthly EMI and plan your car purchase better
              </p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calculator Sliders */}
            <FadeInSection>
              <Card className="p-6 md:p-8 rounded-2xl border-slate-200/60">
                <div className="space-y-8">
                  {/* Loan Amount */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <Label className="text-sm font-medium text-slate-700">Loan Amount</Label>
                      <span className="text-lg font-bold text-brand">
                        ₹{(loanAmount / 100000).toFixed(1)}L
                      </span>
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
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>₹1L</span>
                      <span>₹20L</span>
                    </div>
                  </div>

                  {/* Interest Rate */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <Label className="text-sm font-medium text-slate-700">Interest Rate</Label>
                      <span className="text-lg font-bold text-brand">
                        {interestRate}%
                      </span>
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
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>8%</span>
                      <span>18%</span>
                    </div>
                  </div>

                  {/* Tenure */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <Label className="text-sm font-medium text-slate-700">Tenure</Label>
                      <span className="text-lg font-bold text-brand">
                        {tenure} {tenure === 1 ? 'Year' : 'Years'}
                      </span>
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
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>1 Year</span>
                      <span>7 Years</span>
                    </div>
                  </div>
                </div>
              </Card>
            </FadeInSection>

            {/* EMI Result */}
            <FadeInSection delay={0.15}>
              <Card className="p-6 md:p-8 rounded-2xl border-slate-200/60">
                <div className="text-center mb-6">
                  <p className="text-sm text-slate-500 mb-1">Monthly EMI</p>
                  <p className="text-4xl md:text-5xl font-extrabold text-brand">
                    ₹{emi.toLocaleString('en-IN')}
                  </p>
                </div>

                {/* Visual Breakdown Bar */}
                <div className="mb-6">
                  <div className="flex h-6 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 transition-all duration-500 flex items-center justify-center"
                      style={{ width: `${principalRatio}%` }}
                    >
                      {principalRatio > 15 && (
                        <span className="text-[10px] text-white font-medium">Principal</span>
                      )}
                    </div>
                    <div
                      className="bg-amber-500 transition-all duration-500 flex items-center justify-center"
                      style={{ width: `${100 - principalRatio}%` }}
                    >
                      {100 - principalRatio > 15 && (
                        <span className="text-[10px] text-white font-medium">Interest</span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <div className="flex items-center gap-1.5">
                      <div className="size-3 rounded-full bg-blue-500" />
                      <span className="text-xs text-slate-500">Principal</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="size-3 rounded-full bg-amber-500" />
                      <span className="text-xs text-slate-500">Interest</span>
                    </div>
                  </div>
                </div>

                {/* Breakdown Cards */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <p className="text-xs text-slate-500 mb-1">Principal</p>
                    <p className="text-lg font-bold text-blue-700">
                      ₹{(loanAmount / 100000).toFixed(1)}L
                    </p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-4 text-center">
                    <p className="text-xs text-slate-500 mb-1">Interest</p>
                    <p className="text-lg font-bold text-amber-700">
                      ₹{(totalInterest / 100000).toFixed(1)}L
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <p className="text-xs text-slate-500 mb-1">Total</p>
                    <p className="text-lg font-bold text-green-700">
                      ₹{(totalPayment / 100000).toFixed(1)}L
                    </p>
                  </div>
                </div>
              </Card>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Apply Loan Form Section */}
      <section className="py-12 md:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-brand mb-3">
                Apply for Car Loan
              </h2>
              <p className="text-slate-500 max-w-lg mx-auto">
                Fill in your details and our finance partner Shani Finserve will get back to you with the best offer
              </p>
            </div>
          </FadeInSection>

          <FadeInSection delay={0.1}>
            {formSubmitted ? (
              <Card className="p-8 rounded-2xl border-slate-200/60 text-center">
                <div className="size-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="size-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-brand mb-3">Application Submitted!</h3>
                <p className="text-slate-500 mb-6">
                  Thank you for applying. Shani Finserve will contact you within 24 hours with your loan offer.
                </p>
                <Button
                  onClick={() => { setFormSubmitted(false); form.reset() }}
                  variant="outline"
                  className="rounded-xl"
                >
                  Apply Another Loan
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

                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="your@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="10-digit mobile number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="city" render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select City" /></SelectTrigger></FormControl>
                            <SelectContent>
                              {cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="employmentType" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employment Type</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Employment Type" /></SelectTrigger></FormControl>
                            <SelectContent>
                              {employmentTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="monthlyIncome" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Monthly Income (₹)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="e.g. 50000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <div className="bg-blue-50 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-900">Loan Amount</p>
                          <p className="text-xs text-blue-600/80">Based on your EMI calculator selection</p>
                        </div>
                        <span className="text-xl font-bold text-blue-700">
                          ₹{loanAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={handleFormSubmit}
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 text-base font-semibold btn-shine"
                    >
                      {loading ? (
                        <>
                          <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="size-4 mr-2" />
                          Apply for Loan
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

      {/* Required Documents Section */}
      <section className="py-12 md:py-16 px-4 bg-slate-50/50">
        <div className="max-w-6xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-brand mb-3">
                Required Documents
              </h2>
              <p className="text-slate-500 max-w-lg mx-auto">
                Keep these 5 documents ready for a smooth loan process
              </p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {[
              { icon: CreditCard, title: 'Aadhaar Card', desc: 'For identity & address verification', color: 'bg-blue-100 text-blue-600' },
              { icon: FileText, title: 'PAN Card', desc: 'For income tax verification', color: 'bg-emerald-100 text-emerald-600' },
              { icon: Landmark, title: 'Bank Statement', desc: 'Last 3 months statement', color: 'bg-amber-100 text-amber-600' },
              { icon: FileCheck, title: 'Salary Slip', desc: 'Latest 2-3 months salary slips', color: 'bg-purple-100 text-purple-600' },
              { icon: User, title: 'Photograph', desc: 'Passport size photo', color: 'bg-rose-100 text-rose-600' },
            ].map((item, i) => (
              <FadeInSection key={item.title} delay={i * 0.08}>
                <Card className="p-4 rounded-2xl border-slate-200/60 hover:shadow-lg transition-all duration-300 text-center group">
                  <div className={`size-12 ${item.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                    <item.icon className="size-6" />
                  </div>
                  <h3 className="font-semibold text-brand text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-slate-400">{item.desc}</p>
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
            <Card className="p-6 rounded-2xl bg-gradient-to-r from-brand to-brand-light text-white flex flex-col md:flex-row items-center justify-center gap-4">
              <div className="size-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Shield className="size-6" />
              </div>
              <div className="text-center md:text-left">
                <h3 className="font-bold text-lg">Powered by Shani Finserve</h3>
                <p className="text-white/70 text-sm">Your trusted partner for car finance solutions across Northeast India</p>
              </div>
              <Badge className="bg-white/20 text-white border-white/30 ml-0 md:ml-auto">
                Verified Partner
              </Badge>
            </Card>
          </FadeInSection>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-16 px-4 bg-slate-50/50">
        <div className="max-w-3xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-brand mb-3">
                Finance FAQs
              </h2>
              <p className="text-slate-500 max-w-lg mx-auto">
                Common questions about car finance answered
              </p>
            </div>
          </FadeInSection>

          <FadeInSection delay={0.1}>
            <Accordion type="single" collapsible className="space-y-3">
              {financeFAQs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="bg-white rounded-xl border border-slate-200/60 px-6 data-[state=open]:shadow-md transition-shadow"
                >
                  <AccordionTrigger className="text-left font-semibold text-brand hover:no-underline py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-500 text-sm leading-relaxed pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeInSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <FadeInSection>
            <Card className="p-8 md:p-12 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 text-white text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Ready to Drive Your Dream Car?
              </h2>
              <p className="text-white/80 mb-6 max-w-lg mx-auto">
                Don&apos;t let finances hold you back. Apply now and get instant approval with the best rates from Shani Finserve.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => useAppStore.getState().navigateTo('used-cars')}
                  className="bg-white text-blue-600 hover:bg-slate-100 rounded-xl h-12 px-8 text-base font-semibold"
                >
                  Browse Cars
                  <ArrowUpRight className="size-4 ml-2" />
                </Button>
                <Button
                  onClick={() => useAppStore.getState().navigateTo('contact')}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 rounded-xl h-12 px-8 text-base font-semibold"
                >
                  Talk to Us
                </Button>
              </div>
            </Card>
          </FadeInSection>
        </div>
      </section>
    </div>
  )
}
