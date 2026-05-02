'use client'

import Image from 'next/image'
import {
  MapPin,
  Phone,
  Mail,
  Send,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Shield,
  Car,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useAppStore, type PageName } from '@/lib/store'
import { cn } from '@/lib/utils'

/* ─── Data ───────────────────────────────────────────────── */

interface FooterLink {
  label: string
  page: PageName
}

const quickLinks: FooterLink[] = [
  { label: 'Used Cars', page: 'used-cars' },
  { label: 'Sell Car', page: 'sell-car' },
  { label: 'Finance', page: 'finance' },
  { label: 'Insurance', page: 'insurance' },
  { label: 'About Us', page: 'about' },
  { label: 'Contact', page: 'contact' },
  { label: 'Blog', page: 'blog' },
  { label: 'FAQ', page: 'faq' },
]

const popularSearches: FooterLink[] = [
  { label: 'Used Cars in Dibrugarh', page: 'used-cars-city' },
  { label: 'Used Cars in Guwahati', page: 'used-cars-city' },
  { label: 'Maruti Cars', page: 'used-cars-brand' },
  { label: 'Under 5 Lakh', page: 'used-cars-budget' },
  { label: 'SUV Cars', page: 'used-cars' },
  { label: 'Automatic Cars', page: 'used-cars' },
]

const legalLinks: FooterLink[] = [
  { label: 'Privacy Policy', page: 'privacy-policy' },
  { label: 'Terms of Service', page: 'terms' },
]

const socialLinks = [
  { icon: <Facebook className="size-4" />, label: 'Facebook', href: '#' },
  { icon: <Instagram className="size-4" />, label: 'Instagram', href: '#' },
  { icon: <Twitter className="size-4" />, label: 'Twitter', href: '#' },
  { icon: <Youtube className="size-4" />, label: 'YouTube', href: '#' },
]

/* ─── Component ──────────────────────────────────────────── */

export function Footer() {
  const navigateTo = useAppStore((s) => s.navigateTo)

  const handleLinkClick = (page: PageName) => {
    navigateTo(page)
  }

  return (
    <footer className="bg-[#0a1628] text-white mt-auto">
      {/* ── Main Grid ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        {/* Top: Logo + Tagline */}
        <div className="flex items-center gap-3 mb-10">
          <Image
            src="/logo.png"
            alt="MeriPehli Gadi"
            width={100}
            height={28}
            className="h-7 w-auto object-contain brightness-0 invert"
          />
          <span className="text-sm text-white/60 italic">
            &ldquo;Har family ki pehli car ka sapna, ab aur aasaan.&rdquo;
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Column 1 – About */}
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Car className="size-4 text-accent-blue" />
              About MeriPehli Gadi
            </h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Northeast India&apos;s trusted online car marketplace. Buy, sell, and finance
              pre-owned and new vehicles with complete transparency and ease.
            </p>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5 text-sm text-white/70">
                <MapPin className="size-4 mt-0.5 text-accent-orange shrink-0" />
                <span>
                  Dibrugarh, Assam, India
                  <br />
                  Near AT Road, Industrial Area
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/70">
                <Phone className="size-4 text-accent-orange shrink-0" />
                <a href="tel:+918721932757" className="hover:text-white transition-colors">
                  +91 87219 32757
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/70">
                <Mail className="size-4 text-accent-orange shrink-0" />
                <a href="mailto:info@meripehligadi.com" className="hover:text-white transition-colors">
                  info@meripehligadi.com
                </a>
              </div>
            </div>
          </div>

          {/* Column 2 – Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleLinkClick(link.page)}
                    className="text-sm text-white/60 hover:text-accent-orange transition-colors duration-200 hover:translate-x-1 transform inline-block"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 – Popular Searches */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5">
              Popular Searches
            </h3>
            <ul className="space-y-2.5">
              {popularSearches.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleLinkClick(link.page)}
                    className="text-sm text-white/60 hover:text-accent-orange transition-colors duration-200 hover:translate-x-1 transform inline-block"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 – Connect */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
              <Send className="size-4 text-accent-blue" />
              Connect With Us
            </h3>

            {/* Newsletter */}
            <div className="mb-5">
              <p className="text-xs text-white/50 mb-2.5">
                Subscribe for latest offers &amp; updates
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="h-9 bg-white/10 border-white/15 text-white placeholder:text-white/40 text-sm rounded-lg px-3 focus-visible:border-accent-orange/50"
                />
                <Button
                  size="sm"
                  className="h-9 bg-accent-orange hover:bg-accent-orange/90 text-white rounded-lg px-3 shrink-0"
                >
                  <Send className="size-3.5" />
                </Button>
              </div>
            </div>

            {/* Social Icons */}
            <div>
              <p className="text-xs text-white/50 mb-3">Follow us on</p>
              <div className="flex items-center gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className={cn(
                      'flex size-9 items-center justify-center rounded-lg',
                      'bg-white/10 hover:bg-accent-blue/20 text-white/60 hover:text-white',
                      'transition-all duration-200 hover:scale-110',
                    )}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Trust badges */}
            <div className="mt-6 flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white/5 text-[10px] text-white/50">
                <Shield className="size-3 text-accent-green" />
                <span>Verified Cars</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white/5 text-[10px] text-white/50">
                <Car className="size-3 text-accent-blue" />
                <span>Easy Finance</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Separator ── */}
      <Separator className="bg-white/10" />

      {/* ── Bottom Bar ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Copyright */}
          <div className="text-xs text-white/40 text-center sm:text-left">
            &copy; {new Date().getFullYear()} MeriPehli Gadi. All rights reserved.
          </div>

          {/* Legal Links */}
          <div className="flex items-center gap-4">
            {legalLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleLinkClick(link.page)}
                className="text-xs text-white/40 hover:text-white/70 transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Shani Finserve Badge */}
          <div className="flex items-center gap-1.5 text-xs text-white/40">
            <div className="size-1.5 rounded-full bg-accent-green" />
            <span>Powered by</span>
            <span className="font-semibold text-white/60">Shani Finserve</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
