'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Car, Camera, Upload, ChevronRight, ChevronLeft, Check, Star,
  Shield, BadgeCheck, Clock, FileText, Users, IndianRupee,
  Sparkles, ArrowUpRight, MapPin, Phone, Mail, User,
  Gauge, Calendar, Palette, CircleDot, ImagePlus, X, PartyPopper,
  Zap, Eye, DollarSign, TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
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

// ─── Confetti Effect ─────────────────────────────────────────────────

function ConfettiEffect() {
  const colors = ['#f97316', '#22c55e', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6']
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    x: Math.random() * 100,
    y: -20 - Math.random() * 40,
    size: 6 + Math.random() * 8,
    delay: Math.random() * 1.5,
    duration: 2 + Math.random() * 2,
    rotation: Math.random() * 360,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: `${p.x}vw`, y: `${p.y}vh`, rotate: 0, opacity: 1, scale: 1 }}
          animate={{ y: '110vh', rotate: p.rotation * 2, opacity: 0, scale: 0.5 }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
          className="absolute rounded-sm"
          style={{ backgroundColor: p.color, width: p.size, height: p.size * 0.6 }}
        />
      ))}
    </div>
  )
}

// ─── Schemas ─────────────────────────────────────────────────────────

const carDetailsSchema = z.object({
  registrationNumber: z.string().min(1, 'Registration number required'),
  brand: z.string().min(1, 'Brand required'),
  model: z.string().min(1, 'Model required'),
  year: z.string().min(1, 'Year required'),
  variant: z.string().optional(),
  kmDriven: z.string().min(1, 'KM driven required'),
})

const carInfoSchema = z.object({
  fuelType: z.string().min(1, 'Fuel type required'),
  transmission: z.string().min(1, 'Transmission required'),
  ownerType: z.string().min(1, 'Owner type required'),
  color: z.string().min(1, 'Color required'),
  condition: z.string().min(1, 'Condition required'),
})

const photosPriceSchema = z.object({
  expectedPrice: z.string().min(1, 'Expected price required'),
})

const yourDetailsSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  city: z.string().min(1, 'City required'),
  address: z.string().optional(),
})

type CarDetailsData = z.infer<typeof carDetailsSchema>
type CarInfoData = z.infer<typeof carInfoSchema>
type PhotosPriceData = z.infer<typeof photosPriceSchema>
type YourDetailsData = z.infer<typeof yourDetailsSchema>

const valuationSchema = z.object({
  brand: z.string().min(1, 'Brand required'),
  model: z.string().min(1, 'Model required'),
  variant: z.string().optional(),
  year: z.string().min(1, 'Year required'),
  kmDriven: z.string().min(1, 'KM driven required'),
  fuelType: z.string().min(1, 'Fuel type required'),
  transmission: z.string().min(1, 'Transmission required'),
  city: z.string().min(1, 'City required'),
  ownerType: z.string().optional(),
  condition: z.string().optional(),
})

type ValuationData = z.infer<typeof valuationSchema>

const valuationLeadSchema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
})

type ValuationLeadData = z.infer<typeof valuationLeadSchema>

// ─── Data ────────────────────────────────────────────────────────────

const years = Array.from({ length: 25 }, (_, i) => String(2025 - i))
const fuelTypes = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid', 'LPG']
const transmissions = ['Manual', 'Automatic', 'AMT', 'CVT', 'DCT']
const ownerTypes = ['First Owner', 'Second Owner', 'Third Owner', 'Fourth+ Owner']
const colors = ['White', 'Black', 'Silver', 'Red', 'Blue', 'Grey', 'Brown', 'Green', 'Beige', 'Yellow', 'Maroon', 'Orange']
const conditions = ['Excellent', 'Good', 'Fair', 'Poor']

// ─── Sell Car Form Component ─────────────────────────────────────────

