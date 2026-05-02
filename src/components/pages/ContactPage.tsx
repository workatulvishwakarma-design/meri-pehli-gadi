'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle,
  MessageCircle, Instagram, Facebook, Twitter, Youtube, Navigation
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

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

// ─── Contact Page ───────────────────────────────────────────────────

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Our Office',
      detail: 'MUKUL SHAH, C/O, opposite Vishal Mega Mart, KARTIC PARA, Dibrugarh, Assam 786001',
      color: 'bg-orange-50 text-orange-600',
      borderColor: 'border-orange-200',
    },
    {
      icon: Phone,
      title: 'Call Us',
      detail: '087219 32757',
      link: 'tel:08721932757',
      color: 'bg-emerald-50 text-emerald-600',
      borderColor: 'border-emerald-200',
    },
    {
      icon: Mail,
      title: 'Email Us',
      detail: 'info@meripehligadi.com',
      link: 'mailto:info@meripehligadi.com',
      color: 'bg-blue-50 text-blue-600',
      borderColor: 'border-blue-200',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      detail: 'Monday - Saturday: 9:00 AM - 7:00 PM',
      subDetail: 'Sunday: Closed',
      color: 'bg-purple-50 text-purple-600',
      borderColor: 'border-purple-200',
    },
  ]

  const subjects = [
    'General Inquiry',
    'Buy a Car',
    'Sell My Car',
    'Car Finance',
    'Car Insurance',
    'Test Drive',
    'Complaint',
    'Partnership',
    'Other',
  ]

  const socialLinks = [
    { icon: Instagram, label: 'Instagram', href: '#', color: 'hover:text-pink-600' },
    { icon: Facebook, label: 'Facebook', href: '#', color: 'hover:text-blue-600' },
    { icon: Twitter, label: 'Twitter', href: '#', color: 'hover:text-sky-500' },
    { icon: Youtube, label: 'YouTube', href: '#', color: 'hover:text-red-600' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'CONTACT',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
        }),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      } else {
        setSubmitStatus('error')
      }
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-[#0a1628] via-[#1a2a4a] to-[#0a1628] py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-[10%] size-40 rounded-full bg-orange-500 blur-3xl" />
          <div className="absolute bottom-10 right-[10%] size-60 rounded-full bg-blue-500 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge className="bg-white/10 text-white border-0 mb-4 text-xs">
              <Phone className="size-3 mr-1" />
              We&apos;re Here to Help
            </Badge>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
              <span className="bg-gradient-to-r from-white via-blue-200 to-orange-300 bg-clip-text text-transparent">
                Contact Us
              </span>
            </h1>
            <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto">
              Have a question, need help, or want to know more about our services? 
              Reach out to us and we&apos;ll get back to you as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {contactInfo.map((info, i) => (
              <FadeInSection key={info.title} delay={i * 0.1}>
                <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                  <Card className={`p-5 rounded-2xl border ${info.borderColor} bg-white shadow-sm hover:shadow-md transition-shadow h-full`}>
                    <div className={`size-11 rounded-xl ${info.color} flex items-center justify-center mb-3`}>
                      <info.icon className="size-5" />
                    </div>
                    <h3 className="font-bold text-brand text-sm mb-1">{info.title}</h3>
                    {info.link ? (
                      <a href={info.link} className="text-slate-600 text-xs leading-relaxed hover:text-accent-blue transition-colors">
                        {info.detail}
                      </a>
                    ) : (
                      <>
                        <p className="text-slate-600 text-xs leading-relaxed">{info.detail}</p>
                        {info.subDetail && (
                          <p className="text-slate-400 text-xs mt-0.5">{info.subDetail}</p>
                        )}
                      </>
                    )}
                  </Card>
                </motion.div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form + Map */}
      <section className="py-12 md:py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Contact Form */}
            <FadeInSection>
              <Card className="p-6 md:p-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Send className="size-5 text-accent-orange" />
                  <h2 className="text-xl font-bold text-brand">Send Us a Message</h2>
                </div>

                {submitStatus === 'success' ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10"
                  >
                    <CheckCircle2 className="size-16 text-emerald-500 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-brand mb-2">Message Sent Successfully!</h3>
                    <p className="text-slate-500 text-sm mb-6">
                      Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                    </p>
                    <Button
                      onClick={() => setSubmitStatus('idle')}
                      variant="outline"
                      className="rounded-lg"
                    >
                      Send Another Message
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                          Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="name"
                          placeholder="Your full name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="rounded-lg h-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                          Email <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="rounded-lg h-10"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium text-slate-700">
                          Phone Number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Your phone number"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="rounded-lg h-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-sm font-medium text-slate-700">
                          Subject <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={formData.subject}
                          onValueChange={(v) => setFormData({ ...formData, subject: v })}
                          required
                        >
                          <SelectTrigger className="w-full h-10 rounded-lg">
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            {subjects.map((s) => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm font-medium text-slate-700">
                        Message <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us how we can help you..."
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="rounded-lg resize-none"
                      />
                    </div>

                    {submitStatus === 'error' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3"
                      >
                        <AlertCircle className="size-4 text-red-500 flex-shrink-0" />
                        <p className="text-sm text-red-700">
                          Something went wrong. Please try again or contact us via WhatsApp.
                        </p>
                      </motion.div>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-brand hover:bg-brand-light text-white font-semibold rounded-xl h-11"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="size-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </Card>
            </FadeInSection>

            {/* Map Placeholder */}
            <FadeInSection delay={0.15}>
              <div className="space-y-4">
                <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                  <div className="bg-slate-100 h-64 md:h-80 flex flex-col items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 opacity-50" />
                    <div className="relative z-10 text-center">
                      <div className="size-16 mx-auto mb-3 rounded-full bg-white shadow-lg flex items-center justify-center">
                        <Navigation className="size-8 text-brand" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-700 mb-1">Visit Us</h3>
                      <p className="text-slate-500 text-xs px-4 max-w-xs">
                        Opposite Vishal Mega Mart, Kartic Para, Dibrugarh, Assam 786001
                      </p>
                    </div>
                    {/* Decorative dots */}
                    <div className="absolute bottom-4 left-4 grid grid-cols-5 gap-1">
                      {Array.from({ length: 25 }).map((_, i) => (
                        <div key={i} className="size-1 rounded-full bg-slate-400/40" />
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Social Media Links */}
                <Card className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <h3 className="font-bold text-brand text-sm mb-3">Follow Us</h3>
                  <div className="flex gap-3">
                    {socialLinks.map((social) => (
                      <motion.a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="size-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
                        aria-label={social.label}
                      >
                        <social.icon className="size-4" />
                      </motion.a>
                    ))}
                  </div>
                </Card>

                {/* WhatsApp CTA */}
                <a
                  href="https://wa.me/918721932757?text=Hi%20MeriPehli%20Gadi%2C%20I%20need%20help%20with..."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                        <MessageCircle className="size-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-emerald-800 text-sm">Chat on WhatsApp</h3>
                        <p className="text-emerald-600 text-xs">Get instant response from our team</p>
                      </div>
                    </div>
                  </Card>
                </a>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>
    </div>
  )
}
