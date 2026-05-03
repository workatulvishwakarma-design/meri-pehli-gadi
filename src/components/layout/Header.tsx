'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Search,
  MapPin,
  Heart,
  LogIn,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Car,
  DollarSign,
  Shield,
  BookOpen,
  Phone,
  User,
  Zap,
  TrendingUp,
  CalendarClock,
  ArrowRight,
  HandCoins,
  ShieldCheck,
  Crown,
  Banknote,
  Sparkles,
  Tag,
  FileText,
  Calculator,
  ClipboardCheck,
  Percent,
  HelpCircle,
  Award,
  Upload,
  Eye,
  FileCheck,
  CircleDollarSign,
  RefreshCw,
  AlertTriangle,
  Umbrella,
  LifeBuoy,
  BadgeCheck,
  Building2,
  Fuel,
  Gauge,
  Layers,
  Star,
  ArrowLeftRight,
  CheckCircle2,
  Bike,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useAppStore, type PageName } from '@/lib/store'
import { cn } from '@/lib/utils'

/* ═══════════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════════ */

interface MegaHeading {
  label: string
  page: PageName
  params?: Record<string, string>
  icon: LucideIcon
}

interface MegaQuickLink {
  label: string
  page: PageName
  params?: Record<string, string>
  icon: LucideIcon
  isCta?: boolean
  ctaLabel?: string
}

interface MegaMenuData {
  headings: MegaHeading[]
  quickLinks: MegaQuickLink[]
  poweredBy?: boolean
}

interface SimpleDropdownItem {
  label: string
  page: PageName
  params?: Record<string, string>
  icon: LucideIcon
}

interface NavItemConfig {
  label: string
  page: PageName
  type: 'mega' | 'dropdown' | 'link'
  megaMenu?: MegaMenuData
  dropdownItems?: SimpleDropdownItem[]
}

/* ═══════════════════════════════════════════════════════════════
   Mega Menu Data — Buy Used Car
   ═══════════════════════════════════════════════════════════════ */

const buyUsedCarMega: MegaMenuData = {
  headings: [
    { label: 'Buy Used Cars in Assam', page: 'used-cars', params: { city: 'assam' }, icon: MapPin },
    { label: 'Used Cars in Your City', page: 'used-cars', icon: Building2 },
    { label: 'Browse by Brand', page: 'used-cars', icon: Layers },
    { label: 'Browse by Budget', page: 'used-cars', icon: Banknote },
    { label: 'Browse by Body Type', page: 'used-cars', icon: Car },
    { label: 'Browse by Fuel Type', page: 'used-cars', icon: Fuel },
    { label: 'Certified Cars', page: 'certified-cars', icon: ShieldCheck },
    { label: 'Low Mileage Cars', page: 'used-cars', icon: Gauge },
    { label: 'Luxury Cars', page: 'luxury-cars', icon: Crown },
  ],
  quickLinks: [
    { label: 'Used Cars in Guwahati', page: 'used-cars-city', params: { city: 'guwahati' }, icon: MapPin },
    { label: 'Used Cars in Dibrugarh', page: 'used-cars-city', params: { city: 'dibrugarh' }, icon: MapPin },
    { label: 'Used Cars in Tinsukia', page: 'used-cars-city', params: { city: 'tinsukia' }, icon: MapPin },
    { label: 'Used Maruti Cars', page: 'used-cars-brand', params: { brand: 'maruti-suzuki' }, icon: Car },
    { label: 'Used Hyundai Cars', page: 'used-cars-brand', params: { brand: 'hyundai' }, icon: Car },
    { label: 'Used Tata Cars', page: 'used-cars-brand', params: { brand: 'tata' }, icon: Car },
    { label: 'Used Cars Under \u20B95 Lakh', page: 'used-cars-budget', params: { budget: '5' }, icon: Banknote },
    { label: 'Used Automatic Cars in Assam', page: 'used-cars', params: { city: 'assam', transmission: 'automatic' }, icon: ArrowLeftRight },
  ],
}

/* ═══════════════════════════════════════════════════════════════
   Mega Menu Data — Car Finance
   ═══════════════════════════════════════════════════════════════ */

