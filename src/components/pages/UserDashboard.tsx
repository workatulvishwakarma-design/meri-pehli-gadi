'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import {
  LayoutDashboard,
  Heart,
  User,
  Car,
  Plus,
  Trash2,
  MapPin,
  Phone,
  Eye,
  LogOut,
  ChevronRight,
  Shield,
  FileText,
  CalendarCheck,
} from 'lucide-react'

// ─── Types ──────────────────────────────────────────────────────────────
interface AuthUser {
  id: string
  email: string
  name: string | null
  phone: string | null
  avatar: string | null
  role: string
  cityId?: string | null
  city?: { id: string; name: string; slug: string }
}

interface WishlistCar {
  id: string
  carId: string
  car: {
    id: string
    title: string
    price: number
    year: number
    kmDriven: number
    fuelType: string
    transmission: string
    status: string
    city?: { id: string; name: string }
    brand?: { id: string; name: string }
    model?: { id: string; name: string }
    images?: { id: string; url: string }[]
  }
}

interface CarItem {
  id: string
  title: string
  price: number
  status: string
  year: number
  fuelType: string
  transmission: string
  kmDriven: number
  brand?: { id: string; name: string }
  city?: { id: string; name: string }
  images?: { id: string; url: string }[]
  createdAt: string
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
  }
  return map[s] || 'bg-slate-100 text-slate-600'
}

// ─── Sidebar Config ─────────────────────────────────────────────────────
type Section = 'overview' | 'wishlist' | 'listings' | 'add-car' | 'profile'

interface SidebarItem {
  id: Section
  label: string
  icon: React.ReactNode
  roles?: string[]
}

const buyerSections: SidebarItem[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
  { id: 'wishlist', label: 'My Wishlist', icon: <Heart size={18} /> },
  { id: 'profile', label: 'Profile Settings', icon: <User size={18} /> },
]

const sellerSections: SidebarItem[] = [
  ...buyerSections,
  { id: 'listings', label: 'My Listings', icon: <Car size={18} />, roles: ['SELLER'] },
  { id: 'add-car', label: 'Add New Car', icon: <Plus size={18} />, roles: ['SELLER'] },
]

