'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { authHeaders, formatPrice, formatDate, statusColor, leadTypeColor } from './AdminLayout'
import {
  Car, TrendingUp, ClipboardList, DollarSign, Shield, Handshake,
  CalendarCheck, Store, Phone, Users, RefreshCw, ArrowUpRight, ArrowDownRight,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
  Legend,
} from 'recharts'

const CHART_COLORS = ['#3b82f6', '#f97316', '#22c55e', '#8b5cf6', '#ec4899', '#06b6d4', '#f59e0b', '#ef4444']

interface DashboardProps {
  user: { id: string; name: string | null; email: string; role: string }
}

interface Stats {
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

export default function DashboardOverview({ user }: DashboardProps) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentCars, setRecentCars] = useState<any[]>([])
  const [recentLeads, setRecentLeads] = useState<any[]>([])
  const [leadsByType, setLeadsByType] = useState<{ type: string; count: number }[]>([])
  const [topCities, setTopCities] = useState<any[]>([])
  const [topBrands, setTopBrands] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchStats = useCallback(async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/dashboard/stats', { headers: authHeaders() })
      const d = await r.json()
      setStats(d.overview)
      setRecentCars(d.recentCars || [])
      setRecentLeads(d.recentLeads || [])
      setLeadsByType(d.leadsByType || [])
      setTopCities(d.topCities || [])
      setTopBrands(d.topBrands || [])
    } catch { /* ignore */ }
    setLoading(false)
  }, [])

  useEffect(() => { fetchStats() }, [fetchStats])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-72 rounded-xl" />
          <Skeleton className="h-72 rounded-xl" />
        </div>
      </div>
    )
  }

  const conversionRate = stats?.totalLeads
    ? ((stats.convertedLeads / stats.totalLeads) * 100).toFixed(1)
    : '0'

  const statCards = [
    { label: 'Total Cars', value: stats?.totalCars ?? 0, icon: <Car size={20} />, color: 'from-blue-500 to-blue-600', change: '+12%', up: true },
    { label: 'Active Listings', value: stats?.activeCars ?? 0, icon: <TrendingUp size={20} />, color: 'from-emerald-500 to-emerald-600', change: '+8%', up: true },
    { label: 'Total Leads', value: stats?.totalLeads ?? 0, icon: <ClipboardList size={20} />, color: 'from-amber-500 to-amber-600', change: '+24%', up: true },
    { label: 'New Leads', value: stats?.newLeads ?? 0, icon: <Phone size={20} />, color: 'from-rose-500 to-rose-600', change: '+15%', up: true },
    { label: 'Finance Leads', value: leadsByType.find(l => l.type === 'FINANCE')?.count ?? 0, icon: <DollarSign size={20} />, color: 'from-cyan-500 to-cyan-600' },
    { label: 'Insurance Leads', value: leadsByType.find(l => l.type === 'INSURANCE')?.count ?? 0, icon: <Shield size={20} />, color: 'from-violet-500 to-violet-600' },
    { label: 'Sell Requests', value: leadsByType.find(l => l.type === 'SELL_CAR')?.count ?? 0, icon: <Handshake size={20} />, color: 'from-orange-500 to-orange-600' },
    { label: 'Conversion Rate', value: conversionRate + '%', icon: <TrendingUp size={20} />, color: 'from-green-500 to-green-600', change: '+5%', up: true },
  ]

  // Chart data
  const leadTypeChartData = leadsByType.map(l => ({
    name: l.type.replace('_', ' '),
    value: l.count,
  }))

  const monthlyData = [
    { month: 'Jan', leads: 12, cars: 8 },
    { month: 'Feb', leads: 19, cars: 12 },
    { month: 'Mar', leads: 28, cars: 15 },
    { month: 'Apr', leads: 35, cars: 18 },
    { month: 'May', leads: stats?.monthlyLeads ?? 42, cars: stats?.monthlyCars ?? 22 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back, {user?.name || user?.email} 👋</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchStats} className="gap-1.5">
          <RefreshCw size={14} /> Refresh
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <Card key={s.label} className="border-0 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
            <CardContent className="p-4 relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">{s.label}</p>
                  <p className="text-2xl font-bold text-slate-800">{typeof s.value === 'number' ? s.value.toLocaleString() : s.value}</p>
                  {s.change && (
                    <div className={`flex items-center gap-0.5 mt-1 text-xs font-medium ${s.up ? 'text-emerald-600' : 'text-red-500'}`}>
                      {s.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {s.change}
                    </div>
                  )}
                </div>
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${s.color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  {s.icon}
                </div>
              </div>
              {/* Decorative gradient line */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${s.color} opacity-60`} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Monthly Growth */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-700">Monthly Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCars" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorLeads)" name="Leads" />
                <Area type="monotone" dataKey="cars" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorCars)" name="Cars Added" />
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Leads by Type */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-700">Leads by Type</CardTitle>
          </CardHeader>
          <CardContent>
            {leadTypeChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={leadTypeChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {leadTypeChartData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                  <Legend formatter={(value) => <span className="text-xs text-slate-600">{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[260px] text-slate-400 text-sm">
                No lead data yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Cities & Brands */}
      <div className="grid md:grid-cols-2 gap-6">
        {topCities.length > 0 && (
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-slate-700">Top Cities by Cars</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={topCities.map(c => ({ name: c.name || 'Unknown', cars: c.count }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                  <Bar dataKey="cars" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {topBrands.length > 0 && (
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-slate-700">Top Brands</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={topBrands.map(b => ({ name: b.name || 'Unknown', cars: b.count }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                  <Bar dataKey="cars" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Tables */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-700">Recent Cars</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Title</TableHead>
                  <TableHead className="text-xs">Price</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentCars.slice(0, 5).map((car: any) => (
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

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-700">Recent Leads</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Name</TableHead>
                  <TableHead className="text-xs">Type</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentLeads.slice(0, 5).map((lead: any) => (
                  <TableRow key={lead.id}>
                    <TableCell className="text-sm font-medium">{lead.name}</TableCell>
                    <TableCell><Badge variant="secondary" className={`text-xs ${leadTypeColor(lead.type)}`}>{lead.type.replace('_', ' ')}</Badge></TableCell>
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
