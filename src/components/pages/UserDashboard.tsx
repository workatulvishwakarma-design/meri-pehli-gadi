'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Heart,
  MessageSquare,
  Car,
  DollarSign,
  Shield,
  Settings,
  LogOut,
  ChevronRight,
  Eye,
  X,
  Plus,
  TrendingUp,
  Users,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Package,
  BarChart3,
  Upload,
  Camera,
  Star,
  Search,
  Filter,
  ChevronDown,
  Truck,
  FileText,
  Send,
  Trash2,
  ExternalLink,
  Bell,
  UserCircle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useAppStore } from '@/lib/store'
import { toast } from 'sonner'
import Image from 'next/image'

// ─── Types ────────────────────────────────────────────────────────────

interface UserData {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
  phone?: string
  city?: string
  createdAt?: string
}

interface WishlistCar {
  id: string
  carId: string
  createdAt: string
  car: {
    id: string
    title: string
    price: number
    year: number
    kmDriven: number
    fuelType: string
    transmission: string
    city?: { name: string } | null
    images: { url: string; alt?: string }[]
    brand?: { name: string } | null
    model?: { name: string } | null
  }
}

interface LeadData {
  id: string
  type: string
  status: string
  name: string
  email?: string
  phone: string
  message?: string
  createdAt: string
  car?: { id: string; title: string; price: number } | null
}

interface TestDriveData {
  id: string
  name: string
  email?: string
  phone: string
  preferredDate?: string
  preferredTime?: string
  message?: string
  status: string
  createdAt: string
  car: { id: string; title: string; price: number }
}

interface SellerCar {
  id: string
  title: string
  slug: string
  price: number
  year: number
  status: string
  viewsCount: number
  inquiriesCount: number
  images: { url: string; alt?: string }[]
  brand?: { name: string } | null
  model?: { name: string } | null
  city?: { name: string } | null
  createdAt: string
}

// ─── Helpers ──────────────────────────────────────────────────────────

