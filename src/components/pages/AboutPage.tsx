'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Heart, Shield, Eye, Users, Car, MapPin, Building2, Award,
  Target, Lightbulb, ArrowUpRight, CheckCircle2, Star
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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

// ─── Privacy Policy Content ─────────────────────────────────────────

function PrivacyPolicyContent() {
  return (
    <div className="prose prose-slate max-w-none">
      <h2 className="text-2xl font-bold text-brand mb-4">Privacy Policy</h2>
      <p className="text-sm text-slate-500 mb-6">Last updated: January 2025</p>

      <section className="mb-8">
        <h3 className="text-lg font-bold text-brand mb-3">1. Information We Collect</h3>
        <p className="text-sm text-slate-600 leading-relaxed mb-3">
          At MeriPehli Gadi, we collect information you provide directly to us, including your name, email address, phone number, location, and other details when you create an account, list a car, inquire about a vehicle, or use our services.
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">
          We also collect certain information automatically, including your IP address, browser type, device information, pages visited, and time spent on our platform.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-bold text-brand mb-3">2. How We Use Your Information</h3>
        <ul className="text-sm text-slate-600 leading-relaxed space-y-2 list-disc pl-5">
          <li>To provide and maintain our car listing and discovery services</li>
          <li>To process your inquiries and connect you with buyers/sellers</li>
          <li>To send you notifications about your listings and messages</li>
          <li>To provide customer support and respond to your requests</li>
          <li>To improve our platform and develop new features</li>
          <li>To communicate with you about updates and promotions (with your consent)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-bold text-brand mb-3">3. Information Sharing</h3>
        <p className="text-sm text-slate-600 leading-relaxed mb-3">
          We do not sell, trade, or rent your personal information to third parties. We may share your information with:
        </p>
        <ul className="text-sm text-slate-600 leading-relaxed space-y-2 list-disc pl-5">
          <li>Other users when you respond to their inquiries or listings</li>
          <li>Service providers who assist in operating our platform</li>
          <li>Law enforcement when required by law</li>
          <li>Business partners (like Shani Finserve) only with your explicit consent</li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-bold text-brand mb-3">4. Data Security</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          We implement industry-standard security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security of your data.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-bold text-brand mb-3">5. Your Rights</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          You have the right to access, correct, or delete your personal information at any time. You can manage your data through your account settings or contact us at privacy@meripehligadi.com.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-bold text-brand mb-3">6. Cookies</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          We use cookies and similar tracking technologies to enhance your experience on our platform. You can control cookie preferences through your browser settings.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-bold text-brand mb-3">7. Contact Us</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          If you have any questions about this Privacy Policy, please contact us at privacy@meripehligadi.com or call us at +91 98765 43210.
        </p>
      </section>
    </div>
  )
}

// ─── Terms Content ──────────────────────────────────────────────────

function TermsContent() {
  return (
    <div className="prose prose-slate max-w-none">
      <h2 className="text-2xl font-bold text-brand mb-4">Terms of Service</h2>
      <p className="text-sm text-slate-500 mb-6">Last updated: January 2025</p>

      <section className="mb-8">
        <h3 className="text-lg font-bold text-brand mb-3">1. Acceptance of Terms</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          By accessing or using MeriPehli Gadi, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-bold text-brand mb-3">2. User Accounts</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          To access certain features, you may need to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-bold text-brand mb-3">3. Listings & Transactions</h3>
        <ul className="text-sm text-slate-600 leading-relaxed space-y-2 list-disc pl-5">
          <li>All car listings must be accurate and represent the actual vehicle condition</li>
          <li>Users must not list stolen, illegal, or misrepresented vehicles</li>
          <li>MeriPehli Gadi acts as a platform and is not a party to any transaction between buyers and sellers</li>
          <li>Users are responsible for verifying vehicle details before completing a transaction</li>
          <li>All financial transactions are the responsibility of the parties involved</li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-bold text-brand mb-3">4. Prohibited Activities</h3>
        <ul className="text-sm text-slate-600 leading-relaxed space-y-2 list-disc pl-5">
          <li>Posting false, misleading, or fraudulent listings</li>
          <li>Using the platform for spam, harassment, or illegal activities</li>
          <li>Attempting to gain unauthorized access to other users&apos; accounts</li>
          <li>Copying or scraping content from the platform without permission</li>
          <li>Circumventing any security measures or restrictions</li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-bold text-brand mb-3">5. Intellectual Property</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          All content, design, logos, and software on MeriPehli Gadi are the property of MeriPehli Gadi and are protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our express permission.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-bold text-brand mb-3">6. Limitation of Liability</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          MeriPehli Gadi provides the platform &quot;as is&quot; without any warranties. We are not liable for any damages arising from the use of our platform, including but not limited to any financial losses from transactions between users.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-bold text-brand mb-3">7. Modifications</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          We reserve the right to modify these terms at any time. Continued use of the platform after modifications constitutes acceptance of the updated terms.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-bold text-brand mb-3">8. Contact</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          For questions about these Terms, contact us at legal@meripehligadi.com.
        </p>
      </section>
    </div>
  )
}