const carFinanceMega: MegaMenuData = {
  poweredBy: true,
  headings: [
    { label: 'Used Car Loan', page: 'finance', params: { section: 'used-car-loan' }, icon: CircleDollarSign },
    { label: 'Loan Against Car', page: 'finance', params: { section: 'loan-against-car' }, icon: Car },
    { label: 'EMI Calculator', page: 'finance', params: { section: 'emi-calculator' }, icon: Calculator },
    { label: 'Documents & Eligibility', page: 'finance', params: { section: 'documents' }, icon: FileText },
    { label: 'Interest Rates', page: 'finance', params: { section: 'interest-rates' }, icon: Percent },
    { label: 'Application Process', page: 'finance', params: { section: 'application-process' }, icon: ClipboardCheck },
    { label: 'Why Shani Finserve?', page: 'about', icon: Award },
    { label: 'Check Loan Eligibility', page: 'finance', params: { section: 'check-eligibility' }, icon: CheckCircle2 },
  ],
  quickLinks: [
    { label: 'Used Car Loan in Assam', page: 'finance', params: { city: 'assam' }, icon: MapPin },
    { label: 'Used Car Loan in Guwahati', page: 'finance', params: { city: 'guwahati' }, icon: MapPin },
    { label: 'Used Car Loan in Dibrugarh', page: 'finance', params: { city: 'dibrugarh' }, icon: MapPin },
    { label: 'Low EMI Used Car Loan', page: 'finance', params: { section: 'low-emi' }, icon: Banknote },
    { label: 'Car Loan for First-Time Buyers', page: 'finance', params: { section: 'first-time' }, icon: User },
    {
      label: 'Apply Now',
      page: 'finance',
      params: { section: 'apply' },
      icon: ArrowRight,
      isCta: true,
      ctaLabel: 'Quick Apply',
    },
  ],
}

/* ═══════════════════════════════════════════════════════════════
   Mega Menu Data — Sell Car
   ═══════════════════════════════════════════════════════════════ */

const sellCarMega: MegaMenuData = {
  headings: [
    { label: 'Sell My Car', page: 'sell-car', icon: HandCoins },
    { label: 'Used Car Valuation', page: 'car-valuation', icon: Tag },
    { label: 'Upload Car Details', page: 'sell-car', params: { step: 'upload' }, icon: Upload },
    { label: 'Schedule Inspection', page: 'sell-car', params: { step: 'inspection' }, icon: Eye },
    { label: 'Get Best Price', page: 'sell-car', params: { step: 'pricing' }, icon: Sparkles },
    { label: 'Documents Required', page: 'sell-car', params: { step: 'documents' }, icon: FileCheck },
  ],
  quickLinks: [
    { label: 'Sell Car in Guwahati', page: 'sell-car', params: { city: 'guwahati' }, icon: MapPin },
    { label: 'Sell Car in Dibrugarh', page: 'sell-car', params: { city: 'dibrugarh' }, icon: MapPin },
    {
      label: 'List Your Car Free',
      page: 'sell-car',
      icon: ArrowRight,
      isCta: true,
      ctaLabel: 'Start Selling',
    },
  ],
}

/* ═══════════════════════════════════════════════════════════════
   Mega Menu Data — Insurance
   ═══════════════════════════════════════════════════════════════ */

const insuranceMega: MegaMenuData = {
  headings: [
    { label: 'Used Car Insurance', page: 'insurance', params: { section: 'used-car' }, icon: Shield },
    { label: 'Insurance Renewal', page: 'insurance', params: { section: 'renewal' }, icon: RefreshCw },
    { label: 'Third Party Insurance', page: 'insurance', params: { section: 'third-party' }, icon: AlertTriangle },
    { label: 'Comprehensive Insurance', page: 'insurance', params: { section: 'comprehensive' }, icon: Umbrella },
    { label: 'Claim Assistance', page: 'insurance', params: { section: 'claim' }, icon: LifeBuoy },
    { label: 'Check Insurance Price', page: 'insurance', params: { section: 'price' }, icon: Calculator },
    { label: 'Insurance by Shani Finserve', page: 'insurance', params: { section: 'shani-finserve' }, icon: BadgeCheck },
  ],
  quickLinks: [
    {
      label: 'Get Insurance Quote',
      page: 'insurance',
      icon: ArrowRight,
      isCta: true,
      ctaLabel: 'Get Quote',
    },
  ],
}

