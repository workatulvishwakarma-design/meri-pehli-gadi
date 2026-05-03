'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  MapPin, Phone, Mail, Clock, Send, Check, MessageSquare,
  ArrowUpRight, Globe, Building2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
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

// ─── Contact Schema ─────────────────────────────────────────────────

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

// ─── Contact Info Cards ─────────────────────────────────────────────

const contactInfo = [
  {
    icon: MapPin,
    title: 'Our Address',
    detail: 'Dibrugarh, Assam 786001, India',
    subDetail: 'Northeast India',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: Phone,
    title: 'Phone Number',
    detail: '+91 98765 43210',
    subDetail: 'Mon-Sat, 9 AM - 7 PM',
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    icon: Mail,
    title: 'Email Address',
    detail: 'hello@meripehligadi.com',
    subDetail: 'We reply within 24 hours',
    color: 'bg-amber-100 text-amber-600',
  },
  {
    icon: Clock,
    title: 'Business Hours',
    detail: 'Mon - Sat: 9:00 AM - 7:00 PM',
    subDetail: 'Sunday: Closed',
    color: 'bg-purple-100 text-purple-600',
  },
]

// ─── Main ContactPage Component ─────────────────────────────────────

export function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', phone: '', subject: '', message: '' },
  })

  const handleFormSubmit = async () => {
    const valid = await form.trigger()
    if (!valid) return

    setLoading(true)
    setError('')

    try {
      const vals = form.getValues()
      const payload = {
        name: vals.name,
        email: vals.email,
        phone: vals.phone,
        message: `[${vals.subject}] ${vals.message}`,
        type: 'CONTACT',
      }

      const res = await fetch('/api/leads', {
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
      <section className="relative bg-gradient-to-br from-slate-700 via-slate-600 to-slate-500 py-16 md:py-24 px-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYyaDR2MmgtNHYyem0wLTE2aC0ydi00aDJ2Mmg0djJoLTR2MnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="bg-white/20 text-white border-white/30 mb-4 text-sm px-4 py-1">
                <MessageSquare className="size-3.5 mr-1.5" />
                Get in Touch
              </Badge>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
                Contact <span className="text-sky-300">Us</span>
              </h1>
              <p className="text-white/90 text-lg md:text-xl">
                Have a question or need help? We&apos;re here to assist you. Reach out to us anytime.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((item, i) => (
              <FadeInSection key={item.title} delay={i * 0.1}>
                <Card className="p-6 rounded-2xl border-slate-200/60 hover:shadow-lg transition-all duration-300 group">
                  <div className={`size-12 ${item.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <item.icon className="size-6" />
                  </div>
                  <h3 className="font-bold text-brand mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 font-medium">{item.detail}</p>
                  <p className="text-xs text-slate-400 mt-1">{item.subDetail}</p>
                </Card>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form + Map Section */}
      <section className="py-12 md:py-16 px-4 bg-slate-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <FadeInSection>
              <Card className="p-6 md:p-8 rounded-2xl border-slate-200/60">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-brand mb-2">Send us a Message</h2>
                  <p className="text-sm text-slate-500">Fill out the form below and we&apos;ll get back to you within 24 hours</p>
                </div>

                {formSubmitted ? (
                  <div className="text-center py-8">
                    <div className="size-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check className="size-10 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-brand mb-3">Message Sent!</h3>
                    <p className="text-slate-500 mb-6">
                      Thank you for reaching out. Our team will get back to you within 24 hours.
                    </p>
                    <Button
                      onClick={() => { setFormSubmitted(false); form.reset() }}
                      variant="outline"
                      className="rounded-xl"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <>
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

                          <FormField control={form.control} name="subject" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subject</FormLabel>
                              <FormControl>
                                <Input placeholder="What is this about?" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                        </div>

                        <FormField control={form.control} name="message" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell us how we can help you..."
                                rows={5}
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />

                        <Button
                          type="button"
                          onClick={handleFormSubmit}
                          disabled={loading}
                          className="w-full bg-brand hover:bg-brand-light text-white rounded-xl h-12 text-base font-semibold btn-shine"
                        >
                          {loading ? (
                            <>
                              <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="size-4 mr-2" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </div>
                    </Form>
                  </>
                )}
              </Card>
            </FadeInSection>

            {/* Map Placeholder */}
            <FadeInSection delay={0.15}>
              <div className="space-y-6">
                <Card className="rounded-2xl border-slate-200/60 overflow-hidden">
                  <div className="bg-slate-200 aspect-[4/3] flex items-center justify-center relative">
                    <div className="text-center">
                      <MapPin className="size-12 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-500 font-medium">Map Placeholder</p>
                      <p className="text-xs text-slate-400 mt-1">Dibrugarh, Assam, India</p>
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <Badge className="bg-white text-slate-600 border border-slate-200 shadow-sm">
                        <Building2 className="size-3 mr-1" />
                        Dibrugarh HQ
                      </Badge>
                    </div>
                  </div>
                </Card>

                {/* Quick Contact */}
                <Card className="p-6 rounded-2xl bg-gradient-to-r from-brand to-brand-light text-white">
                  <h3 className="font-bold text-lg mb-3">Need Quick Help?</h3>
                  <p className="text-white/80 text-sm mb-4">
                    Call us directly or WhatsApp us for instant support
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a href="tel:+919876543210" className="inline-flex items-center gap-2 text-sm font-medium bg-white/20 hover:bg-white/30 rounded-xl px-4 py-2.5 transition-colors">
                      <Phone className="size-4" />
                      +91 98765 43210
                    </a>
                    <a
                      href="https://wa.me/919876543210"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium bg-green-500 hover:bg-green-600 rounded-xl px-4 py-2.5 transition-colors"
                    >
                      <MessageSquare className="size-4" />
                      WhatsApp Us
                    </a>
                  </div>
                </Card>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <FadeInSection>
            <Card className="p-8 md:p-12 rounded-2xl bg-gradient-to-r from-brand to-brand-light text-white text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Have More Questions?
              </h2>
              <p className="text-white/80 mb-6 max-w-lg mx-auto">
                Check out our frequently asked questions or browse our help center for quick answers.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => useAppStore.getState().navigateTo('faq')}
                  className="bg-white text-brand hover:bg-slate-100 rounded-xl h-12 px-8 text-base font-semibold"
                >
                  View FAQs
                  <ArrowUpRight className="size-4 ml-2" />
                </Button>
                <Button
                  onClick={() => useAppStore.getState().navigateTo('about')}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 rounded-xl h-12 px-8 text-base font-semibold"
                >
                  About Us
                </Button>
              </div>
            </Card>
          </FadeInSection>
        </div>
      </section>
    </div>
  )
}
