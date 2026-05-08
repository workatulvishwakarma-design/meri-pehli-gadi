'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { authHeaders, formatDate, statusColor, leadTypeColor } from './AdminLayout'
import { exportToCSV, exportToExcel, exportToPDF } from '@/lib/export-utils'
import {
  Search, Download, Phone, MessageCircle, StickyNote, Clock,
  UserPlus, ArrowUpDown, Filter, ExternalLink, Eye, ChevronRight,
} from 'lucide-react'

interface LeadCRMProps {
  user: { id: string; name: string | null; email: string; role: string }
  filterType: string
}

interface Lead {
  id: string; name: string; phone: string; email: string | null
  type: string; status: string; message: string | null
  assignedAgentId: string | null; metaData: string | null
  car?: { id: string; title: string; price: number }
  createdAt: string; updatedAt: string
}

interface LeadNote {
  id: string; content: string; authorName: string | null; createdAt: string
}

interface LeadActivity {
  id: string; action: string; details: string | null; authorName: string | null; createdAt: string
}

export default function LeadCRM({ user, filterType }: LeadCRMProps) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState(filterType)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [notes, setNotes] = useState<LeadNote[]>([])
  const [activities, setActivities] = useState<LeadActivity[]>([])
  const [newNote, setNewNote] = useState('')
  const [agents, setAgents] = useState<{ id: string; name: string }[]>([])

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ limit: '100' })
      if (typeFilter) params.set('type', typeFilter)
      if (statusFilter) params.set('status', statusFilter)
      const r = await fetch(`/api/leads?${params}`, { headers: authHeaders() })
      const d = await r.json()
      setLeads(d.leads || [])
    } catch { /* ignore */ }
    setLoading(false)
  }, [typeFilter, statusFilter])

  const fetchAgents = useCallback(async () => {
    try {
      const r = await fetch('/api/users?limit=50', { headers: authHeaders() })
      const d = await r.json()
      const agentRoles = ['SUPER_ADMIN', 'ADMIN', 'AGENT']
      setAgents((d.users || []).filter((u: any) => agentRoles.includes(u.role)).map((u: any) => ({ id: u.id, name: u.name || u.email })))
    } catch { /* ignore */ }
  }, [])

  useEffect(() => { fetchLeads(); fetchAgents() }, [fetchLeads, fetchAgents])

  // Status change with activity tracking
  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({
          status: newStatus,
          activity: { action: 'STATUS_CHANGED', details: JSON.stringify({ newStatus }), authorName: user.name || user.email },
        }),
      })
      toast.success('Status updated')
      fetchLeads()
    } catch { toast.error('Failed to update') }
  }

  // Agent assignment
  const handleAssignAgent = async (leadId: string, agentId: string) => {
    try {
      await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({
          assignedAgentId: agentId,
          activity: { action: 'ASSIGNED', details: JSON.stringify({ agentId }), authorName: user.name || user.email },
        }),
      })
      toast.success('Agent assigned')
      fetchLeads()
    } catch { toast.error('Failed to assign') }
  }

  // Open lead detail
  const openLeadDetail = async (lead: Lead) => {
    setSelectedLead(lead)
    setDetailOpen(true)
    // Fetch notes and activities
    try {
      const [notesR, activitiesR] = await Promise.all([
        fetch(`/api/leads/${lead.id}/notes`, { headers: authHeaders() }),
        fetch(`/api/leads/${lead.id}/activities`, { headers: authHeaders() }),
      ])
      const notesD = await notesR.json()
      const activitiesD = await activitiesR.json()
      setNotes(notesD.notes || [])
      setActivities(activitiesD.activities || [])
    } catch { setNotes([]); setActivities([]) }
  }

  // Add note
  const handleAddNote = async () => {
    if (!newNote.trim() || !selectedLead) return
    try {
      await fetch(`/api/leads/${selectedLead.id}/notes`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ content: newNote, authorName: user.name || user.email }),
      })
      setNewNote('')
      toast.success('Note added')
      // Refresh
      openLeadDetail(selectedLead)
    } catch { toast.error('Failed to add note') }
  }

  // Export
  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    const data = filteredLeads.map(l => ({
      Name: l.name, Phone: l.phone, Email: l.email || '', Type: l.type,
      Status: l.status, Car: l.car?.title || '', Date: formatDate(l.createdAt),
    }))

    if (format === 'csv') exportToCSV(data, 'leads-export')
    else if (format === 'excel') exportToExcel(data, 'leads-export', 'Leads')
    else {
      const cols = ['Name', 'Phone', 'Email', 'Type', 'Status', 'Car', 'Date']
      const rows = data.map(d => [d.Name, d.Phone, d.Email, d.Type, d.Status, d.Car, d.Date])
      exportToPDF('Lead Report — MeriPehli Gadi', cols, rows, 'leads-report')
    }
  }

  // Filter
  const filteredLeads = leads.filter(l => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      if (!l.name.toLowerCase().includes(q) && !l.phone.includes(q) && !(l.email || '').toLowerCase().includes(q)) return false
    }
    return true
  })

  // Activity icon mapping
  const activityIcon = (action: string) => {
    switch (action) {
      case 'CREATED': return '🆕'
      case 'STATUS_CHANGED': return '🔄'
      case 'ASSIGNED': return '👤'
      case 'NOTE_ADDED': return '📝'
      case 'CALLED': return '📞'
      case 'WHATSAPP_CLICKED': return '💬'
      default: return '📋'
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {filterType ? `${filterType.replace('_', ' ')} Leads` : 'Lead CRM'}
          </h1>
          <p className="text-sm text-slate-500">{filteredLeads.length} leads total</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => handleExport('excel')} className="gap-1.5">
            <Download size={14} /> Excel
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('pdf')} className="gap-1.5">
            <Download size={14} /> PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('csv')} className="gap-1.5">
            <Download size={14} /> CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by name, phone, email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        {!filterType && (
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="CONTACT">Contact</SelectItem>
              <SelectItem value="FINANCE">Finance</SelectItem>
              <SelectItem value="INSURANCE">Insurance</SelectItem>
              <SelectItem value="SELL_CAR">Sell Car</SelectItem>
              <SelectItem value="TEST_DRIVE">Test Drive</SelectItem>
              <SelectItem value="VALUATION">Valuation</SelectItem>
            </SelectContent>
          </Select>
        )}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Status</SelectItem>
            <SelectItem value="NEW">New</SelectItem>
            <SelectItem value="CONTACTED">Contacted</SelectItem>
            <SelectItem value="QUALIFIED">Qualified</SelectItem>
            <SelectItem value="CONVERTED">Converted</SelectItem>
            <SelectItem value="LOST">Lost</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full rounded" />)}</div>
      ) : (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <ScrollArea className="max-h-[65vh]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="text-xs font-semibold">Name</TableHead>
                    <TableHead className="text-xs font-semibold">Phone</TableHead>
                    <TableHead className="text-xs font-semibold">Type</TableHead>
                    <TableHead className="text-xs font-semibold">Status</TableHead>
                    <TableHead className="text-xs font-semibold">Car</TableHead>
                    <TableHead className="text-xs font-semibold">Agent</TableHead>
                    <TableHead className="text-xs font-semibold">Date</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map(lead => (
                    <TableRow key={lead.id} className="hover:bg-slate-50/50 cursor-pointer" onClick={() => openLeadDetail(lead)}>
                      <TableCell>
                        <div>
                          <span className="text-sm font-medium text-slate-800">{lead.name}</span>
                          {lead.email && <p className="text-xs text-slate-400">{lead.email}</p>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <a href={`tel:${lead.phone}`} className="text-sm text-blue-600 hover:underline" onClick={e => e.stopPropagation()}>
                          {lead.phone}
                        </a>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`text-xs ${leadTypeColor(lead.type)}`}>
                          {lead.type.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select value={lead.status} onValueChange={v => { handleStatusChange(lead.id, v) }}>
                          <SelectTrigger className="h-7 w-[110px] text-xs" onClick={e => e.stopPropagation()}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST'].map(s => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-xs text-slate-500 max-w-[120px] truncate">
                        {lead.car?.title || '—'}
                      </TableCell>
                      <TableCell>
                        <Select value={lead.assignedAgentId || ''} onValueChange={v => handleAssignAgent(lead.id, v)}>
                          <SelectTrigger className="h-7 w-[110px] text-xs" onClick={e => e.stopPropagation()}>
                            <SelectValue placeholder="Assign" />
                          </SelectTrigger>
                          <SelectContent>
                            {agents.map(a => (
                              <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">{formatDate(lead.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1" onClick={e => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-green-600" asChild>
                            <a href={`https://wa.me/91${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener">
                              <MessageCircle size={14} />
                            </a>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-blue-600" asChild>
                            <a href={`tel:${lead.phone}`}>
                              <Phone size={14} />
                            </a>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openLeadDetail(lead)}>
                            <Eye size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredLeads.length === 0 && (
                    <TableRow><TableCell colSpan={8} className="text-center py-8 text-slate-400">No leads found</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Lead Detail Modal */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>{selectedLead?.name}</span>
              {selectedLead && <Badge variant="secondary" className={`text-xs ${leadTypeColor(selectedLead.type)}`}>{selectedLead.type.replace('_', ' ')}</Badge>}
            </DialogTitle>
          </DialogHeader>

          {selectedLead && (
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 font-medium">Phone</label>
                  <p className="text-sm font-medium">{selectedLead.phone}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-500 font-medium">Email</label>
                  <p className="text-sm">{selectedLead.email || '—'}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-500 font-medium">Interested Car</label>
                  <p className="text-sm">{selectedLead.car?.title || '—'}</p>
                </div>
                <div>
                  <label className="text-xs text-slate-500 font-medium">Created</label>
                  <p className="text-sm">{formatDate(selectedLead.createdAt)}</p>
                </div>
              </div>

              {selectedLead.message && (
                <div>
                  <label className="text-xs text-slate-500 font-medium">Message</label>
                  <p className="text-sm bg-slate-50 p-3 rounded-lg mt-1">{selectedLead.message}</p>
                </div>
              )}

              <Separator />

              {/* Activity Timeline */}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
                  <Clock size={14} /> Activity Timeline
                </h3>
                <div className="space-y-3 relative pl-6 border-l-2 border-slate-200">
                  {activities.map(act => (
                    <div key={act.id} className="relative">
                      <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-white border-2 border-blue-400 flex items-center justify-center text-[8px]">
                        {activityIcon(act.action)}
                      </div>
                      <div className="bg-slate-50 rounded-lg p-2.5">
                        <div className="flex justify-between items-start">
                          <p className="text-xs font-medium text-slate-700">
                            {act.action.replace('_', ' ')}
                            {act.authorName && <span className="text-slate-400 font-normal"> by {act.authorName}</span>}
                          </p>
                          <span className="text-[10px] text-slate-400">{formatDate(act.createdAt)}</span>
                        </div>
                        {act.details && <p className="text-xs text-slate-500 mt-0.5">{act.details}</p>}
                      </div>
                    </div>
                  ))}
                  {activities.length === 0 && (
                    <p className="text-xs text-slate-400 py-2">No activity recorded yet</p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Notes */}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
                  <StickyNote size={14} /> Notes
                </h3>
                <div className="space-y-2 mb-3">
                  {notes.map(note => (
                    <div key={note.id} className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                      <p className="text-sm text-slate-700">{note.content}</p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {note.authorName || 'System'} • {formatDate(note.createdAt)}
                      </p>
                    </div>
                  ))}
                  {notes.length === 0 && <p className="text-xs text-slate-400">No notes yet</p>}
                </div>
                <div className="flex gap-2">
                  <Textarea
                    value={newNote}
                    onChange={e => setNewNote(e.target.value)}
                    placeholder="Add a note..."
                    rows={2}
                    className="text-sm"
                  />
                  <Button onClick={handleAddNote} size="sm" className="self-end">
                    Add
                  </Button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" className="gap-1.5 text-green-600" asChild>
                  <a href={`https://wa.me/91${selectedLead.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener">
                    <MessageCircle size={14} /> WhatsApp
                  </a>
                </Button>
                <Button size="sm" variant="outline" className="gap-1.5 text-blue-600" asChild>
                  <a href={`tel:${selectedLead.phone}`}>
                    <Phone size={14} /> Call
                  </a>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