// ─── Refund Policy Content ──────────────────────────────────────────

function RefundPolicyContent() {
  return (
    <div className="prose prose-slate max-w-none">
      <h2 className="text-2xl font-bold text-brand mb-4">Refund Policy</h2>
      <p className="text-sm text-slate-500 mb-6">Last updated: January 2025</p>

      <section className="mb-8">
        <h3 className="text-lg font-bold text-brand mb-3">1. General Refund Policy</h3>
        <p className="text-sm text-slate-600 leading-relaxed mb-3">
          MeriPehli Gadi is a platform connecting car buyers and sellers. Since transactions happen directly between users, refund policies are determined by the individual sellers and the nature of the transaction.
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">
          We recommend buyers thoroughly inspect vehicles and clarify all terms before making any payments.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-bold text-brand mb-3">2. Featured Listing Refunds</h3>
        <p className="text-sm text-slate-600 leading-relaxed mb-3">
          If you have purchased a featured listing or promotional service from MeriPehli Gadi:
        </p>
        <ul className="text-sm text-slate-600 leading-relaxed space-y-2 list-disc pl-5">
          <li>Refund requests must be made within 7 days of purchase</li>
          <li>If the service has not been delivered, a full refund will be issued</li>
          <li>If the service has been partially delivered, a proportional refund may be issued</li>
          <li>Refunds will be processed within 10-15 business days</li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-bold text-brand mb-3">3. Finance & Insurance Services</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          Finance and insurance services are provided by our partner Shani Finserve. Any refund requests related to these services should be directed to Shani Finserve&apos;s customer support team.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-bold text-brand mb-3">4. How to Request a Refund</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          To request a refund, please contact us at support@meripehligadi.com with your order details and reason for the refund. Our team will review your request and respond within 48 hours.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-bold text-brand mb-3">5. Dispute Resolution</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          In case of disputes between buyers and sellers, we encourage both parties to communicate and resolve the issue amicably. MeriPehli Gadi can act as a mediator but is not legally bound to resolve third-party disputes.
        </p>
      </section>
    </div>
  )
}

// ─── Main AboutPage Component ───────────────────────────────────────