function formatPrice(price: number): string {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`
  return `₹${price.toLocaleString('en-IN')}`
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function getStatusBadge(status: string) {
  const map: Record<string, { label: string; className: string }> = {
    NEW: { label: 'New', className: 'bg-blue-100 text-blue-700 border-blue-200' },
    CONTACTED: { label: 'Contacted', className: 'bg-amber-100 text-amber-700 border-amber-200' },
    QUALIFIED: { label: 'Qualified', className: 'bg-purple-100 text-purple-700 border-purple-200' },
    CONVERTED: { label: 'Converted', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    LOST: { label: 'Lost', className: 'bg-red-100 text-red-700 border-red-200' },
    ACTIVE: { label: 'Active', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    SOLD: { label: 'Sold', className: 'bg-slate-100 text-slate-700 border-slate-200' },
    PENDING: { label: 'Pending', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    DRAFT: { label: 'Draft', className: 'bg-slate-100 text-slate-700 border-slate-200' },
    FEATURED: { label: 'Featured', className: 'bg-orange-100 text-orange-700 border-orange-200' },
  }
  const info = map[status] || { label: status, className: 'bg-slate-100 text-slate-700' }
  return <Badge variant="outline" className={info.className}>{info.label}</Badge>
}

function getLeadTypeLabel(type: string) {
  const map: Record<string, string> = {
    CONTACT: 'Inquiry',
    TEST_DRIVE: 'Test Drive',
    FINANCE: 'Loan',
    INSURANCE: 'Insurance',
    SELL_CAR: 'Sell Car',
    VALUATION: 'Valuation',
    MAKE_OFFER: 'Make Offer',
    DEALER_INQUIRY: 'Dealer Inquiry',
  }
  return map[type] || type
}

const TOKEN_KEY = 'meripehli-token'

// ─── Sidebar Menu Config ──────────────────────────────────────────────

type SidebarItem = {
  id: string
  label: string
  icon: React.ReactNode
  roles?: string[]
}

const sidebarItems: SidebarItem[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="size-4" /> },
  { id: 'wishlist', label: 'My Wishlist', icon: <Heart className="size-4" />, roles: ['BUYER'] },
  { id: 'inquiries', label: 'My Inquiries', icon: <MessageSquare className="size-4" />, roles: ['BUYER'] },
  { id: 'test-drives', label: 'Test Drives', icon: <Car className="size-4" />, roles: ['BUYER'] },
  { id: 'loans', label: 'Loan Applications', icon: <DollarSign className="size-4" />, roles: ['BUYER'] },
  { id: 'insurance', label: 'Insurance Applications', icon: <Shield className="size-4" />, roles: ['BUYER'] },
  { id: 'my-listings', label: 'My Listings', icon: <Package className="size-4" />, roles: ['SELLER', 'DEALER'] },
  { id: 'add-car', label: 'Add New Car', icon: <Plus className="size-4" />, roles: ['SELLER', 'DEALER'] },
  { id: 'leads', label: 'Lead Management', icon: <Users className="size-4" />, roles: ['SELLER', 'DEALER'] },
  { id: 'performance', label: 'Performance', icon: <BarChart3 className="size-4" />, roles: ['SELLER', 'DEALER'] },
  { id: 'profile', label: 'Profile Settings', icon: <Settings className="size-4" /> },
]

// ─── API Helper ───────────────────────────────────────────────────────

async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  const token = localStorage.getItem(TOKEN_KEY)
  if (!token) return null
  try {
    const res = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(options?.headers || {}),
      },
    })
    if (res.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      return null
    }
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Request failed' }))
      throw new Error(err.error || `HTTP ${res.status}`)
    }
    return await res.json()
  } catch (err) {
    console.error(`API error [${endpoint}]:`, err)
    throw err
  }
}

// ─── Main Component ───────────────────────────────────────────────────

export function UserDashboard() {
  const store = useAppStore()
  const navigateTo = useAppStore((s) => s.navigateTo)
  const setShowAuthModal = useAppStore((s) => s.setShowAuthModal)
  const currentPage = useAppStore((s) => s.currentPage)
  const setAuth = useAppStore((s) => s.setAuth)

  const [activeSection, setActiveSection] = useState('overview')
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Data state
  const [wishlist, setWishlist] = useState<WishlistCar[]>([])
  const [inquiries, setInquiries] = useState<LeadData[]>([])
  const [testDrives, setTestDrives] = useState<TestDriveData[]>([])
  const [financeLeads, setFinanceLeads] = useState<LeadData[]>([])
  const [insuranceLeads, setInsuranceLeads] = useState<LeadData[]>([])
  const [myListings, setMyListings] = useState<SellerCar[]>([])
  const [sellerLeads, setSellerLeads] = useState<LeadData[]>([])

  // Stats
  const [stats, setStats] = useState({
    savedCars: 0,
    inquiries: 0,
    testDrives: 0,
    applications: 0,
    totalViews: 0,
    totalListings: 0,
    activeListings: 0,
    totalLeads: 0,
  })

  // Profile form
  const [profileName, setProfileName] = useState('')
  const [profilePhone, setProfilePhone] = useState('')
  const [profileCity, setProfileCity] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)

  // Add car form
  const [showAddCar, setShowAddCar] = useState(false)
  const [addCarForm, setAddCarForm] = useState({
    title: '',
    year: '2023',
    price: '',
    kmDriven: '',
    fuelType: 'PETROL',
    transmission: 'MANUAL',
    description: '',
  })
  const [addingCar, setAddingCar] = useState(false)

  const userRole = user?.role || 'BUYER'

  // ─── Auth Check ────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true
    void (async () => {
      const token = localStorage.getItem(TOKEN_KEY)
      if (!token) {
        if (mounted) setLoading(false)
        return
      }
      try {
        const data = await apiFetch<{ user: UserData }>('/api/auth/me')
        if (!mounted) return
        if (data?.user) {
          setUser(data.user)
          setAuth({
            id: data.user.id,
            name: data.user.name || '',
            email: data.user.email,
            role: data.user.role,
            avatar: data.user.avatar,
          })
          setProfileName(data.user.name || '')
          setProfilePhone(data.user.phone || '')
          setProfileCity(data.user.city || '')

          // DEALER redirects
          if (data.user.role === 'DEALER' || data.user.role === 'ADMIN' || data.user.role === 'SUPER_ADMIN') {
            navigateTo('admin-dashboard')
            if (mounted) setLoading(false)
            return
          }
        } else {
          localStorage.removeItem(TOKEN_KEY)
        }
      } catch {
        localStorage.removeItem(TOKEN_KEY)
      }
      if (mounted) setLoading(false)
    })()
    return () => { mounted = false }
  }, [setAuth, navigateTo])

  // ─── Fetch Data ────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return
    let mounted = true
    void (async () => {
      if (userRole === 'BUYER') {
        try {
          const data = await apiFetch<{ wishlists: WishlistCar[] }>('/api/wishlist')
          if (data?.wishlists && mounted) {
            setWishlist(data.wishlists)
            setStats((s) => ({ ...s, savedCars: data.wishlists.length }))
          }
        } catch { /* empty */ }
        try {
          const data = await apiFetch<{ leads: LeadData[]; pagination: { total: number } }>('/api/leads?type=CONTACT&limit=50')
          if (data?.leads && mounted) {
            setInquiries(data.leads)
            setStats((s) => ({ ...s, inquiries: data.pagination.total }))
          }
        } catch { /* empty */ }
        try {
          const data = await apiFetch<{ leads: LeadData[] }>('/api/leads?type=TEST_DRIVE&limit=50')
          if (data?.leads && mounted) {
            setTestDrives(data.leads as unknown as TestDriveData[])
            setStats((s) => ({ ...s, testDrives: data.leads.length }))
          }
        } catch { /* empty */ }
        try {
          const data = await apiFetch<{ leads: LeadData[] }>('/api/leads?type=FINANCE&limit=50')
          if (data?.leads && mounted) setFinanceLeads(data.leads)
        } catch { /* empty */ }
        try {
          const data = await apiFetch<{ leads: LeadData[] }>('/api/leads?type=INSURANCE&limit=50')
          if (data?.leads && mounted) setInsuranceLeads(data.leads)
        } catch { /* empty */ }
      }
      if (userRole === 'SELLER') {
        try {
          const data = await apiFetch<{ data: SellerCar[] }>('/api/cars?limit=50')
          if (data?.data && mounted) {
            setMyListings(data.data)
            setStats((s) => ({
              ...s,
              totalListings: data.data.length,
              activeListings: data.data.filter((c) => c.status === 'ACTIVE' || c.status === 'FEATURED').length,
              totalViews: data.data.reduce((acc, c) => acc + (c.viewsCount || 0), 0),
            }))
          }
        } catch { /* empty */ }
        try {
          const data = await apiFetch<{ leads: LeadData[]; pagination: { total: number } }>('/api/leads?limit=50')
          if (data?.leads && mounted) {
            setSellerLeads(data.leads)
            setStats((s) => ({ ...s, totalLeads: data.pagination.total }))
          }
        } catch { /* empty */ }
      }
    })()
    return () => { mounted = false }
  }, [user, userRole])

  // ─── Fetch My Listings (for SELLER) ──────────────────────────────
  const fetchMyListings = async () => {
    try {
      const data = await apiFetch<{ data: SellerCar[] }>('/api/cars?limit=50')
      if (data?.data) {
        setMyListings(data.data)
        setStats((s) => ({
          ...s,
          totalListings: data.data.length,
          activeListings: data.data.filter((c) => c.status === 'ACTIVE' || c.status === 'FEATURED').length,
          totalViews: data.data.reduce((acc, c) => acc + (c.viewsCount || 0), 0),
        }))
      }
    } catch { /* empty */ }
  }

  // ─── Actions ───────────────────────────────────────────────────────
  const removeFromWishlist = async (carId: string) => {
    try {
      await apiFetch(`/api/wishlist?carId=${carId}`, { method: 'DELETE' })
      setWishlist((w) => w.filter((item) => item.carId !== carId))
      setStats((s) => ({ ...s, savedCars: s.savedCars - 1 }))
      toast.success('Removed from wishlist')
    } catch {
      toast.error('Failed to remove from wishlist')
    }
  }

  const handleLogin = () => {
    setShowAuthModal(true)
  }

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
    setAuth(null)
    navigateTo('home')
    toast.success('Logged out successfully')
  }

  const handleSaveProfile = async () => {
    setSavingProfile(true)
    try {
      // Profile update would be a PUT endpoint; using a stub for now
      toast.success('Profile updated successfully')
    } catch {
      toast.error('Failed to update profile')
    }
    setSavingProfile(false)
  }

  const handleAddCar = async () => {
    if (!addCarForm.title || !addCarForm.price) {
      toast.error('Please fill in car title and price')
      return
    }
    setAddingCar(true)
    try {
      const result = await apiFetch('/api/cars', {
        method: 'POST',
        body: JSON.stringify({
          title: addCarForm.title,
          price: parseFloat(addCarForm.price),
          year: parseInt(addCarForm.year),
          kmDriven: parseInt(addCarForm.kmDriven) || 0,
          fuelType: addCarForm.fuelType,
          transmission: addCarForm.transmission,
          description: addCarForm.description,
        }),
      })
      if (result) {
        toast.success('Car added successfully!')
        setShowAddCar(false)
        setAddCarForm({ title: '', year: '2023', price: '', kmDriven: '', fuelType: 'PETROL', transmission: 'MANUAL', description: '' })
        fetchMyListings()
      }
    } catch (err) {
      toast.error('Failed to add car')
    }
    setAddingCar(false)
  }

  // ─── Computed sidebar items based on role ───────────────────────────
  const filteredItems = sidebarItems.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  )

  // ─── LOGIN SCREEN ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand mx-auto mb-4" />
          <p className="text-slate-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-slate-50 to-orange-50/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full mx-4"
        >
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-brand/5 flex items-center justify-center mx-auto mb-6">
                <UserCircle className="size-10 text-brand" />
              </div>
              <h2 className="text-2xl font-bold text-brand mb-2">Welcome to Your Dashboard</h2>
              <p className="text-slate-500 mb-6">
                Login to access your wishlist, inquiries, test drives, and manage your car listings.
              </p>
              <Button
                onClick={handleLogin}
                className="w-full bg-brand hover:bg-brand-light text-white h-12 text-base rounded-xl"
              >
                Login to Access Dashboard
              </Button>
              <p className="text-xs text-slate-400 mt-4">
                Don&apos;t have an account? Sign up for free to get started.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  // ─── DASHBOARD LAYOUT ──────────────────────────────────────────────
  return (
    <div className="min-h-[70vh] bg-slate-50/80">
      <div className="max-w-[1400px] mx-auto px-4 py-6 md:px-6 lg:px-8">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="gap-2"
          >
            <LayoutDashboard className="size-4" />
            <span className="text-sm font-medium">Menu</span>
          </Button>
          <div className="flex items-center gap-2">
            <Avatar className="size-8">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-brand text-white text-xs font-bold">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-slate-700">{user.name}</span>
          </div>
        </div>

        <div className="flex gap-6">
          {/* ─── SIDEBAR ──────────────────────────────────────────── */}
          <aside className="hidden md:block w-64 shrink-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* User Card */}
              <Card className="mb-4 border-0 shadow-sm overflow-hidden">
                <div className="h-16 gradient-brand relative" />
                <CardContent className="p-4 -mt-8 relative">
                  <Avatar className="size-16 border-4 border-white shadow-md">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-brand text-white text-lg font-bold">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-slate-800 mt-3 text-sm">
                    {user.name || 'User'}
                  </h3>
                  <p className="text-xs text-slate-500">{user.email}</p>
                  <Badge
                    variant="outline"
                    className="mt-2 text-[10px] bg-brand/5 border-brand/20 text-brand"
                  >
                    {userRole}
                  </Badge>
                </CardContent>
              </Card>

              {/* Nav Items */}
              <Card className="border-0 shadow-sm p-2">
                <nav className="space-y-1">
                  {filteredItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveSection(item.id)
                        setMobileMenuOpen(false)
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                        activeSection === item.id
                          ? 'bg-brand text-white shadow-md shadow-brand/20'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                      {activeSection === item.id && (
                        <ChevronRight className="size-3 ml-auto" />
                      )}
                    </button>
                  ))}
                </nav>
                <Separator className="my-3" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="size-4" />
                  <span className="font-medium">Logout</span>
                </button>
              </Card>
            </motion.div>
          </aside>

          {/* Mobile Menu Overlay */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/40 z-40 md:hidden"
                  onClick={() => setMobileMenuOpen(false)}
                />
                <motion.div
                  initial={{ x: -280 }}
                  animate={{ x: 0 }}
                  exit={{ x: -280 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 p-4 shadow-2xl md:hidden overflow-y-auto"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-brand">Dashboard</h3>
                    <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(false)}>
                      <X className="size-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-3 mb-4 p-3 bg-slate-50 rounded-lg">
                    <Avatar className="size-10">
                      <AvatarFallback className="bg-brand text-white text-sm font-bold">
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                  <nav className="space-y-1">
                    {filteredItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveSection(item.id)
                          setMobileMenuOpen(false)
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                          activeSection === item.id
                            ? 'bg-brand text-white'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {item.icon}
                        <span className="font-medium">{item.label}</span>
                      </button>
                    ))}
                  </nav>
                  <Separator className="my-3" />
                  <button
                    onClick={() => { handleLogout(); setMobileMenuOpen(false) }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="size-4" />
                    <span>Logout</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* ─── CONTENT AREA ──────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                {/* Section Title */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold text-brand">
                      {filteredItems.find((i) => i.id === activeSection)?.label || 'Dashboard'}
                    </h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {activeSection === 'overview' && `Welcome back, ${user.name || 'User'}!`}
                      {activeSection === 'wishlist' && `${wishlist.length} cars saved`}
                      {activeSection === 'inquiries' && `${inquiries.length} inquiries sent`}
                      {activeSection === 'test-drives' && `${testDrives.length} test drive requests`}
                      {activeSection === 'loans' && `${financeLeads.length} loan applications`}
                      {activeSection === 'insurance' && `${insuranceLeads.length} insurance applications`}
                      {activeSection === 'my-listings' && `${myListings.length} car listings`}
                      {activeSection === 'add-car' && 'List a new car for sale'}
                      {activeSection === 'leads' && `${sellerLeads.length} leads received`}
                      {activeSection === 'performance' && 'Your selling performance'}
                      {activeSection === 'profile' && 'Manage your account'}
                    </p>
                  </div>
                  {/* Desktop: Quick action buttons */}
                  <div className="hidden md:flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateTo('used-cars')}
                      className="gap-1.5 text-xs"
                    >
                      <Search className="size-3.5" />
                      Browse Cars
                    </Button>
                    {userRole === 'BUYER' && (
                      <Button
                        size="sm"
                        onClick={() => navigateTo('sell-car')}
                        className="gap-1.5 text-xs bg-accent-orange hover:bg-orange-600 text-white"
                      >
                        <Plus className="size-3.5" />
                        Sell Your Car
                      </Button>
                    )}
                  </div>
                </div>

                {/* ─── OVERVIEW ──────────────────────────────────────── */}
                {activeSection === 'overview' && (
                  <div className="space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {userRole === 'BUYER' ? (
                        <>
                          <StatCard
                            icon={<Heart className="size-5 text-red-500" />}
                            label="Saved Cars"
                            value={stats.savedCars}
                            color="bg-red-50 border-red-100"
                          />
                          <StatCard
                            icon={<MessageSquare className="size-5 text-blue-500" />}
                            label="Inquiries"
                            value={stats.inquiries}
                            color="bg-blue-50 border-blue-100"
                          />
                          <StatCard
                            icon={<Car className="size-5 text-emerald-500" />}
                            label="Test Drives"
                            value={stats.testDrives}
                            color="bg-emerald-50 border-emerald-100"
                          />
                          <StatCard
                            icon={<FileText className="size-5 text-purple-500" />}
                            label="Applications"
                            value={stats.applications}
                            color="bg-purple-50 border-purple-100"
                          />
                        </>
                      ) : (
                        <>
                          <StatCard
                            icon={<Package className="size-5 text-blue-500" />}
                            label="Total Listings"
                            value={stats.totalListings}
                            color="bg-blue-50 border-blue-100"
                          />
                          <StatCard
                            icon={<Eye className="size-5 text-emerald-500" />}
                            label="Total Views"
                            value={stats.totalViews}
                            color="bg-emerald-50 border-emerald-100"
                          />
                          <StatCard
                            icon={<Users className="size-5 text-orange-500" />}
                            label="Total Leads"
                            value={stats.totalLeads}
                            color="bg-orange-50 border-orange-100"
                          />
                          <StatCard
                            icon={<TrendingUp className="size-5 text-purple-500" />}
                            label="Active"
                            value={stats.activeListings}
                            color="bg-purple-50 border-purple-100"
                          />
                        </>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <Card className="border-0 shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <QuickAction
                            icon={<Search className="size-5" />}
                            label="Browse Cars"
                            desc="Find your perfect car"
                            onClick={() => navigateTo('used-cars')}
                            gradient="from-blue-500 to-blue-600"
                          />
                          <QuickAction
                            icon={<Truck className="size-5" />}
                            label="Sell Your Car"
                            desc="Get the best price"
                            onClick={() => navigateTo('sell-car')}
                            gradient="from-orange-500 to-orange-600"
                          />
                          <QuickAction
                            icon={<DollarSign className="size-5" />}
                            label="Apply for Loan"
                            desc="Easy EMI options"
                            onClick={() => navigateTo('finance')}
                            gradient="from-emerald-500 to-emerald-600"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="border-0 shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {wishlist.length > 0 && (
                            <RecentItem
                              icon={<Heart className="size-4 text-red-500" />}
                              text={`You saved ${wishlist[0]?.car.title || 'a car'}`}
                              time={wishlist[0]?.createdAt || ''}
                            />
                          )}
                          {inquiries.length > 0 && (
                            <RecentItem
                              icon={<MessageSquare className="size-4 text-blue-500" />}
                              text={`Inquiry about ${inquiries[0]?.car?.title || 'a car'}`}
                              time={inquiries[0]?.createdAt || ''}
                            />
                          )}
                          {testDrives.length > 0 && (
                            <RecentItem
                              icon={<Car className="size-4 text-emerald-500" />}
                              text={`Test drive for ${testDrives[0]?.car?.title || 'a car'}`}
                              time={testDrives[0]?.createdAt || ''}
                            />
                          )}
                          {wishlist.length === 0 && inquiries.length === 0 && testDrives.length === 0 && (
                            <div className="text-center py-8">
                              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                                <Bell className="size-7 text-slate-400" />
                              </div>
                              <p className="text-slate-500 text-sm">No activity yet</p>
                              <p className="text-slate-400 text-xs mt-1">Start by browsing and saving cars</p>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-4 gap-1.5"
                                onClick={() => navigateTo('used-cars')}
                              >
                                <Search className="size-3.5" />
                                Browse Cars
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* ─── MY WISHLIST ────────────────────────────────────── */}
                {activeSection === 'wishlist' && (
                  <div>
                    {wishlist.length === 0 ? (
                      <EmptyState
                        icon={<Heart className="size-10 text-slate-300" />}
                        title="Your wishlist is empty"
                        description="Save cars you're interested in to compare later"
                        actionLabel="Browse Cars"
                        onAction={() => navigateTo('used-cars')}
                      />
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {wishlist.map((item) => (
                          <WishlistCard
                            key={item.id}
                            item={item}
                            onRemove={removeFromWishlist}
                            onViewCar={(id) => navigateTo('car-details', { id })}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ─── MY INQUIRIES ───────────────────────────────────── */}
                {activeSection === 'inquiries' && (
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-0">
                      {inquiries.length === 0 ? (
                        <div className="p-8">
                          <EmptyState
                            icon={<MessageSquare className="size-10 text-slate-300" />}
                            title="No inquiries yet"
                            description="Send inquiries about cars you're interested in"
                            actionLabel="Browse Cars"
                            onAction={() => navigateTo('used-cars')}
                          />
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-xs">Car</TableHead>
                                <TableHead className="text-xs">Type</TableHead>
                                <TableHead className="text-xs">Status</TableHead>
                                <TableHead className="text-xs">Date</TableHead>
                                <TableHead className="text-xs text-right">Action</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {inquiries.map((inquiry) => (
                                <TableRow key={inquiry.id} className="hover:bg-slate-50/50">
                                  <TableCell className="font-medium text-sm">
                                    {inquiry.car?.title || 'N/A'}
                                  </TableCell>
                                  <TableCell>
                                    <span className="text-xs text-slate-500">
                                      {getLeadTypeLabel(inquiry.type)}
                                    </span>
                                  </TableCell>
                                  <TableCell>{getStatusBadge(inquiry.status)}</TableCell>
                                  <TableCell className="text-xs text-slate-500">
                                    {formatDate(inquiry.createdAt)}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {inquiry.car?.id && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-xs gap-1"
                                        onClick={() => navigateTo('car-details', { id: inquiry.car!.id })}
                                      >
                                        View
                                        <ExternalLink className="size-3" />
                                      </Button>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* ─── TEST DRIVES ────────────────────────────────────── */}
                {activeSection === 'test-drives' && (
                  <div className="space-y-4">
                    {testDrives.length === 0 ? (
                      <Card className="border-0 shadow-sm">
                        <CardContent className="p-8">
                          <EmptyState
                            icon={<Car className="size-10 text-slate-300" />}
                            title="No test drives booked"
                            description="Book a test drive for your favorite car"
                            actionLabel="Browse Cars"
                            onAction={() => navigateTo('used-cars')}
                          />
                        </CardContent>
                      </Card>
                    ) : (
                      testDrives.map((td) => (
                        <TestDriveCard key={td.id} testDrive={td} onViewCar={(id) => navigateTo('car-details', { id })} />
                      ))
                    )}
                  </div>
                )}

                {/* ─── LOAN APPLICATIONS ──────────────────────────────── */}
                {activeSection === 'loans' && (
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-0">
                      {financeLeads.length === 0 ? (
                        <div className="p-8">
                          <EmptyState
                            icon={<DollarSign className="size-10 text-slate-300" />}
                            title="No loan applications"
                            description="Apply for a car loan with easy EMI options"
                            actionLabel="Apply for Loan"
                            onAction={() => navigateTo('finance')}
                          />
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-xs">Car</TableHead>
                                <TableHead className="text-xs">Status</TableHead>
                                <TableHead className="text-xs">Phone</TableHead>
                                <TableHead className="text-xs">Date</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {financeLeads.map((lead) => (
                                <TableRow key={lead.id} className="hover:bg-slate-50/50">
                                  <TableCell className="font-medium text-sm">
                                    {lead.car?.title || 'General Inquiry'}
                                  </TableCell>
                                  <TableCell>{getStatusBadge(lead.status)}</TableCell>
                                  <TableCell className="text-xs text-slate-500">{lead.phone}</TableCell>
                                  <TableCell className="text-xs text-slate-500">
                                    {formatDate(lead.createdAt)}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* ─── INSURANCE APPLICATIONS ─────────────────────────── */}
                {activeSection === 'insurance' && (
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-0">
                      {insuranceLeads.length === 0 ? (
                        <div className="p-8">
                          <EmptyState
                            icon={<Shield className="size-10 text-slate-300" />}
                            title="No insurance applications"
                            description="Get insurance quotes for your car"
                            actionLabel="Get Insurance"
                            onAction={() => navigateTo('insurance')}
                          />
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-xs">Car</TableHead>
                                <TableHead className="text-xs">Status</TableHead>
                                <TableHead className="text-xs">Phone</TableHead>
                                <TableHead className="text-xs">Date</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {insuranceLeads.map((lead) => (
                                <TableRow key={lead.id} className="hover:bg-slate-50/50">
                                  <TableCell className="font-medium text-sm">
                                    {lead.car?.title || 'General Inquiry'}
                                  </TableCell>
                                  <TableCell>{getStatusBadge(lead.status)}</TableCell>
                                  <TableCell className="text-xs text-slate-500">{lead.phone}</TableCell>
                                  <TableCell className="text-xs text-slate-500">
                                    {formatDate(lead.createdAt)}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* ─── MY LISTINGS (SELLER) ───────────────────────────── */}
                {activeSection === 'my-listings' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm text-slate-500">{myListings.length} cars listed</p>
                      <Button
                        size="sm"
                        className="gap-1.5 text-xs bg-accent-orange hover:bg-orange-600 text-white"
                        onClick={() => setActiveSection('add-car')}
                      >
                        <Plus className="size-3.5" />
                        Add New Car
                      </Button>
                    </div>
                    {myListings.length === 0 ? (
                      <Card className="border-0 shadow-sm">
                        <CardContent className="p-8">
                          <EmptyState
                            icon={<Package className="size-10 text-slate-300" />}
                            title="No listings yet"
                            description="Add your first car listing to start selling"
                            actionLabel="Add New Car"
                            onAction={() => setActiveSection('add-car')}
                          />
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {myListings.map((car) => (
                          <SellerCarCard key={car.id} car={car} />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ─── ADD NEW CAR (SELLER) ───────────────────────────── */}
                {activeSection === 'add-car' && (
                  <Card className="border-0 shadow-sm max-w-2xl">
                    <CardHeader>
                      <CardTitle className="text-lg">Add New Car Listing</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Car Title *</Label>
                          <Input
                            placeholder="e.g. Maruti Swift ZXI 2022"
                            value={addCarForm.title}
                            onChange={(e) => setAddCarForm({ ...addCarForm, title: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Price (₹) *</Label>
                          <Input
                            type="number"
                            placeholder="e.g. 500000"
                            value={addCarForm.price}
                            onChange={(e) => setAddCarForm({ ...addCarForm, price: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Year</Label>
                          <Select value={addCarForm.year} onValueChange={(v) => setAddCarForm({ ...addCarForm, year: v })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 15 }, (_, i) => 2024 - i).map((y) => (
                                <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">KM Driven</Label>
                          <Input
                            type="number"
                            placeholder="e.g. 25000"
                            value={addCarForm.kmDriven}
                            onChange={(e) => setAddCarForm({ ...addCarForm, kmDriven: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Fuel Type</Label>
                          <Select value={addCarForm.fuelType} onValueChange={(v) => setAddCarForm({ ...addCarForm, fuelType: v })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PETROL">Petrol</SelectItem>
                              <SelectItem value="DIESEL">Diesel</SelectItem>
                              <SelectItem value="CNG">CNG</SelectItem>
                              <SelectItem value="ELECTRIC">Electric</SelectItem>
                              <SelectItem value="HYBRID">Hybrid</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Transmission</Label>
                          <Select value={addCarForm.transmission} onValueChange={(v) => setAddCarForm({ ...addCarForm, transmission: v })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="MANUAL">Manual</SelectItem>
                              <SelectItem value="AUTOMATIC">Automatic</SelectItem>
                              <SelectItem value="CVT">CVT</SelectItem>
                              <SelectItem value="AMT">AMT</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Description</Label>
                        <Textarea
                          placeholder="Describe your car's condition, features, etc."
                          value={addCarForm.description}
                          onChange={(e) => setAddCarForm({ ...addCarForm, description: e.target.value })}
                          rows={4}
                        />
                      </div>
                      {/* Decorative image upload */}
                      <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
                        <Camera className="size-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-sm text-slate-500 font-medium">Upload Car Photos</p>
                        <p className="text-xs text-slate-400 mt-1">Drag and drop or click to upload (up to 10 images)</p>
                        <Button variant="outline" size="sm" className="mt-3 gap-1.5">
                          <Upload className="size-3.5" />
                          Choose Files
                        </Button>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          onClick={handleAddCar}
                          disabled={addingCar}
                          className="bg-brand hover:bg-brand-light text-white"
                        >
                          {addingCar ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                              Adding...
                            </>
                          ) : (
                            'Add Car Listing'
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setActiveSection('my-listings')}
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* ─── LEAD MANAGEMENT (SELLER) ───────────────────────── */}
                {activeSection === 'leads' && (
                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-0">
                      {sellerLeads.length === 0 ? (
                        <div className="p-8">
                          <EmptyState
                            icon={<Users className="size-10 text-slate-300" />}
                            title="No leads yet"
                            description="Leads will appear here when customers show interest in your cars"
                          />
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-xs">Name</TableHead>
                                <TableHead className="text-xs">Type</TableHead>
                                <TableHead className="text-xs">Car</TableHead>
                                <TableHead className="text-xs">Status</TableHead>
                                <TableHead className="text-xs">Phone</TableHead>
                                <TableHead className="text-xs">Date</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {sellerLeads.map((lead) => (
                                <TableRow key={lead.id} className="hover:bg-slate-50/50">
                                  <TableCell className="font-medium text-sm">{lead.name}</TableCell>
                                  <TableCell>
                                    <span className="text-xs text-slate-500">
                                      {getLeadTypeLabel(lead.type)}
                                    </span>
                                  </TableCell>
                                  <TableCell className="text-sm">{lead.car?.title || 'N/A'}</TableCell>
                                  <TableCell>{getStatusBadge(lead.status)}</TableCell>
                                  <TableCell className="text-xs text-slate-500">{lead.phone}</TableCell>
                                  <TableCell className="text-xs text-slate-500">
                                    {formatDate(lead.createdAt)}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* ─── PERFORMANCE (SELLER) ────────────────────────────── */}
                {activeSection === 'performance' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <StatCard
                        icon={<Eye className="size-5 text-blue-500" />}
                        label="Total Views"
                        value={stats.totalViews}
                        color="bg-blue-50 border-blue-100"
                      />
                      <StatCard
                        icon={<Users className="size-5 text-orange-500" />}
                        label="Total Leads"
                        value={stats.totalLeads}
                        color="bg-orange-50 border-orange-100"
                      />
                      <StatCard
                        icon={<Package className="size-5 text-emerald-500" />}
                        label="Active Listings"
                        value={stats.activeListings}
                        color="bg-emerald-50 border-emerald-100"
                      />
                      <StatCard
                        icon={<TrendingUp className="size-5 text-purple-500" />}
                        label="Conversion Rate"
                        value={`${stats.totalListings > 0 ? Math.round((stats.totalLeads / Math.max(stats.totalViews, 1)) * 100) : 0}%`}
                        color="bg-purple-50 border-purple-100"
                      />
                    </div>

                    <Card className="border-0 shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">Listing Performance</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        {myListings.length === 0 ? (
                          <div className="p-8 text-center">
                            <p className="text-slate-500 text-sm">No listings to show performance data</p>
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="text-xs">Car</TableHead>
                                  <TableHead className="text-xs">Status</TableHead>
                                  <TableHead className="text-xs">Views</TableHead>
                                  <TableHead className="text-xs">Inquiries</TableHead>
                                  <TableHead className="text-xs">Price</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {myListings.slice(0, 10).map((car) => (
                                  <TableRow key={car.id} className="hover:bg-slate-50/50">
                                    <TableCell className="font-medium text-sm">{car.title}</TableCell>
                                    <TableCell>{getStatusBadge(car.status)}</TableCell>
                                    <TableCell>
                                      <span className="flex items-center gap-1 text-sm">
                                        <Eye className="size-3 text-slate-400" />
                                        {car.viewsCount}
                                      </span>
                                    </TableCell>
                                    <TableCell>
                                      <span className="flex items-center gap-1 text-sm">
                                        <MessageSquare className="size-3 text-slate-400" />
                                        {car.inquiriesCount}
                                      </span>
                                    </TableCell>
                                    <TableCell className="text-sm font-semibold text-brand">
                                      {formatPrice(car.price)}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* ─── PROFILE SETTINGS ───────────────────────────────── */}
                {activeSection === 'profile' && (
                  <div className="max-w-2xl space-y-6">
                    {/* Avatar Section */}
                    <Card className="border-0 shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-5">
                          <div className="relative group">
                            <Avatar className="size-20">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback className="bg-brand text-white text-2xl font-bold">
                                {user.name?.charAt(0)?.toUpperCase() || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <button className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Camera className="size-5 text-white" />
                            </button>
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-slate-800">{user.name || 'User'}</h3>
                            <p className="text-sm text-slate-500">{user.email}</p>
                            <Badge variant="outline" className="mt-1 text-[10px]">
                              Member since {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Profile Form */}
                    <Card className="border-0 shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-base">Personal Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Full Name</Label>
                            <Input
                              value={profileName}
                              onChange={(e) => setProfileName(e.target.value)}
                              placeholder="Your name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Email</Label>
                            <Input
                              value={user.email}
                              disabled
                              className="bg-slate-50"
                            />
                            <p className="text-[11px] text-slate-400">Email cannot be changed</p>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Phone</Label>
                            <Input
                              value={profilePhone}
                              onChange={(e) => setProfilePhone(e.target.value)}
                              placeholder="+91 XXXXX XXXXX"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">City</Label>
                            <Input
                              value={profileCity}
                              onChange={(e) => setProfileCity(e.target.value)}
                              placeholder="Your city"
                            />
                          </div>
                        </div>
                        <Button
                          onClick={handleSaveProfile}
                          disabled={savingProfile}
                          className="bg-brand hover:bg-brand-light text-white"
                        >
                          {savingProfile ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Change Password */}
                    <Card className="border-0 shadow-sm">
                      <CardHeader>
                        <CardTitle className="text-base">Change Password</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Current Password</Label>
                          <Input type="password" placeholder="Enter current password" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">New Password</Label>
                            <Input type="password" placeholder="Enter new password" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Confirm Password</Label>
                            <Input type="password" placeholder="Confirm new password" />
                          </div>
                        </div>
                        <Button variant="outline">
                          Update Password
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Sub-Components ────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: number | string
  color: string
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Card className={`border ${color} shadow-sm`}>
        <CardContent className="p-4 flex items-center gap-3">
          <div className="size-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
            {icon}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-500 font-medium">{label}</p>
            <p className="text-lg font-bold text-slate-800">{value}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function QuickAction({
  icon,
  label,
  desc,
  onClick,
  gradient,
}: {
  icon: React.ReactNode
  label: string
  desc: string
  onClick: () => void
  gradient: string
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow text-left"
    >
      <div className={`size-10 rounded-xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
      <ChevronRight className="size-4 text-slate-300 ml-auto shrink-0" />
    </motion.button>
  )
}

