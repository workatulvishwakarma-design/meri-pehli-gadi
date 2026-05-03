'use client'

import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ShieldCheck,
  MapPin,
  Banknote,
  Shield,
  IndianRupee,
  Car,
  MessageCircle,
  FileText,
  Zap,
  ChevronRight,
  Lightbulb,
  CircleDot,
  Sparkles,
  ArrowRight,
  Landmark,
  ShieldPlus,
  Tag,
} from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ASSAM_CITIES, CAR_BRANDS, BUDGET_RANGES } from '@/lib/seo-data'
import { useAppStore } from '@/lib/store'

// ─────────────────────────────────────────────────────────────────────────────
// 1. QuickAnswerBox
// ─────────────────────────────────────────────────────────────────────────────

interface QuickAnswerBoxProps {
  answer: string
  className?: string
}

export function QuickAnswerBox({ answer, className }: QuickAnswerBoxProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={cn(
        'gradient-blue rounded-xl p-5 sm:p-6 relative overflow-hidden',
        className
      )}
    >
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/5" />
      <div className="absolute -right-2 -bottom-2 h-16 w-16 rounded-full bg-white/5" />
      <Badge className="mb-3 bg-white/20 text-white border-0 text-xs font-medium">
        <Zap className="mr-1 size-3" />
        Quick Answer
      </Badge>
      <p className="text-sm sm:text-base leading-relaxed text-white/95 font-medium">
        {answer}
      </p>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. FAQSchemaBlock
// ─────────────────────────────────────────────────────────────────────────────

interface FAQSchemaBlockProps {
  faqs: Array<{ question: string; answer: string }>
  className?: string
}

export function FAQSchemaBlock({ faqs, className }: FAQSchemaBlockProps) {
  if (!faqs || faqs.length === 0) return null

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className={cn('w-full', className)}
    >
      <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">
        Frequently Asked Questions
      </h2>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`faq-${index}`}
            className="border-border/60"
          >
            <AccordionTrigger className="text-sm sm:text-base font-semibold text-foreground hover:text-brand-light hover:no-underline">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </motion.section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. LocalTrustBlock
// ─────────────────────────────────────────────────────────────────────────────

const TRUST_ITEMS = [
  { label: 'Verified Listings', icon: ShieldCheck, color: 'text-accent-blue' },
  { label: 'Local Assam Support', icon: MapPin, color: 'text-accent-orange' },
  { label: 'Finance by Shani Finserve', icon: Banknote, color: 'text-accent-green' },
  { label: 'Insurance Assistance', icon: Shield, color: 'text-accent-blue' },
  { label: 'Transparent Pricing', icon: IndianRupee, color: 'text-accent-orange' },
  { label: 'Easy Test Drive', icon: Car, color: 'text-accent-green' },
  { label: 'WhatsApp Support', icon: MessageCircle, color: 'text-accent-blue' },
  { label: 'Document Assistance', icon: FileText, color: 'text-accent-orange' },
]

interface LocalTrustBlockProps {
  className?: string
}

export function LocalTrustBlock({ className }: LocalTrustBlockProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className={cn('w-full', className)}
    >
      <div className="text-center mb-6 sm:mb-8">
        <Badge variant="secondary" className="mb-3">
          <ShieldCheck className="mr-1 size-3" />
          Why Trust Us
        </Badge>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          Trusted by Assam Car Buyers
        </h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-xl mx-auto">
          Every listing is verified with local support, transparent pricing and end-to-end guidance.
        </p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {TRUST_ITEMS.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: index * 0.06 }}
          >
            <Card className="py-4 px-3 sm:p-5 text-center hover:shadow-md transition-shadow duration-200 cursor-default">
              <CardContent className="p-0 flex flex-col items-center gap-2 sm:gap-3">
                <div
                  className={cn(
                    'flex items-center justify-center size-10 sm:size-12 rounded-xl bg-secondary',
                    item.color
                  )}
                >
                  <item.icon className="size-5 sm:size-6" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-foreground leading-tight">
                  {item.label}
                </span>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. RelatedSearchesBlock
// ─────────────────────────────────────────────────────────────────────────────

interface RelatedSearchesBlockProps {
  searches: string[]
  className?: string
}

export function RelatedSearchesBlock({
  searches,
  className,
}: RelatedSearchesBlockProps) {
  if (!searches || searches.length === 0) return null

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={cn('w-full', className)}
    >
      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-3 sm:mb-4">
        Related Searches
      </h2>
      <div className="flex flex-wrap gap-2">
        {searches.map((search, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25, delay: index * 0.03 }}
          >
            <Badge
              variant="outline"
              className="cursor-pointer hover:bg-accent-blue hover:text-white hover:border-accent-blue transition-colors duration-200 text-xs sm:text-sm py-1.5 px-3"
            >
              {search}
            </Badge>
          </motion.span>
        ))}
      </div>
    </motion.section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. PopularCityLinks
