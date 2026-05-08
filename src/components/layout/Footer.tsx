'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
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
  ShieldCheck,
  Headphones,
  Landmark,
  FileText,
  BadgeCheck,
  MessageCircle,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useAppStore, type PageName } from '@/lib/store'
import { cn } from '@/lib/utils'

/* ─── Types ────────────────────────────────────────────── */

interface FooterNavLink {
  label: string
  page: PageName
  params?: Record<string, string>
}

/* ─── Data: City Links ─────────────────────────────────── */

const cityLinks: FooterNavLink[] = [
  { label: 'Used Cars in Guwahati', page: 'used-cars-city', params: { city: 'guwahati' } },
  { label: 'Used Cars in Dibrugarh', page: 'used-cars-city', params: { city: 'dibrugarh' } },
  { label: 'Used Cars in Tinsukia', page: 'used-cars-city', params: { city: 'tinsukia' } },
  { label: 'Used Cars in Jorhat', page: 'used-cars-city', params: { city: 'jorhat' } },
  { label: 'Used Cars in Tezpur', page: 'used-cars-city', params: { city: 'tezpur' } },
  { label: 'Used Cars in Silchar', page: 'used-cars-city', params: { city: 'silchar' } },
  { label: 'Used Cars in Sivasagar', page: 'used-cars-city', params: { city: 'sivasagar' } },
  { label: 'Used Cars in Nagaon', page: 'used-cars-city', params: { city: 'nagaon' } },
]

/* ─── Data: Brand Links ────────────────────────────────── */

const brandLinks: FooterNavLink[] = [
  { label: 'Used Maruti Cars in Assam', page: 'used-cars-brand', params: { brand: 'maruti-suzuki' } },
  { label: 'Used Hyundai Cars in Assam', page: 'used-cars-brand', params: { brand: 'hyundai' } },
  { label: 'Used Tata Cars in Assam', page: 'used-cars-brand', params: { brand: 'tata' } },
  { label: 'Used Mahindra Cars in Assam', page: 'used-cars-brand', params: { brand: 'mahindra' } },
  { label: 'Used Honda Cars in Assam', page: 'used-cars-brand', params: { brand: 'honda' } },
  { label: 'Used Toyota Cars in Assam', page: 'used-cars-brand', params: { brand: 'toyota' } },
  { label: 'Used Kia Cars in Assam', page: 'used-cars-brand', params: { brand: 'kia' } },
]

/* ─── Data: Budget & Body Type ─────────────────────────── */

const budgetBodyLinks: FooterNavLink[] = [
  { label: 'Under ₹2 Lakh in Assam', page: 'used-cars-budget', params: { budget: '2' } },
  { label: 'Under ₹5 Lakh in Assam', page: 'used-cars-budget', params: { budget: '5' } },
  { label: 'Under ₹10 Lakh in Assam', page: 'used-cars-budget', params: { budget: '10' } },
  { label: 'SUV Cars in Assam', page: 'used-cars' },
  { label: 'Hatchback Cars in Assam', page: 'used-cars' },
  { label: 'Sedan Cars in Assam', page: 'used-cars' },
  { label: 'Electric Cars in Assam', page: 'electric-cars' },
]

/* ─── Data: Finance & Insurance ────────────────────────── */

const financeInsuranceLinks: FooterNavLink[] = [
  { label: 'Used Car Loan in Assam', page: 'finance' },
  { label: 'Car Loan in Guwahati', page: 'finance' },
  { label: 'Car Insurance in Assam', page: 'insurance' },
  { label: 'Insurance Renewal', page: 'insurance' },
  { label: 'EMI Calculator', page: 'finance' },
  { label: 'Loan Eligibility', page: 'finance' },
]

/* ─── Data: Popular Searches ───────────────────────────── */

const popularSearchLinks: FooterNavLink[] = [
  { label: 'Best Used Cars in Assam', page: 'used-cars' },
  { label: 'Low Mileage Used Cars', page: 'used-cars' },
  { label: 'Certified Used Cars', page: 'certified-cars' },
  { label: 'First Car for Family', page: 'used-cars' },
  { label: 'Budget Cars in Assam', page: 'used-cars' },
]

