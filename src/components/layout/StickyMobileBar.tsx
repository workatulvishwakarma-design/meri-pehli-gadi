'use client'

import { Phone, MessageCircle, Banknote, HandCoins } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { SITE_URL, WHATSAPP_NUMBER, WHATSAPP_MESSAGE } from '@/lib/seo-data'

export default function StickyMobileBar() {
  const { showMobileMenu, navigateTo } = useAppStore()

  if (showMobileMenu) return null

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] border-t border-slate-100">
        <div className="flex items-stretch justify-around">
          {/* Call */}
          <a
            href="tel:+918721932757"
            className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 active:bg-accent-blue/10 transition-colors"
            aria-label="Call us"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent-blue text-white">
              <Phone className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium text-slate-600 leading-tight">Call</span>
          </a>

          {/* WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 active:bg-green-50 transition-colors"
            aria-label="Chat on WhatsApp"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white">
              <MessageCircle className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium text-slate-600 leading-tight">WhatsApp</span>
          </a>

          {/* Finance */}
          <button
            onClick={() => navigateTo('finance')}
            className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 active:bg-brand/5 transition-colors"
            aria-label="Finance"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand text-white">
              <Banknote className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium text-slate-600 leading-tight">Finance</span>
          </button>

          {/* Sell Car */}
          <button
            onClick={() => navigateTo('sell-car')}
            className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 active:bg-orange-50 transition-colors"
            aria-label="Sell Your Car"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent-orange text-white">
              <HandCoins className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-medium text-slate-600 leading-tight">Sell Car</span>
          </button>
        </div>

        {/* iOS safe area padding */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </div>
  )
}
