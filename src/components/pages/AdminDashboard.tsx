'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import {
  LayoutDashboard,
  Car,
  Tag,
  MapPin,
  Store,
  Users,
  ClipboardList,
  DollarSign,
  Shield,
  Handshake,
  CalendarCheck,
  FileText,
  HelpCircle,
  Quote,
  Image as ImageIcon,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  LogOut,
  Menu,
  RefreshCw,
  TrendingUp,
  Eye,
  Phone,
  Search,
} from 'lucide-react'

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

interface CarItem {
  id: string
  title: string
  price: number
  status: string
  year: number
  kmDriven: number
  fuelType: string
  transmission: string
  bodyType: string
  color: string | null
  badge: string | null
  isCertified: boolean
  brandId: string
  modelId: string
  cityId: string | null
  description: string | null
  brand?: { id: string; name: string }
  model?: { id: string; name: string }
  city?: { id: string; name: string }
  images?: { id: string; url: string }[]
  createdAt: string
}

interface LeadItem {
  id: string
  name: string
  phone: string
  email: string | null
  type: string
  status: string
  message: string | null
  car?: { id: string; title: string; price: number }
  createdAt: string
}

interface BlogItem {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  status: string
  tags: string | null
  coverImage: string | null
  createdAt: string
}

interface DashboardStats {
  totalCars: number
  activeCars: number
  featuredCars: number
  totalLeads: number
  newLeads: number
  convertedLeads: number
  totalUsers: number
  totalDealers: number
  totalBlogs: number
  monthlyLeads: number
  monthlyCars: number
}

// ─── Helpers ────────────────────────────────────────────────────────────
const API = '/api'
function authHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('meripehli-token') : null
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
}