// ─────────────────────────────────────────────────────────────────────────────

interface PopularCityLinksProps {
  className?: string
}

export function PopularCityLinks({ className }: PopularCityLinksProps) {
  const navigateTo = useAppStore((s) => s.navigateTo)

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className={cn('w-full', className)}
    >
      <div className="mb-4 sm:mb-6">
        <Badge variant="secondary" className="mb-3">
          <MapPin className="mr-1 size-3" />
          Explore Cities
        </Badge>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          Popular Cities in Assam
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Find verified used cars in your city
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {ASSAM_CITIES.map((city, index) => (
          <motion.button
            key={city.slug}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.03 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              navigateTo('used-cars-city', { city: city.slug })
            }
            className="flex items-center justify-between rounded-xl border border-border/60 bg-card px-3.5 py-3 sm:px-4 sm:py-3.5 text-left hover:border-accent-blue hover:shadow-md transition-all duration-200 group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-accent-blue/10 text-accent-blue shrink-0">
                <MapPin className="size-4" />
              </div>
              <span className="text-sm font-medium text-foreground truncate">
                {city.name}
              </span>
            </div>
            <ChevronRight className="size-3.5 text-muted-foreground group-hover:text-accent-blue transition-colors shrink-0" />
          </motion.button>
        ))}
      </div>
    </motion.section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. PopularBrandLinks
// ─────────────────────────────────────────────────────────────────────────────

interface PopularBrandLinksProps {
  className?: string
}

export function PopularBrandLinks({ className }: PopularBrandLinksProps) {
  const navigateTo = useAppStore((s) => s.navigateTo)

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className={cn('w-full', className)}
    >
      <div className="mb-4 sm:mb-6">
        <Badge variant="secondary" className="mb-3">
          <Car className="mr-1 size-3" />
          Browse Brands
        </Badge>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          Popular Car Brands
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Explore trusted brands with verified listings
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {CAR_BRANDS.map((brand, index) => (
          <motion.button
            key={brand.slug}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.03 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() =>
              navigateTo('used-cars-brand', { brand: brand.slug })
            }
            className={cn(
              'flex items-center justify-between rounded-xl border bg-card px-3.5 py-3 sm:px-4 sm:py-3.5 text-left transition-all duration-200 group cursor-pointer',
              brand.popular
                ? 'border-accent-blue/40 hover:border-accent-blue hover:shadow-md'
                : 'border-border/60 hover:border-muted-foreground/40 hover:shadow-sm'
            )}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={cn(
                  'flex size-8 items-center justify-center rounded-lg shrink-0',
                  brand.popular
                    ? 'bg-accent-blue/10 text-accent-blue'
                    : 'bg-secondary text-muted-foreground'
                )}
              >
                <Car className="size-4" />
              </div>
              <div className="min-w-0">
                <span className="text-sm font-medium text-foreground block truncate">
                  {brand.name}
                </span>
                {brand.popular && (
                  <span className="text-[10px] text-accent-blue font-medium">
                    Popular
                  </span>
                )}
              </div>
            </div>
            <ChevronRight className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
          </motion.button>
        ))}
      </div>
    </motion.section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. BudgetLinks
// ─────────────────────────────────────────────────────────────────────────────

interface BudgetLinksProps {
  className?: string
}

