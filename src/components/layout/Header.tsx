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
  Car,
  DollarSign,
  Shield,
  BookOpen,
  Phone,
  User,
  Zap,
  TrendingUp,
  CalendarClock,
  ArrowLeftRight,
  HandCoins,
  ShieldCheck,
  Crown,
  Banknote,
  Sparkles,
  Tag,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { useAppStore, type PageName } from '@/lib/store'
import { cn } from '@/lib/utils'

/* ─── Dropdown Data ──────────────────────────────────────── */

interface DropItem {
  label: string
  page: PageName
  icon: React.ReactNode
  desc?: string
}

const usedCarsDropdown: DropItem[] = [
  { label: 'Buy Used Cars', page: 'used-cars', icon: <Car className="size-4 text-accent-blue" />, desc: 'Explore all listings' },
  { label: 'Used Cars in City', page: 'used-cars-city', icon: <MapPin className="size-4 text-accent-green" />, desc: 'Cars near you' },
  { label: 'Sell My Car', page: 'sell-car', icon: <HandCoins className="size-4 text-accent-orange" />, desc: 'Get best price' },
  { label: 'Car Valuation', page: 'car-valuation', icon: <Tag className="size-4 text-accent-blue" />, desc: 'Free value check' },
  { label: 'Certified Cars', page: 'certified-cars', icon: <ShieldCheck className="size-4 text-accent-green" />, desc: 'Inspected & verified' },
  { label: 'Budget Cars', page: 'used-cars-budget', icon: <Banknote className="size-4 text-accent-orange" />, desc: 'Under 5 lakh' },
  { label: 'Luxury Cars', page: 'luxury-cars', icon: <Crown className="size-4 text-accent-orange" />, desc: 'Premium collection' },
]

const newCarsDropdown: DropItem[] = [
  { label: 'Electric Cars', page: 'electric-cars', icon: <Zap className="size-4 text-accent-green" />, desc: 'Go green with EVs' },
  { label: 'Popular Cars', page: 'new-cars', icon: <TrendingUp className="size-4 text-accent-blue" />, desc: 'Top selling models' },
  { label: 'Upcoming Cars', page: 'new-cars', icon: <CalendarClock className="size-4 text-accent-orange" />, desc: 'Launching soon' },
  { label: 'Compare Cars', page: 'compare-cars', icon: <ArrowLeftRight className="size-4 text-accent-blue" />, desc: 'Side by side specs' },
  { label: 'Find Dealers', page: 'contact', icon: <MapPin className="size-4 text-accent-green" />, desc: 'Nearby showrooms' },
]

/* ─── Nav Items ──────────────────────────────────────────── */

interface NavItem {
  label: string
  page: PageName
  hasDropdown?: boolean
  dropdown?: DropItem[]
}

const navItems: NavItem[] = [
  { label: 'Used Cars', page: 'used-cars', hasDropdown: true, dropdown: usedCarsDropdown },
  { label: 'New Cars', page: 'new-cars', hasDropdown: true, dropdown: newCarsDropdown },
  { label: 'Sell Car', page: 'sell-car' },
  { label: 'Finance', page: 'finance' },
  { label: 'Insurance', page: 'insurance' },
  { label: 'Blog', page: 'blog' },
  { label: 'Contact', page: 'contact' },
]

/* ─── Dropdown Sub-component ─────────────────────────────── */

function NavDropdown({ items }: { items: DropItem[] }) {
  const [open, setOpen] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const navigateTo = useAppStore((s) => s.navigateTo)

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpen(true)
  }
  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.97 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          className="absolute top-full left-1/2 -translate-x-1/2 z-50 mt-1 w-[520px] rounded-xl border bg-background shadow-xl p-3"
        >
          <div className="grid grid-cols-2 gap-1">
            {items.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setOpen(false)
                  navigateTo(item.page)
                }}
                className="flex items-start gap-3 p-3 rounded-lg text-left transition-colors hover:bg-accent/60 group cursor-pointer"
              >
                <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/80 group-hover:bg-accent-blue/10 transition-colors">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-foreground group-hover:text-accent-blue transition-colors">
                    {item.label}
                  </div>
                  {item.desc && (
                    <div className="text-xs text-muted-foreground mt-0.5 truncate">
                      {item.desc}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ─── Main Header Component ──────────────────────────────── */

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

  const handleNavClick = (page: PageName) => {
    navigateTo(page)
  }

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
            {navItems.map((item) =>
              item.hasDropdown && item.dropdown ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={(e) => {
                    /* Trigger open via hover state managed in dropdown */
                    const btn = e.currentTarget.querySelector('button')
                    if (btn) {
                      const evt = new MouseEvent('mouseenter', { bubbles: true })
                      btn.dispatchEvent(evt)
                    }
                  }}
                >
                  <DropdownNavItem item={item} />
                </div>
              ) : (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.page)}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 hover:text-brand hover:bg-accent/50 rounded-md transition-colors"
                >
                  {item.label}
                </button>
              ),
            )}
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

            {/* List Your Car */}
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
          <div className="flex items-center gap-3 px-4 py-5 border-b border-border/50">
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
          </div>

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

          {/* Nav Links */}
          <nav className="flex flex-col py-2">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  handleNavClick(item.page)
                  setShowMobileMenu(false)
                }}
                className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-slate-700 hover:text-brand hover:bg-accent/40 transition-colors"
              >
                <span>{item.label}</span>
                {item.hasDropdown && <ChevronDown className="size-3.5 ml-auto text-muted-foreground" />}
              </button>
            ))}
          </nav>

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
                  handleNavClick('user-dashboard')
                  setShowMobileMenu(false)
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
                handleNavClick('sell-car')
                setShowMobileMenu(false)
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

/* ─── DropdownNavItem ────────────────────────────────────── */

function DropdownNavItem({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const navigateTo = useAppStore((s) => s.navigateTo)

  const enter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpen(true)
  }
  const leave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <div className="relative" onMouseEnter={enter} onMouseLeave={leave}>
      <button
        className={cn(
          'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors',
          'text-slate-700 hover:text-brand hover:bg-accent/50',
          open && 'text-brand bg-accent/50',
        )}
      >
        {item.label}
        <ChevronDown
          className={cn('size-3.5 transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      <AnimatePresence>
        {open && item.dropdown && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute top-full left-1/2 -translate-x-1/2 z-50 mt-1 w-[520px] rounded-xl border bg-background shadow-xl p-3"
            onMouseEnter={enter}
            onMouseLeave={leave}
          >
            <div className="grid grid-cols-2 gap-1">
              {item.dropdown.map((d) => (
                <button
                  key={d.label}
                  onClick={() => {
                    setOpen(false)
                    navigateTo(d.page)
                  }}
                  className="flex items-start gap-3 p-3 rounded-lg text-left transition-colors hover:bg-accent/60 group cursor-pointer"
                >
                  <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/80 group-hover:bg-accent-blue/10 transition-colors">
                    {d.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-foreground group-hover:text-accent-blue transition-colors">
                      {d.label}
                    </div>
                    {d.desc && (
                      <div className="text-xs text-muted-foreground mt-0.5 truncate">
                        {d.desc}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
