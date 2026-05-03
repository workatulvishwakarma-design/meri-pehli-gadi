'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Car,
  Zap,
  TrendingUp,
  CalendarClock,
  ArrowLeftRight,
  MapPin,
  HandCoins,
  ShieldCheck,
  Crown,
  Banknote,
  ChevronDown,
  Sparkles,
  Award,
  Tag,
} from 'lucide-react'
import { useAppStore, type PageName } from '@/lib/store'
import { cn } from '@/lib/utils'

interface MenuItem {
  label: string
  page: PageName
  icon: React.ReactNode
  description?: string
}

interface MegaMenuGroup {
  label: string
  items: MenuItem[]
}

const newCarsMenu: MenuItem[] = [
  { label: 'Electric Cars', page: 'electric-cars', icon: <Zap className="size-4 text-accent-green" />, description: 'Go green with EVs' },
  { label: 'Popular Cars', page: 'new-cars', icon: <TrendingUp className="size-4 text-accent-blue" />, description: 'Top selling models' },
  { label: 'Upcoming Cars', page: 'new-cars', icon: <CalendarClock className="size-4 text-accent-orange" />, description: 'Launching soon' },
  { label: 'New Launches', page: 'new-cars', icon: <Sparkles className="size-4 text-accent-orange" />, description: 'Fresh arrivals' },
  { label: 'Compare Cars', page: 'compare-cars', icon: <ArrowLeftRight className="size-4 text-accent-blue" />, description: 'Side by side specs' },
  { label: 'Find Dealers', page: 'contact', icon: <MapPin className="size-4 text-accent-green" />, description: 'Nearby showrooms' },
]

const usedCarsMenu: MenuItem[] = [
  { label: 'Buy Used Cars', page: 'used-cars', icon: <Car className="size-4 text-accent-blue" />, description: 'Explore all listings' },
  { label: 'Used Cars in City', page: 'used-cars-city', icon: <MapPin className="size-4 text-accent-green" />, description: 'Cars near you' },
  { label: 'Sell My Car', page: 'sell-car', icon: <HandCoins className="size-4 text-accent-orange" />, description: 'Get best price' },
  { label: 'Car Valuation', page: 'car-valuation', icon: <Tag className="size-4 text-accent-blue" />, description: 'Free value check' },
  { label: 'Certified Cars', page: 'certified-cars', icon: <ShieldCheck className="size-4 text-accent-green" />, description: 'Inspected & verified' },
  { label: 'Budget Cars', page: 'used-cars-budget', icon: <Banknote className="size-4 text-accent-orange" />, description: 'Under 5 lakh' },
  { label: 'Luxury Cars', page: 'luxury-cars', icon: <Crown className="size-4 text-accent-orange" />, description: 'Premium collection' },
]

interface MegaMenuProps {
  label: string
  menuItems: MenuItem[]
}

export function MegaMenu({ label, menuItems }: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const navigateTo = useAppStore((s) => s.navigateTo)

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 150)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const handleClick = (page: PageName) => {
    setIsOpen(false)
    navigateTo(page)
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={cn(
          'flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors',
          'text-foreground/80 hover:text-foreground hover:bg-accent/50',
          isOpen && 'text-foreground bg-accent/50'
        )}
      >
        {label}
        <ChevronDown
          className={cn(
            'size-3.5 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={cn(
              'absolute top-full left-1/2 -translate-x-1/2 z-50 mt-1',
              'w-[520px] rounded-xl border bg-background shadow-xl',
              'p-4'
            )}
          >
            <div className="grid grid-cols-2 gap-1">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleClick(item.page)}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-lg text-left',
                    'transition-colors hover:bg-accent/60',
                    'group cursor-pointer'
                  )}
                >
                  <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/80 group-hover:bg-accent-blue/10 transition-colors">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-foreground group-hover:text-accent-blue transition-colors">
                      {item.label}
                    </div>
                    {item.description && (
                      <div className="text-xs text-muted-foreground mt-0.5 truncate">
                        {item.description}
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

export function NewCarsMegaMenu() {
  return <MegaMenu label="New Cars" menuItems={newCarsMenu} />
}

export function UsedCarsMegaMenu() {
  return <MegaMenu label="Used Cars" menuItems={usedCarsMenu} />
}
