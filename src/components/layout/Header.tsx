'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  Search,
  MapPin,
  Heart,
  LogIn,
  Menu,
  X,
  ChevronDown,
  Globe,
  Car,
  DollarSign,
  Shield,
  FileText,
  BookOpen,
  Phone,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { useAppStore, type PageName } from '@/lib/store'
import { NewCarsMegaMenu, UsedCarsMegaMenu } from './MegaMenu'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  page: PageName
  icon: React.ReactNode
  megaMenu?: React.ReactNode
}

const navItems: NavItem[] = [
  {
    label: 'Used Cars',
    page: 'used-cars',
    icon: <Car className="size-4" />,
    megaMenu: <UsedCarsMegaMenu />,
  },
  {
    label: 'New Cars',
    page: 'new-cars',
    icon: <Car className="size-4" />,
    megaMenu: <NewCarsMegaMenu />,
  },
  { label: 'Sell Car', page: 'sell-car', icon: <DollarSign className="size-4" /> },
  { label: 'Finance', page: 'finance', icon: <DollarSign className="size-4" /> },
  { label: 'Insurance', page: 'insurance', icon: <Shield className="size-4" /> },
  { label: 'Blog', page: 'blog', icon: <BookOpen className="size-4" /> },
  { label: 'Contact', page: 'contact', icon: <Phone className="size-4" /> },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileSearch, setMobileSearch] = useState('')

  const navigateTo = useAppStore((s) => s.navigateTo)
  const selectedCity = useAppStore((s) => s.selectedCity)
  const setShowCityModal = useAppStore((s) => s.setShowCityModal)
  const setShowAuthModal = useAppStore((s) => s.setShowAuthModal)
  const isAuthenticated = useAppStore((s) => s.isAuthenticated)
  const user = useAppStore((s) => s.user)
  const showMobileMenu = useAppStore((s) => s.showMobileMenu)
  const setShowMobileMenu = useAppStore((s) => s.setShowMobileMenu)
  const setSearchQuery = useAppStore((s) => s.setSearchQuery)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = useCallback(
    (query: string) => {
      if (query.trim()) {
        setSearchQuery(query.trim())
        navigateTo('used-cars', { search: query.trim() })
        setSearchOpen(false)
      }
    },
    [navigateTo, setSearchQuery]
  )

  const handleNavClick = (page: PageName) => {
    navigateTo(page)
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        scrolled ? 'glass-header shadow-sm' : 'bg-background/95'
      )}
    >
      {/* Top accent bar */}
      <div className="h-0.5 w-full bg-gradient-to-r from-accent-blue via-accent-orange to-accent-blue" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[70px] items-center gap-4 lg:h-[70px]">
          {/* Mobile hamburger */}
          <button
            className="lg:hidden flex size-10 items-center justify-center rounded-md hover:bg-accent/60 transition-colors"
            onClick={() => setShowMobileMenu(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5 text-foreground" />
          </button>

          {/* Logo */}
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2 shrink-0"
          >
            <Image
              src="/logo.png"
              alt="MeriPehli Gadi"
              width={44}
              height={44}
              className="size-9 sm:size-11 object-contain"
              priority
            />
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-bold leading-tight text-foreground">
                MeriPehli<span className="text-accent-orange">Gadi</span>
              </span>
              <span className="text-[10px] text-muted-foreground leading-tight">
                Shani Finserve
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 ml-4">
            {navItems.map((item) => (
              <div key={item.label} className="relative">
                {item.megaMenu ? (
                  item.megaMenu
                ) : (
                  <button
                    onClick={() => handleNavClick(item.page)}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent/50 rounded-md transition-colors"
                  >
                    {item.label}
                  </button>
                )}
              </div>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search car, brand, model..."
                className="pl-9 pr-4 h-9 bg-accent/40 border-transparent focus-visible:border-accent-blue/50 focus-visible:bg-background rounded-full text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch((e.target as HTMLInputElement).value)
                  }
                }}
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-2 ml-auto">
            {/* City Selector - Desktop */}
            <button
              onClick={() => setShowCityModal(true)}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-accent/60 transition-colors text-sm"
            >
              <MapPin className="size-4 text-accent-orange" />
              <span className="font-medium text-foreground capitalize max-w-[80px] truncate">
                {selectedCity}
              </span>
              <ChevronDown className="size-3 text-muted-foreground" />
            </button>

            {/* Language Selector */}
            <button className="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-md hover:bg-accent/60 transition-colors text-xs text-muted-foreground">
              <Globe className="size-3.5" />
              <span>EN</span>
            </button>

            {/* Wishlist */}
            <button
              onClick={() => navigateTo('user-dashboard')}
              className="flex size-9 items-center justify-center rounded-md hover:bg-accent/60 transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="size-4.5 text-foreground/70 hover:text-red-500 transition-colors" />
            </button>

            {/* Login / User Avatar */}
            {isAuthenticated && user ? (
              <button
                onClick={() => navigateTo('user-dashboard')}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-accent/60 transition-colors"
              >
                <div className="flex size-7 items-center justify-center rounded-full bg-accent-blue text-white text-xs font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-foreground max-w-[80px] truncate">
                  {user.name.split(' ')[0]}
                </span>
              </button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAuthModal(true)}
                className="hidden sm:flex items-center gap-1.5 text-foreground/80"
              >
                <LogIn className="size-4" />
                <span className="text-sm">Login</span>
              </Button>
            )}

            {/* List Your Car Button */}
            <Button
              size="sm"
              onClick={() => navigateTo('sell-car')}
              className="hidden sm:flex bg-accent-orange hover:bg-accent-orange/90 text-white shadow-md btn-shine"
            >
              <span className="text-xs sm:text-sm font-semibold">List Your Car</span>
            </Button>

            {/* Mobile: Search + City */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden flex size-9 items-center justify-center rounded-md hover:bg-accent/60 transition-colors"
              aria-label="Search"
            >
              <Search className="size-4.5 text-foreground/70" />
            </button>

            <button
              onClick={() => setShowCityModal(true)}
              className="md:hidden flex size-9 items-center justify-center rounded-md hover:bg-accent/60 transition-colors"
              aria-label="Select city"
            >
              <MapPin className="size-4.5 text-accent-orange" />
            </button>

            {/* Mobile: Login */}
            {!isAuthenticated && (
              <button
                onClick={() => setShowAuthModal(true)}
                className="sm:hidden flex size-9 items-center justify-center rounded-md hover:bg-accent/60 transition-colors"
                aria-label="Login"
              >
                <LogIn className="size-4.5 text-foreground/70" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search Bar (collapsible) */}
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pb-3"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search car, brand, model..."
                className="pl-9 pr-4 h-9 bg-accent/40 border-transparent rounded-full text-sm"
                value={mobileSearch}
                onChange={(e) => setMobileSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch(mobileSearch)
                }}
                autoFocus
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Mobile Menu Sheet */}
      <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
        <SheetContent side="left" className="w-[300px] sm:w-[340px] p-0 overflow-y-auto">
          {/* Sheet Header with Logo */}
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

          {/* City selector in mobile */}
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

          {/* Navigation Links */}
          <nav className="flex flex-col py-2">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  handleNavClick(item.page)
                  setShowMobileMenu(false)
                }}
                className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent/40 transition-colors"
              >
                {item.icon}
                <span>{item.label}</span>
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
              className="w-full bg-accent-orange hover:bg-accent-orange/90 text-white"
              onClick={() => {
                handleNavClick('sell-car')
                setShowMobileMenu(false)
              }}
            >
              <span className="font-semibold">List Your Car Free</span>
            </Button>
          </div>

          {/* Contact info */}
          <div className="px-5 py-4 border-t border-border/50 space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Phone className="size-3.5" />
              <span>+91 87219 32757</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileText className="size-3.5" />
              <span>info@meripehligadi.com</span>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
