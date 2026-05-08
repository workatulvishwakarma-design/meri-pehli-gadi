'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { authHeaders, formatPrice, formatDate, statusColor } from './AdminLayout'
import { exportToCSV, exportToExcel, parseCSV, validateCarImport } from '@/lib/export-utils'
import { ASSAM_CITY_SLUGS } from '@/lib/permissions'
import { Plus, Pencil, Trash2, Search, Download, Upload } from 'lucide-react'

interface Props { user: { id: string; name: string | null; email: string; role: string } }

export default function CarManagement({ user }: Props) {
  const [cars, setCars] = useState<any[]>([])
  const [brands, setBrands] = useState<any[]>([])
  const [models, setModels] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const fetchCars = useCallback(async () => {
    setLoading(true)
    try {
      const p = new URLSearchParams({ status: statusFilter || 'ALL', limit: '100' })
      const r = await fetch(`/api/cars?${p}`, { headers: authHeaders() })
      const d = await r.json(); setCars(d.cars || [])
    } catch {} setLoading(false)
  }, [statusFilter])

  const fetchBrands = useCallback(async () => { try { const r = await fetch('/api/brands'); const d = await r.json(); setBrands(d.brands || []) } catch {} }, [])
  const fetchCities = useCallback(async () => { try { const r = await fetch('/api/cities'); const d = await r.json(); setCities(d.cities || []) } catch {} }, [])
  const fetchModels = useCallback(async (bid: string) => { if (!bid) { setModels([]); return }; try { const r = await fetch(`/api/models?brandId=${bid}`); const d = await r.json(); setModels(d.models || []) } catch {} }, [])

  useEffect(() => { fetchCars(); fetchBrands(); fetchCities() }, [fetchCars, fetchBrands, fetchCities])

  const filtered = cars.filter(c => !search || c.title.toLowerCase().includes(search.toLowerCase()) || (c.brand?.name || '').toLowerCase().includes(search.toLowerCase()))

  const handleDelete = async () => { if (!deleteId) return; try { await fetch(`/api/cars/${deleteId}`, { method: 'DELETE', headers: authHeaders() }); toast.success('Deleted'); fetchCars() } catch { toast.error('Failed') }; setDeleteOpen(false) }

  const handleExport = (f: 'csv' | 'excel') => {
    const data = filtered.map(c => ({ Title: c.title, Brand: c.brand?.name || '', Price: c.price, Year: c.year, KM: c.kmDriven, Fuel: c.fuelType, City: c.city?.name || '', Status: c.status }))
    f === 'csv' ? exportToCSV(data, 'cars') : exportToExcel(data, 'cars', 'Cars')
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    try {
      const rows = await parseCSV(file)
      const result = validateCarImport(rows, cars.map(c => c.title), ASSAM_CITY_SLUGS)
      if (result.errors.length) toast.error(`${result.errors.length} errors`)
      if (result.valid.length) toast.success(`${result.valid.length} valid rows`)
    } catch { toast.error('Parse failed') }
    e.target.value = ''
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-2xl font-bold">Cars Management</h1><p className="text-sm text-slate-500">{filtered.length} cars</p></div>
        <div className="flex gap-2 flex-wrap">
          <Button size="sm" onClick={() => { setEditing(null); setDialogOpen(true) }}><Plus size={14} className="mr-1" /> Add Car</Button>
          <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}><Upload size={14} className="mr-1" /> Import</Button>
          <input ref={fileRef} type="file" accept=".csv" onChange={handleImport} className="hidden" />
          <Button variant="outline" size="sm" onClick={() => handleExport('excel')}><Download size={14} className="mr-1" /> Excel</Button>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9" /></div>
        <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-[130px] h-9"><SelectValue placeholder="All Status" /></SelectTrigger><SelectContent><SelectItem value="">All</SelectItem>{['ACTIVE','DRAFT','PENDING','SOLD','FEATURED'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
      </div>

      {loading ? <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div> : (
        <Card className="border-0 shadow-sm"><CardContent className="p-0"><ScrollArea className="max-h-[65vh]"><Table>
          <TableHeader><TableRow className="bg-slate-50">
            <TableHead className="text-xs">Car</TableHead><TableHead className="text-xs">Price</TableHead><TableHead className="text-xs">Status</TableHead><TableHead className="text-xs">City</TableHead><TableHead className="text-xs">Date</TableHead><TableHead className="text-xs text-right">Actions</TableHead>
          </TableRow></TableHeader>
          <TableBody>{filtered.map(car => (
            <TableRow key={car.id}>
              <TableCell><div><p className="text-sm font-medium">{car.title}</p><p className="text-xs text-slate-400">{car.brand?.name} • {car.year} • {car.fuelType}</p></div></TableCell>
              <TableCell className="text-sm font-medium">{formatPrice(car.price)}</TableCell>
              <TableCell><Badge variant="outline" className={`text-xs ${statusColor(car.status)}`}>{car.status}</Badge></TableCell>
              <TableCell className="text-sm text-slate-500">{car.city?.name || '—'}</TableCell>
              <TableCell className="text-xs text-slate-500">{formatDate(car.createdAt)}</TableCell>
              <TableCell className="text-right"><div className="flex justify-end gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditing(car); setDialogOpen(true) }}><Pencil size={14} /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => { setDeleteId(car.id); setDeleteOpen(true) }}><Trash2 size={14} /></Button>
              </div></TableCell>
            </TableRow>
          ))}{filtered.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-8 text-slate-400">No cars</TableCell></TableRow>}</TableBody>
        </Table></ScrollArea></CardContent></Card>
      )}

      <CarForm open={dialogOpen} onClose={() => { setDialogOpen(false); setEditing(null) }} car={editing} brands={brands} cities={cities} models={models} onBrandChange={fetchModels}
        onSave={async (data: any) => {
          try {
            if (editing) { await fetch(`/api/cars/${editing.id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(data) }); toast.success('Updated') }
            else { await fetch('/api/cars', { method: 'POST', headers: authHeaders(), body: JSON.stringify(data) }); toast.success('Created') }
            setDialogOpen(false); setEditing(null); fetchCars()
          } catch { toast.error('Failed') }
        }} />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete car?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-red-600">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  )
}

function CarForm({ open, onClose, car, brands, cities, models, onBrandChange, onSave }: any) {
  const def = { title: '', brandId: '', modelId: '', year: 2024, price: 0, kmDriven: 0, fuelType: 'PETROL', transmission: 'MANUAL', bodyType: 'HATCHBACK', color: '', cityId: '', description: '', status: 'ACTIVE', isCertified: false, seoTitle: '', seoDescription: '' }
  const [form, setForm] = useState(def)
  useEffect(() => { if (open && car) { setForm({ ...def, ...car, color: car.color || '', cityId: car.cityId || '', description: car.description || '' }); onBrandChange(car.brandId) } else if (open) setForm(def) }, [open, car])
  const upd = (k: string, v: any) => { setForm(p => ({ ...p, [k]: v })); if (k === 'brandId') { setForm(p => ({ ...p, modelId: '' })); onBrandChange(v) } }

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose() }}><DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>{car ? 'Edit' : 'Add'} Car</DialogTitle></DialogHeader>
      <form onSubmit={e => { e.preventDefault(); onSave({ ...form, price: +form.price, year: +form.year, kmDriven: +form.kmDriven }) }} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><Label>Title</Label><Input value={form.title} onChange={e => upd('title', e.target.value)} required /></div>
          <div><Label>Brand</Label><Select value={form.brandId} onValueChange={v => upd('brandId', v)}><SelectTrigger><SelectValue placeholder="Brand" /></SelectTrigger><SelectContent>{brands.map((b: any) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>Model</Label><Select value={form.modelId} onValueChange={v => upd('modelId', v)} disabled={!form.brandId}><SelectTrigger><SelectValue placeholder="Model" /></SelectTrigger><SelectContent>{models.map((m: any) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>Price ₹</Label><Input type="number" value={form.price} onChange={e => upd('price', e.target.value)} min="0" /></div>
          <div><Label>Year</Label><Input type="number" value={form.year} onChange={e => upd('year', e.target.value)} /></div>
          <div><Label>KM</Label><Input type="number" value={form.kmDriven} onChange={e => upd('kmDriven', e.target.value)} min="0" /></div>
          <div><Label>Fuel</Label><Select value={form.fuelType} onValueChange={v => upd('fuelType', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{['PETROL','DIESEL','CNG','ELECTRIC','HYBRID','LPG'].map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>Transmission</Label><Select value={form.transmission} onValueChange={v => upd('transmission', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{['MANUAL','AUTOMATIC','CVT','DCT','AMT'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>City</Label><Select value={form.cityId} onValueChange={v => upd('cityId', v)}><SelectTrigger><SelectValue placeholder="City" /></SelectTrigger><SelectContent>{cities.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>Status</Label><Select value={form.status} onValueChange={v => upd('status', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{['ACTIVE','DRAFT','PENDING','SOLD','FEATURED'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
          <div><Label>Color</Label><Input value={form.color} onChange={e => upd('color', e.target.value)} /></div>
          <div className="col-span-2"><Label>Description</Label><Textarea value={form.description} onChange={e => upd('description', e.target.value)} rows={3} /></div>
          <div className="col-span-2 flex gap-4"><div className="flex items-center gap-2"><Checkbox checked={form.isCertified} onCheckedChange={v => upd('isCertified', v)} /><Label>Certified</Label></div></div>
        </div>
        <DialogFooter><Button type="button" variant="outline" onClick={onClose}>Cancel</Button><Button type="submit">{car ? 'Update' : 'Create'}</Button></DialogFooter>
      </form>
    </DialogContent></Dialog>
  )
}