function formatPrice(n: number) {
  return '₹' + (n >= 100000 ? (n / 100000).toFixed(1) + ' L' : n.toLocaleString('en-IN'))
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function statusColor(s: string) {
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

function leadTypeColor(t: string) {
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
  | 'dashboard'
  | 'cars'
  | 'brands'
  | 'cities'
  | 'dealers'
  | 'users'
  | 'leads'
  | 'finance-leads'
  | 'insurance-leads'
  | 'sell-car-leads'
  | 'test-drive-leads'
  | 'blogs'
  | 'faqs'
  | 'testimonials'
  | 'banners'
  | 'settings'

interface SidebarItem {
  id: Section
  label: string
  icon: React.ReactNode
}

const sidebarGroups: { title: string; items: SidebarItem[] }[] = [
  {
    title: 'MAIN',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
      { id: 'cars', label: 'Cars', icon: <Car size={18} /> },
      { id: 'brands', label: 'Brands', icon: <Tag size={18} /> },
      { id: 'cities', label: 'Cities', icon: <MapPin size={18} /> },
      { id: 'dealers', label: 'Dealers', icon: <Store size={18} /> },
      { id: 'users', label: 'Users', icon: <Users size={18} /> },
    ],
  },
  {
    title: 'LEADS',
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
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const { setShowAuthModal } = useAppStore()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState<Section>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Data states
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentCars, setRecentCars] = useState<CarItem[]>([])
  const [recentLeads, setRecentLeads] = useState<LeadItem[]>([])
  const [cars, setCars] = useState<CarItem[]>([])
  const [brands, setBrands] = useState<any[]>([])
  const [models, setModels] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])
  const [dealers, setDealers] = useState<any[]>([])
  const [usersList, setUsersList] = useState<any[]>([])
  const [leads, setLeads] = useState<LeadItem[]>([])
  const [blogs, setBlogs] = useState<BlogItem[]>([])
  const [settings, setSettings] = useState<{ key: string; value: string | null; type: string; id: string }[]>([])
  const [faqs, setFaqs] = useState<any[]>([])
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [banners, setBanners] = useState<any[]>([])
  const [dataLoading, setDataLoading] = useState(false)

  // Dialog states
  const [carDialogOpen, setCarDialogOpen] = useState(false)
  const [editingCar, setEditingCar] = useState<CarItem | null>(null)
  const [blogDialogOpen, setBlogDialogOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState<BlogItem | null>(null)
  const [dealerDialogOpen, setDealerDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: string } | null>(null)

  // Settings edit values
  const [settingsEditValues, setSettingsEditValues] = useState<Record<string, string>>({})

  // Filters
  const [leadTypeFilter, setLeadTypeFilter] = useState<string>('')

  // ─── Auth Check ───────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true
    const token = localStorage.getItem('meripehli-token')
    if (!token) {
      const id = setTimeout(() => { if (mounted) setLoading(false) }, 0)
      return () => { mounted = false; clearTimeout(id) }
    }
    fetch(`${API}/auth/me`, { headers: authHeaders() })
      .then(r => r.json())
      .then(data => {
        if (mounted && data.user) setUser(data.user)
      })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('meripehli-token')
    setUser(null)
  }

  // ─── Data Fetchers ────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    try {
      const r = await fetch(`${API}/dashboard/stats`, { headers: authHeaders() })
      const d = await r.json()
      setStats(d.overview)
      setRecentCars(d.recentCars || [])
      setRecentLeads(d.recentLeads || [])
    } catch { /* ignore */ }
  }, [])

  const fetchCars = useCallback(async (status?: string) => {
    setDataLoading(true)
    try {
      const params = new URLSearchParams({ status: 'ALL', limit: '50' })
      if (status) params.set('status', status)
      const r = await fetch(`${API}/cars?${params}`, { headers: authHeaders() })
      const d = await r.json()
      setCars(d.cars || [])
    } catch { /* ignore */ }
    setDataLoading(false)
  }, [])

  const fetchBrands = useCallback(async () => {
    try {
      const r = await fetch(`${API}/brands`)
      const d = await r.json()
      setBrands(d.brands || [])
    } catch { /* ignore */ }
  }, [])

  const fetchModels = useCallback(async (brandId: string) => {
    if (!brandId) { setModels([]); return }
    try {
      const r = await fetch(`${API}/models?brandId=${brandId}`)
      const d = await r.json()
      setModels(d.models || [])
    } catch { /* ignore */ }
  }, [])

  const fetchCities = useCallback(async () => {
    try {
      const r = await fetch(`${API}/cities`)
      const d = await r.json()
      setCities(d.cities || [])
    } catch { /* ignore */ }
  }, [])

  const fetchDealers = useCallback(async () => {
    try {
      const r = await fetch(`${API}/dealers`)
      const d = await r.json()
      setDealers(d.dealers || [])
    } catch { /* ignore */ }
  }, [])

  const fetchUsers = useCallback(async () => {
    setDataLoading(true)
    try {
      const r = await fetch(`${API}/users?limit=50`, { headers: authHeaders() })
      const d = await r.json()
      setUsersList(d.users || [])
    } catch { /* ignore */ }
    setDataLoading(false)
  }, [])

  const fetchLeads = useCallback(async (type?: string) => {
    setDataLoading(true)
    try {
      const params = new URLSearchParams({ limit: '50' })
      if (type) params.set('type', type)
      const r = await fetch(`${API}/leads?${params}`, { headers: authHeaders() })
      const d = await r.json()
      setLeads(d.leads || [])
    } catch { /* ignore */ }
    setDataLoading(false)
  }, [])

  const fetchBlogs = useCallback(async () => {
    setDataLoading(true)
    try {
      const r = await fetch(`${API}/blogs?limit=50`, { headers: authHeaders() })
      const d = await r.json()
      setBlogs(d.blogs || [])
    } catch { /* ignore */ }
    setDataLoading(false)
  }, [])

  const fetchSettings = useCallback(async () => {
    setDataLoading(true)
    try {
      const r = await fetch(`${API}/settings`)
      const d = await r.json()
      setSettings(d.raw || [])
    } catch { /* ignore */ }
    setDataLoading(false)
  }, [])

  const fetchFaqs = useCallback(async () => {
    setDataLoading(true)
    try {
      const r = await fetch(`${API}/faqs`)
      const d = await r.json()
      setFaqs(d.faqs || [])
    } catch { /* ignore */ }
    setDataLoading(false)
  }, [])

  const fetchTestimonials = useCallback(async () => {
    setDataLoading(true)
    try {
      const r = await fetch(`${API}/testimonials`)
      const d = await r.json()
      setTestimonials(d.testimonials || [])
    } catch { /* ignore */ }
    setDataLoading(false)
  }, [])

  const fetchBanners = useCallback(async () => {
    setDataLoading(true)
    try {
      const r = await fetch(`${API}/banners`)
      const d = await r.json()
      setBanners(d.banners || [])
    } catch { /* ignore */ }
    setDataLoading(false)
  }, [])

  // Load data when section changes
  useEffect(() => {
    if (!user) return
    let cancelled = false
    const timer = setTimeout(async () => {
      if (cancelled) return
      switch (activeSection) {
        case 'dashboard': await fetchStats(); break
        case 'cars': await fetchCars(); fetchBrands(); fetchCities(); break
        case 'brands': await fetchBrands(); break
        case 'cities': await fetchCities(); break
        case 'dealers': await fetchDealers(); fetchCities(); break
        case 'users': await fetchUsers(); break
        case 'leads': await fetchLeads(); break
        case 'finance-leads': await fetchLeads('FINANCE'); break
        case 'insurance-leads': await fetchLeads('INSURANCE'); break
        case 'sell-car-leads': await fetchLeads('SELL_CAR'); break
        case 'test-drive-leads': await fetchLeads('TEST_DRIVE'); break
        case 'blogs': await fetchBlogs(); break
        case 'faqs': await fetchFaqs(); break
        case 'testimonials': await fetchTestimonials(); break
        case 'banners': await fetchBanners(); break
        case 'settings': await fetchSettings(); break
      }
    }, 0)
    return () => { cancelled = true; clearTimeout(timer) }
  }, [activeSection, user])

  // ─── Auth Guards ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600" />
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

  if (!['SUPER_ADMIN', 'ADMIN', 'DEALER'].includes(user?.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="p-8 text-center max-w-sm">
          <Shield size={40} className="mx-auto mb-4 text-red-400" />
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-slate-500">You don't have permission to access this page.</p>
        </Card>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════════
  // SECTION RENDERERS
  // ═══════════════════════════════════════════════════════════════════

  // ─── Dashboard Overview ────────────────────────────────────────────
  function renderDashboard() {
    const statCards = [
      { label: 'Total Cars', value: stats?.totalCars ?? 0, icon: <Car size={20} />, color: 'bg-blue-50 text-blue-600' },
      { label: 'Active Cars', value: stats?.activeCars ?? 0, icon: <TrendingUp size={20} />, color: 'bg-emerald-50 text-emerald-600' },
      { label: 'Sold Cars', value: stats?.featuredCars ?? 0, icon: <Car size={20} />, color: 'bg-violet-50 text-violet-600' },
      { label: 'Total Leads', value: stats?.totalLeads ?? 0, icon: <ClipboardList size={20} />, color: 'bg-amber-50 text-amber-600' },
      { label: 'New Leads', value: stats?.newLeads ?? 0, icon: <Phone size={20} />, color: 'bg-rose-50 text-rose-600' },
      { label: 'Finance Leads', value: stats?.convertedLeads ?? 0, icon: <DollarSign size={20} />, color: 'bg-cyan-50 text-cyan-600' },
      { label: 'Test Drives', value: stats?.monthlyLeads ?? 0, icon: <CalendarCheck size={20} />, color: 'bg-orange-50 text-orange-600' },
      { label: 'Dealers', value: stats?.totalDealers ?? 0, icon: <Store size={20} />, color: 'bg-pink-50 text-pink-600' },
    ]

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard Overview</h1>
            <p className="text-slate-500 text-sm">Welcome back, {user?.name || user?.email}</p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchStats}>
            <RefreshCw size={14} className="mr-1" /> Refresh
          </Button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <Card key={s.label} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${s.color}`}>{s.icon}</div>
                  <span className="text-2xl font-bold">{s.value.toLocaleString()}</span>
                </div>
                <p className="text-xs text-slate-500 font-medium">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Cars */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Recent Cars</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Title</TableHead>
                    <TableHead className="text-xs">Price</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentCars.slice(0, 5).map((car) => (
                    <TableRow key={car.id}>
                      <TableCell className="text-sm font-medium">{car.title}</TableCell>
                      <TableCell className="text-sm">{formatPrice(car.price)}</TableCell>
                      <TableCell><Badge variant="outline" className={`text-xs ${statusColor(car.status)}`}>{car.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                  {recentCars.length === 0 && <TableRow><TableCell colSpan={3} className="text-center text-sm text-slate-400 py-4">No cars yet</TableCell></TableRow>}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Recent Leads */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Recent Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Name</TableHead>
                    <TableHead className="text-xs">Type</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentLeads.slice(0, 5).map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="text-sm font-medium">{lead.name}</TableCell>
                      <TableCell><Badge variant="secondary" className={`text-xs ${leadTypeColor(lead.type)}`}>{lead.type}</Badge></TableCell>
                      <TableCell><Badge variant="outline" className={`text-xs ${statusColor(lead.status)}`}>{lead.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                  {recentLeads.length === 0 && <TableRow><TableCell colSpan={3} className="text-center text-sm text-slate-400 py-4">No leads yet</TableCell></TableRow>}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // ─── Cars Management ───────────────────────────────────────────────
  function renderCars() {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Cars Management</h1>
          <Button size="sm" onClick={() => { setEditingCar(null); setCarDialogOpen(true) }}>
            <Plus size={16} className="mr-1" /> Add Car
          </Button>
        </div>

        {dataLoading ? (
          <div className="space-y-3"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="max-h-[70vh]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Title</TableHead>
                      <TableHead className="text-xs">Brand</TableHead>
                      <TableHead className="text-xs">Price</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs">City</TableHead>
                      <TableHead className="text-xs">Date</TableHead>
                      <TableHead className="text-xs text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cars.map((car) => (
                      <TableRow key={car.id}>
                        <TableCell className="text-sm font-medium">{car.title}</TableCell>
                        <TableCell className="text-sm">{car.brand?.name || car.brandId}</TableCell>
                        <TableCell className="text-sm">{formatPrice(car.price)}</TableCell>
                        <TableCell><Badge variant="outline" className={`text-xs ${statusColor(car.status)}`}>{car.status}</Badge></TableCell>
                        <TableCell className="text-sm">{car.city?.name || '-'}</TableCell>
                        <TableCell className="text-xs text-slate-500">{formatDate(car.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditingCar(car); setCarDialogOpen(true) }}>
                              <Pencil size={14} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => { setDeleteTarget({ id: car.id, type: 'car' }); setDeleteDialogOpen(true) }}>
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {cars.length === 0 && (
                      <TableRow><TableCell colSpan={7} className="text-center py-8 text-slate-400">No cars found</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        <CarFormDialog
          open={carDialogOpen}
          onClose={() => { setCarDialogOpen(false); setEditingCar(null) }}
          car={editingCar}
          brands={brands}
          cities={cities}
          onBrandChange={fetchModels}
          onSave={async (data) => {
            try {
              if (editingCar) {
                await fetch(`${API}/cars/${editingCar.id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(data) })
                toast.success('Car updated')
              } else {
                await fetch(`${API}/cars`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(data) })
                toast.success('Car created')
              }
              setCarDialogOpen(false)
              setEditingCar(null)
              fetchCars()
            } catch (e: any) {
              toast.error(e?.message || 'Failed to save car')
            }
          }}
        />
      </div>
    )
  }

  // ─── Leads Management ─────────────────────────────────────────────
  function renderLeads() {
    const displayedLeads = leadTypeFilter ? leads.filter(l => l.type === leadTypeFilter) : leads

    const handleStatusChange = async (leadId: string, status: string) => {
      try {
        await fetch(`${API}/leads/${leadId}`, { method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ status }) })
        toast.success('Lead status updated')
        fetchLeads()
      } catch {
        toast.error('Failed to update lead')
      }
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h1 className="text-2xl font-bold">Leads</h1>
          <div className="flex gap-2 flex-wrap">
            <Button variant={leadTypeFilter === '' ? 'default' : 'outline'} size="sm" onClick={() => setLeadTypeFilter('')}>All</Button>
            <Button variant={leadTypeFilter === 'FINANCE' ? 'default' : 'outline'} size="sm" onClick={() => setLeadTypeFilter('FINANCE')}>Finance</Button>
            <Button variant={leadTypeFilter === 'INSURANCE' ? 'default' : 'outline'} size="sm" onClick={() => setLeadTypeFilter('INSURANCE')}>Insurance</Button>
            <Button variant={leadTypeFilter === 'SELL_CAR' ? 'default' : 'outline'} size="sm" onClick={() => setLeadTypeFilter('SELL_CAR')}>Sell Car</Button>
            <Button variant={leadTypeFilter === 'TEST_DRIVE' ? 'default' : 'outline'} size="sm" onClick={() => setLeadTypeFilter('TEST_DRIVE')}>Test Drive</Button>
          </div>
        </div>

        {dataLoading ? (
          <div className="space-y-3"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="max-h-[70vh]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Name</TableHead>
                      <TableHead className="text-xs">Phone</TableHead>
                      <TableHead className="text-xs">Type</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs">Car</TableHead>
                      <TableHead className="text-xs">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayedLeads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="text-sm font-medium">{lead.name}</TableCell>
                        <TableCell className="text-sm">{lead.phone}</TableCell>
                        <TableCell><Badge variant="secondary" className={`text-xs ${leadTypeColor(lead.type)}`}>{lead.type.replace('_', ' ')}</Badge></TableCell>
                        <TableCell>
                          <Select value={lead.status} onValueChange={(v) => handleStatusChange(lead.id, v)}>
                            <SelectTrigger className="h-7 w-[120px] text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST'].map(s => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-xs text-slate-500">{lead.car?.title || '-'}</TableCell>
                        <TableCell className="text-xs text-slate-500">{formatDate(lead.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                    {displayedLeads.length === 0 && (
                      <TableRow><TableCell colSpan={6} className="text-center py-8 text-slate-400">No leads found</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  // ─── Blogs Management ─────────────────────────────────────────────
  function renderBlogs() {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Blogs</h1>
          <Button size="sm" onClick={() => { setEditingBlog(null); setBlogDialogOpen(true) }}>
            <Plus size={16} className="mr-1" /> Add Blog
          </Button>
        </div>

        {dataLoading ? (
          <div className="space-y-3"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Title</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs">Date</TableHead>
                    <TableHead className="text-xs text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogs.map((blog) => (
                    <TableRow key={blog.id}>
                      <TableCell className="text-sm font-medium">{blog.title}</TableCell>
                      <TableCell><Badge variant="outline" className={`text-xs ${statusColor(blog.status)}`}>{blog.status}</Badge></TableCell>
                      <TableCell className="text-xs text-slate-500">{formatDate(blog.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditingBlog(blog); setBlogDialogOpen(true) }}>
                            <Pencil size={14} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => { setDeleteTarget({ id: blog.id, type: 'blog' }); setDeleteDialogOpen(true) }}>
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {blogs.length === 0 && (
                    <TableRow><TableCell colSpan={4} className="text-center py-8 text-slate-400">No blogs found</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        <BlogFormDialog
          open={blogDialogOpen}
          onClose={() => { setBlogDialogOpen(false); setEditingBlog(null) }}
          blog={editingBlog}
          onSave={async (data) => {
            try {
              if (editingBlog) {
                await fetch(`${API}/blogs/${editingBlog.id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(data) })
                toast.success('Blog updated')
              } else {
                await fetch(`${API}/blogs`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(data) })
                toast.success('Blog created')
              }
              setBlogDialogOpen(false)
              setEditingBlog(null)
              fetchBlogs()
            } catch {
              toast.error('Failed to save blog')
            }
          }}
        />
      </div>
    )
  }

  // ─── Simple Table Section (Brands, Cities, Dealers, Users, FAQs, Testimonials, Banners) ──────────
  function renderSimpleTable(title: string, rows: { cells: { key: string; value: React.ReactNode }[]; id: string }[], addAction?: React.ReactNode) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{title}</h1>
          {addAction}
        </div>

        {dataLoading ? (
          <div className="space-y-3"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="max-h-[70vh]">
                <Table>
                  {rows.length > 0 && (
                    <TableHeader>
                      <TableRow>
                        {rows[0].cells.map(c => (
                          <TableHead key={c.key} className="text-xs">{c.key}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                  )}
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.cells.map(c => (
                          <TableCell key={row.id + c.key} className="text-sm">{c.value}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                    {rows.length === 0 && (
                      <TableRow><TableCell colSpan={10} className="text-center py-8 text-slate-400">No data found</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  function renderBrands() {
    const rows = brands.map(b => ({
      id: b.id,
      cells: [
        { key: 'Logo', value: b.logo ? <img src={b.logo} className="w-8 h-8 object-contain rounded" alt={b.name} /> : <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center text-xs">{b.name[0]}</div> },
        { key: 'Name', value: b.name },
        { key: 'Slug', value: <span className="text-xs text-slate-500">{b.slug}</span> },
        { key: 'Country', value: b.country || '-' },
        { key: 'Cars', value: <Badge variant="secondary" className="text-xs">{b._count?.cars || 0}</Badge> },
      ],
    }))
    return renderSimpleTable('Brands', rows)
  }

  function renderCities() {
    const rows = cities.map(c => ({
      id: c.id,
      cells: [
        { key: 'Name', value: c.name },
        { key: 'Slug', value: <span className="text-xs text-slate-500">{c.slug}</span> },
        { key: 'State', value: c.state || '-' },
        { key: 'Popular', value: c.isPopular ? <Badge className="text-xs bg-emerald-100 text-emerald-700">Yes</Badge> : <span className="text-xs text-slate-400">No</span> },
        { key: 'Cars', value: <Badge variant="secondary" className="text-xs">{c._count?.cars || 0}</Badge> },
      ],
    }))
    return renderSimpleTable('Cities', rows)
  }

  function renderDealers() {
    const rows = dealers.map(d => ({
      id: d.id,
      cells: [
        { key: 'Name', value: <span className="font-medium">{d.name}</span> },
        { key: 'Phone', value: d.phone },
        { key: 'Email', value: d.email || '-' },
        { key: 'City', value: d.city?.name || '-' },
        { key: 'Cars', value: <Badge variant="secondary" className="text-xs">{d._count?.cars || 0}</Badge> },
        { key: 'Rating', value: d.rating ? `⭐ ${d.rating}` : '-' },
      ],
    }))
    return renderSimpleTable('Dealers', rows,
      <Button size="sm" onClick={() => setDealerDialogOpen(true)}>
        <Plus size={16} className="mr-1" /> Add Dealer
      </Button>
    )
  }

  function renderUsers() {
    const rows = usersList.map(u => ({
      id: u.id,
      cells: [
        { key: 'Name', value: <span className="font-medium">{u.name || '-'}</span> },
        { key: 'Email', value: u.email },
        { key: 'Phone', value: u.phone || '-' },
        { key: 'Role', value: <Badge variant="outline" className={`text-xs ${u.role === 'SUPER_ADMIN' ? 'bg-red-50 text-red-700 border-red-200' : u.role === 'ADMIN' ? 'bg-violet-50 text-violet-700 border-violet-200' : u.role === 'DEALER' ? 'bg-blue-50 text-blue-700 border-blue-200' : u.role === 'SELLER' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-600'}`}>{u.role}</Badge> },
        { key: 'City', value: u.city?.name || '-' },
        { key: 'Active', value: u.isActive ? <Badge className="text-xs bg-emerald-100 text-emerald-700">Active</Badge> : <Badge className="text-xs bg-red-100 text-red-700">Inactive</Badge> },
      ],
    }))
    return renderSimpleTable('Users', rows)
  }

  function renderFAQs() {
    const rows = faqs.map(f => ({
      id: f.id,
      cells: [
        { key: 'Question', value: <span className="font-medium">{f.question}</span> },
        { key: 'Answer', value: <span className="text-sm text-slate-500 line-clamp-1">{f.answer}</span> },
        { key: 'Category', value: f.category || '-' },
        { key: 'Active', value: f.isActive ? <Badge className="text-xs bg-emerald-100 text-emerald-700">Yes</Badge> : <Badge className="text-xs bg-red-100 text-red-700">No</Badge> },
      ],
    }))
    return renderSimpleTable('FAQs', rows)
  }

  function renderTestimonials() {
    const rows = testimonials.map(t => ({
      id: t.id,
      cells: [
        { key: 'Name', value: <span className="font-medium">{t.name}</span> },
        { key: 'Designation', value: t.designation || '-' },
        { key: 'City', value: t.city || '-' },
        { key: 'Rating', value: '⭐'.repeat(t.rating) },
        { key: 'Active', value: t.isActive ? <Badge className="text-xs bg-emerald-100 text-emerald-700">Yes</Badge> : <Badge className="text-xs bg-red-100 text-red-700">No</Badge> },
      ],
    }))
    return renderSimpleTable('Testimonials', rows)
  }

  function renderBanners() {
    const rows = banners.map(b => ({
      id: b.id,
      cells: [
        { key: 'Title', value: <span className="font-medium">{b.title}</span> },
        { key: 'Subtitle', value: b.subtitle || '-' },
        { key: 'Position', value: <Badge variant="secondary" className="text-xs">{b.position}</Badge> },
        { key: 'Sort', value: b.sortOrder },
        { key: 'Active', value: b.isActive ? <Badge className="text-xs bg-emerald-100 text-emerald-700">Yes</Badge> : <Badge className="text-xs bg-red-100 text-red-700">No</Badge> },
      ],
    }))
    return renderSimpleTable('Banners', rows)
  }

  // ─── Settings ─────────────────────────────────────────────────────
  function renderSettings() {
    const handleSave = async (key: string) => {
      try {
        await fetch(`${API}/settings`, {
          method: 'PUT',
          headers: authHeaders(),
          body: JSON.stringify({ key, value: settingsEditValues[key] || null }),
        })
        toast.success('Setting saved')
      } catch {
        toast.error('Failed to save setting')
      }
    }

    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Settings</h1>

        {dataLoading ? (
          <div className="space-y-3"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="max-h-[70vh]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs w-[200px]">Key</TableHead>
                      <TableHead className="text-xs">Value</TableHead>
                      <TableHead className="text-xs w-[80px]">Type</TableHead>
                      <TableHead className="text-xs w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {settings.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell className="text-sm font-mono font-medium">{s.key}</TableCell>
                        <TableCell>
                          {s.type === 'html' ? (
                            <Textarea
                              value={settingsEditValues[s.key] ?? s.value ?? ''}
                              onChange={(e) => setSettingsEditValues({ ...settingsEditValues, [s.key]: e.target.value })}
                              rows={3}
                              className="text-sm"
                            />
                          ) : (
                            <Input
                              value={settingsEditValues[s.key] ?? s.value ?? ''}
                              onChange={(e) => setSettingsEditValues({ ...settingsEditValues, [s.key]: e.target.value })}
                              className="text-sm"
                            />
                          )}
                        </TableCell>
                        <TableCell><Badge variant="secondary" className="text-xs">{s.type}</Badge></TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline" onClick={() => handleSave(s.key)}>Save</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {settings.length === 0 && (
                      <TableRow><TableCell colSpan={4} className="text-center py-8 text-slate-400">No settings found</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  // ─── Section Router ───────────────────────────────────────────────
  function renderSection() {
    switch (activeSection) {
      case 'dashboard': return renderDashboard()
      case 'cars': return renderCars()
      case 'brands': return renderBrands()
      case 'cities': return renderCities()
      case 'dealers': return renderDealers()
      case 'users': return renderUsers()
      case 'leads': return renderLeads()
      case 'finance-leads':
      case 'insurance-leads':
      case 'sell-car-leads':
      case 'test-drive-leads':
        return renderLeads()
      case 'blogs': return renderBlogs()
      case 'faqs': return renderFAQs()
      case 'testimonials': return renderTestimonials()
      case 'banners': return renderBanners()
      case 'settings': return renderSettings()
      default: return renderDashboard()
    }
  }

  // ─── Delete Handler ───────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      const endpoint = deleteTarget.type === 'car' ? `${API}/cars/${deleteTarget.id}` : `${API}/blogs/${deleteTarget.id}`
      const res = await fetch(endpoint, { method: 'DELETE', headers: authHeaders() })
      if (res.ok) {
        toast.success(`Deleted successfully`)
        if (deleteTarget.type === 'car') fetchCars()
        else fetchBlogs()
      } else {
        toast.error('Delete failed')
      }
    } catch {
      toast.error('Delete failed')
    }
    setDeleteDialogOpen(false)
    setDeleteTarget(null)
  }

  // ═══════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-16' : sidebarOpen ? 'w-64' : 'w-0'} bg-[#0a1628] text-white flex-shrink-0 transition-all duration-300 overflow-hidden`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-14 flex items-center px-4 border-b border-white/10">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-2">
                <Car size={24} className="text-emerald-400" />
                <span className="font-bold text-sm">MeriPehli Gadi</span>
              </div>
            )}
          </div>

          {/* Nav */}
          <ScrollArea className="flex-1 py-2">
            {sidebarGroups.map((group) => (
              <div key={group.title} className="mb-2">
                {!sidebarCollapsed && (
                  <div className="px-4 py-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    {group.title}
                  </div>
                )}
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                      activeSection === item.id
                        ? 'bg-white/10 text-white border-r-2 border-emerald-400'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    {item.icon}
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </button>
                ))}
              </div>
            ))}
          </ScrollArea>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-14 bg-white border-b flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
              <Menu size={18} />
            </Button>
            <h2 className="text-sm font-semibold capitalize text-slate-700">
              {activeSection.replace(/-/g, ' ')}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600 hidden sm:block">
              {user?.name || user?.email}
            </span>
            <Badge variant="outline" className="text-xs">{user?.role}</Badge>
            <Button variant="outline" size="sm" onClick={handleLogout} className="text-red-500 hover:text-red-600 hover:bg-red-50">
              <LogOut size={14} className="mr-1" /> Logout
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {renderSection()}
        </main>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.type}?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. This will permanently delete the item.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dealer Dialog */}
      <DealerFormDialog
        open={dealerDialogOpen}
        onClose={() => setDealerDialogOpen(false)}
        cities={cities}
        onSave={async (data) => {
          try {
            await fetch(`${API}/dealers`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(data) })
            toast.success('Dealer created')
            setDealerDialogOpen(false)
            fetchDealers()
          } catch {
            toast.error('Failed to create dealer')
          }
        }}
      />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════

// ─── Car Form Dialog ────────────────────────────────────────────────
function CarFormDialog({
  open, onClose, car, brands, cities, onBrandChange, onSave,
}: {
  open: boolean
  onClose: () => void
  car: CarItem | null
  brands: any[]
  cities: any[]
  onBrandChange: (brandId: string) => void
  onSave: (data: any) => void
}) {
  const defaultForm = {
    title: '', brandId: '', modelId: '', year: new Date().getFullYear(), price: 0, kmDriven: 0,
    fuelType: 'PETROL', transmission: 'MANUAL', bodyType: 'HATCHBACK', color: '', cityId: '',
    description: '', badge: '', status: 'ACTIVE', isCertified: false,
  }

  const [form, setForm] = useState(defaultForm)
  const [models, setModels] = useState<any[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...form,
      price: Number(form.price),
      year: Number(form.year),
      kmDriven: Number(form.kmDriven),
    })
  }

  const updateField = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (field === 'brandId') {
      setForm(prev => ({ ...prev, modelId: '' }))
      onBrandChange(value)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => {
      if (v && car) {
        setForm({
          title: car.title, brandId: car.brandId, modelId: car.modelId, year: car.year,
          price: car.price, kmDriven: car.kmDriven, fuelType: car.fuelType,
          transmission: car.transmission, bodyType: car.bodyType, color: car.color || '',
          cityId: car.cityId || '', description: car.description || '', badge: car.badge || '',
          status: car.status, isCertified: car.isCertified,
        })
        onBrandChange(car.brandId)
      } else if (v) {
        setForm(defaultForm)
        setModels([])
      } else {
        onClose()
      }
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{car ? 'Edit Car' : 'Add New Car'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={e => updateField('title', e.target.value)} required />
            </div>
            <div>
              <Label>Brand</Label>
              <Select value={form.brandId} onValueChange={v => updateField('brandId', v)} required>
                <SelectTrigger><SelectValue placeholder="Select brand" /></SelectTrigger>
                <SelectContent>
                  {brands.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Model</Label>
              <Select value={form.modelId} onValueChange={v => updateField('modelId', v)} required disabled={!form.brandId}>
                <SelectTrigger><SelectValue placeholder="Select model" /></SelectTrigger>
                <SelectContent>
                  {models.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Price (₹)</Label>
              <Input type="number" value={form.price} onChange={e => updateField('price', e.target.value)} required min="0" />
            </div>
            <div>
              <Label>Year</Label>
              <Input type="number" value={form.year} onChange={e => updateField('year', e.target.value)} required min="1900" max={new Date().getFullYear() + 1} />
            </div>
            <div>
              <Label>KM Driven</Label>
              <Input type="number" value={form.kmDriven} onChange={e => updateField('kmDriven', e.target.value)} required min="0" />
            </div>
            <div>
              <Label>Fuel Type</Label>
              <Select value={form.fuelType} onValueChange={v => updateField('fuelType', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['PETROL', 'DIESEL', 'CNG', 'ELECTRIC', 'HYBRID', 'LPG'].map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Transmission</Label>
              <Select value={form.transmission} onValueChange={v => updateField('transmission', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['MANUAL', 'AUTOMATIC', 'CVT', 'DCT', 'AMT'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Body Type</Label>
              <Select value={form.bodyType} onValueChange={v => updateField('bodyType', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['SUV', 'SEDAN', 'HATCHBACK', 'COUPE', 'CONVERTIBLE', 'VAN', 'TRUCK', 'MPV', 'PICKUP', 'WAGON'].map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Color</Label>
              <Input value={form.color} onChange={e => updateField('color', e.target.value)} />
            </div>
            <div>
              <Label>City</Label>
              <Select value={form.cityId} onValueChange={v => updateField('cityId', v)}>
                <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
                <SelectContent>
                  {cities.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Badge</Label>
              <Input value={form.badge} onChange={e => updateField('badge', e.target.value)} placeholder="e.g. Best Deal" />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={v => updateField('status', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['ACTIVE', 'DRAFT', 'PENDING', 'SOLD', 'FEATURED'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={e => updateField('description', e.target.value)} rows={3} />
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <Checkbox checked={form.isCertified} onCheckedChange={(v) => updateField('isCertified', v)} />
              <Label>Is Certified</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{car ? 'Update Car' : 'Create Car'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── Blog Form Dialog ───────────────────────────────────────────────
function BlogFormDialog({
  open, onClose, blog, onSave,
}: {
  open: boolean
  onClose: () => void
  blog: BlogItem | null
  onSave: (data: any) => void
}) {
  const defaultForm = { title: '', content: '', status: 'DRAFT' }
  const [form, setForm] = useState(defaultForm)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(form)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => {
      if (v && blog) {
        setForm({ title: blog.title, content: blog.content || '', status: blog.status })
      } else if (v) {
        setForm(defaultForm)
      } else {
        onClose()
      }
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{blog ? 'Edit Blog' : 'Add New Blog'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <Label>Content</Label>
            <Textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={8} />
          </div>
          <div>
            <Label>Status</Label>
            <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {['DRAFT', 'PUBLISHED', 'ARCHIVED'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{blog ? 'Update Blog' : 'Create Blog'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── Dealer Form Dialog ─────────────────────────────────────────────
function DealerFormDialog({
  open, onClose, cities, onSave,
}: {
  open: boolean
  onClose: () => void
  cities: any[]
  onSave: (data: any) => void
}) {
  const defaultForm = { name: '', phone: '', email: '', cityId: '', address: '' }
  const [form, setForm] = useState(defaultForm)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(form)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => {
      if (v) setForm(defaultForm)
      else onClose()
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Dealer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <Label>City</Label>
            <Select value={form.cityId} onValueChange={v => setForm({ ...form, cityId: v })} required>
              <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
              <SelectContent>
                {cities.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Address</Label>
            <Textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} rows={2} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Create Dealer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