export function AboutPage() {
  const { currentPage } = useAppStore()

  const isPolicy = ['privacy-policy', 'terms', 'refund-policy'].includes(currentPage)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {!isPolicy ? (
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
                  <Heart className="size-3.5 mr-1.5" />
                  Our Story
                </Badge>
                <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
                  About <span className="text-sky-300">MeriPehli Gadi</span>
                </h1>
                <p className="text-white/90 text-lg md:text-xl">
                  Northeast India&apos;s most trusted platform for buying and selling cars. Built with love in Assam.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      ) : (
        <section className="relative bg-gradient-to-br from-slate-700 via-slate-600 to-slate-500 py-12 md:py-16 px-4">
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-2xl md:text-4xl font-extrabold text-white mb-3">
                  {currentPage === 'privacy-policy' && 'Privacy Policy'}
                  {currentPage === 'terms' && 'Terms of Service'}
                  {currentPage === 'refund-policy' && 'Refund Policy'}
                </h1>
                <p className="text-white/70 text-sm">
                  Please read these carefully before using our platform
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      {!isPolicy ? (
        <>
          {/* Our Story Section */}
          <section className="py-12 md:py-16 px-4">
            <div className="max-w-4xl mx-auto">
              <FadeInSection>
                <div className="text-center mb-10">
                  <h2 className="text-2xl md:text-3xl font-bold text-brand mb-3">Our Story</h2>
                </div>
              </FadeInSection>

              <FadeInSection delay={0.1}>
                <div className="space-y-4 text-slate-600 leading-relaxed">
                  <p>
                    MeriPehli Gadi was born from a simple idea: making it easy for people in Northeast India to buy and sell cars with trust and transparency. Founded in Dibrugarh, Assam, we noticed that the car buying and selling experience in the region was fragmented, unreliable, and often frustrating.
                  </p>
                  <p>
                    We set out to change that. What started as a small local platform has grown into Northeast India&apos;s most trusted car marketplace, connecting thousands of buyers with genuine sellers across Assam and beyond.
                  </p>
                  <p>
                    Our mission is simple — to make every car purchase a &quot;Meri Pehli Gadi&quot; moment. Whether it&apos;s your first car or your fifth, we want the experience to be memorable, transparent, and hassle-free.
                  </p>
                  <p>
                    Today, we work with 100+ verified dealers, serve customers across 50+ cities, and have facilitated over 500+ successful car sales. And we&apos;re just getting started.
                  </p>
                </div>
              </FadeInSection>
            </div>
          </section>

          {/* Vision & Values Section */}
          <section className="py-12 md:py-16 px-4 bg-slate-50/50">
            <div className="max-w-6xl mx-auto">
              <FadeInSection>
                <div className="text-center mb-10">
                  <h2 className="text-2xl md:text-3xl font-bold text-brand mb-3">Our Vision & Values</h2>
                  <p className="text-slate-500 max-w-lg mx-auto">
                    These core values guide everything we do at MeriPehli Gadi
                  </p>
                </div>
              </FadeInSection>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    icon: Shield,
                    title: 'Trust',
                    desc: 'We verify every listing and dealer to ensure you get genuine, reliable information. Your trust is our most valuable asset.',
                    color: 'bg-blue-100 text-blue-600',
                  },
                  {
                    icon: Eye,
                    title: 'Transparency',
                    desc: 'No hidden charges, no misleading information. We believe in complete honesty in every transaction and interaction.',
                    color: 'bg-emerald-100 text-emerald-600',
                  },
                  {
                    icon: MapPin,
                    title: 'Local Support',
                    desc: 'We are from Northeast India, for Northeast India. Our team understands the local market, culture, and needs.',
                    color: 'bg-orange-100 text-orange-600',
                  },
                ].map((item, i) => (
                  <FadeInSection key={item.title} delay={i * 0.1}>
                    <Card className="p-6 rounded-2xl border-slate-200/60 hover:shadow-lg transition-all duration-300 text-center group">
                      <div className={`size-16 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                        <item.icon className="size-8" />
                      </div>
                      <h3 className="font-bold text-brand text-lg mb-3">{item.title}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                    </Card>
                  </FadeInSection>
                ))}
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-12 md:py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <FadeInSection>
                <div className="bg-gradient-to-r from-brand to-brand-light rounded-2xl p-8 md:p-12">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                      { value: '500+', label: 'Cars Sold', icon: Car },
                      { value: '100+', label: 'Verified Dealers', icon: Building2 },
                      { value: '50+', label: 'Cities Covered', icon: MapPin },
                      { value: '10K+', label: 'Happy Customers', icon: Users },
                    ].map((stat) => (
                      <div key={stat.label} className="text-center">
                        <stat.icon className="size-8 text-sky-300 mx-auto mb-2" />
                        <p className="text-3xl md:text-4xl font-extrabold text-white mb-1">{stat.value}</p>
                        <p className="text-white/70 text-sm">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeInSection>
            </div>
          </section>

          {/* Team Section */}
          <section className="py-12 md:py-16 px-4 bg-slate-50/50">
            <div className="max-w-6xl mx-auto">
              <FadeInSection>
                <div className="text-center mb-10">
                  <h2 className="text-2xl md:text-3xl font-bold text-brand mb-3">Meet Our Team</h2>
                  <p className="text-slate-500 max-w-lg mx-auto">
                    The passionate people behind MeriPehli Gadi
                  </p>
                </div>
              </FadeInSection>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { name: 'Rahul Sharma', role: 'Founder & CEO', initials: 'RS' },
                  { name: 'Priya Dutta', role: 'COO', initials: 'PD' },
                  { name: 'Amit Baruah', role: 'CTO', initials: 'AB' },
                  { name: 'Neha Gogoi', role: 'Head of Sales', initials: 'NG' },
                ].map((member, i) => (
                  <FadeInSection key={member.name} delay={i * 0.1}>
                    <Card className="p-6 rounded-2xl border-slate-200/60 hover:shadow-lg transition-all duration-300 text-center group">
                      <div className="size-20 bg-gradient-to-br from-brand to-brand-light rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <span className="text-xl font-bold text-white">{member.initials}</span>
                      </div>
                      <h3 className="font-bold text-brand">{member.name}</h3>
                      <p className="text-sm text-slate-500">{member.role}</p>
                    </Card>
                  </FadeInSection>
                ))}
              </div>
            </div>
          </section>

          {/* Shani Finserve Partnership Section */}
          <section className="py-12 md:py-16 px-4">
            <div className="max-w-4xl mx-auto">
              <FadeInSection>
                <Card className="p-8 md:p-12 rounded-2xl border-slate-200/60">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="size-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shrink-0">
                      <Award className="size-10 text-white" />
                    </div>
                    <div>
                      <Badge className="bg-amber-100 text-amber-700 border-amber-200 mb-3">
                        Official Partnership
                      </Badge>
                      <h3 className="text-xl md:text-2xl font-bold text-brand mb-3">
                        In Partnership with Shani Finserve
                      </h3>
                      <p className="text-slate-500 leading-relaxed mb-4">
                        MeriPehli Gadi has partnered with Shani Finserve to offer hassle-free car finance and insurance solutions to our customers. Together, we provide end-to-end support from finding your dream car to financing and protecting it.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <Button
                          onClick={() => useAppStore.getState().navigateTo('finance')}
                          className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl"
                        >
                          Explore Finance <ArrowUpRight className="size-4 ml-1" />
                        </Button>
                        <Button
                          onClick={() => useAppStore.getState().navigateTo('insurance')}
                          variant="outline"
                          className="rounded-xl"
                        >
                          Get Insurance <ArrowUpRight className="size-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </FadeInSection>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-12 md:py-16 px-4 bg-slate-50/50">
            <div className="max-w-4xl mx-auto">
              <FadeInSection>
                <Card className="p-8 md:p-12 rounded-2xl bg-gradient-to-r from-accent-orange to-orange-400 text-white text-center">
                  <h2 className="text-2xl md:text-3xl font-bold mb-3">
                    Join the MeriPehli Gadi Family
                  </h2>
                  <p className="text-white/80 mb-6 max-w-lg mx-auto">
                    Whether you&apos;re buying your first car or selling one, we&apos;re here to make the experience amazing.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={() => useAppStore.getState().navigateTo('used-cars')}
                      className="bg-white text-accent-orange hover:bg-slate-100 rounded-xl h-12 px-8 text-base font-semibold"
                    >
                      Browse Cars
                      <ArrowUpRight className="size-4 ml-2" />
                    </Button>
                    <Button
                      onClick={() => useAppStore.getState().navigateTo('contact')}
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10 rounded-xl h-12 px-8 text-base font-semibold"
                    >
                      Contact Us
                    </Button>
                  </div>
                </Card>
              </FadeInSection>
            </div>
          </section>
        </>
      ) : (
        /* Policy Content Section */
        <section className="py-12 md:py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <FadeInSection>
              <Card className="p-6 md:p-10 rounded-2xl border-slate-200/60">
                {currentPage === 'privacy-policy' && <PrivacyPolicyContent />}
                {currentPage === 'terms' && <TermsContent />}
                {currentPage === 'refund-policy' && <RefundPolicyContent />}
              </Card>
            </FadeInSection>

            <FadeInSection delay={0.1}>
              <div className="mt-6 text-center">
                <Button
                  onClick={() => useAppStore.getState().navigateTo('about')}
                  variant="outline"
                  className="rounded-xl"
                >
                  Back to About Us
                </Button>
              </div>
            </FadeInSection>
          </div>
        </section>
      )}
    </div>
  )
}
