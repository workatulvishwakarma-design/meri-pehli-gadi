'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import {
  LayoutDashboard, Car, Tag, MapPin, Store, Users, ClipboardList,
  DollarSign, Shield, Handshake, CalendarCheck, FileText, HelpCircle,
  Quote, Image as ImageIcon, Settings, Menu, LogOut, BarChart3,
  UserCheck, ChevronLeft,
} from 'lucide-react'
import { hasPermission, getVisibleSections, type Permission } from '@/lib/permissions'

// Lazy load admin modules
import dynamic from 'next/dynamic'
const DashboardOverview = dynamic(() => import('./DashboardOverview'))
const CarManagement = dynamic(() => import('./CarManagement'))
const LeadCRM = dynamic(() => import('./LeadCRM'))
const InsuranceModule = dynamic(() => import('./InsuranceModule'))
const FinanceModule = dynamic(() => import('./FinanceModule'))
const CustomerManagement = dynamic(() => import('./CustomerManagement'))
const AnalyticsCharts = dynamic(() => import('./AnalyticsCharts'))

// ─── Types ──────────────────────────────────────────────────────────────
interface AuthUser {
  id: string
  email: string
  name: string | null
  phone: string | null
  avatar: string | null
  role: string
  city?: { id: string; name: string; slug: string }
}

// ─── Helpers ────────────────────────────────────────────────────────────
const API = '/api'
export function authHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('meripehli-token') : null
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
}

export function formatPrice(n: number) {
  return '₹' + (n >= 100000 ? (n / 100000).toFixed(1) + ' L' : n.toLocaleString('en-IN'))
}

export function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function statusColor(s: string) {
  const map: Record<string, string> = {
    ACTIVE: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    DRAFT: 'bg-slate-100 text-slate-600 border-slate-200',
    SOLD: 'bg-blue-100 text-blue-700 border-blue-200',
    PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
    FEATURED: 'bg-purple-100 text-purple-700 border-purple-200',
    NEW: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    CONTACTED: 'bg-blue-100 text-blue-700 border-blue-200',
    QUALIFIED: 'bg-amber-100 text-amber-700 border-amber-200',
    CONVERTED: 'bg-green-100 text-green-700 border-green-200',
    LOST: 'bg-red-100 text-red-700 border-red-200',
    PUBLISHED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    ARCHIVED: 'bg-slate-100 text-slate-600 border-slate-200',
  }
  return map[s] || 'bg-slate-100 text-slate-600'
}

export function leadTypeColor(t: string) {
  const map: Record<string, string> = {
    CONTACT: 'bg-slate-100 text-slate-700',
    TEST_DRIVE: 'bg-violet-100 text-violet-700',
    FINANCE: 'bg-emerald-100 text-emerald-700',
    INSURANCE: 'bg-sky-100 text-sky-700',
    SELL_CAR: 'bg-amber-100 text-amber-700',
    VALUATION: 'bg-rose-100 text-rose-700',
    MAKE_OFFER: 'bg-orange-100 text-orange-700',
    DEALER_INQUIRY: 'bg-indigo-100 text-indigo-700',
  }
  return map[t] || 'bg-slate-100 text-slate-700'
}

// ─── Sidebar Config ─────────────────────────────────────────────────────
type Section =
  | 'dashboard' | 'cars' | 'brands' | 'cities' | 'dealers' | 'users'
  | 'leads' | 'finance-leads' | 'insurance-leads' | 'sell-car-leads' | 'test-drive-leads'
  | 'customers' | 'analytics'
  | 'blogs' | 'faqs' | 'testimonials' | 'banners' | 'settings'

interface SidebarItem { id: Section; label: string; icon: React.ReactNode }