/* ═══════════════════════════════════════════════════════════════
   Simple Dropdown — Blog
   ═══════════════════════════════════════════════════════════════ */

const blogDropdownItems: SimpleDropdownItem[] = [
  { label: 'All Articles', page: 'blog', icon: BookOpen },
  { label: 'Car Buying Tips', page: 'blog', params: { category: 'buying-tips' }, icon: Star },
  { label: 'Car Maintenance', page: 'blog', params: { category: 'maintenance' }, icon: Wrench },
  { label: 'Finance & Insurance', page: 'blog', params: { category: 'finance-insurance' }, icon: DollarSign },
  { label: 'Industry News', page: 'blog', params: { category: 'news' }, icon: TrendingUp },
  { label: 'Car Reviews', page: 'blog', params: { category: 'reviews' }, icon: Gauge },
]

/* ═══════════════════════════════════════════════════════════════
   Navigation Items
   ═══════════════════════════════════════════════════════════════ */

const navItems: NavItemConfig[] = [
  { label: 'Buy Used Car', page: 'used-cars', type: 'mega', megaMenu: buyUsedCarMega },
  { label: 'Car Finance', page: 'finance', type: 'mega', megaMenu: carFinanceMega },
  { label: 'Sell Car', page: 'sell-car', type: 'mega', megaMenu: sellCarMega },
  { label: 'Insurance', page: 'insurance', type: 'mega', megaMenu: insuranceMega },
  { label: 'Blog', page: 'blog', type: 'dropdown', dropdownItems: blogDropdownItems },
]

/* ═══════════════════════════════════════════════════════════════
   Framer Motion Variants
   ═══════════════════════════════════════════════════════════════ */

const megaMenuVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: 8,
    scale: 0.97,
    transition: { duration: 0.15, ease: 'easeIn' },
  },
}

const dropdownVariants = {
  hidden: { opacity: 0, y: 6, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: 6,
    scale: 0.97,
    transition: { duration: 0.12, ease: 'easeIn' },
  },
}

/* ═══════════════════════════════════════════════════════════════
   Mega Menu Component (Desktop)
   ═══════════════════════════════════════════════════════════════ */

