'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export default function PremiumPreloader() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Check if we've already shown the preloader in this session
    const hasSeenPreloader = sessionStorage.getItem('preloaderSeen')
    
    if (hasSeenPreloader) {
      setIsVisible(false)
      return
    }

    // Set timeout to hide preloader after 2.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false)
      sessionStorage.setItem('preloaderSeen', 'true')
    }, 2800)

    // Ensure body doesn't scroll while preloader is active
    document.body.style.overflow = 'hidden'

    return () => {
      clearTimeout(timer)
      document.body.style.overflow = ''
    }
  }, [])

  if (!isVisible) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black overflow-hidden"
        >
          {/* Background Ambient Glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] bg-gradient-to-tr from-blue-900/20 via-transparent to-orange-900/20 rounded-full blur-[100px] animate-pulse" />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            {/* SVG Car Outline Animation */}
            <div className="relative w-64 h-32 md:w-80 md:h-40 mb-8">
              <svg viewBox="0 0 320 120" className="w-full h-full drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                {/* Outline Path */}
                <motion.path
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                  d="M40 90 L60 50 C65 40, 80 35, 100 30 L220 30 C240 35, 255 40, 260 50 L280 90 C290 90, 300 95, 300 105 C300 115, 290 120, 280 120 L270 120 C270 110, 260 100, 250 100 C240 100, 230 110, 230 120 L90 120 C90 110, 80 100, 70 100 C60 100, 50 110, 50 120 L40 120 C30 120, 20 115, 20 105 C20 95, 30 90, 40 90 Z"
                  fill="none"
                  stroke="url(#neonGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                {/* Wheels */}
                <motion.circle
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  cx="70" cy="110" r="15"
                  fill="none" stroke="#3b82f6" strokeWidth="2"
                />
                <motion.circle
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.3 }}
                  cx="250" cy="110" r="15"
                  fill="none" stroke="#3b82f6" strokeWidth="2"
                />

                {/* Gradients */}
                <defs>
                  <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Light Sweep Effect */}
              <motion.div
                initial={{ left: '-100%' }}
                animate={{ left: '200%' }}
                transition={{ duration: 1.5, delay: 0.5, ease: 'easeInOut' }}
                className="absolute top-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"
              />
            </div>

            {/* Brand Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="text-center"
            >
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2" style={{ textShadow: '0 0 20px rgba(255,255,255,0.3)' }}>
                MeriPehli <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-400">Gadi</span>
              </h1>
              <div className="flex items-center justify-center gap-2 mt-4 opacity-80">
                <div className="h-px w-8 bg-gradient-to-r from-transparent to-white/50" />
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300 font-medium">
                  Powered by Shani Finserve
                </p>
                <div className="h-px w-8 bg-gradient-to-l from-transparent to-white/50" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