const sidebarGroups: { title: string; items: SidebarItem[] }[] = [
  {
    title: 'MAIN',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
      { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
      { id: 'cars', label: 'Cars', icon: <Car size={18} /> },
      { id: 'dealers', label: 'Dealers', icon: <Store size={18} /> },
      { id: 'users', label: 'Users', icon: <Users size={18} /> },
      { id: 'customers', label: 'Customers', icon: <UserCheck size={18} /> },
    ],
  },
  {
    title: 'CRM',
    items: [
      { id: 'leads', label: 'All Leads', icon: <ClipboardList size={18} /> },
      { id: 'finance-leads', label: 'Finance', icon: <DollarSign size={18} /> },
      { id: 'insurance-leads', label: 'Insurance', icon: <Shield size={18} /> },
      { id: 'sell-car-leads', label: 'Sell Car', icon: <Handshake size={18} /> },
      { id: 'test-drive-leads', label: 'Test Drive', icon: <CalendarCheck size={18} /> },
    ],
  },
  {
    title: 'CONTENT',
    items: [
      { id: 'blogs', label: 'Blogs', icon: <FileText size={18} /> },
      { id: 'faqs', label: 'FAQs', icon: <HelpCircle size={18} /> },
      { id: 'testimonials', label: 'Testimonials', icon: <Quote size={18} /> },
      { id: 'banners', label: 'Banners', icon: <ImageIcon size={18} /> },
    ],
  },
  {
    title: 'SETTINGS',
    items: [
      { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════
// ADMIN LAYOUT
// ═══════════════════════════════════════════════════════════════════════
export default function AdminLayout() {
  const { setShowAuthModal, navigateTo } = useAppStore()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState<Section>('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Auth check
  useEffect(() => {
    let mounted = true
    const token = localStorage.getItem('meripehli-token')
    if (!token) {
      const id = setTimeout(() => { if (mounted) setLoading(false) }, 0)
      return () => { mounted = false; clearTimeout(id) }
    }
    fetch(`${API}/auth/me`, { headers: authHeaders() })
      .then(r => r.json())
      .then(data => { if (mounted && data.user) setUser(data.user) })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('meripehli-token')
    setUser(null)
    navigateTo('home')
  }

  // Auth guards
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-500">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="p-8 text-center max-w-sm">
          <LogOut size={40} className="mx-auto mb-4 text-slate-400" />
          <h2 className="text-xl font-semibold mb-2">Admin Access Required</h2>
          <p className="text-slate-500 mb-4">Please login to access the admin dashboard.</p>
          <Button onClick={() => setShowAuthModal(true)}>Please Login</Button>
        </Card>
      </div>
    )
  }

  if (!['SUPER_ADMIN', 'ADMIN', 'AGENT', 'DEALER', 'FINANCE_EXECUTIVE', 'INSURANCE_EXECUTIVE', 'CONTENT_MANAGER'].includes(user?.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="p-8 text-center max-w-sm">
          <Shield size={40} className="mx-auto mb-4 text-red-400" />
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-slate-500">You don&apos;t have permission to access this page.</p>
        </Card>
      </div>
    )
  }

  // Filter sidebar based on role permissions
  const visibleSections = getVisibleSections(user.role)

  const filteredSidebarGroups = sidebarGroups.map(group => ({
    ...group,
    items: group.items.filter(item => {
      // SUPER_ADMIN and ADMIN see everything
      if (['SUPER_ADMIN', 'ADMIN'].includes(user.role)) return true
      return visibleSections.includes(item.id)
    }),
  })).filter(group => group.items.length > 0)

  // Render section
  function renderSection() {
    switch (activeSection) {
      case 'dashboard': return <DashboardOverview user={user!} />
      case 'analytics': return <AnalyticsCharts />
      case 'cars': return <CarManagement user={user!} />
      case 'leads': return <LeadCRM user={user!} filterType="" />
      case 'finance-leads': return <FinanceModule user={user!} />
      case 'insurance-leads': return <InsuranceModule user={user!} />
      case 'sell-car-leads': return <LeadCRM user={user!} filterType="SELL_CAR" />
      case 'test-drive-leads': return <LeadCRM user={user!} filterType="TEST_DRIVE" />
      case 'customers': return <CustomerManagement />
      default: return <DashboardOverview user={user!} />
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-[#0a1628] text-white flex-shrink-0 transition-all duration-300 overflow-hidden fixed inset-y-0 left-0 z-50`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-14 flex items-center justify-between px-4 border-b border-white/10">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center">
                  <Car size={18} className="text-white" />
                </div>
                <div>
                  <span className="font-bold text-sm block leading-tight">MeriPehli Gadi</span>
                  <span className="text-[10px] text-slate-400">Admin Panel</span>
                </div>
              </div>
            )}
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="p-1 hover:bg-white/10 rounded">
              <ChevronLeft size={16} className={`transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 py-2">
            {filteredSidebarGroups.map((group) => (
              <div key={group.title} className="mb-2">
                {!sidebarCollapsed && (
                  <div className="px-4 py-1.5 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                    {group.title}
                  </div>
                )}
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all ${
                      activeSection === item.id
                        ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/10 text-white border-r-2 border-emerald-400'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <span className={activeSection === item.id ? 'text-emerald-400' : ''}>{item.icon}</span>
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </button>
                ))}
              </div>
            ))}
          </ScrollArea>

          {/* Bottom */}
          {!sidebarCollapsed && (
            <div className="p-3 border-t border-white/10">
              <div className="text-[10px] text-slate-500 text-center">
                Powered by Shani Finserve
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Top Bar */}
        <header className="h-14 bg-white border-b flex items-center justify-between px-4 flex-shrink-0 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8 lg:hidden" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
              <Menu size={18} />
            </Button>
            <div>
              <h2 className="text-sm font-semibold capitalize text-slate-700">
                {activeSection.replace(/-/g, ' ')}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600 hidden sm:block">
              {user?.name || user?.email}
            </span>
            <Badge variant="outline" className={`text-xs ${
              user?.role === 'SUPER_ADMIN' ? 'bg-red-50 text-red-700 border-red-200' :
              user?.role === 'ADMIN' ? 'bg-violet-50 text-violet-700 border-violet-200' :
              user?.role === 'AGENT' ? 'bg-blue-50 text-blue-700 border-blue-200' :
              'bg-slate-100 text-slate-600'
            }`}>{user?.role?.replace('_', ' ')}</Badge>
            <Button variant="outline" size="sm" onClick={handleLogout} className="text-red-500 hover:text-red-600 hover:bg-red-50">
              <LogOut size={14} className="mr-1" /> Logout
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <React.Suspense fallback={
            <div className="flex items-center justify-center min-h-[40vh]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600" />
            </div>
          }>
            {renderSection()}
          </React.Suspense>
        </main>
      </div>
    </div>
  )
}
