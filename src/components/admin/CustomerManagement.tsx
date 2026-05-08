'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { authHeaders, formatDate } from './AdminLayout'
import { exportToExcel, exportToCSV } from '@/lib/export-utils'
import { Search, Download, UserCheck, Mail, Phone, MapPin } from 'lucide-react'

export default function CustomerManagement() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/users?limit=100', { headers: authHeaders() })
      const d = await r.json()
      setUsers(d.users || [])
    } catch { /* ignore */ }
    setLoading(false)
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const filtered = users.filter(u => {
    if (!search) return true
    const q = search.toLowerCase()
    return (u.name || '').toLowerCase().includes(q) ||
           u.email.toLowerCase().includes(q) ||
           (u.phone || '').includes(q)
  })

  const handleExport = () => {
    const data = filtered.map(u => ({
      Name: u.name || '—', Email: u.email, Phone: u.phone || '—',
      Role: u.role, City: u.city?.name || '—', Status: u.isActive ? 'Active' : 'Inactive',
      Joined: formatDate(u.createdAt),
    }))
    exportToExcel(data, 'customers-export', 'Customers')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Customer Management</h1>
          <p className="text-sm text-slate-500">{filtered.length} customers</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5">
          <Download size={14} /> Export
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <Input placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9" />
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full rounded" />)}</div>
      ) : (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <ScrollArea className="max-h-[65vh]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="text-xs font-semibold">Customer</TableHead>
                    <TableHead className="text-xs font-semibold">Contact</TableHead>
                    <TableHead className="text-xs font-semibold">Role</TableHead>
                    <TableHead className="text-xs font-semibold">City</TableHead>
                    <TableHead className="text-xs font-semibold">Status</TableHead>
                    <TableHead className="text-xs font-semibold">Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(u => (
                    <TableRow key={u.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                            {(u.name || u.email)[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{u.name || '—'}</p>
                            <p className="text-xs text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{u.phone || '—'}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs ${
                          u.role === 'BUYER' ? 'bg-slate-100' :
                          u.role === 'SELLER' ? 'bg-amber-50 text-amber-700' :
                          u.role === 'DEALER' ? 'bg-blue-50 text-blue-700' :
                          'bg-violet-50 text-violet-700'
                        }`}>{u.role}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">{u.city?.name || '—'}</TableCell>
                      <TableCell>
                        <Badge className={`text-xs ${u.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">{formatDate(u.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow><TableCell colSpan={6} className="text-center py-8 text-slate-400">No customers found</TableCell></TableRow>
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