export function BudgetLinks({ className }: BudgetLinksProps) {
  const navigateTo = useAppStore((s) => s.navigateTo)

  const budgetIcons = [
    Tag,
    Tag,
    Tag,
    IndianRupee,
    IndianRupee,
    IndianRupee,
    IndianRupee,
    Sparkles,
  ]

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className={cn('w-full', className)}
    >
      <div className="mb-4 sm:mb-6">
        <Badge variant="secondary" className="mb-3">
          <IndianRupee className="mr-1 size-3" />
          By Budget
        </Badge>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          Browse by Budget
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Find the perfect car within your budget
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {BUDGET_RANGES.map((budget, index) => {
          const IconComponent = budgetIcons[index] || Tag
          return (
            <motion.button
              key={budget.slug}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() =>
                navigateTo('used-cars-budget', { budget: budget.slug })
              }
              className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-3.5 py-3 sm:px-4 sm:py-3.5 text-left hover:border-accent-orange hover:shadow-md transition-all duration-200 group cursor-pointer"
            >
              <div className="flex size-9 items-center justify-center rounded-lg bg-accent-orange/10 text-accent-orange shrink-0">
                <IconComponent className="size-4" />
              </div>
              <span className="text-sm font-semibold text-foreground">
                {budget.label}
              </span>
            </motion.button>
          )
        })}
      </div>
    </motion.section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. FinanceCTA
// ─────────────────────────────────────────────────────────────────────────────

interface FinanceCTAProps {
  className?: string
}

