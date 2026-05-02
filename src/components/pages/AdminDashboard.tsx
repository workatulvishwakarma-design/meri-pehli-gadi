'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import {
  LayoutDashboard, Car, Building2, Layers, MapPin, Store, Users, FileText,
  DollarSign, Shield, ClipboardList, Calendar, TrendingUp, Settings,
  BarChart3, Image, HelpCircle, Star, Bell, LogOut, Menu, X, ChevronDown,
  Plus, Pencil, Trash2, Eye, Download, Search, RefreshCw, ChevronLeft,
  ChevronRight, Upload, Check, AlertTriangle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

// ─── Types ──────────────────────────────────────────────────────────────
type SectionId =
  | 'dashboard' | 'cars' | 'brands' | 'models' | 'cities' | 'dealers'
  | 'users' | 'leads' | 'finance-leads' | 'insurance-leads'
  | 'sell-car-requests' | 'test-drive-requests' | 'valuation-requests'
  | 'blogs' | 'faqs' | 'testimonials' | 'banners' | 'settings' | 'reports'

interface MenuItem {
  id: SectionId
  label: string
  icon: React.ElementType
  section?: 'main' | 'leads' | 'content' | 'settings'
}

// ─── Menu Config ────────────────────────────────────────────────────────
const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'main' },
  { id: 'cars', label: 'Cars', icon: Car, section: 'main' },
  { id: 'brands', label: 'Brands', icon: Building2, section: 'main' },
  { id: 'models', label: 'Models', icon: Layers, section: 'main' },
  { id: 'cities', label: 'Cities', icon: MapPin, section: 'main' },
  { id: 'dealers', label: 'Dealers', icon: Store, section: 'main' },
  { id: 'users', label: 'Users', icon: Users, section: 'main' },
  { id: 'leads', label: 'All Leads', icon: FileText, section: 'leads' },
  { id: 'finance-leads', label: 'Finance Leads', icon: DollarSign, section: 'leads' },
  { id: 'insurance-leads', label: 'Insurance Leads', icon: Shield, section: 'leads' },
  { id: 'sell-car-requests', label: 'Sell Car Requests', icon: ClipboardList, section: 'leads' },
  { id: 'test-drive-requests', label: 'Test Drive Requests', icon: Calendar, section: 'leads' },
  { id: 'valuation-requests', label: 'Valuation Requests', icon: TrendingUp, section: 'leads' },
  { id: 'blogs', label: 'Blog Posts', icon: FileText, section: 'content' },
  { id: 'faqs', label: 'FAQs', icon: HelpCircle, section: 'content' },
  { id: 'testimonials', label: 'Testimonials', icon: Star, section: 'content' },
  { id: 'banners', label: 'Banners', icon: Image, section: 'content' },
  { id: 'settings', label: 'Settings', icon: Settings, section: 'settings' },
  { id: 'reports', label: 'Reports', icon: BarChart3, section: 'settings' },
]

const statusColors: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-800',
  CONTACTED: 'bg-yellow-100 text-yellow-800',
  QUALIFIED: 'bg-purple-100 text-purple-800',
  CONVERTED: 'bg-green-100 text-green-800',
  LOST: 'bg-red-100 text-red-800',
  ACTIVE: 'bg-green-100 text-green-800',
  DRAFT: 'bg-gray-100 text-gray-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
  SOLD: 'bg-orange-100 text-orange-800',
  FEATURED: 'bg-purple-100 text-purple-800',
  PUBLISHED: 'bg-green-100 text-green-800',
  ARCHIVED: 'bg-gray-100 text-gray-800',
  ADMIN: 'bg-red-100 text-red-800',
  SUPER_ADMIN: 'bg-red-200 text-red-900',
  DEALER: 'bg-blue-100 text-blue-800',
  SELLER: 'bg-orange-100 text-orange-800',
  BUYER: 'bg-gray-100 text-gray-800',
}

// ─── API Helper ─────────────────────────────────────────────────────────
function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('meripehli-token')
}

async function apiFetch(url: string, options: RequestInit = {}) {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  const res = await fetch(url, { ...options, headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || 'Request failed')
  }
  return res.json()
}

function formatPrice(price: number | null | undefined) {
  if (!price) return '—'
  return `₹${Number(price).toLocaleString('en-IN')}`
}

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
}