function RecentItem({
  icon,
  text,
  time,
}: {
  icon: React.ReactNode
  text: string
  time: string
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
      <div className="size-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-slate-700 truncate">{text}</p>
        {time && <p className="text-xs text-slate-400">{formatDate(time)}</p>}
      </div>
    </div>
  )
}

function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon: React.ReactNode
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}) {
  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-700 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 mb-4 max-w-sm mx-auto">{description}</p>
      {actionLabel && onAction && (
        <Button variant="outline" onClick={onAction} className="gap-1.5">
          {actionLabel}
          <ChevronRight className="size-3.5" />
        </Button>
      )}
    </div>
  )
}

function WishlistCard({
  item,
  onRemove,
  onViewCar,
}: {
  item: WishlistCar
  onRemove: (carId: string) => void
  onViewCar: (carId: string) => void
}) {
  const carImage = item.car.images?.[0]?.url || `https://placehold.co/400x250/e2e8f0/64748b?text=${encodeURIComponent(item.car.title)}`

  return (
    <Card className="border-0 shadow-sm overflow-hidden group">
      <div className="relative aspect-[16/10]">
        <Image
          src={carImage}
          alt={item.car.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 33vw"
          unoptimized
        />
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove(item.carId)
          }}
          className="absolute top-2 right-2 size-7 flex items-center justify-center rounded-full bg-white/90 shadow-md hover:bg-red-50 transition-colors z-10"
        >
          <X className="size-3.5 text-slate-500 hover:text-red-500" />
        </button>
        {item.car.year && (
          <Badge className="absolute bottom-2 left-2 bg-black/60 text-white border-0 text-[10px]">
            {item.car.year}
          </Badge>
        )}
      </div>
      <CardContent className="p-3">
        <h4 className="font-semibold text-sm text-slate-800 line-clamp-1">{item.car.title}</h4>
        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
          {item.car.brand && <span>{item.car.brand.name}</span>}
          {item.car.city && (
            <>
              <span>·</span>
              <span className="flex items-center gap-0.5">
                <MapPin className="size-3" />
                {item.car.city.name}
              </span>
            </>
          )}
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-base font-bold text-brand">{formatPrice(item.car.price)}</span>
          <Button
            size="sm"
            variant="outline"
            className="text-[11px] h-7 gap-1"
            onClick={() => onViewCar(item.carId)}
          >
            View
            <ExternalLink className="size-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function TestDriveCard({
  testDrive,
  onViewCar,
}: {
  testDrive: TestDriveData
  onViewCar: (carId: string) => void
}) {
  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="size-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
          <Car className="size-6 text-emerald-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-slate-800">{testDrive.car?.title || 'Car'}</h4>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500">
            {testDrive.preferredDate && (
              <span className="flex items-center gap-1">
                <Calendar className="size-3" />
                {formatDate(testDrive.preferredDate)}
              </span>
            )}
            {testDrive.preferredTime && (
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                {testDrive.preferredTime}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Phone className="size-3" />
              {testDrive.phone}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {getStatusBadge(testDrive.status)}
          {testDrive.car?.id && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1"
              onClick={() => onViewCar(testDrive.car.id)}
            >
              View Car
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function SellerCarCard({ car }: { car: SellerCar }) {
  const carImage = car.images?.[0]?.url || `https://placehold.co/400x250/e2e8f0/64748b?text=${encodeURIComponent(car.title)}`

  return (
    <Card className="border-0 shadow-sm overflow-hidden group">
      <div className="relative aspect-[16/10]">
        <Image
          src={carImage}
          alt={car.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 33vw"
          unoptimized
        />
        <div className="absolute top-2 left-2 flex gap-1">
          {getStatusBadge(car.status)}
        </div>
      </div>
      <CardContent className="p-3">
        <h4 className="font-semibold text-sm text-slate-800 line-clamp-1">{car.title}</h4>
        <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Eye className="size-3" />
            {car.viewsCount}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="size-3" />
            {car.inquiriesCount}
          </span>
        </div>
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
          <span className="text-base font-bold text-brand">{formatPrice(car.price)}</span>
          <span className="text-[11px] text-slate-400">{formatDate(car.createdAt)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