export function FinanceCTA({ className }: FinanceCTAProps) {
  const navigateTo = useAppStore((s) => s.navigateTo)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className={cn('gradient-blue rounded-xl p-5 sm:p-8 relative overflow-hidden', className)}
    >
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5" />
      <div className="absolute -right-4 -bottom-6 h-28 w-28 rounded-full bg-white/5" />
      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Landmark className="size-5 text-white/90" />
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Need Car Finance?
            </h3>
          </div>
          <p className="text-sm text-white/80 leading-relaxed max-w-md">
            Get used car loans with low EMI, quick approval and simple documentation. 
            Powered by Shani Finserve for Assam buyers.
          </p>
          <Badge className="mt-3 bg-white/15 text-white/90 border-0 text-xs">
            <Banknote className="mr-1 size-3" />
            Powered by Shani Finserve
          </Badge>
        </div>
        <Button
          onClick={() => navigateTo('finance')}
          size="lg"
          className="bg-white text-brand hover:bg-white/90 font-semibold shadow-lg shrink-0 w-full sm:w-auto btn-shine"
        >
          Apply Now
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. InsuranceCTA
// ─────────────────────────────────────────────────────────────────────────────

interface InsuranceCTAProps {
  className?: string
}

export function InsuranceCTA({ className }: InsuranceCTAProps) {
  const navigateTo = useAppStore((s) => s.navigateTo)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className={cn('gradient-green rounded-xl p-5 sm:p-8 relative overflow-hidden', className)}
    >
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5" />
      <div className="absolute -right-4 -bottom-6 h-28 w-28 rounded-full bg-white/5" />
      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <ShieldPlus className="size-5 text-white/90" />
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Need Used Car Insurance?
            </h3>
          </div>
          <p className="text-sm text-white/80 leading-relaxed max-w-md">
            Compare and buy comprehensive, third-party or zero depreciation insurance plans. 
            Quick renewal and claim support through Shani Finserve.
          </p>
          <Badge className="mt-3 bg-white/15 text-white/90 border-0 text-xs">
            <Shield className="mr-1 size-3" />
            Powered by Shani Finserve
          </Badge>
        </div>
        <Button
          onClick={() => navigateTo('insurance')}
          size="lg"
          className="bg-white text-emerald-700 hover:bg-white/90 font-semibold shadow-lg shrink-0 w-full sm:w-auto btn-shine"
        >
          Check Insurance
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. SellCarCTA
// ─────────────────────────────────────────────────────────────────────────────

interface SellCarCTAProps {
  className?: string
}

export function SellCarCTA({ className }: SellCarCTAProps) {
  const navigateTo = useAppStore((s) => s.navigateTo)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className={cn('gradient-orange rounded-xl p-5 sm:p-8 relative overflow-hidden', className)}
    >
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5" />
      <div className="absolute -right-4 -bottom-6 h-28 w-28 rounded-full bg-white/5" />
      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="size-5 text-white/90" />
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Want to Sell Your Car?
            </h3>
          </div>
          <p className="text-sm text-white/80 leading-relaxed max-w-md">
            Get the best price for your used car with free valuation, quick inspection 
            and hassle-free documentation in Assam.
          </p>
        </div>
        <Button
          onClick={() => navigateTo('sell-car')}
          size="lg"
          className="bg-white text-orange-600 hover:bg-white/90 font-semibold shadow-lg shrink-0 w-full sm:w-auto btn-shine"
        >
          Sell Now
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. ExpertTipsBox
// ─────────────────────────────────────────────────────────────────────────────

interface ExpertTipsBoxProps {
  title?: string
  tips: string[]
  className?: string
}

export function ExpertTipsBox({
  title = 'Expert Tips',
  tips,
  className,
}: ExpertTipsBoxProps) {
  if (!tips || tips.length === 0) return null

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className={cn('w-full', className)}
    >
      <div className="rounded-xl border border-border/60 bg-card p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex size-8 items-center justify-center rounded-lg bg-accent-orange/10">
            <Lightbulb className="size-4 text-accent-orange" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            {title}
          </h2>
        </div>
        <ul className="space-y-3">
          {tips.map((tip, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-start gap-3 text-sm sm:text-base text-muted-foreground leading-relaxed"
            >
              <CircleDot className="size-4 mt-1 text-accent-orange shrink-0" />
              <span>{tip}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 12. StepByStepGuide
// ─────────────────────────────────────────────────────────────────────────────

interface StepByStepGuideProps {
  title: string
  steps: string[]
  className?: string
}

export function StepByStepGuide({
  title,
  steps,
  className,
}: StepByStepGuideProps) {
  if (!steps || steps.length === 0) return null

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
      className={cn('w-full', className)}
    >
      <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">
        {title}
      </h2>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[18px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-accent-blue via-accent-blue/40 to-transparent hidden sm:block" />

        <div className="space-y-4 sm:space-y-0">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className="flex gap-4 sm:gap-5"
            >
              {/* Step number */}
              <div className="relative shrink-0">
                <div className="flex size-9 items-center justify-center rounded-full gradient-blue text-white text-sm font-bold shadow-md">
                  {index + 1}
                </div>
              </div>
              {/* Step content */}
              <div className="flex-1 pb-4 sm:pb-8">
                <p className="text-sm sm:text-base font-medium text-foreground leading-relaxed">
                  {step}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 13. AIReadableSummary
// ─────────────────────────────────────────────────────────────────────────────

interface AIReadableSummaryProps {
  text: string
}

export function AIReadableSummary({ text }: AIReadableSummaryProps) {
  if (!text) return null

  return (
    <div className="sr-only" aria-hidden="true" data-ai-summary>
      <h2>Summary for AI</h2>
      <p>{text}</p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 14. SchemaScript
// ─────────────────────────────────────────────────────────────────────────────

interface SchemaScriptProps {
  schema: Record<string, unknown>
}

export function SchemaScript({ schema }: SchemaScriptProps) {
  if (!schema || Object.keys(schema).length === 0) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 15. DynamicMeta
// ─────────────────────────────────────────────────────────────────────────────

interface DynamicMetaProps {
  title: string
  description: string
  keywords?: string[]
}

export function DynamicMeta({ title, description, keywords }: DynamicMetaProps) {
  useEffect(() => {
    // Update document title
    const prevTitle = document.title
    document.title = title

    // Update or create meta description
    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.name = 'description'
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute('content', description)

    // Update or create meta keywords
    if (keywords && keywords.length > 0) {
      let metaKeywords = document.querySelector('meta[name="keywords"]') as HTMLMetaElement | null
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta')
        metaKeywords.name = 'keywords'
        document.head.appendChild(metaKeywords)
      }
      metaKeywords.setAttribute('content', keywords.join(', '))
    }

    return () => {
      document.title = prevTitle
    }
  }, [title, description, keywords])

  return null
}
