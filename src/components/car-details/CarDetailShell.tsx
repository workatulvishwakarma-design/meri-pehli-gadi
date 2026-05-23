'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CarOverview } from './CarOverview'
import { InspectionReport } from './InspectionReport'
import { SpecsAndFeatures } from './SpecsAndFeatures'
import { FinanceBox } from './FinanceBox'
import { InsuranceTab } from './InsuranceTab'
import { OwnerUnlockModal } from './OwnerUnlockModal'
import { Phone, MessageCircle, Calendar } from 'lucide-react'

interface CarDetailShellProps {
  car: any
}

export function CarDetailShell({ car }: CarDetailShellProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'inspection' | 'specs' | 'finance' | 'insurance'>('overview')
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false)

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'inspection', label: 'Inspection' },
    { id: 'specs', label: 'Specs & Features' },
    { id: 'finance', label: 'Finance' },
    { id: 'insurance', label: 'Insurance' },
  ] as const

  const triggerLeadModal = () => setIsLeadModalOpen(true)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
      {/* Left Column: Tabs & Content */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Tab Navigation */}
        <div className="sticky top-[72px] z-30 bg-slate-50 pt-2 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex overflow-x-auto hide-scrollbar gap-2 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2.5 text-sm font-bold rounded-xl whitespace-nowrap transition-colors ${
                  activeTab === tab.id ? 'text-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-slate-800 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content with Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="min-h-[400px]"
          >
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <CarOverview car={{
                  year: car.year,
                  kmDriven: car.kmDriven,
                  fuelType: car.fuelType,
                  transmission: car.transmission,
                  ownerType: car.ownerType,
                  city: car.city?.name || 'Assam',
                  rto: car.rto,
                  bodyType: car.bodyType,
                  price: car.price,
                  color: car.color
                }} />
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 prose max-w-none">
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Why buy this {car.brand?.name || 'Car'}?</h3>
                  <p className="text-slate-600 leading-relaxed">
                    This {car.year} {car.title} is an excellent choice for navigating the diverse terrains of Assam. 
                    With {car.kmDriven.toLocaleString()} km on the odometer, this {car.fuelType.toLowerCase()} {car.bodyType.toLowerCase()} offers great mileage and reliability. 
                    It has been thoroughly inspected and comes with the MeriPehli Gadi trust guarantee. 
                    Easy financing is available through Shani Finserve with low downpayment options.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'inspection' && (
              <InspectionReport score={car.conditionScore || 9} isCertified={car.isCertified} />
            )}

            {activeTab === 'specs' && (
              <SpecsAndFeatures 
                features={car.features || []}
                car={{
                  fuelType: car.fuelType,
                  transmission: car.transmission,
                  bodyType: car.bodyType,
                  year: car.year,
                  kmDriven: car.kmDriven,
                  color: car.color
                }}
              />
            )}

            {activeTab === 'finance' && (
              <FinanceBox 
                price={car.price} 
                emiPrice={car.emiPrice} 
                onApply={triggerLeadModal} 
              />
            )}

            {activeTab === 'insurance' && (
              <InsuranceTab 
                insuranceValidTill={car.insuranceValidTill}
                price={car.price}
                carTitle={car.title}
                onGetQuote={triggerLeadModal}
              />
            )}
          </motion.div>
        </AnimatePresence>

      </div>

      {/* Right Column: Sticky Sidebar */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-6">
          
          {/* Price Card */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 relative overflow-hidden">
            <div className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-1">Asking Price</div>
            <div className="text-4xl font-extrabold text-brand mb-4">
              ₹{car.price.toLocaleString('en-IN')}
            </div>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={triggerLeadModal}
                className="w-full bg-brand hover:bg-brand/90 text-white font-bold py-4 rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                <Calendar className="size-5" /> Book Test Drive
              </button>
              <div className="flex gap-3">
                <button 
                  onClick={triggerLeadModal}
                  className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 font-bold py-3 rounded-xl border border-green-200 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="size-4" /> WhatsApp
                </button>
                <button 
                  onClick={triggerLeadModal}
                  className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-3 rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="size-4" /> Call Seller
                </button>
              </div>
            </div>
            
            <p className="text-center text-xs text-slate-400 mt-4 font-medium">No hidden charges. Transparent pricing.</p>
          </div>

          {/* Owner Unlock */}
          <OwnerUnlockModal 
            carId={car.id}
            carTitle={car.title}
            dealerName={car.dealer?.name}
            dealerPhone={car.dealer?.phone}
          />
          
        </div>
      </div>
      
      {/* Invisible global lead modal triggered from other components */}
      {isLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsLeadModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">Express Interest</h2>
            <p className="text-slate-600 mb-6">A representative will contact you shortly regarding the {car.title}.</p>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  type: 'TEST_DRIVE',
                  name: fd.get('name'),
                  phone: fd.get('phone'),
                  message: `Quick inquiry for ${car.title}`,
                  carId: car.id
                })
              });
              setIsLeadModalOpen(false);
              alert('Thank you! We will contact you soon.');
            }}>
              <div className="space-y-4">
                <input name="name" required placeholder="Your Name" className="w-full p-3 border rounded-xl" />
                <input name="phone" required placeholder="Phone Number" className="w-full p-3 border rounded-xl" />
                <Button type="submit" className="w-full">Submit</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