/* ─── Data: Legal Links ────────────────────────────────── */

const legalLinks: FooterNavLink[] = [
  { label: 'Privacy Policy', page: 'privacy-policy' },
  { label: 'Terms of Service', page: 'terms' },
  { label: 'Refund Policy', page: 'refund-policy' },
]

/* ─── Data: Trust Badges ───────────────────────────────── */

const trustBadges = [
  { icon: <ShieldCheck className="size-4" />, label: 'Verified Listings' },
  { icon: <Headphones className="size-4" />, label: 'Local Assam Support' },
  { icon: <Landmark className="size-4" />, label: 'Finance by Shani Finserve' },
  { icon: <FileText className="size-4" />, label: 'Insurance Assistance' },
  { icon: <BadgeCheck className="size-4" />, label: 'Transparent Pricing' },
  { icon: <MessageCircle className="size-4" />, label: 'WhatsApp Support' },
]

/* ─── Data: Social Links ───────────────────────────────── */

const socialLinks = [
  { icon: <Facebook className="size-4" />, label: 'Facebook', href: '#' },
  { icon: <Instagram className="size-4" />, label: 'Instagram', href: '#' },
  { icon: <Twitter className="size-4" />, label: 'Twitter', href: '#' },
  { icon: <Youtube className="size-4" />, label: 'YouTube', href: '#' },
]

/* ─── Reusable: Link Column ────────────────────────────── */

function getHref(page: string, params?: Record<string, string>): string {
  switch (page) {
    case 'home':
      return '/'
    case 'used-cars':
      return '/used-cars'
    case 'used-cars-city':
      return `/used-cars/in/${params?.city || 'assam'}`
    case 'used-cars-brand':
      return `/used-cars/brand/${params?.brand || 'all'}/assam`
    case 'used-cars-budget':
      return `/used-cars/budget/${params?.budget || 'all'}-lakh/assam`
    case 'car-details':
      return `/car/${params?.id}`
    case 'sell-car':
      return '/sell-car'
    case 'finance':
      return '/finance'
    case 'insurance':
      return '/insurance'
    case 'certified-cars':
      return '/certified-cars'
    case 'electric-cars':
      return '/electric-cars'
    case 'about':
      return '/about'
    case 'contact':
      return '/contact'
    case 'privacy-policy':
      return '/privacy-policy'
    case 'terms':
      return '/terms'
    case 'refund-policy':
      return '/refund-policy'
    default:
      return '/'
  }
}