function MegaMenuPanel({
  data,
  onClose,
}: {
  data: MegaMenuData
  onClose: () => void
}) {
  const navigateTo = useAppStore((s) => s.navigateTo)

  return (
    <div className="w-[700px] flex rounded-2xl border border-border/60 overflow-hidden shadow-2xl shadow-black/10">
      {/* ── Left column: Dark navy headings ── */}
      <div className="w-[300px] bg-slate-900 text-white p-1 flex flex-col">
        {data.headings.map((heading) => {
          const Icon = heading.icon
          return (
            <button
              key={heading.label}
              onClick={() => {
                onClose()
                navigateTo(heading.page, heading.params)
              }}
              className="flex items-center gap-3 px-4 py-2.5 text-left text-[13px] font-medium text-slate-200 hover:bg-white/10 hover:text-white rounded-lg mx-1 my-0.5 transition-all duration-150 group cursor-pointer"
            >
              <Icon className="size-4 text-slate-400 group-hover:text-accent-orange shrink-0 transition-colors" />
              <span className="truncate">{heading.label}</span>
              <ChevronRight className="size-3 text-slate-500 group-hover:text-slate-300 ml-auto opacity-0 group-hover:opacity-100 transition-all shrink-0" />
            </button>
          )
        })}

        {/* Powered by badge */}
        {data.poweredBy && (
          <div className="mt-auto px-4 py-3 mx-1 mb-1">
            <div className="flex items-center gap-2 bg-accent-orange/15 border border-accent-orange/20 rounded-lg px-3 py-2">
              <Award className="size-4 text-accent-orange" />
              <div>
                <div className="text-[11px] font-semibold text-accent-orange leading-tight">
                  Powered by Shani Finserve
                </div>
                <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
                  Trusted NBFC in Assam
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Right column: Quick link cards ── */}
      <div className="flex-1 bg-background p-4 flex flex-col">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-1">
          Popular Searches
        </div>
        <div className="flex-1 grid grid-cols-1 gap-1.5">
          {data.quickLinks.map((link) => {
            const Icon = link.icon
            if (link.isCta) {
              return (
                <button
                  key={link.label}
                  onClick={() => {
                    onClose()
                    navigateTo(link.page, link.params)
                  }}
                  className="mt-2 flex items-center gap-2.5 bg-gradient-to-r from-accent-orange to-orange-600 text-white rounded-xl px-4 py-3 text-sm font-semibold shadow-lg shadow-accent-orange/20 hover:shadow-accent-orange/35 transition-all duration-200 hover:scale-[1.01] cursor-pointer group"
                >
                  <div className="flex size-8 items-center justify-center rounded-lg bg-white/20 shrink-0">
                    <Icon className="size-4" />
                  </div>
                  <span className="flex-1">{link.label}</span>
                  {link.ctaLabel && (
                    <Badge className="bg-white/20 text-white border-0 text-[10px] px-2 py-0.5">
                      {link.ctaLabel}
                    </Badge>
                  )}
                  <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              )
            }
            return (
              <button
                key={link.label}
                onClick={() => {
                  onClose()
                  navigateTo(link.page, link.params)
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-[13px] font-medium text-foreground hover:bg-accent/60 hover:text-foreground transition-all duration-150 group cursor-pointer"
              >
                <div className="flex size-7 items-center justify-center rounded-md bg-accent/80 group-hover:bg-accent-orange/10 transition-colors shrink-0">
                  <Icon className="size-3.5 text-muted-foreground group-hover:text-accent-orange transition-colors" />
                </div>
                <span>{link.label}</span>
                <ChevronRight className="size-3 text-muted-foreground/50 ml-auto group-hover:text-muted-foreground opacity-0 group-hover:opacity-100 transition-all shrink-0" />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   Simple Dropdown Component (Desktop) — Blog etc.
   ═══════════════════════════════════════════════════════════════ */

function SimpleDropdownPanel({
  items,
  onClose,
}: {
  items: SimpleDropdownItem[]
  onClose: () => void
}) {
  const navigateTo = useAppStore((s) => s.navigateTo)

  return (
    <div className="w-[220px] rounded-xl border border-border/60 bg-background shadow-xl shadow-black/8 p-2">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <button
            key={item.label}
            onClick={() => {
              onClose()
              navigateTo(item.page, item.params)
            }}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-left text-[13px] font-medium text-foreground hover:bg-accent/60 transition-colors group cursor-pointer"
          >
            <Icon className="size-4 text-muted-foreground group-hover:text-accent-orange transition-colors shrink-0" />
            <span>{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   Nav Item Wrapper (Desktop) — handles hover state
   ═══════════════════════════════════════════════════════════════ */

function DesktopNavItem({ item }: { item: NavItemConfig }) {
  const [open, setOpen] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const navigateTo = useAppStore((s) => s.navigateTo)

  const enter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpen(true)
  }
  const leave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 200)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const handleClose = () => setOpen(false)

  return (
    <div className="relative" onMouseEnter={enter} onMouseLeave={leave}>
      <button
        onClick={() => {
          if (item.type === 'link') {
            navigateTo(item.page)
          }
        }}
        className={cn(
          'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer',
          'text-slate-700 hover:text-foreground hover:bg-accent/50',
          open && 'text-foreground bg-accent/60',
        )}
      >
        {item.label}
        {(item.type === 'mega' || item.type === 'dropdown') && (
          <ChevronDown
            className={cn(
              'size-3.5 text-muted-foreground transition-transform duration-200',
              open && 'rotate-180',
            )}
          />
        )}
      </button>

      <AnimatePresence>
        {open && item.type === 'mega' && item.megaMenu && (
          <motion.div
            variants={megaMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onMouseEnter={enter}
            onMouseLeave={leave}
            className="absolute top-full left-1/2 -translate-x-1/2 z-50 pt-3"
          >
            <MegaMenuPanel data={item.megaMenu} onClose={handleClose} />
          </motion.div>
        )}
        {open && item.type === 'dropdown' && item.dropdownItems && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onMouseEnter={enter}
            onMouseLeave={leave}
            className="absolute top-full left-1/2 -translate-x-1/2 z-50 pt-3"
          >
            <SimpleDropdownPanel items={item.dropdownItems} onClose={handleClose} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   Mobile Menu — Accordion Sections
   ═══════════════════════════════════════════════════════════════ */

function MobileMegaSection({
  item,
}: {
  item: NavItemConfig
}) {
  const navigateTo = useAppStore((s) => s.navigateTo)
  const setShowMobileMenu = useAppStore((s) => s.setShowMobileMenu)

  const handleNavigate = (page: PageName, params?: Record<string, string>) => {
    setShowMobileMenu(false)
    navigateTo(page, params)
  }

  return (
    <AccordionItem value={item.label} className="border-b border-border/40 px-0">
      <AccordionTrigger className="px-5 py-3.5 text-sm font-semibold text-slate-800 hover:no-underline">
        {item.label}
      </AccordionTrigger>
      <AccordionContent className="pb-0">
        {/* Headings */}
        {item.type === 'mega' && item.megaMenu && (
          <div className="px-5 pb-3 space-y-0.5">
            {item.megaMenu.headings.map((heading) => {
              const Icon = heading.icon
              return (
                <button
                  key={heading.label}
                  onClick={() => handleNavigate(heading.page, heading.params)}
                  className="flex items-center gap-2.5 w-full py-2 text-left text-[13px] text-slate-600 hover:text-foreground transition-colors cursor-pointer"
                >
                  <Icon className="size-3.5 text-muted-foreground" />
                  <span>{heading.label}</span>
                </button>
              )
            })}
          </div>
        )}

        {/* Quick links / dropdown items */}
        {item.type === 'mega' && item.megaMenu && item.megaMenu.quickLinks.length > 0 && (
          <div className="px-5 pb-3">
            <div className="h-px bg-border/60 mb-2" />
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Popular
            </div>
            <div className="space-y-0.5">
              {item.megaMenu.quickLinks.map((link) => {
                const Icon = link.icon
                return (
                  <button
                    key={link.label}
                    onClick={() => handleNavigate(link.page, link.params)}
                    className={cn(
                      'flex items-center gap-2.5 w-full py-2 text-left text-[13px] transition-colors cursor-pointer',
                      link.isCta
                        ? 'font-semibold text-accent-orange'
                        : 'text-slate-600 hover:text-foreground',
                    )}
                  >
                    <Icon className="size-3.5 text-muted-foreground" />
                    <span>{link.label}</span>
                    {link.ctaLabel && (
                      <Badge variant="secondary" className="ml-auto text-[9px] px-1.5 py-0">
                        {link.ctaLabel}
                      </Badge>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Powered by badge */}
        {item.type === 'mega' && item.megaMenu?.poweredBy && (
          <div className="px-5 pb-3">
            <div className="flex items-center gap-2 bg-accent-orange/10 border border-accent-orange/15 rounded-lg px-3 py-2">
              <Award className="size-3.5 text-accent-orange" />
              <div>
                <div className="text-[10px] font-semibold text-accent-orange leading-tight">
                  Powered by Shani Finserve
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Simple dropdown items */}
        {item.type === 'dropdown' && item.dropdownItems && (
          <div className="px-5 pb-3 space-y-0.5">
            {item.dropdownItems.map((d) => {
              const Icon = d.icon
              return (
                <button
                  key={d.label}
                  onClick={() => handleNavigate(d.page, d.params)}
                  className="flex items-center gap-2.5 w-full py-2 text-left text-[13px] text-slate-600 hover:text-foreground transition-colors cursor-pointer"
                >
                  <Icon className="size-3.5 text-muted-foreground" />
                  <span>{d.label}</span>
                </button>
              )
            })}
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  )
}

/* ═══════════════════════════════════════════════════════════════
   Main Header Component
   ═══════════════════════════════════════════════════════════════ */

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [mobileSearch, setMobileSearch] = useState('')

  const navigateTo = useAppStore((s) => s.navigateTo)
  const selectedCity = useAppStore((s) => s.selectedCity)
  const setShowCityModal = useAppStore((s) => s.setShowCityModal)
  const setShowAuthModal = useAppStore((s) => s.setShowAuthModal)
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)
  const user = useAppStore((s) => s.user)
  const showMobileMenu = useAppStore((s) => s.showMobileMenu)
  const setShowMobileMenu = useAppStore((s) => s.setShowMobileMenu)
  const setSearchQueryStore = useAppStore((s) => s.setSearchQuery)

  /* scroll listener */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* search handler */
  const handleSearch = useCallback(
    (query: string) => {
      const q = query.trim()
      if (!q) return
      setSearchQueryStore(q)
      navigateTo('used-cars', { search: q })
    },
    [navigateTo, setSearchQueryStore],
  )

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled ? 'glass-header shadow-sm' : 'bg-background/95',
      )}
    >
      {/* Accent bar */}
      <div className="h-0.5 w-full bg-gradient-to-r from-accent-blue via-accent-orange to-accent-blue" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-4 md:h-[70px]">
          {/* ── Mobile hamburger ── */}
          <button
            className="lg:hidden flex size-10 items-center justify-center rounded-md hover:bg-accent/60 transition-colors"
            onClick={() => setShowMobileMenu(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5 text-foreground" />
          </button>

          {/* ── Logo ── */}
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2 shrink-0"
          >
            <Image
              src="/logo.png"
              alt="MeriPehli Gadi"
              width={140}
              height={40}
              className="h-8 w-auto object-contain md:h-10"
              priority
            />
          </button>

          {/* ── Desktop Navigation ── */}
          <nav className="hidden lg:flex items-center gap-0.5 ml-3">
            {navItems.map((item) => (
              <DesktopNavItem key={item.label} item={item} />
            ))}
          </nav>

          {/* ── Desktop Search Bar ── */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSearch(searchQuery)
                }}
              >
                <Input
                  type="text"
                  placeholder="Search cars, brands..."
                  className="pl-9 pr-4 h-9 bg-accent/40 border-transparent focus-visible:border-accent-blue/50 focus-visible:bg-background rounded-full text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>
          </div>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-1 sm:gap-2 ml-auto">
            {/* City selector - desktop */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCityModal(true)}
              className="hidden md:flex items-center gap-1.5 text-slate-700 hover:text-brand px-2"
            >
              <MapPin className="size-4 text-accent-orange" />
              <span className="text-sm font-medium capitalize max-w-[80px] truncate">
                {selectedCity}
              </span>
              <ChevronDown className="size-3 text-muted-foreground" />
            </Button>

            {/* Wishlist */}
            <button
              onClick={() => navigateTo('user-dashboard')}
              className="flex size-9 items-center justify-center rounded-md hover:bg-accent/60 transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="size-[18px] text-slate-700 hover:text-red-500 transition-colors" />
            </button>

            {/* Login / User */}
            {isAuthenticated && user ? (
              <button
                onClick={() => navigateTo('user-dashboard')}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-accent/60 transition-colors"
              >
                <div className="flex size-7 items-center justify-center rounded-full bg-accent-blue text-white text-xs font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-slate-700 max-w-[80px] truncate">
                  {user.name.split(' ')[0]}
                </span>
              </button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAuthModal(true)}
                className="hidden sm:flex items-center gap-1.5 text-slate-700 hover:text-brand"
              >
                <LogIn className="size-4" />
                <span className="text-sm">Login</span>
              </Button>
            )}

            {/* List Your Car CTA */}
            <Button
              size="sm"
              onClick={() => navigateTo('sell-car')}
              className="hidden sm:flex bg-accent-orange hover:bg-accent-orange/90 text-white rounded-full px-4 shadow-md btn-shine"
            >
              <span className="text-xs sm:text-sm font-semibold">List Your Car</span>
            </Button>

            {/* Mobile: Search icon */}
            <button
              onClick={() => setMobileSearchOpen((v) => !v)}
              className="md:hidden flex size-9 items-center justify-center rounded-md hover:bg-accent/60 transition-colors"
              aria-label="Search"
            >
              {mobileSearchOpen ? (
                <X className="size-[18px] text-slate-700" />
              ) : (
                <Search className="size-[18px] text-slate-700" />
              )}
            </button>

            {/* Mobile: City */}
            <button
              onClick={() => setShowCityModal(true)}
              className="md:hidden flex size-9 items-center justify-center rounded-md hover:bg-accent/60 transition-colors"
              aria-label="Select city"
            >
              <MapPin className="size-[18px] text-accent-orange" />
            </button>

            {/* Mobile: Login */}
            {!isAuthenticated && (
              <button
                onClick={() => setShowAuthModal(true)}
                className="sm:hidden flex size-9 items-center justify-center rounded-md hover:bg-accent/60 transition-colors"
                aria-label="Login"
              >
                <LogIn className="size-[18px] text-slate-700" />
              </button>
            )}
          </div>
        </div>

        {/* ── Mobile Search Bar (collapsible) ── */}
        <AnimatePresence>
          {mobileSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pb-3"
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSearch(mobileSearch)
                  setMobileSearchOpen(false)
                }}
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search cars, brands..."
                    className="pl-9 pr-4 h-9 bg-accent/40 border-transparent rounded-full text-sm"
                    value={mobileSearch}
                    onChange={(e) => setMobileSearch(e.target.value)}
                    autoFocus
                  />
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Mobile Menu Sheet ── */}
      <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
        <SheetContent side="left" className="w-[300px] sm:w-[340px] p-0 overflow-y-auto">
          {/* Header */}
          <SheetHeader className="px-4 py-5 border-b border-border/50 text-left">
            <SheetTitle className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="MeriPehli Gadi"
                width={40}
                height={40}
                className="size-10 object-contain"
              />
              <div>
                <div className="text-base font-bold text-foreground">
                  MeriPehli<span className="text-accent-orange">Gadi</span>
                </div>
                <div className="text-[10px] text-muted-foreground">Shani Finserve</div>
              </div>
            </SheetTitle>
          </SheetHeader>

          {/* City selector */}
          <button
            onClick={() => {
              setShowMobileMenu(false)
              setShowCityModal(true)
            }}
            className="flex items-center gap-2.5 w-full px-5 py-3 text-sm hover:bg-accent/40 transition-colors"
          >
            <MapPin className="size-4 text-accent-orange" />
            <span className="text-foreground font-medium capitalize">{selectedCity}</span>
            <ChevronDown className="size-3.5 ml-auto text-muted-foreground" />
          </button>

          <Separator />

          {/* Accordion Nav */}
          <Accordion type="multiple" className="py-1">
            {navItems.map((item) => (
              <MobileMegaSection key={item.label} item={item} />
            ))}
          </Accordion>

          <Separator />

          {/* Mobile Bottom Actions */}
          <div className="p-4 space-y-2">
            {!isAuthenticated ? (
              <Button
                variant="outline"
                className="w-full flex items-center gap-2"
                onClick={() => {
                  setShowMobileMenu(false)
                  setShowAuthModal(true)
                }}
              >
                <LogIn className="size-4" />
                <span>Login / Register</span>
              </Button>
            ) : (
              <Button
                variant="outline"
                className="w-full flex items-center gap-2"
                onClick={() => {
                  setShowMobileMenu(false)
                  navigateTo('user-dashboard')
                }}
              >
                <div className="flex size-6 items-center justify-center rounded-full bg-accent-blue text-white text-xs font-bold">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <span>{user?.name}</span>
              </Button>
            )}
            <Button
              className="w-full bg-accent-orange hover:bg-accent-orange/90 text-white rounded-full"
              onClick={() => {
                setShowMobileMenu(false)
                navigateTo('sell-car')
              }}
            >
              <span className="font-semibold">List Your Car Free</span>
            </Button>
          </div>

          {/* Contact */}
          <div className="px-5 py-4 border-t border-border/50 space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Phone className="size-3.5" />
              <span>+91 87219 32757</span>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