function SellCarForm() {
  const [step, setStep] = useState(1)
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([])
  const [models, setModels] = useState<{ id: string; name: string }[]>([])
  const [cities, setCities] = useState<{ id: string; name: string; slug: string }[]>([])
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/brands').then(r => r.json()).then(d => setBrands(d.brands || [])).catch(() => {})
    fetch('/api/cities').then(r => r.json()).then(d => setCities(d.cities || [])).catch(() => {})
  }, [])

  const stepDetailsForm = useForm<CarDetailsData>({
    resolver: zodResolver(carDetailsSchema),
    defaultValues: { registrationNumber: '', brand: '', model: '', year: '', variant: '', kmDriven: '' },
  })

  const stepInfoForm = useForm<CarInfoData>({
    resolver: zodResolver(carInfoSchema),
    defaultValues: { fuelType: '', transmission: '', ownerType: '', color: '', condition: '' },
  })

  const stepPhotosForm = useForm<PhotosPriceData>({
    resolver: zodResolver(photosPriceSchema),
    defaultValues: { expectedPrice: '' },
  })

  const stepContactForm = useForm<YourDetailsData>({
    resolver: zodResolver(yourDetailsSchema),
    defaultValues: { name: '', email: '', phone: '', city: '', address: '' },
  })

  const selectedBrand = stepDetailsForm.watch('brand')

  useEffect(() => {
    if (selectedBrand) {
      fetch(`/api/models?brandId=${selectedBrand}`)
        .then(r => r.json())
        .then(d => setModels(d.models || []))
        .catch(() => setModels([]))
    } else {
      setModels([])
    }
  }, [selectedBrand])

  const steps = [
    { num: 1, label: 'Car Details', icon: Car },
    { num: 2, label: 'Car Info', icon: Gauge },
    { num: 3, label: 'Photos & Price', icon: Camera },
    { num: 4, label: 'Your Details', icon: User },
  ]

  const handleNext = async () => {
    setError('')
    if (step === 1) {
      const valid = await stepDetailsForm.trigger()
      if (!valid) return
      setStep(2)
    } else if (step === 2) {
      const valid = await stepInfoForm.trigger()
      if (!valid) return
      setStep(3)
    } else if (step === 3) {
      const valid = await stepPhotosForm.trigger()
      if (!valid) return
      setStep(4)
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    const valid = await stepContactForm.trigger()
    if (!valid) return

    setLoading(true)
    setError('')

    try {
      const payload = {
        ...stepDetailsForm.getValues(),
        ...stepInfoForm.getValues(),
        expectedPrice: Number(stepPhotosForm.getValues().expectedPrice.replace(/[^0-9]/g, '')) || undefined,
        ...stepContactForm.getValues(),
      }

      const res = await fetch('/api/leads/sell-car', {
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
      <>
        <ConfettiEffect />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto text-center py-12"
        >
          <div className="size-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="size-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-brand mb-3">Your car listing has been submitted!</h2>
          <p className="text-slate-500 mb-6">
            Thank you for listing your car with MeriPehli Gadi. Our team will review your details and get back to you within 24 hours with the best offer.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => useAppStore.getState().navigateTo('home')}
              className="bg-accent-orange hover:bg-orange-600 text-white rounded-xl"
            >
              Back to Home
            </Button>
            <Button
              variant="outline"
              onClick={() => useAppStore.getState().navigateTo('car-valuation')}
              className="rounded-xl"
            >
              Check Valuation <ArrowUpRight className="size-4 ml-1" />
            </Button>
          </div>
        </motion.div>
      </>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div className={`size-10 rounded-full flex items-center justify-center transition-all ${
                  step > s.num ? 'bg-green-500 text-white' :
                  step === s.num ? 'bg-accent-orange text-white shadow-lg' :
                  'bg-slate-100 text-slate-400'
                }`}>
                  {step > s.num ? <Check className="size-5" /> : <s.icon className="size-5" />}
                </div>
                <p className={`text-[10px] md:text-xs mt-1 font-medium ${
                  step >= s.num ? 'text-brand' : 'text-slate-400'
                }`}>{s.label}</p>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mt-[-18px] rounded transition-colors ${
                  step > s.num ? 'bg-green-500' : 'bg-slate-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <Progress value={step * 25} className="h-1.5" />
      </div>

      {/* Error */}
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

      {/* Step 1: Car Details */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <Card className="p-6 rounded-2xl shadow-sm border-slate-200/60">
              <div className="flex items-center gap-3 mb-6">
                <div className="size-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Car className="size-5 text-accent-orange" />
                </div>
                <div>
                  <h3 className="font-bold text-brand text-lg">Car Details</h3>
                  <p className="text-xs text-slate-400">Enter your car registration and basic info</p>
                </div>
              </div>

              <Form {...stepDetailsForm}>
                <div className="space-y-4">
                  <FormField control={stepDetailsForm.control} name="registrationNumber" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registration Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. AS 01 AB 1234" className="uppercase" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={stepDetailsForm.control} name="brand" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand</FormLabel>
                        <Select value={field.value} onValueChange={(v) => { field.onChange(v); stepDetailsForm.setValue('model', '') }}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select Brand" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {brands.map((b) => (
                              <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={stepDetailsForm.control} name="model" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange} disabled={!selectedBrand}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select Model" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {models.map((m) => (
                              <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField control={stepDetailsForm.control} name="year" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {years.map((y) => (
                              <SelectItem key={y} value={y}>{y}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={stepDetailsForm.control} name="variant" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Variant</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. VX, ZX, LXi" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={stepDetailsForm.control} name="kmDriven" render={({ field }) => (
                      <FormItem>
                        <FormLabel>KM Driven</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g. 45000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>
              </Form>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Car Info */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <Card className="p-6 rounded-2xl shadow-sm border-slate-200/60">
              <div className="flex items-center gap-3 mb-6">
                <div className="size-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Gauge className="size-5 text-accent-blue" />
                </div>
                <div>
                  <h3 className="font-bold text-brand text-lg">Car Information</h3>
                  <p className="text-xs text-slate-400">Tell us more about your car specs</p>
                </div>
              </div>

              <Form {...stepInfoForm}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={stepInfoForm.control} name="fuelType" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fuel Type</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Fuel Type" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {fuelTypes.map((f) => (
                              <SelectItem key={f} value={f}>{f}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={stepInfoForm.control} name="transmission" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transmission</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Transmission" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {transmissions.map((t) => (
                              <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={stepInfoForm.control} name="ownerType" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Owner Type</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Owner Type" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {ownerTypes.map((o) => (
                              <SelectItem key={o} value={o}>{o}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={stepInfoForm.control} name="color" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Color" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {colors.map((c) => (
                              <SelectItem key={c} value={c}>{c}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={stepInfoForm.control} name="condition" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Condition</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {conditions.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => field.onChange(c)}
                            className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                              field.value === c
                                ? c === 'Excellent' ? 'bg-green-50 border-green-400 text-green-700' :
                                  c === 'Good' ? 'bg-blue-50 border-blue-400 text-blue-700' :
                                  c === 'Fair' ? 'bg-amber-50 border-amber-400 text-amber-700' :
                                  'bg-red-50 border-red-400 text-red-700'
                                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                            }`}
                          >
                            {c === 'Excellent' && <Star className="size-4 mx-auto mb-1 text-green-500" />}
                            {c === 'Good' && <BadgeCheck className="size-4 mx-auto mb-1 text-blue-500" />}
                            {c === 'Fair' && <CircleDot className="size-4 mx-auto mb-1 text-amber-500" />}
                            {c === 'Poor' && <Car className="size-4 mx-auto mb-1 text-red-500" />}
                            {c}
                          </button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </Form>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Photos & Price */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <Card className="p-6 rounded-2xl shadow-sm border-slate-200/60">
              <div className="flex items-center gap-3 mb-6">
                <div className="size-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Camera className="size-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-brand text-lg">Photos & Price</h3>
                  <p className="text-xs text-slate-400">Upload photos and set your expected price</p>
                </div>
              </div>

              <Form {...stepPhotosForm}>
                <div className="space-y-6">
                  {/* Photo Upload Placeholder */}
                  <div>
                    <Label className="text-sm font-medium text-slate-700 mb-2 block">Upload Photos</Label>
                    <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-accent-orange/50 transition-colors bg-slate-50/50">
                      <div className="size-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <ImagePlus className="size-7 text-accent-orange" />
                      </div>
                      <p className="text-sm font-medium text-slate-600 mb-1">Drag & drop your photos here</p>
                      <p className="text-xs text-slate-400 mb-3">Upload up to 10 photos. JPG, PNG accepted.</p>
                      <Button type="button" variant="outline" className="rounded-xl" onClick={() => {
                        setSelectedPhotos([
                          'https://placehold.co/600x400/f97316/white?text=Car+Photo+1',
                          'https://placehold.co/600x400/f97316/white?text=Car+Photo+2',
                          'https://placehold.co/600x400/f97316/white?text=Car+Photo+3',
                        ])
                      }}>
                        <Upload className="size-4 mr-2" />
                        Browse Files
                      </Button>
                    </div>

                    {/* Preview photos */}
                    <AnimatePresence>
                      {selectedPhotos.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex gap-2 mt-4 flex-wrap"
                        >
                          {selectedPhotos.map((_, i) => (
                            <div key={i} className="relative size-20 rounded-xl overflow-hidden border border-slate-200 group">
                              <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                                <Car className="size-6 text-accent-orange/60" />
                              </div>
                              <button
                                type="button"
                                onClick={() => setSelectedPhotos(prev => prev.filter((_, j) => j !== i))}
                                className="absolute top-1 right-1 size-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="size-3 text-white" />
                              </button>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <FormField control={stepPhotosForm.control} name="expectedPrice" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Price (₹)</FormLabel>
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
              </Form>
            </Card>
          </motion.div>
        )}

        {/* Step 4: Your Details */}
        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <Card className="p-6 rounded-2xl shadow-sm border-slate-200/60">
              <div className="flex items-center gap-3 mb-6">
                <div className="size-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <User className="size-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-brand text-lg">Your Details</h3>
                  <p className="text-xs text-slate-400">How should we contact you?</p>
                </div>
              </div>

              <Form {...stepContactForm}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={stepContactForm.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={stepContactForm.control} name="email" render={({ field }) => (
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
                    <FormField control={stepContactForm.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="10-digit mobile number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={stepContactForm.control} name="city" render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select City" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {cities.map((c) => (
                              <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={stepContactForm.control} name="address" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Your full address" rows={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </Form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={step === 1}
          className="rounded-xl gap-2 disabled:opacity-30"
        >
          <ChevronLeft className="size-4" />
          Back
        </Button>

        {step < 4 ? (
          <Button
            onClick={handleNext}
            className="bg-accent-orange hover:bg-orange-600 text-white rounded-xl gap-2"
          >
            Next
            <ChevronRight className="size-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white rounded-xl gap-2 min-w-[160px]"
          >
            {loading ? (
              <>
                <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <PartyPopper className="size-4" />
                Submit Listing
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}

// ─── Car Valuation Form Component ────────────────────────────────────

function CarValuationForm() {
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([])
  const [models, setModels] = useState<{ id: string; name: string }[]>([])
  const [cities, setCities] = useState<{ id: string; name: string; slug: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null)
  const [showLeadForm, setShowLeadForm] = useState(false)

  const form = useForm<ValuationData>({
    resolver: zodResolver(valuationSchema),
    defaultValues: { brand: '', model: '', variant: '', year: '', kmDriven: '', fuelType: '', transmission: '', city: '', ownerType: '', condition: '' },
  })

  const leadForm = useForm<ValuationLeadData>({
    resolver: zodResolver(valuationLeadSchema),
    defaultValues: { name: '', email: '', phone: '' },
  })

  const selectedBrand = form.watch('brand')

  useEffect(() => {
    fetch('/api/brands').then(r => r.json()).then(d => setBrands(d.brands || [])).catch(() => {})
    fetch('/api/cities').then(r => r.json()).then(d => setCities(d.cities || [])).catch(() => {})
  }, [])

  useEffect(() => {
    if (selectedBrand) {
      fetch(`/api/models?brandId=${selectedBrand}`).then(r => r.json()).then(d => setModels(d.models || [])).catch(() => setModels([]))
    } else {
      setModels([])
    }
  }, [selectedBrand])

  const handleValuation = async () => {
    const valid = await form.trigger()
    if (!valid) return

    setLoading(true)
    setError('')
    setEstimatedPrice(null)
    setShowLeadForm(false)

    try {
      const vals = form.getValues()
      const payload = {
        brand: vals.brand,
        model: vals.model,
        variant: vals.variant || undefined,
        year: Number(vals.year),
        kmDriven: Number(vals.kmDriven),
        fuelType: vals.fuelType,
        transmission: vals.transmission,
        city: vals.city,
        ownerType: vals.ownerType || undefined,
        condition: vals.condition || undefined,
        name: 'Guest User',
        phone: '0000000000',
      }

      const res = await fetch('/api/leads/valuation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.error || 'Valuation failed')
      }

      const data = await res.json()
      setEstimatedPrice(data.estimatedPrice)
      setSubmitted(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleLeadSubmit = async () => {
    const valid = await leadForm.trigger()
    if (!valid) return

    setLoading(true)
    setError('')

    try {
      const vals = form.getValues()
      const leadVals = leadForm.getValues()
      const payload = {
        ...vals,
        year: Number(vals.year),
        kmDriven: Number(vals.kmDriven),
        ...leadVals,
      }

      const res = await fetch('/api/leads/valuation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Failed')
      setShowLeadForm(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-6 md:p-8 rounded-2xl shadow-sm border-slate-200/60">
        <div className="flex items-center gap-3 mb-6">
          <div className="size-10 bg-orange-100 rounded-xl flex items-center justify-center">
            <Sparkles className="size-5 text-accent-orange" />
          </div>
          <div>
            <h3 className="font-bold text-brand text-lg">Get Your Car Valuation</h3>
            <p className="text-xs text-slate-400">Fill in details for an instant estimated value</p>
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3 mb-4">{error}</motion.div>
          )}
        </AnimatePresence>

        {/* Estimated Price Result */}
        <AnimatePresence>
          {estimatedPrice !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-6 mb-6 text-center"
            >
              <p className="text-sm text-slate-500 mb-1">Estimated Market Value</p>
              <p className="text-4xl font-extrabold text-accent-orange mb-2">
                ₹{estimatedPrice.toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-slate-400 mb-4">*This is an estimated value based on market trends. Final price may vary.</p>
              {!showLeadForm ? (
                <Button
                  onClick={() => setShowLeadForm(true)}
                  className="bg-brand hover:bg-brand-light text-white rounded-xl"
                >
                  Get Detailed Valuation Report
                </Button>
              ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 max-w-sm mx-auto">
                  <p className="text-sm font-medium text-brand">Enter your details for a detailed report</p>
                  <Form {...leadForm}>
                    <div className="space-y-3">
                      <FormField control={leadForm.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormControl><Input placeholder="Your name" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={leadForm.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormControl><Input type="email" placeholder="Email (optional)" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={leadForm.control} name="phone" render={({ field }) => (
                        <FormItem>
                          <FormControl><Input type="tel" placeholder="Phone number" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <Button type="button" onClick={handleLeadSubmit} disabled={loading} className="w-full bg-accent-orange hover:bg-orange-600 text-white rounded-xl">
                        {loading ? 'Submitting...' : 'Get Report'}
                      </Button>
                    </div>
                  </Form>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <Form {...form}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="brand" render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <Select value={field.value} onValueChange={(v) => { field.onChange(v); form.setValue('model', '') }}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select Brand" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {brands.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="model" render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange} disabled={!selectedBrand}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select Model" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {models.map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField control={form.control} name="year" render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {years.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="kmDriven" render={({ field }) => (
                <FormItem>
                  <FormLabel>KM Driven</FormLabel>
                  <FormControl><Input type="number" placeholder="e.g. 45000" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="fuelType" render={({ field }) => (
                <FormItem>
                  <FormLabel>Fuel Type</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Fuel" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {fuelTypes.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="city" render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select City" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {cities.map((c) => <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="condition" render={({ field }) => (
                <FormItem>
                  <FormLabel>Condition</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Condition" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {conditions.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <Button
              type="button"
              onClick={handleValuation}
              disabled={loading}
              className="w-full bg-accent-orange hover:bg-orange-600 text-white rounded-xl h-12 text-base font-semibold btn-shine"
            >
              {loading ? (
                <>
                  <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Calculating...
                </>
              ) : (
                <>
                  <Sparkles className="size-4 mr-2" />
                  Get Instant Valuation
                </>
              )}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  )
}

// ─── Main SellCarPage Component ──────────────────────────────────────

export function SellCarPage() {
  const { currentPage } = useAppStore()
  const isValuation = currentPage === 'car-valuation'

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {isValuation ? (
        <section className="relative bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-400 py-16 md:py-24 px-4">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYyaDR2MmgtNHYyem0wLTE2aC0ydi00aDJ2Mmg0djJoLTR2MnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Badge className="bg-white/20 text-white border-white/30 mb-4 text-sm px-4 py-1">
                  <Sparkles className="size-3.5 mr-1.5" />
                  Free Car Valuation
                </Badge>
                <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
                  Know Your Car&apos;s True <span className="text-yellow-100">Value</span>
                </h1>
                <p className="text-white/90 text-lg md:text-xl">
                  Get an instant estimated market value for your car based on real-time market data and trends.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      ) : (
        <section className="relative bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 py-16 md:py-24 px-4">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYyaDR2MmgtNHYyem0wLTE2aC0ydi00aDJ2Mmg0djJoLTR2MnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Badge className="bg-white/20 text-white border-white/30 mb-4 text-sm px-4 py-1">
                  <Car className="size-3.5 mr-1.5" />
                  Sell Your Car
                </Badge>
                <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
                  Sell Your <span className="text-yellow-100">Car</span> Today
                </h1>
                <p className="text-white/90 text-lg md:text-xl">
                  Apni car bechna ab tension-free. Get the best price from verified buyers near you.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Form Section */}
      <section className="py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {isValuation ? <CarValuationForm /> : <SellCarForm />}
        </div>
      </section>

      {/* Benefits Section */}
      {!isValuation && (
        <section className="py-12 md:py-16 px-4 bg-slate-50/50">
          <div className="max-w-6xl mx-auto">
            <FadeInSection>
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-brand mb-3">
                  Why Sell with MeriPehli Gadi?
                </h2>
                <p className="text-slate-500 max-w-lg mx-auto">
                  We make selling your car simple, fast, and profitable
                </p>
              </div>
            </FadeInSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Zap, title: 'Quick Listing', desc: 'List your car in under 5 minutes with our easy form', color: 'bg-orange-100 text-accent-orange' },
                { icon: Eye, title: 'Maximum Visibility', desc: 'Your listing reaches thousands of verified buyers', color: 'bg-blue-100 text-accent-blue' },
                { icon: DollarSign, title: 'Best Price', desc: 'Get competitive offers from genuine buyers', color: 'bg-green-100 text-accent-green' },
                { icon: Shield, title: 'Secure & Trusted', desc: 'Verified buyers and secure transaction process', color: 'bg-purple-100 text-purple-600' },
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
      )}

      {/* Valuation Benefits */}
      {isValuation && (
        <section className="py-12 md:py-16 px-4 bg-slate-50/50">
          <div className="max-w-6xl mx-auto">
            <FadeInSection>
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-brand mb-3">
                  How Our Valuation Works
                </h2>
                <p className="text-slate-500 max-w-lg mx-auto">
                  Get an accurate estimate in three simple steps
                </p>
              </div>
            </FadeInSection>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: FileText, title: 'Fill Details', desc: 'Enter your car\'s brand, model, year and other details' },
                { icon: TrendingUp, title: 'Smart Analysis', desc: 'Our algorithm analyzes market data to calculate the best estimate' },
                { icon: IndianRupee, title: 'Get Price', desc: 'Receive an instant estimated market value for your car' },
              ].map((item, i) => (
                <FadeInSection key={item.title} delay={i * 0.15}>
                  <Card className="p-6 rounded-2xl border-slate-200/60 hover:shadow-lg transition-all duration-300 text-center group relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 size-7 bg-accent-orange text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </div>
                    <div className="size-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 mt-2 group-hover:scale-110 transition-transform">
                      <item.icon className="size-7 text-accent-orange" />
                    </div>
                    <h3 className="font-bold text-brand mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                  </Card>
                </FadeInSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-12 md:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <FadeInSection>
            <Card className="p-8 md:p-12 rounded-2xl bg-gradient-to-r from-brand to-brand-light text-white text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                {isValuation ? 'Want to sell your car too?' : 'Not sure about the price?'}
              </h2>
              <p className="text-white/80 mb-6 max-w-lg mx-auto">
                {isValuation
                  ? 'After getting your valuation, list your car with us to find the best buyer quickly.'
                  : 'Get a free car valuation before listing to set the right price for your car.'}
              </p>
              <Button
                onClick={() => useAppStore.getState().navigateTo(isValuation ? 'sell-car' : 'car-valuation')}
                className="bg-accent-orange hover:bg-orange-600 text-white rounded-xl h-12 px-8 text-base font-semibold"
              >
                {isValuation ? 'List Your Car' : 'Get Free Valuation'}
                <ArrowUpRight className="size-4 ml-2" />
              </Button>
            </Card>
          </FadeInSection>
        </div>
      </section>
    </div>
  )
}