function LinkColumn({ title, links }: { title: string; links: FooterNavLink[] }) {
  return (
    <div>
      <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
        {title}
      </h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={getHref(link.page, link.params)}
              className="group flex items-center gap-1.5 text-sm text-white/60 hover:text-accent-orange transition-colors duration-200 text-left"
              prefetch={false}
            >
              <ChevronRight className="size-3 shrink-0 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-accent-orange" />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ─── Component ─────────────────────────────────────────── */

export function Footer() {
  const navigateTo = useAppStore((s) => s.navigateTo)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = () => {
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <footer className="bg-[#0a1628] text-white mt-auto">
      {/* ══════════════════════════════════════════════════
          SECTION 1 — Top: Logo + Tagline + Trust Row
          ══════════════════════════════════════════════════ */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        {/* Logo + Tagline */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-4 mb-8">
          <div className="flex flex-col items-start">
            <Image
              src="/logo.png"
              alt="MeriPehli Gadi"
              width={140}
              height={36}
              className="h-8 w-auto object-contain brightness-0 invert"
            />
            <span className="text-[10px] font-bold tracking-wider text-accent-orange uppercase mt-1 ml-1 leading-none">
              Powered by Shani Finserve
            </span>
          </div>
          <p className="text-sm text-white/50 italic">
            &ldquo;Har family ki pehli car ka sapna, ab aur aasaan.&rdquo;
          </p>
        </div>

        {/* Trust Badges Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {trustBadges.map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm"
            >
              <span className="text-accent-orange shrink-0">{badge.icon}</span>
              <span className="text-xs text-white/70 font-medium leading-tight">
                {badge.label}
              </span>
            </div>
          ))}
        </div>

        <Separator className="bg-white/[0.08] mb-10" />

        {/* ══════════════════════════════════════════════════
            SECTION 2 — Main 6-Column Grid
            ══════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-x-8 gap-y-10 lg:gap-6">
          {/* ── Column 1: About ── */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Shield className="size-4 text-accent-orange" />
              About Us
            </h3>
            <p className="text-sm text-white/55 leading-relaxed">
              MeriPehli Gadi is Northeast India&apos;s trusted used car marketplace.
              We help families find their dream first car with transparent pricing,
              verified listings, and easy financing — all across Assam.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5 text-sm text-white/60">
                <MapPin className="size-4 mt-0.5 text-accent-orange shrink-0" />
                <span className="leading-snug">
                  MUKUL SHAH, C/O, opposite Vishal Mega Mart,
                  <br />
                  KARTIC PARA, Dibrugarh, Assam 786001
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/60">
                <Phone className="size-4 text-accent-orange shrink-0" />
                <a
                  href="tel:+918721932757"
                  className="hover:text-white transition-colors"
                >
                  087219 32757
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-white/60">
                <Mail className="size-4 text-accent-orange shrink-0" />
                <a
                  href="mailto:info@meripehligadi.com"
                  className="hover:text-white transition-colors"
                >
                  info@meripehligadi.com
                </a>
              </div>
            </div>
          </div>

          {/* ── Column 2: Used Cars by City ── */}
          <LinkColumn title="Used Cars by City" links={cityLinks} />

          {/* ── Column 3: Used Cars by Brand ── */}
          <LinkColumn title="Cars by Brand in Assam" links={brandLinks} />

          {/* ── Column 4: Budget & Body Type ── */}
          <LinkColumn title="Budget & Body Type" links={budgetBodyLinks} />

          {/* ── Column 5: Finance & Insurance ── */}
          <LinkColumn title="Finance & Insurance" links={financeInsuranceLinks} />

          {/* ── Column 6: Popular Searches & Connect ── */}
          <div className="space-y-6">
            <LinkColumn title="Popular Searches" links={popularSearchLinks} />

            {/* Newsletter */}
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
                Newsletter
              </h3>
              {subscribed ? (
                <div className="flex items-center gap-2 text-sm text-green-400">
                  <CheckCircle2 className="size-4 shrink-0" />
                  <span>Subscribed successfully!</span>
                </div>
              ) : (
                <>
                  <p className="text-xs text-white/45 mb-2.5">
                    Get the latest deals &amp; updates delivered to your inbox.
                  </p>
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="Your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                      className="h-9 bg-white/[0.07] border-white/[0.12] text-white placeholder:text-white/35 text-sm rounded-lg px-3 focus-visible:border-accent-orange/50 focus-visible:ring-accent-orange/20"
                    />
                    <Button
                      size="sm"
                      onClick={handleSubscribe}
                      className="h-9 bg-accent-orange hover:bg-accent-orange/90 text-white rounded-lg px-3 shrink-0"
                    >
                      <Send className="size-3.5" />
                    </Button>
                  </div>
                </>
              )}
            </div>

            {/* Social Icons */}
            <div>
              <p className="text-xs text-white/45 mb-3">Follow us on</p>
              <div className="flex items-center gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className={cn(
                      'flex size-9 items-center justify-center rounded-lg',
                      'bg-white/[0.08] hover:bg-accent-orange/20 text-white/50 hover:text-accent-orange',
                      'transition-all duration-200 hover:scale-110',
                    )}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          SECTION 3 — Bottom Bar
          ══════════════════════════════════════════════════ */}
      <Separator className="bg-white/[0.08]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <div className="text-xs text-white/40 text-center lg:text-left">
            &copy; {new Date().getFullYear()} MeriPehli Gadi. All rights reserved.
          </div>

          {/* Legal Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
            {legalLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => navigateTo(link.page)}
                className="text-xs text-white/40 hover:text-white/80 transition-colors duration-200"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Powered by Shani Finserve */}
          <div className="flex items-center gap-1.5 text-xs text-white/40">
            <div className="size-1.5 rounded-full bg-accent-green animate-pulse" />
            <span>Powered by</span>
            <span className="font-semibold text-white/60">Shani Finserve</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