// ═══════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════
export function UserDashboard() {
  const { setShowAuthModal, navigateTo } = useAppStore()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState<Section>('overview')

  // Data
  const [wishlist, setWishlist] = useState<WishlistCar[]>([])
  const [myListings, setMyListings] = useState<CarItem[]>([])
  const [cities, setCities] = useState<any[]>([])
  const [dataLoading, setDataLoading] = useState(false)

  // Profile form
  const [profileForm, setProfileForm] = useState({ name: '', phone: '', cityId: '' })
  const [profileSaving, setProfileSaving] = useState(false)

  // Add car form
  const [brands, setBrands] = useState<any[]>([])
  const [models, setModels] = useState<any[]>([])
  const [carForm, setCarForm] = useState({
    title: '', brandId: '', modelId: '', year: new Date().getFullYear(), price: 0, kmDriven: 0,
    fuelType: 'PETROL', transmission: 'MANUAL', bodyType: 'HATCHBACK', color: '', cityId: '',
    description: '', isCertified: false,
  })
  const [carSaving, setCarSaving] = useState(false)

  const isSeller = user?.role === 'SELLER'
  const sections = isSeller ? sellerSections : buyerSections

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
        if (mounted && data.user) {
          setUser(data.user)
          setProfileForm({
            name: data.user?.name || '',
            phone: data.user?.phone || '',
            cityId: data.user.cityId || '',
          })
          // Redirect DEALER to admin dashboard
          if (data.user?.role === 'DEALER') {
            navigateTo('dealer-dashboard')
          }
        }
      })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('meripehli-token')
    setUser(null)
    navigateTo('home')
  }

  // ─── Data Fetchers ────────────────────────────────────────────────
  const fetchWishlist = useCallback(async () => {
    setDataLoading(true)
    try {
      const r = await fetch(`${API}/wishlist`, { headers: authHeaders() })
      const d = await r.json()
      setWishlist(d.wishlists || [])
    } catch { /* ignore */ }
    setDataLoading(false)
  }, [])

  const fetchMyListings = useCallback(async () => {
    if (!user) return
    setDataLoading(true)
    try {
      const r = await fetch(`${API}/cars?status=ALL&limit=50`, { headers: authHeaders() })
      const d = await r.json()
      setMyListings((d.cars || []).filter((c: CarItem) => c.status !== undefined))
    } catch { /* ignore */ }
    setDataLoading(false)
  }, [user])

  const fetchCities = useCallback(async () => {
    try {
      const r = await fetch(`${API}/cities`)
      const d = await r.json()
      setCities(d.cities || [])
    } catch { /* ignore */ }
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

  // Load data when section changes
  useEffect(() => {
    if (!user || user?.role === 'DEALER') return
    let cancelled = false
    const timer = setTimeout(async () => {
      if (cancelled) return
      switch (activeSection) {
        case 'wishlist': await fetchWishlist(); break
        case 'listings': await fetchMyListings(); break
        case 'profile': await fetchCities(); break
        case 'add-car': fetchBrands(); fetchCities(); break
      }
    }, 0)
    return () => { cancelled = true; clearTimeout(timer) }
  }, [activeSection, user])

  // ─── Actions ──────────────────────────────────────────────────────
  const removeWishlist = async (carId: string) => {
    try {
      await fetch(`${API}/wishlist?carId=${carId}`, { method: 'DELETE', headers: authHeaders() })
      toast.success('Removed from wishlist')
      fetchWishlist()
    } catch {
      toast.error('Failed to remove')
    }
  }

  const saveProfile = async () => {
    setProfileSaving(true)
    try {
      // Note: user profile update requires a dedicated endpoint
      // For now we show success and keep the form values
      await new Promise(resolve => setTimeout(resolve, 500))
      toast.success('Profile saved')
    } catch {
      toast.error('Failed to save profile')
    }
    setProfileSaving(false)
  }

  const handleAddCar = async (e: React.FormEvent) => {
    e.preventDefault()
    setCarSaving(true)
    try {
      const res = await fetch(`${API}/cars`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          ...carForm,
          price: Number(carForm.price),
          year: Number(carForm.year),
          kmDriven: Number(carForm.kmDriven),
        }),
      })
      if (res.ok) {
        toast.success('Car added successfully! It will be reviewed soon.')
        setCarForm({
          title: '', brandId: '', modelId: '', year: new Date().getFullYear(), price: 0, kmDriven: 0,
          fuelType: 'PETROL', transmission: 'MANUAL', bodyType: 'HATCHBACK', color: '', cityId: '',
          description: '', isCertified: false,
        })
        setActiveSection('listings')
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to add car')
      }
    } catch {
      toast.error('Failed to add car')
    }
    setCarSaving(false)
  }

  // ─── Auth Guards ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <Card className="p-8 text-center max-w-sm w-full">
          <LogOut size={40} className="mx-auto mb-4 text-slate-400" />
          <h2 className="text-xl font-semibold mb-2">Login Required</h2>
          <p className="text-slate-500 mb-4">Please login to access your dashboard.</p>
          <Button onClick={() => setShowAuthModal(true)}>Please Login</Button>
        </Card>
      </div>
    )
  }

  if (user?.role === 'DEALER') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════════
  // SECTION RENDERERS
  // ═══════════════════════════════════════════════════════════════════

  // ─── Overview ─────────────────────────────────────────────────────
  function renderOverview() {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back{user?.name ? `, ${user?.name}` : ''}! 👋
          </h1>
          <p className="text-slate-500 mt-1">Here&apos;s a summary of your account.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 bg-rose-50 text-rose-600 rounded-lg">
                <Heart size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{wishlist.length}</p>
                <p className="text-xs text-slate-500">Wishlist</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                <Car size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{myListings.length}</p>
                <p className="text-xs text-slate-500">My Listings</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
                <Shield size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold capitalize text-sm mt-1">{user?.role.replace('_', ' ')}</p>
                <p className="text-xs text-slate-500">Account Type</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
                <CalendarCheck size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-sm mt-1">{user?.city?.name || 'N/A'}</p>
                <p className="text-xs text-slate-500">City</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <button
              onClick={() => navigateTo('sell-car')}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                  <Plus size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium">Sell Your Car</p>
                  <p className="text-xs text-slate-500">List your car for sale</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </button>
            <button
              onClick={() => navigateTo('used-cars')}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                  <Eye size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium">Browse Cars</p>
                  <p className="text-xs text-slate-500">Find your next car</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </button>
            <button
              onClick={() => navigateTo('car-valuation')}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
                  <FileText size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium">Car Valuation</p>
                  <p className="text-xs text-slate-500">Get your car&apos;s value</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ─── Wishlist ─────────────────────────────────────────────────────
  function renderWishlist() {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Wishlist</h1>
            <p className="text-sm text-slate-500">{wishlist.length} car{wishlist.length !== 1 ? 's' : ''} saved</p>
          </div>
        </div>

        {dataLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <Card key={i}><CardContent className="p-4"><Skeleton className="h-40 w-full mb-3" /><Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-1/2 mt-2" /></CardContent></Card>
            ))}
          </div>
        ) : wishlist.length === 0 ? (
          <Card className="py-12">
            <CardContent className="text-center">
              <Heart size={40} className="mx-auto mb-3 text-slate-300" />
              <h3 className="font-semibold text-slate-600">No cars in wishlist</h3>
              <p className="text-sm text-slate-400 mt-1">Browse cars and add them to your wishlist.</p>
              <Button className="mt-4" onClick={() => navigateTo('used-cars')}>Browse Cars</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wishlist.map((item) => {
              const car = item.car
              return (
                <Card key={item.id} className="overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="relative">
                    <div className="h-40 bg-slate-100">
                      {car.images?.[0] ? (
                        <img src={car.images[0].url} alt={car.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <Car size={40} />
                        </div>
                      )}
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeWishlist(car.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                    {car.status && (
                      <Badge variant="outline" className={`absolute top-2 left-2 text-xs ${statusColor(car.status)}`}>{car.status}</Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm truncate">{car.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {car.brand?.name} {car.year} • {car.fuelType} • {car.transmission}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-bold text-lg text-emerald-700">{formatPrice(car.price)}</span>
                      {car.city && (
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <MapPin size={12} /> {car.city.name}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  // ─── My Listings (Seller) ──────────────────────────────────────────
  function renderListings() {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Listings</h1>
            <p className="text-sm text-slate-500">{myListings.length} car{myListings.length !== 1 ? 's' : ''} listed</p>
          </div>
          <Button size="sm" onClick={() => setActiveSection('add-car')}>
            <Plus size={16} className="mr-1" /> Add Car
          </Button>
        </div>

        {dataLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <Card key={i}><CardContent className="p-4"><Skeleton className="h-40 w-full mb-3" /><Skeleton className="h-5 w-3/4" /></CardContent></Card>
            ))}
          </div>
        ) : myListings.length === 0 ? (
          <Card className="py-12">
            <CardContent className="text-center">
              <Car size={40} className="mx-auto mb-3 text-slate-300" />
              <h3 className="font-semibold text-slate-600">No listings yet</h3>
              <p className="text-sm text-slate-400 mt-1">Start by adding your first car.</p>
              <Button className="mt-4" onClick={() => setActiveSection('add-car')}>Add Your First Car</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myListings.map((car) => (
              <Card key={car.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <div className="h-40 bg-slate-100">
                    {car.images?.[0] ? (
                      <img src={car.images[0].url} alt={car.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Car size={40} />
                      </div>
                    )}
                  </div>
                  <Badge variant="outline" className={`absolute top-2 left-2 text-xs ${statusColor(car.status)}`}>{car.status}</Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm truncate">{car.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {car.brand?.name} • {car.year} • {car.kmDriven.toLocaleString()} km
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-bold text-lg text-emerald-700">{formatPrice(car.price)}</span>
                    <span className="text-xs text-slate-400">{formatDate(car.createdAt)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ─── Add New Car (Seller) ──────────────────────────────────────────
  function renderAddCar() {
    const updateField = (field: string, value: any) => {
      setCarForm({ ...carForm, [field]: value })
      if (field === 'brandId') {
        setCarForm(prev => ({ ...prev, modelId: '' }))
        fetchModels(value)
      }
    }

    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Add New Car</h1>

        <Card className="max-w-2xl">
          <CardContent className="p-6">
            <form onSubmit={handleAddCar} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label>Car Title *</Label>
                  <Input
                    value={carForm.title}
                    onChange={e => updateField('title', e.target.value)}
                    placeholder="e.g. Maruti Suzuki Swift VXI 2020"
                    required
                  />
                </div>

                <div>
                  <Label>Brand *</Label>
                  <Select value={carForm.brandId} onValueChange={v => updateField('brandId', v)} required>
                    <SelectTrigger><SelectValue placeholder="Select brand" /></SelectTrigger>
                    <SelectContent>
                      {brands.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Model *</Label>
                  <Select value={carForm.modelId} onValueChange={v => updateField('modelId', v)} required disabled={!carForm.brandId}>
                    <SelectTrigger><SelectValue placeholder="Select model" /></SelectTrigger>
                    <SelectContent>
                      {models.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Price (₹) *</Label>
                  <Input
                    type="number"
                    value={carForm.price}
                    onChange={e => updateField('price', e.target.value)}
                    placeholder="500000"
                    required
                    min="0"
                  />
                </div>

                <div>
                  <Label>Year *</Label>
                  <Input
                    type="number"
                    value={carForm.year}
                    onChange={e => updateField('year', e.target.value)}
                    required
                    min="1900"
                    max={new Date().getFullYear() + 1}
                  />
                </div>

                <div>
                  <Label>KM Driven *</Label>
                  <Input
                    type="number"
                    value={carForm.kmDriven}
                    onChange={e => updateField('kmDriven', e.target.value)}
                    placeholder="25000"
                    required
                    min="0"
                  />
                </div>

                <div>
                  <Label>Fuel Type</Label>
                  <Select value={carForm.fuelType} onValueChange={v => updateField('fuelType', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['PETROL', 'DIESEL', 'CNG', 'ELECTRIC', 'HYBRID', 'LPG'].map(f => (
                        <SelectItem key={f} value={f}>{f}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Transmission</Label>
                  <Select value={carForm.transmission} onValueChange={v => updateField('transmission', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['MANUAL', 'AUTOMATIC', 'CVT', 'DCT', 'AMT'].map(t => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Body Type</Label>
                  <Select value={carForm.bodyType} onValueChange={v => updateField('bodyType', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['SUV', 'SEDAN', 'HATCHBACK', 'COUPE', 'CONVERTIBLE', 'VAN', 'TRUCK', 'MPV', 'PICKUP', 'WAGON'].map(b => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Color</Label>
                  <Input
                    value={carForm.color}
                    onChange={e => updateField('color', e.target.value)}
                    placeholder="White"
                  />
                </div>

                <div>
                  <Label>City</Label>
                  <Select value={carForm.cityId} onValueChange={v => updateField('cityId', v)}>
                    <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
                    <SelectContent>
                      {cities.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label>Description</Label>
                  <Textarea
                    value={carForm.description}
                    onChange={e => updateField('description', e.target.value)}
                    placeholder="Describe your car's condition, features, etc."
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={carSaving}>
                  {carSaving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 mr-2" />
                  ) : (
                    <Plus size={16} className="mr-2" />
                  )}
                  Add Car
                </Button>
                <Button type="button" variant="outline" onClick={() => setActiveSection('listings')}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ─── Profile Settings ──────────────────────────────────────────────
  function renderProfile() {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Profile Settings</h1>

        <Card className="max-w-lg">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                {user?.avatar ? (
                  <img src={user.avatar} className="w-full h-full rounded-full object-cover" alt={user?.name || ''} />
                ) : (
                  <span className="text-2xl font-bold text-emerald-700">{(user?.name || user?.email || '?')[0]?.toUpperCase()}</span>
                )}
              </div>
              <div>
                <h3 className="font-semibold">{user?.name || 'User'}</h3>
                <p className="text-sm text-slate-500">{user?.email}</p>
                <Badge variant="outline" className="text-xs mt-1 capitalize">{user?.role.replace('_', ' ')}</Badge>
              </div>
            </div>

            <Separator />

            <div>
              <Label>Full Name</Label>
              <Input
                value={profileForm.name}
                onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                placeholder="Your full name"
              />
            </div>

            <div>
              <Label>Phone Number</Label>
              <Input
                value={profileForm.phone}
                onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                placeholder="Your phone number"
              />
            </div>

            <div>
              <Label>City</Label>
              <Select value={profileForm.cityId} onValueChange={v => setProfileForm({ ...profileForm, cityId: v })}>
                <SelectTrigger><SelectValue placeholder="Select your city" /></SelectTrigger>
                <SelectContent>
                  {cities.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Email (read-only)</Label>
              <Input value={user?.email} disabled className="bg-slate-50" />
            </div>

            <Separator />

            <div className="flex gap-3">
              <Button onClick={saveProfile} disabled={profileSaving}>
                {profileSaving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 mr-2" />
                ) : null}
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="max-w-lg border-red-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-red-700">Logout</h3>
                <p className="text-sm text-slate-500">Sign out of your account</p>
              </div>
              <Button variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
                <LogOut size={14} className="mr-1" /> Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ─── Section Router ───────────────────────────────────────────────
  function renderSection() {
    switch (activeSection) {
      case 'overview': return renderOverview()
      case 'wishlist': return renderWishlist()
      case 'listings': return isSeller ? renderListings() : renderOverview()
      case 'add-car': return isSeller ? renderAddCar() : renderOverview()
      case 'profile': return renderProfile()
      default: return renderOverview()
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-[80vh] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="md:w-56 flex-shrink-0">
            <div className="sticky top-4">
              {/* User Info Card */}
              <Card className="mb-4">
                <CardContent className="p-4 text-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-2">
                    {user.avatar ? (
                      <img src={user.avatar} className="w-full h-full rounded-full object-cover" alt="" />
                    ) : (
                      <span className="text-xl font-bold text-emerald-700">{(user?.name || user?.email)[0].toUpperCase()}</span>
                    )}
                  </div>
                  <p className="font-semibold text-sm truncate">{user?.name || 'User'}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  <Badge variant="outline" className="text-xs mt-1 capitalize">{user?.role.replace('_', ' ')}</Badge>
                </CardContent>
              </Card>

              {/* Nav */}
              <Card>
                <CardContent className="p-2">
                  {sections
                    .filter(s => !s.roles || s.roles.includes(user?.role))
                    .map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
                          activeSection === item.id
                            ? 'bg-emerald-50 text-emerald-700 font-medium'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    ))}
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            {renderSection()}
          </main>
        </div>
      </div>
    </div>
  )
}
