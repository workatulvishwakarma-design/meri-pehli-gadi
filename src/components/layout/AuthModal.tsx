'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Loader2, Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'

interface FormErrors {
  [key: string]: string
}

// Simple validation helpers (no zod schema import needed)
function validateLogin(data: { email: string; password: string }): FormErrors {
  const errors: FormErrors = {}
  if (!data.email.trim()) errors.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = 'Enter a valid email'
  if (!data.password) errors.password = 'Password is required'
  else if (data.password.length < 6)
    errors.password = 'Password must be at least 6 characters'
  return errors
}

function validateRegister(data: {
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}): FormErrors {
  const errors: FormErrors = {}
  if (!data.name.trim()) errors.name = 'Name is required'
  else if (data.name.trim().length < 2) errors.name = 'Name must be at least 2 characters'
  if (!data.email.trim()) errors.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = 'Enter a valid email'
  if (!data.phone.trim()) errors.phone = 'Phone number is required'
  else if (!/^[6-9]\d{9}$/.test(data.phone.replace(/\s/g, '')))
    errors.phone = 'Enter a valid 10-digit Indian phone number'
  if (!data.password) errors.password = 'Password is required'
  else if (data.password.length < 6)
    errors.password = 'Password must be at least 6 characters'
  if (!data.confirmPassword)
    errors.confirmPassword = 'Please confirm your password'
  else if (data.password !== data.confirmPassword)
    errors.confirmPassword = 'Passwords do not match'
  return errors
}

export function AuthModal() {
  const showAuthModal = useAppStore((s) => s.showAuthModal)
  const setShowAuthModal = useAppStore((s) => s.setShowAuthModal)
  const authMode = useAppStore((s) => s.authMode)
  const setAuthMode = useAppStore((s) => s.setAuthMode)
  const setAuth = useAppStore((s) => s.setAuth)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Login fields
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginErrors, setLoginErrors] = useState<FormErrors>({})
  const [showLoginPassword, setShowLoginPassword] = useState(false)

  // Register fields
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirmPassword, setRegConfirmPassword] = useState('')
  const [regErrors, setRegErrors] = useState<FormErrors>({})
  const [showRegPassword, setShowRegPassword] = useState(false)

  const handleLogin = async () => {
    const data = { email: loginEmail, password: loginPassword }
    const errors = validateLogin(data)
    setLoginErrors(errors)
    setError('')
    if (Object.keys(errors).length > 0) return

    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || 'Login failed. Please try again.')
        return
      }
      setAuth(json.user)
      setShowAuthModal(false)
      // Reset fields
      setLoginEmail('')
      setLoginPassword('')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    const data = {
      name: regName,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
      confirmPassword: regConfirmPassword,
    }
    const errors = validateRegister(data)
    setRegErrors(errors)
    setError('')
    if (Object.keys(errors).length > 0) return

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || 'Registration failed. Please try again.')
        return
      }
      setAuth(json.user)
      setShowAuthModal(false)
      // Reset fields
      setRegName('')
      setRegEmail('')
      setRegPhone('')
      setRegPassword('')
      setRegConfirmPassword('')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const defaultTab = authMode === 'register' ? 'register' : 'login'

  return (
    <Dialog
      open={showAuthModal}
      onOpenChange={(open) => {
        if (!open) {
          setShowAuthModal(false)
          setError('')
        }
      }}
    >
      <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden">
        {/* Top branding bar */}
        <div className="relative bg-gradient-to-br from-[#0a1628] via-[#1e3a5f] to-[#0a1628] px-6 pt-6 pb-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-4">
            <Image
              src="/logo.png"
              alt="MeriPehli Gadi"
              width={36}
              height={36}
              className="size-9 object-contain"
            />
            <div>
              <div className="text-sm font-bold text-white">
                MeriPehli<span className="text-accent-orange">Gadi</span>
              </div>
              <div className="text-[10px] text-white/60">by Shani Finserve</div>
            </div>
          </div>

          <DialogHeader>
            <DialogTitle className="text-white text-xl font-bold">
              {defaultTab === 'login' ? 'Welcome Back!' : 'Create Account'}
            </DialogTitle>
            <DialogDescription className="text-white/60 text-sm">
              {defaultTab === 'login'
                ? 'Sign in to access your dashboard and saved cars'
                : 'Join MeriPehli Gadi for the best car deals'}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Form Body */}
        <div className="px-6 py-5">
          <Tabs
            defaultValue={defaultTab}
            onValueChange={(v) => {
              setAuthMode(v as 'login' | 'register')
              setError('')
            }}
          >
            <TabsList className="w-full h-11 bg-accent/60 p-1 mb-5">
              <TabsTrigger
                value="login"
                className="flex-1 text-sm font-medium rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Login
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="flex-1 text-sm font-medium rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Register
              </TabsTrigger>
            </TabsList>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* ─── Login Tab ─── */}
            <TabsContent value="login" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-xs font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-9 h-10"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                {loginErrors.email && (
                  <p className="text-xs text-red-500">{loginErrors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-xs font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="login-password"
                    type={showLoginPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="pl-9 pr-10 h-10"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleLogin()
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showLoginPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {loginErrors.password && (
                  <p className="text-xs text-red-500">{loginErrors.password}</p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setAuthMode('forgot')}
                  className="text-xs text-accent-blue hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <Button
                className="w-full h-10 bg-accent-orange hover:bg-accent-orange/90 text-white font-semibold"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                Demo: user@meripehligadi.com / password123
              </p>
            </TabsContent>

            {/* ─── Register Tab ─── */}
            <TabsContent value="register" className="space-y-3.5 mt-0">
              <div className="space-y-2">
                <Label htmlFor="reg-name" className="text-xs font-medium">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="reg-name"
                    type="text"
                    placeholder="John Doe"
                    className="pl-9 h-10"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                  />
                </div>
                {regErrors.name && (
                  <p className="text-xs text-red-500">{regErrors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-email" className="text-xs font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-9 h-10"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                  />
                </div>
                {regErrors.email && (
                  <p className="text-xs text-red-500">{regErrors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-phone" className="text-xs font-medium">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="reg-phone"
                    type="tel"
                    placeholder="9876543210"
                    className="pl-9 h-10"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                  />
                </div>
                {regErrors.phone && (
                  <p className="text-xs text-red-500">{regErrors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-password" className="text-xs font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="reg-password"
                    type={showRegPassword ? 'text' : 'password'}
                    placeholder="Min 6 characters"
                    className="pl-9 pr-10 h-10"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showRegPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {regErrors.password && (
                  <p className="text-xs text-red-500">{regErrors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="reg-confirm-password"
                  className="text-xs font-medium"
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="reg-confirm-password"
                    type="password"
                    placeholder="Re-enter password"
                    className="pl-9 h-10"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRegister()
                    }}
                  />
                </div>
                {regErrors.confirmPassword && (
                  <p className="text-xs text-red-500">
                    {regErrors.confirmPassword}
                  </p>
                )}
              </div>

              <Button
                className="w-full h-10 bg-accent-orange hover:bg-accent-orange/90 text-white font-semibold"
                onClick={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </div>

        {/* Bottom branding */}
        <div className="px-6 py-3 border-t border-border/50 bg-muted/30 text-center">
          <p className="text-[10px] text-muted-foreground">
            Powered by <span className="font-semibold text-foreground/70">MeriPehli Gadi</span> &middot; Shani Finserve
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
