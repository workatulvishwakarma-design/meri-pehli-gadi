'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Send } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'bot'
  text: string
  timestamp: Date
}

const INITIAL_BOT_TEXT = 'Namaste! 🙏 Welcome to MeriPehli Gadi. I can help you with:\n\n🚗 Finding used cars in Assam\n💰 Car finance & EMI details\n🛡️ Car insurance queries\n📋 Selling your car\n\nKya help chahiye?'

export default function FloatingCarChatButton() {
  const [isOpen, setIsOpen] = useState(false)
  // Lazy init: create initial message only on first render to avoid SSR time mismatch
  const [messages, setMessages] = useState<Message[]>(() => [{
    id: '1',
    role: 'bot',
    text: INITIAL_BOT_TEXT,
    timestamp: new Date(),
  }])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [mounted, setMounted] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Only render timestamps after client mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input.trim(),
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    // Placeholder bot response
    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: getBotResponse(userMsg.text),
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, botMsg])
      setIsTyping(false)
    }, 1200)
  }

  const getBotResponse = (query: string): string => {
    const q = query.toLowerCase()
    if (q.includes('car') && (q.includes('buy') || q.includes('find') || q.includes('search')))
      return 'We have 100+ certified used cars in Dibrugarh, Guwahati, Jorhat and other Assam cities! 🚗\n\nBrowse our collection or tell me your budget and preferred brand.'
    if (q.includes('finance') || q.includes('loan') || q.includes('emi'))
      return 'Shani Finserve offers easy car loans! 💰\n\n✅ EMI starting ₹8,999/month\n✅ Quick approval in 24-48 hrs\n✅ Minimal documentation\n\nShall I connect you with our finance team?'
    if (q.includes('insurance'))
      return 'We provide comprehensive car insurance support! 🛡️\n\n• New policy\n• Renewal\n• Third-party\n• Comprehensive coverage\n\nShare your car details for a quick quote.'
    if (q.includes('sell'))
      return 'Want to sell your car? 🤝\n\n3 easy steps:\n1. Enter car details\n2. Get free valuation\n3. Get verified buyer inquiries\n\nVisit our Sell Car page to get started!'
    if (q.includes('hello') || q.includes('hi') || q.includes('hey'))
      return 'Hello! 👋 How can I help you today? I can assist with buying cars, finance, insurance, or selling your car in Assam.'
    return 'Thank you for your message! 🙏\n\nOur team will connect with you shortly. You can also:\n\n📞 Call: 087219 32757\n💬 WhatsApp: +91 8721932757\n\nFor immediate assistance.'
  }

  const formatTime = (date: Date) => {
    if (!mounted) return '' // Return empty on SSR to avoid mismatch
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed z-[998] transition-all duration-500 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        style={{ bottom: '150px', right: '24px' }}
        aria-label="Open AI assistant"
      >
        <div className="relative group">
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 blur-lg opacity-40 group-hover:opacity-70 transition-opacity animate-pulse" />

          {/* Main button */}
          <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-[#0a1628] via-[#1e3a5f] to-[#3b82f6] shadow-2xl flex items-center justify-center overflow-hidden border-2 border-white/20 group-hover:scale-110 transition-transform duration-300">
            {/* 3D Car SVG */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="drop-shadow-lg">
              <defs>
                <linearGradient id="carGrad" x1="0" y1="0" x2="24" y2="24">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#a78bfa" />
                </linearGradient>
              </defs>
              {/* Car body */}
              <path d="M3 14h18v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3z" fill="url(#carGrad)" opacity="0.9" />
              <path d="M5 14l2-5h10l2 5" fill="url(#carGrad)" opacity="0.7" />
              {/* Windows */}
              <path d="M7.5 10l1.5-3.5h6L16.5 10" fill="white" opacity="0.3" />
              {/* Wheels */}
              <circle cx="7" cy="17.5" r="1.5" fill="white" opacity="0.9" />
              <circle cx="17" cy="17.5" r="1.5" fill="white" opacity="0.9" />
              {/* Headlights */}
              <rect x="19" y="13" width="2" height="2" rx="0.5" fill="#fbbf24" opacity="0.9" />
              <rect x="3" y="13" width="2" height="2" rx="0.5" fill="#ef4444" opacity="0.7" />
            </svg>

            {/* Shine animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </div>

          {/* Pulse ring */}
          <div className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-ping" style={{ animationDuration: '4s' }} />

          {/* Label */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0a1628] text-white text-[10px] px-2.5 py-1 rounded-full whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
            AI Assistant
          </div>
        </div>
      </button>

      {/* Chat Window */}
      <div
        className={`fixed z-[999] transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'
        }`}
        style={{ bottom: '24px', right: '24px', width: '380px', maxHeight: '560px' }}
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col" style={{ height: '520px' }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0a1628] to-[#1e3a5f] p-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center shadow-lg">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M3 14h18v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3z" fill="white" opacity="0.9" />
                  <path d="M5 14l2-5h10l2 5" fill="white" opacity="0.7" />
                  <circle cx="7" cy="17.5" r="1.5" fill="white" />
                  <circle cx="17" cy="17.5" r="1.5" fill="white" />
                </svg>
              </div>
              <div>
                <h3 className="text-white text-sm font-semibold">MeriPehli Gadi Assistant</h3>
                <p className="text-blue-200 text-[10px]">Ask about cars, finance or insurance</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md'
                    : 'bg-white border border-slate-200 text-slate-700 rounded-bl-md shadow-sm'
                }`}>
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <p
                    className={`text-[9px] mt-1 ${msg.role === 'user' ? 'text-blue-200' : 'text-slate-400'}`}
                    suppressHydrationWarning
                  >
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t bg-white flex-shrink-0">
            <form onSubmit={e => { e.preventDefault(); handleSend() }} className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 h-9 text-sm rounded-full px-4"
              />
              <Button type="submit" size="icon" className="h-9 w-9 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600" disabled={!input.trim()}>
                <Send size={14} />
              </Button>
            </form>
            <p className="text-[9px] text-slate-400 text-center mt-1.5">
              Powered by MeriPehli Gadi • AI responses are for assistance only
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
