'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import {
  Shield, Eye, MapPin, Handshake, ArrowRight, Phone, Mail,
  Users, Car, Building2, HeartHandshake, Award, Star, Target,
  CheckCircle2, MessageCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
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

// ─── About Page ─────────────────────────────────────────────────────

function AboutMainPage() {
  const navigateTo = useAppStore((s) => s.navigateTo)

  const values = [
    {
      icon: Shield,
      title: 'Trust',
      description: 'Every car undergoes rigorous quality checks. We verify documents, inspect engines, and ensure complete transparency before listing any vehicle on our platform.',
      color: 'bg-emerald-50 text-emerald-600',
      borderColor: 'border-emerald-200',
    },
    {
      icon: Eye,
      title: 'Transparency',
      description: 'No hidden charges, no misleading information. We display true condition reports, real photos, and fair pricing on every listing.',
      color: 'bg-blue-50 text-blue-600',
      borderColor: 'border-blue-200',
    },
    {
      icon: MapPin,
      title: 'Local Support',
      description: 'Based in Dibrugarh, Assam, we understand the Northeast India market deeply. Our local team provides hands-on support for every transaction.',
      color: 'bg-orange-50 text-orange-600',
      borderColor: 'border-orange-200',
    },
  ]

  const team = [
    {
      name: 'Mukul Shah',
      role: 'Founder & CEO',
      description: 'Visionary entrepreneur passionate about making car ownership accessible to every Indian family.',
      gradient: 'from-brand to-blue-700',
    },
    {
      name: 'Finance Team',
      role: 'Shani Finserve',
      description: 'Dedicated financial experts providing hassle-free car loans and insurance solutions.',
      gradient: 'from-orange-500 to-amber-500',
    },
    {
      name: 'Sales Team',
      role: 'Customer Support',
      description: 'Friendly, knowledgeable team helping you find the perfect car at the best price.',
      gradient: 'from-emerald-500 to-teal-500',
    },
  ]

  const stats = [
    { value: '500+', label: 'Cars Sold', icon: Car },
    { value: '100+', label: 'Verified Dealers', icon: Building2 },
    { value: '50+', label: 'Cities Covered', icon: MapPin },
    { value: '10,000+', label: 'Happy Customers', icon: Users },
  ]

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-[#0a1628] via-[#1a2a4a] to-[#0a1628] overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-[10%] size-40 rounded-full bg-orange-500 blur-3xl" />
          <div className="absolute bottom-10 right-[10%] size-60 rounded-full bg-blue-500 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image src="/logo.png" alt="MeriPehli Gadi" width={120} height={40} className="h-10 w-auto mx-auto mb-6" unoptimized />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl font-extrabold mb-4"
          >
            <span className="bg-gradient-to-r from-white via-blue-200 to-orange-300 bg-clip-text text-transparent">
              About MeriPehli Gadi
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto"
          >
            Your trusted partner in buying and selling quality pre-owned cars across Northeast India and beyond.
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="max-w-3xl mx-auto text-center">
              <Badge className="bg-orange-50 text-orange-600 border-orange-200 mb-4">
                <Target className="size-3 mr-1" />
                Our Mission
              </Badge>
              <h2 className="text-2xl md:text-4xl font-bold text-brand mb-6 leading-tight">
                Har family ki pehli car ka sapna, ab aur aasaan.
              </h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                At MeriPehli Gadi, we believe every family deserves a reliable car at a fair price. 
                We&apos;re building India&apos;s most trusted used car marketplace, starting from the heart of 
                Assam and expanding across the nation. Our mission is to make the dream of car ownership 
                a reality for millions of Indian families.
              </p>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-12 md:py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <FadeInSection>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-brand mb-4">Our Story</h2>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    MeriPehli Gadi was founded in Dibrugarh, Assam, with a simple yet powerful vision: 
                    to create a transparent and trustworthy platform where people can buy and sell 
                    pre-owned cars with complete peace of mind.
                  </p>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    Growing up in Northeast India, our founder Mukul Shah witnessed firsthand the challenges 
                    people face when buying a used car — hidden defects, unclear ownership history, and 
                    unfair pricing. This inspired the creation of a platform built on three pillars: 
                    trust, transparency, and local support.
                  </p>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Today, MeriPehli Gadi has grown from a local initiative to a comprehensive car 
                    marketplace serving customers across 50+ cities, with over 500 cars sold and 
                    thousands of satisfied families who found their first car through us.
                  </p>
                </div>
                <div className="relative">
                  <div className="bg-gradient-to-br from-[#0a1628] to-[#1a2a4a] rounded-2xl p-8 text-center">
                    <Car className="size-20 text-white/80 mx-auto mb-4" />
                    <p className="text-white/60 text-sm">Since</p>
                    <p className="text-white text-4xl font-bold">2023</p>
                    <p className="text-white/60 text-sm mt-1">Dibrugarh, Assam</p>
                  </div>
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -top-3 -right-3 bg-accent-orange text-white rounded-xl px-3 py-1.5 shadow-lg"
                  >
                    <p className="text-xs font-bold">Growing Fast!</p>
                  </motion.div>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Vision & Values */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-brand mb-2">Our Vision & Values</h2>
              <p className="text-slate-500 text-sm max-w-xl mx-auto">
                Everything we do is guided by these core principles
              </p>
            </div>
          </FadeInSection>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {values.map((item, i) => (
              <FadeInSection key={item.title} delay={i * 0.1}>
                <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                  <Card className={`p-6 rounded-2xl border ${item.borderColor} bg-white h-full shadow-sm hover:shadow-md transition-shadow`}>
                    <div className={`size-12 rounded-xl ${item.color} flex items-center justify-center mb-4`}>
                      <item.icon className="size-6" />
                    </div>
                    <h3 className="text-lg font-bold text-brand mb-2">{item.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>
                  </Card>
                </motion.div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Shani Finserve Partnership */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 md:p-10">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-shrink-0">
                    <div className="size-20 md:size-24 bg-gradient-to-br from-[#0a1628] to-[#1a2a4a] rounded-2xl flex items-center justify-center">
                      <Handshake className="size-10 md:size-12 text-accent-orange" />
                    </div>
                  </div>
                  <div className="text-center md:text-left flex-1">
                    <Badge className="bg-orange-50 text-orange-600 border-orange-200 mb-3">
                      <Star className="size-3 mr-1" />
                      Official Partner
                    </Badge>
                    <h2 className="text-2xl md:text-3xl font-bold text-brand mb-3">
                      Shani Finserve Partnership
                    </h2>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      We&apos;ve partnered with Shani Finserve to make car ownership even more accessible. 
                      Through this partnership, MeriPehli Gadi customers get exclusive access to:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      {[
                        'Competitive car loan interest rates',
                        'Quick loan approval in 24 hours',
                        'Comprehensive car insurance plans',
                        'Minimal documentation process',
                        'Flexible EMI options',
                        'Zero down payment on select models',
                      ].map((item) => (
                        <div key={item} className="flex items-center gap-2">
                          <CheckCircle2 className="size-4 text-emerald-500 flex-shrink-0" />
                          <span className="text-sm text-slate-600">{item}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm font-semibold text-brand">
                      Finance and insurance support by Shani Finserve
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 md:py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-brand mb-2">Meet Our Team</h2>
              <p className="text-slate-500 text-sm max-w-xl mx-auto">
                The passionate people behind MeriPehli Gadi
              </p>
            </div>
          </FadeInSection>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {team.map((member, i) => (
              <FadeInSection key={member.name} delay={i * 0.1}>
                <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                  <Card className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow text-center h-full">
                    <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center`}>
                      <Users className="size-10 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-brand">{member.name}</h3>
                    <p className="text-accent-orange text-sm font-medium mb-2">{member.role}</p>
                    <p className="text-slate-500 text-sm leading-relaxed">{member.description}</p>
                  </Card>
                </motion.div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-[#0a1628] via-[#1a2a4a] to-[#0a1628]">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-10">
              Our Impact in Numbers
            </h2>
          </FadeInSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map((stat, i) => (
              <FadeInSection key={stat.label} delay={i * 0.1}>
                <div className="text-center">
                  <div className="size-14 mx-auto mb-3 rounded-full bg-white/10 flex items-center justify-center">
                    <stat.icon className="size-7 text-accent-orange" />
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <FadeInSection>
            <div className="max-w-2xl mx-auto text-center">
              <HeartHandshake className="size-12 text-accent-orange mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold text-brand mb-3">
                Get in Touch with Us
              </h2>
              <p className="text-slate-500 text-sm mb-6">
                Have questions? Want to know more about our services? We&apos;d love to hear from you.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button
                  size="lg"
                  onClick={() => navigateTo('contact')}
                  className="bg-brand hover:bg-brand-light text-white font-semibold rounded-xl px-8 h-11"
                >
                  <Mail className="size-4 mr-2" />
                  Contact Us
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigateTo('faq')}
                  className="rounded-xl px-8 h-11 border-slate-200 text-brand"
                >
                  <MessageCircle className="size-4 mr-2" />
                  View FAQs
                </Button>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>
    </div>
  )
}

// ─── Privacy Policy Page ────────────────────────────────────────────

function PrivacyPolicyPage() {
  const navigateTo = useAppStore((s) => s.navigateTo)

  const sections = [
    {
      title: 'Information We Collect',
      content: [
        'Personal Information: When you create an account, list a car, or contact us, we may collect your name, email address, phone number, and address.',
        'Vehicle Information: Details about cars you list or inquire about, including make, model, year, registration number, and images.',
        'Usage Data: We collect information about how you use our platform, including pages visited, search queries, and interaction patterns.',
        'Device Information: Your IP address, browser type, operating system, and device identifiers for security and analytics purposes.',
      ],
    },
    {
      title: 'How We Use Your Information',
      content: [
        'To provide and maintain our car marketplace services.',
        'To process your inquiries, car listings, and transactions.',
        'To connect you with dealers, sellers, and buyers.',
        'To send you notifications about your listings, messages, and account activity.',
        'To improve our platform and develop new features.',
        'To comply with legal obligations and protect against fraud.',
      ],
    },
    {
      title: 'Data Sharing',
      content: [
        'We share your information with car dealers and potential buyers/sellers as necessary to facilitate transactions on our platform.',
        'We may share data with Shani Finserve for finance and insurance services if you opt-in.',
        'We use third-party analytics services to improve user experience, but data is anonymized.',
        'We may disclose information if required by law or to protect our rights and safety.',
      ],
    },
    {
      title: 'Your Rights',
      content: [
        'Access: You can request a copy of the personal data we hold about you.',
        'Correction: You can update or correct your personal information at any time.',
        'Deletion: You can request deletion of your account and associated data.',
        'Opt-out: You can opt out of marketing communications at any time.',
        'Data Portability: You can request your data in a portable format.',
      ],
    },
    {
      title: 'Data Security',
      content: [
        'We implement industry-standard security measures to protect your personal information.',
        'All data transmissions are encrypted using SSL/TLS protocols.',
        'We regularly review and update our security practices.',
        'While we strive to protect your data, no method of transmission over the internet is 100% secure.',
      ],
    },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0a1628] via-[#1a2a4a] to-[#0a1628] py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge className="bg-white/10 text-white border-0 mb-4 text-xs">Legal</Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Privacy Policy</h1>
            <p className="text-slate-400 text-sm">Last updated: January 2025</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <FadeInSection>
              <p className="text-slate-600 text-sm leading-relaxed mb-8">
                At MeriPehli Gadi, we take your privacy seriously. This Privacy Policy explains how we collect, 
                use, disclose, and safeguard your information when you visit our platform or use our services. 
                Please read this policy carefully to understand our practices regarding your personal data.
              </p>
            </FadeInSection>

            {sections.map((section, i) => (
              <FadeInSection key={section.title} delay={i * 0.05}>
                <div className="mb-8">
                  <h2 className="text-lg md:text-xl font-bold text-brand mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-brand">{i + 1}</span>
                    </div>
                    {section.title}
                  </h2>
                  <ul className="space-y-2 ml-10">
                    {section.content.map((item, j) => (
                      <li key={j} className="text-slate-600 text-sm leading-relaxed flex items-start gap-2">
                        <span className="text-accent-orange mt-1.5 flex-shrink-0">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <Separator className="my-6 bg-slate-100" />
              </FadeInSection>
            ))}

            <FadeInSection>
              <div className="bg-slate-50 rounded-xl p-6 mt-6">
                <h3 className="font-semibold text-brand mb-2">Contact Us About Privacy</h3>
                <p className="text-slate-600 text-sm mb-4">
                  If you have any questions about this Privacy Policy, please contact us at{' '}
                  <a href="mailto:info@meripehligadi.com" className="text-accent-blue hover:underline">
                    info@meripehligadi.com
                  </a>
                  {' '}or call us at{' '}
                  <a href="tel:08721932757" className="text-accent-blue hover:underline">
                    087219 32757
                  </a>.
                </p>
                <Button
                  variant="outline"
                  onClick={() => navigateTo('contact')}
                  className="rounded-lg text-sm"
                >
                  <MessageCircle className="size-4 mr-2" />
                  Contact Support
                </Button>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>
    </div>
  )
}

// ─── Terms & Conditions Page ────────────────────────────────────────

function TermsPage() {
  const navigateTo = useAppStore((s) => s.navigateTo)

  const sections = [
    {
      title: 'Acceptance of Terms',
      content: 'By accessing and using MeriPehli Gadi\'s platform (website and mobile interfaces), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services. These terms apply to all users, including visitors, buyers, sellers, and dealers.',
    },
    {
      title: 'User Accounts',
      content: 'To access certain features, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate and complete information during registration. You must be at least 18 years old to create an account.',
    },
    {
      title: 'Car Listings',
      content: 'All car listings on MeriPehli Gadi are provided by third-party sellers and dealers. While we strive to ensure accuracy, we do not guarantee the completeness or reliability of listing information. Users are encouraged to independently verify all vehicle details, including condition, ownership, and documentation, before making a purchase decision.',
    },
    {
      title: 'Transactions',
      content: 'MeriPehli Gadi serves as a marketplace connecting buyers and sellers. We facilitate the transaction process but are not a party to the sale agreement between buyers and sellers. Final purchase agreements are between the buyer and seller. We recommend using secure payment methods and proper documentation for all transactions.',
    },
    {
      title: 'Finance and Insurance',
      content: 'Car finance and insurance services are provided by our partner Shani Finserve. Approval of loans and insurance policies is subject to Shani Finserve\'s terms, conditions, and eligibility criteria. MeriPehli Gadi is not responsible for any decisions made by Shani Finserve regarding loan or insurance applications.',
    },
    {
      title: 'Prohibited Activities',
      content: 'Users are prohibited from posting fraudulent or misleading car listings, using the platform for illegal activities, attempting to manipulate pricing or reviews, creating multiple accounts for fraudulent purposes, and violating any applicable laws or regulations while using the platform.',
    },
    {
      title: 'Limitation of Liability',
      content: 'MeriPehli Gadi shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform. Our total liability shall not exceed the fees paid by you to us in the twelve months preceding the claim, if any.',
    },
    {
      title: 'Modifications',
      content: 'We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the platform after changes constitutes acceptance of the modified terms. We will notify users of significant changes through email or platform notifications.',
    },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0a1628] via-[#1a2a4a] to-[#0a1628] py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge className="bg-white/10 text-white border-0 mb-4 text-xs">Legal</Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Terms & Conditions</h1>
            <p className="text-slate-400 text-sm">Last updated: January 2025</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <FadeInSection>
              <p className="text-slate-600 text-sm leading-relaxed mb-8">
                These Terms and Conditions govern your use of MeriPehli Gadi&apos;s platform and services. 
                Please read them carefully before using our website or mobile application.
              </p>
            </FadeInSection>

            {sections.map((section, i) => (
              <FadeInSection key={section.title} delay={i * 0.05}>
                <div className="mb-6">
                  <h2 className="text-lg md:text-xl font-bold text-brand mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-brand">{i + 1}</span>
                    </div>
                    {section.title}
                  </h2>
                  <p className="text-slate-600 text-sm leading-relaxed ml-10">{section.content}</p>
                </div>
                <Separator className="my-4 bg-slate-100" />
              </FadeInSection>
            ))}

            <FadeInSection>
              <div className="bg-slate-50 rounded-xl p-6 mt-6">
                <h3 className="font-semibold text-brand mb-2">Questions About Our Terms?</h3>
                <p className="text-slate-600 text-sm mb-4">
                  For any questions regarding these terms, please reach out to our support team.
                </p>
                <Button
                  variant="outline"
                  onClick={() => navigateTo('contact')}
                  className="rounded-lg text-sm"
                >
                  <Phone className="size-4 mr-2" />
                  Contact Support
                </Button>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>
    </div>
  )
}

// ─── Refund Policy Page ─────────────────────────────────────────────

function RefundPolicyPage() {
  const navigateTo = useAppStore((s) => s.navigateTo)

  const sections = [
    {
      title: 'Certified Car Return Policy',
      content: 'Cars purchased through our Certified Pre-Owned program come with a 7-day return window. If you are not satisfied with your certified car purchase for any reason, you may initiate a return within 7 days of delivery for a full refund, subject to the conditions below.',
      highlight: true,
    },
    {
      title: 'Return Conditions',
      content: [
        'The car must be returned in the same condition as delivered, with no additional damage beyond normal test-driving wear.',
        'All original documents, accessories, and keys must be returned with the vehicle.',
        'The car must not have been driven more than 200 km since delivery.',
        'No modifications or alterations should have been made to the vehicle.',
        'The return request must be initiated within the 7-day window through our support team.',
      ],
    },
    {
      title: 'Refund Process',
      content: [
        'Once your return request is approved, our team will inspect the vehicle within 2 business days.',
        'After a successful inspection, the refund will be processed within 7-10 business days.',
        'Refunds will be issued to the original payment method used for the purchase.',
        'Shipping or transportation costs for return are the buyer\'s responsibility unless the car had undisclosed defects.',
        'If finance was used, the loan will be cancelled and any payments made will be refunded to the financing partner.',
      ],
    },
    {
      title: 'Non-Returnable Items',
      content: 'Returns are not applicable for: Cars purchased from private sellers through the marketplace (non-certified listings), vehicles with custom modifications made after purchase, cars with damage caused by the buyer, and transactions completed more than 7 days ago.',
    },
    {
      title: 'Disputed Transactions',
      content: 'If you believe there has been a misrepresentation in a car listing (undisclosed defects, incorrect specifications, etc.), please contact our support team within 7 days of delivery with supporting evidence. We will investigate the matter and work towards a fair resolution, which may include a partial refund, full refund, or car exchange.',
    },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0a1628] via-[#1a2a4a] to-[#0a1628] py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge className="bg-white/10 text-white border-0 mb-4 text-xs">Legal</Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Refund Policy</h1>
            <p className="text-slate-400 text-sm">Last updated: January 2025</p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <FadeInSection>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-8 flex items-start gap-3">
                <Shield className="size-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-emerald-800 mb-1">Certified Pre-Owned Guarantee</p>
                  <p className="text-sm text-emerald-700">
                    All certified cars come with a 7-day return policy and 6-month warranty for your peace of mind.
                  </p>
                </div>
              </div>
            </FadeInSection>

            {sections.map((section, i) => (
              <FadeInSection key={section.title} delay={i * 0.05}>
                <div className="mb-8">
                  <h2 className={`text-lg md:text-xl font-bold mb-3 flex items-center gap-2 ${section.highlight ? 'text-emerald-700' : 'text-brand'}`}>
                    <div className={`w-8 h-8 rounded-lg ${section.highlight ? 'bg-emerald-100' : 'bg-brand/10'} flex items-center justify-center`}>
                      <CheckCircle2 className={`size-4 ${section.highlight ? 'text-emerald-600' : 'text-brand'}`} />
                    </div>
                    {section.title}
                  </h2>
                  {Array.isArray(section.content) ? (
                    <ul className="space-y-2 ml-10">
                      {section.content.map((item, j) => (
                        <li key={j} className="text-slate-600 text-sm leading-relaxed flex items-start gap-2">
                          <span className="text-accent-orange mt-1.5 flex-shrink-0">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-600 text-sm leading-relaxed ml-10">{section.content}</p>
                  )}
                </div>
                <Separator className="my-4 bg-slate-100" />
              </FadeInSection>
            ))}

            <FadeInSection>
              <div className="bg-slate-50 rounded-xl p-6 mt-6">
                <h3 className="font-semibold text-brand mb-2">Need Help with a Return?</h3>
                <p className="text-slate-600 text-sm mb-4">
                  Our support team is here to help you with any return or refund queries.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    onClick={() => navigateTo('contact')}
                    className="rounded-lg text-sm"
                  >
                    <Phone className="size-4 mr-2" />
                    Contact Support
                  </Button>
                  <a
                    href="https://wa.me/918721932757"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50 transition-colors"
                  >
                    <MessageCircle className="size-4" />
                    WhatsApp Us
                  </a>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>
    </div>
  )
}

// ─── Main Export ────────────────────────────────────────────────────

export function AboutPage() {
  const currentPage = useAppStore((s) => s.currentPage)

  switch (currentPage) {
    case 'privacy-policy':
      return <PrivacyPolicyPage />
    case 'terms':
      return <TermsPage />
    case 'refund-policy':
      return <RefundPolicyPage />
    default:
      return <AboutMainPage />
  }
}