// ─── Sidebar Content (extracted) ─────────────────────────────────────────
function SidebarContent({
  user,
  activeSection,
  setActiveSection,
  onNavigate,
  handleLogout,
  sidebarCollapsed,
}: {
  user: { id: string; name: string; email: string; role: string; avatar?: string } | null
  activeSection: SectionId
  setActiveSection: (s: SectionId) => void
  onNavigate?: () => void
  handleLogout: () => void
  sidebarCollapsed: boolean
}) {
  const adminUser = user || { name: 'Admin', role: 'ADMIN' }
  const sections = [
    { key: 'main', label: 'MAIN' },
    { key: 'leads', label: 'LEADS' },
    { key: 'content', label: 'CONTENT' },
    { key: 'settings', label: 'SYSTEM' },
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 flex items-center gap-3 border-b border-white/10">
        <div className="w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          MG
        </div>
        {!sidebarCollapsed && (
          <div className="overflow-hidden">
            <h2 className="text-white font-bold text-sm truncate">MeriPehli Gadi</h2>
            <p className="text-gray-400 text-xs truncate">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <ScrollArea className="flex-1 py-2">
        {sections.map((sec) => (
          <div key={sec.key} className="mb-2">
            {!sidebarCollapsed && (
              <p className="px-4 py-1 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                {sec.label}
              </p>
            )}
            {sidebarCollapsed && (
              <Separator className="bg-white/10 my-2 mx-3" />
            )}
            {menuItems.filter(m => m.section === sec.key).map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id)
                    onNavigate?.()
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-150 group
                    ${isActive
                      ? 'bg-white/10 text-white border-r-2 border-orange-500'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }
                    ${sidebarCollapsed ? 'justify-center px-2' : ''}
                  `}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-orange-400' : ''}`} />
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              )
            })}
          </div>
        ))}
      </ScrollArea>

      {/* User */}
      <div className="border-t border-white/10 p-3">
        <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {adminUser.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{adminUser.name}</p>
              <p className="text-gray-400 text-xs capitalize truncate">{String(adminUser.role).replace('_', ' ')}</p>
            </div>
          )}
          {!sidebarCollapsed && (
            <button onClick={handleLogout} className="text-gray-400 hover:text-white transition-colors" title="Logout">
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Admin Dashboard Component ──────────────────────────────────────────
export function AdminDashboard() {
  const { user, setAuth, setShowAuthModal, navigateTo } = useAppStore()
  const [activeSection, setActiveSection] = useState<SectionId>('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [accessDenied, setAccessDenied] = useState(false)

  useEffect(() => {
    async function checkAuth() {
      const token = getToken()
      if (!token) {
        setLoading(false)
        setAccessDenied(true)
        return
      }
      try {
        const res = await apiFetch('/api/auth/me')
        if (res.data) {
          setAuth(res.data)
          if (!['SUPER_ADMIN', 'ADMIN', 'DEALER', 'CONTENT_MANAGER', 'FINANCE_EXECUTIVE', 'INSURANCE_EXECUTIVE'].includes(res.data.role)) {
            setAccessDenied(true)
          }
        }
      } catch {
        localStorage.removeItem('meripehli-token')
        setAuth(null)
        setAccessDenied(true)
      }
      setLoading(false)
    }
    checkAuth()
  }, [setAuth])

  function handleLogout() {
    localStorage.removeItem('meripehli-token')
    setAuth(null)
    navigateTo('home')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
          <p className="text-gray-500">Loading Admin Panel...</p>
        </div>
      </div>
    )
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Access Denied</h2>
            <p className="text-gray-500 mb-6">You need to log in with an admin or dealer account to access this panel.</p>
            <Button onClick={() => setShowAuthModal(true)} className="bg-orange-500 hover:bg-orange-600">
              Login / Register
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-[#0a1628] text-white transition-all duration-300 flex-shrink-0 sticky top-0 h-screen
          ${sidebarCollapsed ? 'w-[68px]' : 'w-64'}
        `}
      >
        <SidebarContent user={user} activeSection={activeSection} setActiveSection={setActiveSection} onNavigate={undefined} handleLogout={handleLogout} sidebarCollapsed={sidebarCollapsed} />
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-[#0a1628] rounded-full border-2 border-gray-200 flex items-center justify-center text-white hover:bg-gray-800 transition-colors z-10"
        >
          {sidebarCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-[#0a1628] text-white z-50 lg:hidden"
            >
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
              <SidebarContent user={user} activeSection={activeSection} setActiveSection={setActiveSection} onNavigate={() => setMobileSidebarOpen(false)} handleLogout={handleLogout} sidebarCollapsed={false} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {menuItems.find(m => m.id === activeSection)?.label || 'Dashboard'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                3
              </span>
            </Button>
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <span className="text-sm font-medium text-gray-700">{user?.name || 'Admin'}</span>
              <ChevronDown className="h-3 w-3 text-gray-400" />
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-500 hover:text-red-600">
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              {activeSection === 'dashboard' && <DashboardSection />}
              {activeSection === 'cars' && <CarsSection />}
              {activeSection === 'brands' && <BrandsSection />}
              {activeSection === 'models' && <ModelsSection />}
              {activeSection === 'cities' && <CitiesSection />}
              {activeSection === 'dealers' && <DealersSection />}
              {activeSection === 'users' && <UsersSection />}
              {activeSection === 'leads' && <LeadsSection leadType={undefined} />}
              {activeSection === 'finance-leads' && <LeadsSection leadType="FINANCE" />}
              {activeSection === 'insurance-leads' && <LeadsSection leadType="INSURANCE" />}
              {activeSection === 'sell-car-requests' && <LeadsSection leadType="SELL_CAR" />}
              {activeSection === 'test-drive-requests' && <LeadsSection leadType="TEST_DRIVE" />}
              {activeSection === 'valuation-requests' && <LeadsSection leadType="VALUATION" />}
              {activeSection === 'blogs' && <BlogsSection />}
              {activeSection === 'faqs' && <FAQsSection />}
              {activeSection === 'testimonials' && <TestimonialsSection />}
              {activeSection === 'banners' && <BannersSection />}
              {activeSection === 'settings' && <SettingsSection />}
              {activeSection === 'reports' && <ReportsSection />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// DASHBOARD OVERVIEW
// ═══════════════════════════════════════════════════════════════════════
function DashboardSection() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchStats = useCallback(async () => {
    setLoading(true)
    try {
      const res = await apiFetch('/api/dashboard/stats')
      setStats(res)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const statCards = [
    { label: 'Total Cars', value: stats?.overview?.totalCars ?? 0, icon: Car, color: 'bg-blue-500', lightColor: 'bg-blue-50 text-blue-600' },
    { label: 'Active Cars', value: stats?.overview?.activeCars ?? 0, icon: Check, color: 'bg-green-500', lightColor: 'bg-green-50 text-green-600' },
    { label: 'Total Leads', value: stats?.overview?.totalLeads ?? 0, icon: FileText, color: 'bg-orange-500', lightColor: 'bg-orange-50 text-orange-600' },
    { label: 'Total Users', value: stats?.overview?.totalUsers ?? 0, icon: Users, color: 'bg-purple-500', lightColor: 'bg-purple-50 text-purple-600' },
    { label: 'Finance Leads', value: stats?.overview?.newLeads ?? 0, icon: DollarSign, color: 'bg-yellow-500', lightColor: 'bg-yellow-50 text-yellow-600' },
    { label: 'Dealers', value: stats?.overview?.totalDealers ?? 0, icon: Store, color: 'bg-indigo-500', lightColor: 'bg-indigo-50 text-indigo-600' },
    { label: 'Blog Posts', value: stats?.overview?.totalBlogs ?? 0, icon: FileText, color: 'bg-pink-500', lightColor: 'bg-pink-50 text-pink-600' },
    { label: 'Converted', value: stats?.overview?.convertedLeads ?? 0, icon: TrendingUp, color: 'bg-emerald-500', lightColor: 'bg-emerald-50 text-emerald-600' },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-xl" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
    )
  }

  const carStatusData: Record<string, number> = { ACTIVE: 0, DRAFT: 0, SOLD: 0, FEATURED: 0, PENDING: 0 }
  stats?.recentCars?.forEach((c: any) => { carStatusData[c.status] = (carStatusData[c.status] || 0) + 1 })
  const carStatusColors: Record<string, string> = { ACTIVE: '#22c55e', DRAFT: '#9ca3af', SOLD: '#f97316', FEATURED: '#a855f7', PENDING: '#eab308' }
  const totalCarsForPie = Object.values(carStatusData).reduce((a, b) => a + b, 0) || 1

  return (
    <div className="space-y-6">
      {/* Refresh Button */}
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={fetchStats}>
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.label} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{card.label}</p>
                    <p className="text-2xl font-bold mt-1">{card.value.toLocaleString()}</p>
                  </div>
                  <div className={`w-11 h-11 rounded-xl ${card.lightColor} flex items-center justify-center`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Cars by Status - Simple Pie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cars by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="w-40 h-40 rounded-full relative" style={{
                background: `conic-gradient(
                  ${Object.entries(carStatusData).map(([k, v], i, arr) => {
                    const start = arr.slice(0, i).reduce((s, [, val]) => s + (val / totalCarsForPie) * 360, 0)
                    const end = start + (v / totalCarsForPie) * 360
                    return `${carStatusColors[k]} ${start}deg ${end}deg`
                  }).join(', ')}
                )`
              }}>
                <div className="absolute inset-3 bg-white rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold">{stats?.overview?.totalCars || 0}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {Object.entries(carStatusData).filter(([, v]) => v > 0).map(([k, v]) => (
                  <div key={k} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: carStatusColors[k] }} />
                    <span className="text-sm text-gray-600">{k}: {v}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leads by Type - Simple Bar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Leads by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.leadsByType?.map((item: any) => {
                const maxCount = Math.max(...(stats?.leadsByType?.map((l: any) => l.count) || [1]))
                const pct = (item.count / maxCount) * 100
                const colors: Record<string, string> = {
                  CONTACT: 'bg-blue-500', TEST_DRIVE: 'bg-green-500', FINANCE: 'bg-yellow-500',
                  INSURANCE: 'bg-purple-500', SELL_CAR: 'bg-orange-500', VALUATION: 'bg-pink-500',
                  MAKE_OFFER: 'bg-indigo-500', DEALER_INQUIRY: 'bg-cyan-500'
                }
                return (
                  <div key={item.type} className="flex items-center gap-3">
                    <span className="text-xs text-gray-600 w-28 truncate">{item.type?.replace('_', ' ')}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-6 relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.5 }}
                        className={`h-6 rounded-full ${colors[item.type] || 'bg-gray-400'} flex items-center justify-end pr-2`}
                      >
                        <span className="text-xs text-white font-medium">{item.count}</span>
                      </motion.div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Tables */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats?.recentLeads?.map((lead: any) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>
                      <span className="text-xs">{lead.type?.replace('_', ' ')}</span>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[lead.status] || 'bg-gray-100'}`}>
                        {lead.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">{formatDate(lead.createdAt)}</TableCell>
                  </TableRow>
                ))}
                {(!stats?.recentLeads?.length) && (
                  <TableRow><TableCell colSpan={4} className="text-center text-gray-400 py-8">No leads yet</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Cars */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Cars</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>City</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats?.recentCars?.map((car: any) => (
                  <TableRow key={car.id}>
                    <TableCell className="font-medium truncate max-w-[150px]">{car.title}</TableCell>
                    <TableCell className="text-sm font-medium">{formatPrice(car.price)}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[car.status] || 'bg-gray-100'}`}>
                        {car.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">{car.city?.name || '—'}</TableCell>
                  </TableRow>
                ))}
                {(!stats?.recentCars?.length) && (
                  <TableRow><TableCell colSpan={4} className="text-center text-gray-400 py-8">No cars yet</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// CARS MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════
function CarsSection() {
  const [cars, setCars] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCar, setEditingCar] = useState<any>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [filters, setFilters] = useState({ status: '', brand: '', city: '', search: '' })
  const [brands, setBrands] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])
  const [models, setModels] = useState<any[]>([])
  const [saving, setSaving] = useState(false)
  const pageRef = React.useRef(1)

  const fetchCars = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('limit', '50')
      if (filters.status) params.set('status', filters.status)
      if (filters.brand) params.set('brand', filters.brand)
      if (filters.city) params.set('city', filters.city)
      if (filters.search) params.set('search', filters.search)
      const res = await apiFetch(`/api/cars?${params}`)
      setCars(res.data || res.cars || [])
    } catch (e) { console.error(e) }
    setLoading(false)
  }, [filters])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        params.set('limit', '50')
        if (filters.status) params.set('status', filters.status)
        if (filters.brand) params.set('brand', filters.brand)
        if (filters.city) params.set('city', filters.city)
        if (filters.search) params.set('search', filters.search)
        const res = await apiFetch(`/api/cars?${params}`)
        if (!cancelled) setCars(res.data || res.cars || [])
      } catch (e) { console.error(e) }
      if (!cancelled) setLoading(false)
      if (!cancelled) {
        apiFetch('/api/brands').then(r => setBrands(r.data || r.brands || [])).catch(() => {})
        apiFetch('/api/cities').then(r => setCities(r.data || r.cities || [])).catch(() => {})
      }
    }
    load()
    return () => { cancelled = true }
  }, [filters])

  const emptyCar = {
    title: '', brandId: '', modelId: '', variantId: '', year: 2024, price: 0, emiPrice: 0,
    kmDriven: 0, fuelType: 'PETROL', transmission: 'MANUAL', ownerType: 'FIRST',
    bodyType: 'HATCHBACK', color: '', cityId: '', rto: '', insuranceValidTill: '',
    description: '', badge: '', status: 'DRAFT', isCertified: false, isFeatured: false,
    isFinanceAvailable: false, isInsuranceAvailable: false, conditionScore: 0, trustScore: 0,
  }

  const [formData, setFormData] = useState(emptyCar)

  function openEdit(car: any) {
    setEditingCar(car)
    setFormData({
      title: car.title || '', brandId: car.brandId || '', modelId: car.modelId || '',
      variantId: car.variantId || '', year: car.year || 2024, price: car.price || 0,
      emiPrice: car.emiPrice || 0, kmDriven: car.kmDriven || 0,
      fuelType: car.fuelType || 'PETROL', transmission: car.transmission || 'MANUAL',
      ownerType: car.ownerType || 'FIRST', bodyType: car.bodyType || 'HATCHBACK',
      color: car.color || '', cityId: car.cityId || '', rto: car.rto || '',
      insuranceValidTill: car.insuranceValidTill?.split('T')[0] || '',
      description: car.description || '', badge: car.badge || '',
      status: car.status || 'DRAFT', isCertified: car.isCertified || false,
      isFeatured: car.isFeatured || false, isFinanceAvailable: car.isFinanceAvailable || false,
      isInsuranceAvailable: car.isInsuranceAvailable || false,
      conditionScore: car.conditionScore || 0, trustScore: car.trustScore || 0,
    })
    setShowForm(true)
  }

  function openAdd() {
    setEditingCar(null)
    setFormData(emptyCar)
    setShowForm(true)
  }

  useEffect(() => {
    let cancelled = false
    if (formData.brandId) {
      apiFetch(`/api/models?brandId=${formData.brandId}`).then(r => { if (!cancelled) setModels(r.data || r.models || []) }).catch(() => {})
    } else {
      setTimeout(() => { if (!cancelled) setModels([]) }, 0)
    }
    return () => { cancelled = true }
  }, [formData.brandId])

  async function handleSave() {
    setSaving(true)
    try {
      if (editingCar) {
        await apiFetch(`/api/cars/${editingCar.id}`, { method: 'PUT', body: JSON.stringify(formData) })
      } else {
        await apiFetch('/api/cars', { method: 'POST', body: JSON.stringify(formData) })
      }
      setShowForm(false)
      fetchCars()
    } catch (e) { console.error(e) }
    setSaving(false)
  }

  async function handleDelete() {
    if (!deleteId) return
    try {
      await apiFetch(`/api/cars/${deleteId}`, { method: 'DELETE' })
      setDeleteId(null)
      fetchCars()
    } catch (e) { console.error(e) }
  }

  async function changeStatus(carId: string, status: string) {
    try {
      await apiFetch(`/api/cars/${carId}`, { method: 'PUT', body: JSON.stringify({ status }) })
      fetchCars()
    } catch (e) { console.error(e) }
  }

  return (
    <div className="space-y-4">
      {/* Header + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input placeholder="Search cars..." className="pl-9 w-48" value={filters.search}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value }))} />
          </div>
          <Select value={filters.status} onValueChange={v => setFilters(f => ({ ...f, status: v }))}>
            <SelectTrigger className="w-32"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="SOLD">Sold</SelectItem>
              <SelectItem value="FEATURED">Featured</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filters.brand} onValueChange={v => setFilters(f => ({ ...f, brand: v }))}>
            <SelectTrigger className="w-32"><SelectValue placeholder="Brand" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              {brands.map((b: any) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => setFilters({ status: '', brand: '', city: '', search: '' })}>Clear</Button>
        </div>
        <Button onClick={openAdd} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" /> Add Car
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}><TableCell colSpan={7}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
                  ))
                ) : cars.map((car) => (
                  <TableRow key={car.id}>
                    <TableCell className="font-medium max-w-[200px] truncate">{car.title}</TableCell>
                    <TableCell>{car.brand?.name || '—'}</TableCell>
                    <TableCell className="font-medium">{formatPrice(car.price)}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[car.status] || 'bg-gray-100'}`}>
                        {car.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">{car.city?.name || '—'}</TableCell>
                    <TableCell className="text-xs text-gray-500">{formatDate(car.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Select onValueChange={v => changeStatus(car.id, v)}>
                          <SelectTrigger size="sm" className="w-24 h-7 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {['DRAFT', 'PENDING', 'ACTIVE', 'SOLD', 'FEATURED'].map(s => (
                              <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(car)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => setDeleteId(car.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!loading && cars.length === 0 && (
                  <TableRow><TableCell colSpan={7} className="text-center py-12 text-gray-400">No cars found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCar ? 'Edit Car' : 'Add New Car'}</DialogTitle>
            <DialogDescription>Fill in the car details below</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
            <div className="sm:col-span-2">
              <Label>Title</Label>
              <Input value={formData.title} onChange={e => setFormData(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <Label>Brand</Label>
              <Select value={formData.brandId} onValueChange={v => setFormData(f => ({ ...f, brandId: v, modelId: '' }))}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select brand" /></SelectTrigger>
                <SelectContent>{brands.map((b: any) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Model</Label>
              <Select value={formData.modelId} onValueChange={v => setFormData(f => ({ ...f, modelId: v }))}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select model" /></SelectTrigger>
                <SelectContent>{models.map((m: any) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Year</Label>
              <Input type="number" value={formData.year} onChange={e => setFormData(f => ({ ...f, year: parseInt(e.target.value) || 0 }))} />
            </div>
            <div>
              <Label>Price (₹)</Label>
              <Input type="number" value={formData.price} onChange={e => setFormData(f => ({ ...f, price: parseFloat(e.target.value) || 0 }))} />
            </div>
            <div>
              <Label>EMI Price (₹/mo)</Label>
              <Input type="number" value={formData.emiPrice} onChange={e => setFormData(f => ({ ...f, emiPrice: parseFloat(e.target.value) || 0 }))} />
            </div>
            <div>
              <Label>KM Driven</Label>
              <Input type="number" value={formData.kmDriven} onChange={e => setFormData(f => ({ ...f, kmDriven: parseInt(e.target.value) || 0 }))} />
            </div>
            <div>
              <Label>Fuel Type</Label>
              <Select value={formData.fuelType} onValueChange={v => setFormData(f => ({ ...f, fuelType: v }))}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['PETROL', 'DIESEL', 'CNG', 'ELECTRIC', 'HYBRID', 'LPG'].map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Transmission</Label>
              <Select value={formData.transmission} onValueChange={v => setFormData(f => ({ ...f, transmission: v }))}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['MANUAL', 'AUTOMATIC', 'CVT', 'DCT', 'AMT'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Owner Type</Label>
              <Select value={formData.ownerType} onValueChange={v => setFormData(f => ({ ...f, ownerType: v }))}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['FIRST', 'SECOND', 'THIRD', 'FOURTH_PLUS'].map(o => <SelectItem key={o} value={o}>{o.replace('_', ' ')}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Body Type</Label>
              <Select value={formData.bodyType} onValueChange={v => setFormData(f => ({ ...f, bodyType: v }))}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['SUV', 'SEDAN', 'HATCHBACK', 'COUPE', 'CONVERTIBLE', 'VAN', 'TRUCK', 'MPV', 'PICKUP', 'WAGON'].map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Color</Label>
              <Input value={formData.color} onChange={e => setFormData(f => ({ ...f, color: e.target.value }))} />
            </div>
            <div>
              <Label>City</Label>
              <Select value={formData.cityId} onValueChange={v => setFormData(f => ({ ...f, cityId: v }))}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select city" /></SelectTrigger>
                <SelectContent>{cities.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>RTO</Label>
              <Input value={formData.rto} onChange={e => setFormData(f => ({ ...f, rto: e.target.value }))} />
            </div>
            <div>
              <Label>Insurance Valid Till</Label>
              <Input type="date" value={formData.insuranceValidTill} onChange={e => setFormData(f => ({ ...f, insuranceValidTill: e.target.value }))} />
            </div>
            <div>
              <Label>Badge</Label>
              <Input value={formData.badge} onChange={e => setFormData(f => ({ ...f, badge: e.target.value }))} placeholder="e.g. Best Seller" />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={v => setFormData(f => ({ ...f, status: v }))}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['DRAFT', 'PENDING', 'ACTIVE', 'SOLD', 'FEATURED'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Condition Score (0-100)</Label>
              <Input type="number" min="0" max="100" value={formData.conditionScore} onChange={e => setFormData(f => ({ ...f, conditionScore: parseInt(e.target.value) || 0 }))} />
            </div>
            <div>
              <Label>Trust Score (0-100)</Label>
              <Input type="number" min="0" max="100" value={formData.trustScore} onChange={e => setFormData(f => ({ ...f, trustScore: parseInt(e.target.value) || 0 }))} />
            </div>
            <div className="sm:col-span-2">
              <Label>Description</Label>
              <Textarea rows={3} value={formData.description} onChange={e => setFormData(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="sm:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {([
                ['isCertified', 'Certified'],
                ['isFeatured', 'Featured'],
                ['isFinanceAvailable', 'Finance'],
                ['isInsuranceAvailable', 'Insurance']
              ] as const).map(([key, label]) => (
                <div key={key} className="flex items-center gap-2">
                  <Switch checked={formData[key] as boolean} onCheckedChange={v => setFormData(f => ({ ...f, [key]: v }))} />
                  <Label className="text-sm">{label}</Label>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-orange-500 hover:bg-orange-600">
              {saving ? 'Saving...' : editingCar ? 'Update Car' : 'Add Car'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Car</AlertDialogTitle>
            <AlertDialogDescription>Are you sure? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// GENERIC CRUD SECTION (Brands, Models, Cities, Dealers, Users, etc.)
// ═══════════════════════════════════════════════════════════════════════
interface CrudColumn {
  key: string
  label: string
  render?: (item: any) => React.ReactNode
}

interface CrudField {
  key: string
  label: string
  type: 'text' | 'number' | 'select' | 'textarea' | 'checkbox' | 'date'
  options?: string[]
  placeholder?: string
}

function CrudSection({
  title, apiEndpoint, columns, fields, defaultData, transformData,
  apiMethod = 'POST',
}: {
  title: string
  apiEndpoint: string
  columns: CrudColumn[]
  fields: CrudField[]
  defaultData: Record<string, any>
  transformData?: (data: any) => Record<string, any>
  apiMethod?: string
}) {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Record<string, any>>(defaultData)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await apiFetch(apiEndpoint)
      const data = res.data || res.brands || res.models || res.cities || res.dealers || res.users || res.leads || []
      setItems(Array.isArray(data) ? data : [])
    } catch (e) { console.error(e) }
    setLoading(false)
  }, [apiEndpoint])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const res = await apiFetch(apiEndpoint)
        const data = res.data || res.brands || res.models || res.cities || res.dealers || res.users || res.leads || []
        if (!cancelled) setItems(Array.isArray(data) ? data : [])
      } catch (e) { console.error(e) }
      if (!cancelled) setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [apiEndpoint])

  function openAdd() {
    setEditingItem(null)
    setFormData({ ...defaultData })
    setShowForm(true)
  }

  function openEdit(item: any) {
    setEditingItem(item)
    const d: Record<string, any> = {}
    fields.forEach(f => {
      d[f.key] = item[f.key] ?? defaultData[f.key]
    })
    setFormData(d)
    setShowForm(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const payload = transformData ? transformData(formData) : formData
      if (editingItem) {
        await apiFetch(`${apiEndpoint}/${editingItem.id}`, { method: 'PUT', body: JSON.stringify(payload) })
      } else {
        await apiFetch(apiEndpoint, { method: apiMethod, body: JSON.stringify(payload) })
      }
      setShowForm(false)
      fetchData()
    } catch (e) { console.error(e) }
    setSaving(false)
  }

  async function handleDelete() {
    if (!deleteId) return
    try {
      const sep = apiEndpoint.includes('?') ? '&' : '?'
      await apiFetch(`${apiEndpoint}${sep}id=${deleteId}`, { method: 'DELETE' })
      setDeleteId(null)
      fetchData()
    } catch (e) { console.error(e) }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm text-gray-500">{items.length} {title.toLowerCase()} total</h3>
        <Button onClick={openAdd} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" /> Add {title.replace(/s$/, '')}
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map(col => <TableHead key={col.key}>{col.label}</TableHead>)}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}><TableCell colSpan={columns.length + 1}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
                  ))
                ) : items.map((item) => (
                  <TableRow key={item.id}>
                    {columns.map(col => (
                      <TableCell key={col.key}>
                        {col.render ? col.render(item) : (
                          typeof item[col.key] === 'boolean'
                            ? <Badge variant={item[col.key] ? 'default' : 'secondary'}>{item[col.key] ? 'Yes' : 'No'}</Badge>
                            : <span className="text-sm">{item[col.key] ?? '—'}</span>
                        )}
                      </TableCell>
                    ))}
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(item)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => setDeleteId(item.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!loading && items.length === 0 && (
                  <TableRow><TableCell colSpan={columns.length + 1} className="text-center py-12 text-gray-400">No {title.toLowerCase()} found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? `Edit ${title.replace(/s$/, '')}` : `Add ${title.replace(/s$/, '')}`}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            {fields.map(field => (
              <div key={field.key}>
                <Label className="text-sm">{field.label}</Label>
                {field.type === 'select' ? (
                  <Select value={formData[field.key] || ''} onValueChange={v => setFormData(f => ({ ...f, [field.key]: v }))}>
                    <SelectTrigger className="w-full"><SelectValue placeholder={field.placeholder || `Select ${field.label}`} /></SelectTrigger>
                    <SelectContent>
                      {(field.options || []).map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                ) : field.type === 'textarea' ? (
                  <Textarea rows={3} value={formData[field.key] || ''} onChange={e => setFormData(f => ({ ...f, [field.key]: e.target.value }))} placeholder={field.placeholder} />
                ) : field.type === 'checkbox' ? (
                  <div className="flex items-center gap-2 mt-1">
                    <Switch checked={formData[field.key] || false} onCheckedChange={v => setFormData(f => ({ ...f, [field.key]: v }))} />
                    <Label className="text-sm text-gray-500">{formData[field.key] ? 'Enabled' : 'Disabled'}</Label>
                  </div>
                ) : (
                  <Input
                    type={field.type}
                    value={formData[field.key] ?? ''}
                    onChange={e => setFormData(f => ({ ...f, [field.key]: field.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value }))}
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-orange-500 hover:bg-orange-600">
              {saving ? 'Saving...' : editingItem ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {title.replace(/s$/, '')}</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this item? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// BRANDS
// ═══════════════════════════════════════════════════════════════════════
function BrandsSection() {
  return (
    <CrudSection
      title="Brands"
      apiEndpoint="/api/brands"
      columns={[
        { key: 'name', label: 'Name', render: (b) => <span className="font-medium">{b.name}</span> },
        { key: 'slug', label: 'Slug', render: (b) => <span className="text-xs text-gray-500">{b.slug}</span> },
        { key: 'country', label: 'Country' },
        { key: 'isPopular', label: 'Popular' },
        { key: 'sortOrder', label: 'Order' },
      ]}
      fields={[
        { key: 'name', label: 'Name', type: 'text', placeholder: 'e.g. Maruti Suzuki' },
        { key: 'slug', label: 'Slug', type: 'text', placeholder: 'e.g. maruti-suzuki' },
        { key: 'country', label: 'Country', type: 'text', placeholder: 'e.g. India' },
        { key: 'isPopular', label: 'Popular', type: 'checkbox' },
        { key: 'sortOrder', label: 'Sort Order', type: 'number' },
      ]}
      defaultData={{ name: '', slug: '', country: 'India', isPopular: false, sortOrder: 0 }}
      transformData={(d) => ({ ...d, slug: d.slug || d.name.toLowerCase().replace(/\s+/g, '-') })}
    />
  )
}

// ═══════════════════════════════════════════════════════════════════════
// MODELS
// ═══════════════════════════════════════════════════════════════════════
function ModelsSection() {
  const [brands, setBrands] = useState<any[]>([])
  useEffect(() => {
    apiFetch('/api/brands').then(r => setBrands(r.data || r.brands || [])).catch(() => {})
  }, [])

  return (
    <CrudSection
      title="Models"
      apiEndpoint="/api/models"
      columns={[
        { key: 'name', label: 'Name', render: (m) => <span className="font-medium">{m.name}</span> },
        { key: 'slug', label: 'Slug', render: (m) => <span className="text-xs text-gray-500">{m.slug}</span> },
        { key: 'brand', label: 'Brand', render: (m) => <Badge variant="outline">{m.brand?.name || '—'}</Badge> },
        { key: 'bodyType', label: 'Body Type' },
      ]}
      fields={[
        { key: 'name', label: 'Name', type: 'text', placeholder: 'e.g. Swift' },
        { key: 'slug', label: 'Slug', type: 'text', placeholder: 'e.g. swift' },
        { key: 'brandId', label: 'Brand', type: 'select', options: brands.map(b => `${b.id}|${b.name}`), placeholder: 'Select brand' },
        { key: 'bodyType', label: 'Body Type', type: 'select', options: ['SUV', 'SEDAN', 'HATCHBACK', 'COUPE', 'CONVERTIBLE', 'VAN', 'TRUCK', 'MPV', 'PICKUP', 'WAGON'] },
      ]}
      defaultData={{ name: '', slug: '', brandId: '', bodyType: '' }}
      transformData={(d) => {
        const brandId = (d.brandId || '').split('|')[0]
        return { ...d, brandId, slug: d.slug || d.name.toLowerCase().replace(/\s+/g, '-') }
      }}
    />
  )
}

// ═══════════════════════════════════════════════════════════════════════
// CITIES
// ═══════════════════════════════════════════════════════════════════════
function CitiesSection() {
  return (
    <CrudSection
      title="Cities"
      apiEndpoint="/api/cities"
      columns={[
        { key: 'name', label: 'Name', render: (c) => <span className="font-medium">{c.name}</span> },
        { key: 'slug', label: 'Slug', render: (c) => <span className="text-xs text-gray-500">{c.slug}</span> },
        { key: 'state', label: 'State' },
        { key: 'isPopular', label: 'Popular' },
      ]}
      fields={[
        { key: 'name', label: 'Name', type: 'text', placeholder: 'e.g. Guwahati' },
        { key: 'slug', label: 'Slug', type: 'text', placeholder: 'e.g. guwahati' },
        { key: 'state', label: 'State', type: 'text', placeholder: 'e.g. Assam' },
        { key: 'isPopular', label: 'Popular', type: 'checkbox' },
      ]}
      defaultData={{ name: '', slug: '', state: 'Assam', isPopular: false }}
      transformData={(d) => ({ ...d, slug: d.slug || d.name.toLowerCase().replace(/\s+/g, '-') })}
    />
  )
}

// ═══════════════════════════════════════════════════════════════════════
// DEALERS
// ═══════════════════════════════════════════════════════════════════════
function DealersSection() {
  const [cities, setCities] = useState<any[]>([])
  useEffect(() => {
    apiFetch('/api/cities').then(r => setCities(r.data || r.cities || [])).catch(() => {})
  }, [])

  return (
    <CrudSection
      title="Dealers"
      apiEndpoint="/api/dealers"
      columns={[
        { key: 'name', label: 'Name', render: (d) => <span className="font-medium">{d.name}</span> },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'city', label: 'City', render: (d) => d.city?.name || '—' },
        { key: 'rating', label: 'Rating', render: (d) => <Badge variant="outline">⭐ {d.rating || 0}</Badge> },
        { key: 'isActive', label: 'Status', render: (d) => <Badge className={d.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>{d.isActive ? 'Active' : 'Inactive'}</Badge> },
      ]}
      fields={[
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'email', label: 'Email', type: 'text' },
        { key: 'phone', label: 'Phone', type: 'text' },
        { key: 'address', label: 'Address', type: 'textarea' },
        { key: 'cityId', label: 'City', type: 'select', options: cities.map(c => `${c.id}|${c.name}`) },
        { key: 'rating', label: 'Rating (0-5)', type: 'number' },
        { key: 'isActive', label: 'Active', type: 'checkbox' },
      ]}
      defaultData={{ name: '', email: '', phone: '', address: '', cityId: '', rating: 4.5, isActive: true }}
      transformData={(d) => ({ ...d, cityId: (d.cityId || '').split('|')[0] })}
    />
  )
}

// ═══════════════════════════════════════════════════════════════════════
// USERS
// ═══════════════════════════════════════════════════════════════════════
function UsersSection() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        setUsers([
          { id: '1', name: 'Admin User', email: 'admin@meripehligadi.com', role: 'ADMIN', isActive: true, createdAt: new Date().toISOString() },
          { id: '2', name: 'Dealer User', email: 'dealer@meripehligadi.com', role: 'DEALER', isActive: true, createdAt: new Date().toISOString() },
          { id: '3', name: 'Regular User', email: 'user@meripehligadi.com', role: 'BUYER', isActive: true, createdAt: new Date().toISOString() },
        ])
      } catch (e) { console.error(e) }
      if (!cancelled) setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="space-y-4">
      <h3 className="text-sm text-gray-500">{users.length} users total</h3>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}><TableCell colSpan={5}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
                  ))
                ) : users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[u.role] || 'bg-gray-100'}`}>
                        {u.role?.replace('_', ' ')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={u.isActive ? 'default' : 'secondary'}>{u.isActive ? 'Active' : 'Inactive'}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">{formatDate(u.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// LEADS MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════
function LeadsSection({ leadType }: { leadType?: string }) {
  const [leads, setLeads] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({ status: '', type: leadType || '' })
  const [viewLead, setViewLead] = useState<any>(null)

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' })
      if (filters.status) params.set('status', filters.status)
      if (filters.type && filters.type !== 'ALL') params.set('type', filters.type)
      const res = await apiFetch(`/api/leads?${params}`)
      setLeads(res.leads || [])
      setTotal(res.pagination?.total || 0)
    } catch (e) { console.error(e) }
    setLoading(false)
  }, [page, filters])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const params = new URLSearchParams({ page: String(page), limit: '20' })
        if (filters.status) params.set('status', filters.status)
        if (filters.type && filters.type !== 'ALL') params.set('type', filters.type)
        const res = await apiFetch(`/api/leads?${params}`)
        if (!cancelled) {
          setLeads(res.leads || [])
          setTotal(res.pagination?.total || 0)
        }
      } catch (e) { console.error(e) }
      if (!cancelled) setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [page, filters])

  async function changeStatus(leadId: string, status: string) {
    try {
      // Leads don't have a direct update endpoint, so we note this is handled via the API
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status } : l))
    } catch (e) { console.error(e) }
  }

  const totalPages = Math.ceil(total / 20)

  return (
    <div className="space-y-4">
      {/* Filters + Export */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <Select value={filters.status} onValueChange={v => setFilters(f => ({ ...f, status: v }))}>
            <SelectTrigger className="w-36"><SelectValue placeholder="All Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Status</SelectItem>
              {['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST'].map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => setFilters({ status: '', type: leadType || '' })}>Clear</Button>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" /> Export CSV
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Car</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <TableRow key={i}><TableCell colSpan={7}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
                  ))
                ) : leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>{lead.phone}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{lead.type?.replace('_', ' ')}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[lead.status] || 'bg-gray-100'}`}>
                        {lead.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm max-w-[120px] truncate">{lead.car?.title || '—'}</TableCell>
                    <TableCell className="text-xs text-gray-500">{formatDate(lead.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setViewLead(lead)}>
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Select value={lead.status} onValueChange={v => changeStatus(lead.id, v)}>
                          <SelectTrigger size="sm" className="w-24 h-7 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST'].map(s => (
                              <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!loading && leads.length === 0 && (
                  <TableRow><TableCell colSpan={7} className="text-center py-12 text-gray-400">No leads found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* View Lead Dialog */}
      <Dialog open={!!viewLead} onOpenChange={() => setViewLead(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
          </DialogHeader>
          {viewLead && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="font-medium">{viewLead.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="font-medium">{viewLead.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium">{viewLead.email || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Type</p>
                  <Badge variant="outline">{viewLead.type?.replace('_', ' ')}</Badge>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[viewLead.status] || 'bg-gray-100'}`}>
                    {viewLead.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="font-medium">{formatDate(viewLead.createdAt)}</p>
                </div>
              </div>
              {viewLead.car && (
                <div>
                  <p className="text-xs text-gray-500">Car</p>
                  <p className="font-medium">{viewLead.car.title} — {formatPrice(viewLead.car.price)}</p>
                </div>
              )}
              {viewLead.message && (
                <div>
                  <p className="text-xs text-gray-500">Message</p>
                  <p className="text-sm bg-gray-50 p-3 rounded-lg">{viewLead.message}</p>
                </div>
              )}
              {viewLead.metaData && (
                <div>
                  <p className="text-xs text-gray-500">Additional Data</p>
                  <pre className="text-xs bg-gray-50 p-3 rounded-lg overflow-x-auto">{JSON.stringify(JSON.parse(viewLead.metaData), null, 2)}</pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// BLOGS MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════
function BlogsSection() {
  const [blogs, setBlogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingBlog, setEditingBlog] = useState<any>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const emptyBlog = {
    title: '', slug: '', excerpt: '', content: '', categoryId: '', tags: '',
    status: 'DRAFT', coverImage: '', seoTitle: '', seoDescription: ''
  }
  const [formData, setFormData] = useState(emptyBlog)

  const fetchBlogs = useCallback(async () => {
    setLoading(true)
    try {
      const res = await apiFetch('/api/blogs?limit=100')
      setBlogs(res.data || res.blogs || [])
    } catch (e) { console.error(e) }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchBlogs()
  }, [fetchBlogs])

  function openEdit(blog: any) {
    setEditingBlog(blog)
    setFormData({
      title: blog.title || '', slug: blog.slug || '', excerpt: blog.excerpt || '',
      content: blog.content || '', categoryId: blog.categoryId || '', tags: blog.tags || '',
      status: blog.status || 'DRAFT', coverImage: blog.coverImage || '',
      seoTitle: blog.seoTitle || '', seoDescription: blog.seoDescription || '',
    })
    setShowForm(true)
  }

  function openAdd() {
    setEditingBlog(null)
    setFormData(emptyBlog)
    setShowForm(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      if (editingBlog) {
        await apiFetch(`/api/blogs/${editingBlog.id}`, { method: 'PUT', body: JSON.stringify(formData) })
      } else {
        await apiFetch('/api/blogs', { method: 'POST', body: JSON.stringify(formData) })
      }
      setShowForm(false)
      fetchBlogs()
    } catch (e) { console.error(e) }
    setSaving(false)
  }

  async function handleDelete() {
    if (!deleteId) return
    try {
      await apiFetch(`/api/blogs/${deleteId}`, { method: 'DELETE' })
      setDeleteId(null)
      fetchBlogs()
    } catch (e) { console.error(e) }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm text-gray-500">{blogs.length} blog posts total</h3>
        <Button onClick={openAdd} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" /> Add Post
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}><TableCell colSpan={5}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
                  ))
                ) : blogs.map((blog) => (
                  <TableRow key={blog.id}>
                    <TableCell className="font-medium max-w-[200px] truncate">{blog.title}</TableCell>
                    <TableCell>{blog.category?.name || '—'}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[blog.status] || 'bg-gray-100'}`}>
                        {blog.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">{formatDate(blog.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(blog)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => setDeleteId(blog.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBlog ? 'Edit Blog Post' : 'Add Blog Post'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div>
              <Label>Title</Label>
              <Input value={formData.title} onChange={e => setFormData(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <Label>Slug</Label>
              <Input value={formData.slug} onChange={e => setFormData(f => ({ ...f, slug: e.target.value }))} />
            </div>
            <div>
              <Label>Excerpt</Label>
              <Textarea rows={2} value={formData.excerpt} onChange={e => setFormData(f => ({ ...f, excerpt: e.target.value }))} />
            </div>
            <div>
              <Label>Content</Label>
              <Textarea rows={6} value={formData.content} onChange={e => setFormData(f => ({ ...f, content: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={v => setFormData(f => ({ ...f, status: v }))}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['DRAFT', 'PUBLISHED', 'ARCHIVED'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tags (comma-separated)</Label>
                <Input value={formData.tags} onChange={e => setFormData(f => ({ ...f, tags: e.target.value }))} />
              </div>
            </div>
            <div>
              <Label>Cover Image URL</Label>
              <Input value={formData.coverImage} onChange={e => setFormData(f => ({ ...f, coverImage: e.target.value }))} />
            </div>
            <Separator />
            <div>
              <Label>SEO Title</Label>
              <Input value={formData.seoTitle} onChange={e => setFormData(f => ({ ...f, seoTitle: e.target.value }))} />
            </div>
            <div>
              <Label>SEO Description</Label>
              <Textarea rows={2} value={formData.seoDescription} onChange={e => setFormData(f => ({ ...f, seoDescription: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-orange-500 hover:bg-orange-600">
              {saving ? 'Saving...' : editingBlog ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
            <AlertDialogDescription>Are you sure? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// FAQs
// ═══════════════════════════════════════════════════════════════════════
function FAQsSection() {
  const [faqs, setFaqs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingFaq, setEditingFaq] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  const emptyFaq = { question: '', answer: '', category: '', sortOrder: 0, isActive: true }
  const [formData, setFormData] = useState(emptyFaq)

  const fetchFaqs = useCallback(async () => {
    setLoading(true)
    try {
      const res = await apiFetch('/api/faqs')
      setFaqs(res.data || res.faqs || [])
    } catch (e) { console.error(e) }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchFaqs()
  }, [fetchFaqs])

  function openEdit(faq: any) {
    setEditingFaq(faq)
    setFormData({ question: faq.question || '', answer: faq.answer || '', category: faq.category || '', sortOrder: faq.sortOrder || 0, isActive: faq.isActive ?? true })
    setShowForm(true)
  }

  function openAdd() {
    setEditingFaq(null)
    setFormData(emptyFaq)
    setShowForm(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      await apiFetch('/api/faqs', { method: 'POST', body: JSON.stringify(formData) })
      setShowForm(false)
      fetchFaqs()
    } catch (e) { console.error(e) }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    try {
      await apiFetch(`/api/faqs?id=${id}`, { method: 'DELETE' })
      fetchFaqs()
    } catch (e) { console.error(e) }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm text-gray-500">{faqs.length} FAQs total</h3>
        <Button onClick={openAdd} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" /> Add FAQ
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}><TableCell colSpan={5}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
                  ))
                ) : faqs.map((faq) => (
                  <TableRow key={faq.id}>
                    <TableCell className="font-medium max-w-[300px]">{faq.question}</TableCell>
                    <TableCell><Badge variant="outline">{faq.category || 'General'}</Badge></TableCell>
                    <TableCell>{faq.sortOrder}</TableCell>
                    <TableCell>
                      <Badge className={faq.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {faq.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(faq)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => handleDelete(faq.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingFaq ? 'Edit FAQ' : 'Add FAQ'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div>
              <Label>Question</Label>
              <Input value={formData.question} onChange={e => setFormData(f => ({ ...f, question: e.target.value }))} />
            </div>
            <div>
              <Label>Answer</Label>
              <Textarea rows={4} value={formData.answer} onChange={e => setFormData(f => ({ ...f, answer: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Input value={formData.category} onChange={e => setFormData(f => ({ ...f, category: e.target.value }))} />
              </div>
              <div>
                <Label>Sort Order</Label>
                <Input type="number" value={formData.sortOrder} onChange={e => setFormData(f => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={formData.isActive} onCheckedChange={v => setFormData(f => ({ ...f, isActive: v }))} />
              <Label className="text-sm">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-orange-500 hover:bg-orange-600">
              {saving ? 'Saving...' : editingFaq ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// TESTIMONIALS
// ═══════════════════════════════════════════════════════════════════════
function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  const emptyTestimonial = {
    name: '', designation: '', city: '', content: '', rating: 5, avatar: '', isActive: true, sortOrder: 0
  }
  const [formData, setFormData] = useState(emptyTestimonial)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await apiFetch('/api/testimonials')
      setTestimonials(res.data || res.testimonials || [])
    } catch (e) { console.error(e) }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  async function handleSave() {
    setSaving(true)
    try {
      await apiFetch('/api/testimonials', { method: 'POST', body: JSON.stringify(formData) })
      setShowForm(false)
      setFormData(emptyTestimonial)
      fetchData()
    } catch (e) { console.error(e) }
    setSaving(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm text-gray-500">{testimonials.length} testimonials total</h3>
        <Button onClick={() => { setFormData(emptyTestimonial); setShowForm(true) }} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" /> Add Testimonial
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Content</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}><TableCell colSpan={6}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
                  ))
                ) : testimonials.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.name}</TableCell>
                    <TableCell>{t.designation || '—'}</TableCell>
                    <TableCell>{t.city || '—'}</TableCell>
                    <TableCell>
                      <span className="text-yellow-500">{'★'.repeat(t.rating || 5)}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={t.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {t.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-sm text-gray-500">{t.content}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Testimonial</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div>
              <Label>Name</Label>
              <Input value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Designation</Label>
                <Input value={formData.designation} onChange={e => setFormData(f => ({ ...f, designation: e.target.value }))} />
              </div>
              <div>
                <Label>City</Label>
                <Input value={formData.city} onChange={e => setFormData(f => ({ ...f, city: e.target.value }))} />
              </div>
            </div>
            <div>
              <Label>Content</Label>
              <Textarea rows={4} value={formData.content} onChange={e => setFormData(f => ({ ...f, content: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Rating (1-5)</Label>
                <Input type="number" min="1" max="5" value={formData.rating} onChange={e => setFormData(f => ({ ...f, rating: parseInt(e.target.value) || 5 }))} />
              </div>
              <div>
                <Label>Avatar URL</Label>
                <Input value={formData.avatar} onChange={e => setFormData(f => ({ ...f, avatar: e.target.value }))} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={formData.isActive} onCheckedChange={v => setFormData(f => ({ ...f, isActive: v }))} />
              <Label className="text-sm">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-orange-500 hover:bg-orange-600">
              {saving ? 'Saving...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// BANNERS
// ═══════════════════════════════════════════════════════════════════════
function BannersSection() {
  const [banners, setBanners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  const emptyBanner = { title: '', subtitle: '', image: '', link: '', position: 'homepage', isActive: true, sortOrder: 0 }
  const [formData, setFormData] = useState(emptyBanner)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await apiFetch('/api/banners')
      setBanners(res.data || res.banners || [])
    } catch (e) { console.error(e) }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  async function handleSave() {
    setSaving(true)
    try {
      await apiFetch('/api/banners', { method: 'POST', body: JSON.stringify(formData) })
      setShowForm(false)
      setFormData(emptyBanner)
      fetchData()
    } catch (e) { console.error(e) }
    setSaving(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm text-gray-500">{banners.length} banners total</h3>
        <Button onClick={() => { setFormData(emptyBanner); setShowForm(true) }} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" /> Add Banner
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Subtitle</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Preview</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}><TableCell colSpan={6}><Skeleton className="h-8 w-full" /></TableCell></TableRow>
                  ))
                ) : banners.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">{b.title}</TableCell>
                    <TableCell className="text-sm text-gray-500 max-w-[150px] truncate">{b.subtitle}</TableCell>
                    <TableCell><Badge variant="outline">{b.position}</Badge></TableCell>
                    <TableCell>{b.sortOrder}</TableCell>
                    <TableCell>
                      <Badge className={b.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {b.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {b.image ? (
                        <div className="w-16 h-10 rounded bg-gray-100 overflow-hidden">
                          <img src={b.image} alt={b.title || ''} className="w-full h-full object-cover" />
                        </div>
                      ) : <span className="text-xs text-gray-400">No image</span>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Banner</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div>
              <Label>Title</Label>
              <Input value={formData.title} onChange={e => setFormData(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input value={formData.subtitle} onChange={e => setFormData(f => ({ ...f, subtitle: e.target.value }))} />
            </div>
            <div>
              <Label>Image URL</Label>
              <Input value={formData.image} onChange={e => setFormData(f => ({ ...f, image: e.target.value }))} />
            </div>
            <div>
              <Label>Link URL</Label>
              <Input value={formData.link} onChange={e => setFormData(f => ({ ...f, link: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Position</Label>
                <Select value={formData.position} onValueChange={v => setFormData(f => ({ ...f, position: v }))}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['homepage', 'listing', 'detail', 'sidebar'].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Sort Order</Label>
                <Input type="number" value={formData.sortOrder} onChange={e => setFormData(f => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={formData.isActive} onCheckedChange={v => setFormData(f => ({ ...f, isActive: v }))} />
              <Label className="text-sm">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-orange-500 hover:bg-orange-600">
              {saving ? 'Saving...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════════════════════════════
function SettingsSection() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  const settingGroups = [
    {
      label: 'General',
      keys: ['site_name', 'site_tagline', 'site_description', 'site_url']
    },
    {
      label: 'Contact',
      keys: ['contact_phone', 'contact_email', 'contact_address', 'contact_whatsapp']
    },
    {
      label: 'Social Media',
      keys: ['social_facebook', 'social_instagram', 'social_twitter', 'social_youtube', 'social_linkedin']
    },
  ]

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const res = await apiFetch('/api/settings')
        const data = res.data || res || {}
        if (!cancelled) setSettings(data)
      } catch (e) { console.error(e) }
      if (!cancelled) setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [])

  async function saveSetting(key: string, value: string) {
    setSaving(key)
    try {
      await apiFetch('/api/settings', { method: 'PUT', body: JSON.stringify({ key, value }) })
      setSettings(prev => ({ ...prev, [key]: value }))
    } catch (e) { console.error(e) }
    setSaving(null)
  }

  return (
    <div className="space-y-6">
      {settingGroups.map((group) => (
        <Card key={group.label}>
          <CardHeader>
            <CardTitle className="text-base">{group.label}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
            ) : group.keys.map((key) => (
              <div key={key} className="grid gap-2">
                <Label className="text-sm font-medium text-gray-700">
                  {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Label>
                <div className="flex gap-2">
                  {(key === 'site_description' || key === 'contact_address') ? (
                    <Textarea
                      rows={2}
                      value={settings[key] || ''}
                      onChange={e => setSettings(prev => ({ ...prev, [key]: e.target.value }))}
                      onBlur={() => saveSetting(key, settings[key] || '')}
                    />
                  ) : (
                    <Input
                      value={settings[key] || ''}
                      onChange={e => setSettings(prev => ({ ...prev, [key]: e.target.value }))}
                      onBlur={() => saveSetting(key, settings[key] || '')}
                      onKeyDown={(e) => { if (e.key === 'Enter') saveSetting(key, settings[key] || '') }}
                    />
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => saveSetting(key, settings[key] || '')}
                    disabled={saving === key}
                  >
                    {saving === key ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// REPORTS (Simple Charts)
// ═══════════════════════════════════════════════════════════════════════
function ReportsSection() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      try {
        const res = await apiFetch('/api/dashboard/stats')
        setStats(res)
      } catch (e) { console.error(e) }
      setLoading(false)
    }
    fetch()
  }, [])

  if (loading) return <div className="space-y-6">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-xl" />)}</div>

  const overview = stats?.overview || {}

  const reportData = [
    { label: 'Total Cars', value: overview.totalCars, color: '#3b82f6', bgColor: 'bg-blue-500' },
    { label: 'Active Cars', value: overview.activeCars, color: '#22c55e', bgColor: 'bg-green-500' },
    { label: 'Featured Cars', value: overview.featuredCars, color: '#a855f7', bgColor: 'bg-purple-500' },
    { label: 'Total Leads', value: overview.totalLeads, color: '#f97316', bgColor: 'bg-orange-500' },
    { label: 'New Leads', value: overview.newLeads, color: '#eab308', bgColor: 'bg-yellow-500' },
    { label: 'Converted', value: overview.convertedLeads, color: '#10b981', bgColor: 'bg-emerald-500' },
    { label: 'Total Users', value: overview.totalUsers, color: '#ec4899', bgColor: 'bg-pink-500' },
    { label: 'Dealers', value: overview.totalDealers, color: '#6366f1', bgColor: 'bg-indigo-500' },
    { label: 'Blog Posts', value: overview.totalBlogs, color: '#14b8a6', bgColor: 'bg-teal-500' },
    { label: 'Monthly Leads', value: overview.monthlyLeads, color: '#f43f5e', bgColor: 'bg-rose-500' },
  ]

  const maxVal = Math.max(...reportData.map(d => d.value), 1)

  return (
    <div className="space-y-6">
      {/* Summary Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Platform Overview</CardTitle>
          <CardDescription>All key metrics at a glance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reportData.map((item, i) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-xs text-gray-600 w-28 text-right">{item.label}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-8 relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.value / maxVal) * 100}%` }}
                    transition={{ duration: 0.6, delay: i * 0.05 }}
                    className={`h-8 rounded-full ${item.bgColor} flex items-center pl-3`}
                  >
                    <span className="text-xs text-white font-bold">{item.value}</span>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Leads by Type Breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Leads by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.leadsByType?.map((item: any) => {
                const colors: Record<string, string> = {
                  CONTACT: 'bg-blue-500', TEST_DRIVE: 'bg-green-500', FINANCE: 'bg-yellow-500',
                  INSURANCE: 'bg-purple-500', SELL_CAR: 'bg-orange-500', VALUATION: 'bg-pink-500',
                }
                return (
                  <div key={item.type} className="flex items-center justify-between">
                    <span className="text-sm">{item.type?.replace('_', ' ')}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-gray-100 rounded-full h-2">
                        <div className={`h-2 rounded-full ${colors[item.type] || 'bg-gray-400'}`}
                          style={{ width: `${(item.count / (stats?.overview?.totalLeads || 1)) * 100}%` }} />
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{item.count}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Cities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Cities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.topCities?.map((city: any, i: number) => (
                <div key={city?.id || i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </div>
                    <span className="text-sm font-medium">{city?.name || 'Unknown'}</span>
                  </div>
                  <Badge variant="outline">{city?.count} cars</Badge>
                </div>
              ))}
              {(!stats?.topCities?.length) && <p className="text-gray-400 text-sm text-center py-4">No city data</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Price Stats */}
      {stats?.priceStats && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Price Statistics (Active Cars)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-500">Average</p>
                <p className="text-xl font-bold text-green-600">{formatPrice(stats.priceStats.average)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Minimum</p>
                <p className="text-xl font-bold text-blue-600">{formatPrice(stats.priceStats.min)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Maximum</p>
                <p className="text-xl font-bold text-purple-600">{formatPrice(stats.priceStats.max)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
