'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Search, HelpCircle, MessageCircle, Car, Banknote,
  Shield, ShoppingCart, Info, ArrowUpRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion'
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

// ─── Types ──────────────────────────────────────────────────────────

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  order: number
  isActive: boolean
}

// ─── FAQ Page ───────────────────────────────────────────────────────

export function FAQPage() {
  const navigateTo = useAppStore((s) => s.navigateTo)
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = [
    { value: 'All', label: 'All', icon: Info },
    { value: 'Buying', label: 'Buying', icon: ShoppingCart },
    { value: 'Selling', label: 'Selling', icon: Car },
    { value: 'Finance', label: 'Finance', icon: Banknote },
    { value: 'Insurance', label: 'Insurance', icon: Shield },
    { value: 'General', label: 'General', icon: HelpCircle },
  ]

  useEffect(() => {
    fetch('/api/faqs')
      .then((r) => r.json())
      .then((d) => {
        setFaqs(d.faqs || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory = activeCategory === 'All' || faq.category === activeCategory
      const matchesSearch =
        searchQuery === '' ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [faqs, searchQuery, activeCategory])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand via-brand-light to-blue-800 py-16 md:py-24 px-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYyaDR2MmgtNHYyem0wLTE2aC0ydi00aDJ2Mmg0djJoLTR2MnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="bg-white/20 text-white border-white/30 mb-4 text-sm px-4 py-1">
                <HelpCircle className="size-3.5 mr-1.5" />
                Help Center
              </Badge>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
                Frequently Asked <span className="text-sky-300">Questions</span>
              </h1>
              <p className="text-white/90 text-lg md:text-xl mb-8">
                Find answers to common questions about buying, selling, financing, and insuring cars.
              </p>

              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="max-w-xl mx-auto"
              >
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white/50" />
                  <Input
                    placeholder="Search FAQs... (e.g., how to buy a car)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:border-white/50"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category Tabs + FAQs */}
      <section className="py-12 md:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Category Tabs */}
          <FadeInSection>
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {categories.map((cat) => (
                <motion.button
                  key={cat.value}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat.value
                      ? 'bg-brand text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <cat.icon className="size-3.5" />
                  {cat.label}
                </motion.button>
              ))}
            </div>
          </FadeInSection>

          {/* FAQ Count */}
          <FadeInSection delay={0.05}>
            <p className="text-slate-500 text-sm mb-4">
              Showing {filteredFaqs.length} {filteredFaqs.length === 1 ? 'question' : 'questions'}
              {activeCategory !== 'All' && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {activeCategory}
                </Badge>
              )}
            </p>
          </FadeInSection>

          {/* FAQ Accordion */}
          <FadeInSection delay={0.1}>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Card key={i} className="rounded-xl p-4">
                    <div className="h-5 bg-slate-200 rounded animate-pulse w-3/4 mb-2" />
                    <div className="h-4 bg-slate-100 rounded animate-pulse w-1/2" />
                  </Card>
                ))}
              </div>
            ) : filteredFaqs.length === 0 ? (
              <div className="text-center py-12">
                <HelpCircle className="size-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 mb-2">No questions found</h3>
                <p className="text-slate-400 text-sm mb-4">
                  {searchQuery
                    ? `No results for "${searchQuery}". Try a different search.`
                    : `No FAQs available in the "${activeCategory}" category yet.`}
                </p>
                {searchQuery && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchQuery('')}
                    className="rounded-lg"
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            ) : (
              <Accordion type="single" collapsible className="space-y-3">
                {filteredFaqs.map((faq) => (
                  <AccordionItem
                    key={faq.id}
                    value={faq.id}
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
            )}
          </FadeInSection>
        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section className="py-12 md:py-16 px-4 bg-slate-50/50">
        <div className="max-w-2xl mx-auto">
          <FadeInSection>
            <Card className="p-6 md:p-8 rounded-2xl border-slate-200/60 text-center">
              <div className="size-14 mx-auto mb-4 rounded-full bg-orange-50 flex items-center justify-center">
                <MessageCircle className="size-7 text-accent-orange" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-brand mb-2">
                Still Have Questions?
              </h2>
              <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
                Can&apos;t find what you&apos;re looking for? Our team is ready to help you with any questions about buying, selling, or financing your car.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button
                  onClick={() => navigateTo('contact')}
                  className="bg-brand hover:bg-brand-light text-white font-semibold rounded-xl px-6 h-11"
                >
                  <MessageCircle className="size-4 mr-2" />
                  Contact Us
                </Button>
                <a
                  href="https://wa.me/918721932757?text=Hi%20MeriPehli%20Gadi%2C%20I%20have%20a%20question..."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-6 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors h-11"
                >
                  <svg viewBox="0 0 24 24" className="size-4 fill-current">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp Us
                </a>
              </div>
            </Card>
          </FadeInSection>
        </div>
      </section>
    </div>
  )
}
