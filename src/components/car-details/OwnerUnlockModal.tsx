'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Unlock, Phone, MessageCircle, X, User, MapPin, CheckCircle2, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface OwnerUnlockProps {
  carId: string
  carTitle: string
  dealerName?: string | null
  dealerPhone?: string | null
}

export function OwnerUnlockModal({ carId, carTitle, dealerName, dealerPhone }: OwnerUnlockProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: 'Dibrugarh',
    interest: 'Buy'
  })

  const CITIES = ['Guwahati', 'Dibrugarh', 'Tinsukia', 'Tezpur', 'Silchar', 'Jorhat', 'Other']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'CONTACT',
          name: formData.name,
          phone: formData.phone,
          message: `Interest: ${formData.interest}. City: ${formData.city}. Car: ${carTitle}`,
          carId
        })
      })

      if (res.ok) {
        setIsUnlocked(true)
        setIsModalOpen(false)
      } else {
        alert('Failed to submit. Please try again.')
      }
    } catch (error) {
      console.error(error)
      alert('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Helper to partially obscure string
  const obscureName = (name?: string | null) => {
    if (!name) return 'Owner Details'
    if (name.length < 3) return name
    return name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1)
  }

  const obscurePhone = (phone?: string | null) => {
    if (!phone) return '+91 98*** *****'
    if (phone.length < 5) return phone
    return phone.substring(0, 4) + '*** ***'
  }

  return (
    <>
      {/* Locked / Unlocked Card */}
      <Card className="p-6 rounded-2xl shadow-sm border-slate-200/80 bg-white/80 backdrop-blur-md relative overflow-hidden">
        {isUnlocked ? (
          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="size-5 text-emerald-500" />
              <h3 className="font-bold text-slate-800">Owner Details Unlocked</h3>
            </div>
            
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="size-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                  {(dealerName || 'O').charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-slate-800">{dealerName || 'Owner'}</div>
                  <div className="text-sm font-medium text-slate-600">{dealerPhone || 'Number not provided'}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <a 
                href={`tel:${dealerPhone}`}
                className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                <Phone className="size-4" /> Call
              </a>
              <a 
                href={`https://wa.me/91${dealerPhone?.replace(/[^0-9]/g, '')}?text=Hi, I am interested in ${encodeURIComponent(carTitle)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                <MessageCircle className="size-4" /> WhatsApp
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="size-4 text-slate-400" />
              <h3 className="font-bold text-slate-800">Owner Details</h3>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 filter blur-[2px] opacity-70 pointer-events-none select-none">
              <div className="font-bold text-slate-800">{obscureName(dealerName)}</div>
              <div className="text-sm font-medium text-slate-600">{obscurePhone(dealerPhone)}</div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-3.5 shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              <span className="relative flex items-center justify-center gap-2">
                <Unlock className="size-4" /> Unlock Owner Details
              </span>
            </button>
          </div>
        )}
      </Card>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 size-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors z-10"
              >
                <X className="size-4" />
              </button>

              <div className="p-6 pb-0">
                <div className="size-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                  <Unlock className="size-6 text-amber-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Get Owner Details</h2>
                <p className="text-slate-500 text-sm mb-6">
                  Please share your details to securely connect with the owner of this {carTitle}.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">Your Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
                      placeholder="Enter full name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input 
                      type="tel" 
                      required
                      pattern="[0-9]{10}"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all"
                      placeholder="10-digit mobile number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">Your City</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 z-10" />
                    <select 
                      value={formData.city}
                      onChange={e => setFormData({...formData, city: e.target.value})}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all appearance-none bg-white"
                    >
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">I am interested in</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Buy', 'Loan', 'Insurance'].map(type => (
                      <label 
                        key={type}
                        className={`flex items-center justify-center py-2 px-1 border rounded-lg cursor-pointer text-sm font-medium transition-all ${
                          formData.interest === type 
                            ? 'border-amber-500 bg-amber-50 text-amber-700' 
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="interest" 
                          value={type}
                          checked={formData.interest === type}
                          onChange={() => setFormData({...formData, interest: type})}
                          className="sr-only"
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Submit & Unlock <Unlock className="size-4" /></>
                    )}
                  </button>
                  <p className="text-center text-[10px] text-slate-400 mt-3 font-medium">
                    By submitting, you agree to our Terms & Privacy Policy
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
