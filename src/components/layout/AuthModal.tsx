'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
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

/* ─── Types ──────────────────────────────────────────────── */

interface LoginFormData {
  email: string
  password: string
}

interface RegisterFormData {
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

/* ─── Component ──────────────────────────────────────────── */

export function AuthModal() {
  const showAuthModal = useAppStore((s) => s.showAuthModal)
  const setShowAuthModal = useAppStore((s) => s.setShowAuthModal)
  const authMode = useAppStore((s) => s.authMode)
  const setAuthMode = useAppStore((s) => s.setAuthMode)
  const setAuth = useAppStore((s) => s.setAuth)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
            <TabsContent value="login" className="mt-0">
              <LoginForm
                loading={loading}
                setLoading={setLoading}
                setError={setError}
                onSuccess={(token, user) => {
                  if (token) localStorage.setItem('meripehli-token', token)
                  setAuth(user)
                  setShowAuthModal(false)
                }}
              />
            </TabsContent>

            {/* ─── Register Tab ─── */}
            <TabsContent value="register" className="mt-0">
              <RegisterForm
                loading={loading}
                setLoading={setLoading}
                setError={setError}
                onSuccess={(token, user) => {
                  if (token) localStorage.setItem('meripehli-token', token)
                  setAuth(user)
                  setShowAuthModal(false)
                }}
              />
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

/* ─── Login Form ─────────────────────────────────────────── */

function LoginForm({
  loading,
  setLoading,
  setError,
  onSuccess,
}: {
  loading: boolean
  setLoading: (v: boolean) => void
  setError: (v: string) => void
  onSuccess: (token: string, user: { id: string; name: string; email: string; role: string; avatar?: string }) => void
}) {
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: LoginFormData) => {
    setError('')
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
      onSuccess(json.token ?? '', json.user)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const setAuthMode = useAppStore((s) => s.setAuthMode)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
            })}
          />
        </div>
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="login-password" className="text-xs font-medium">
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            className="pl-9 pr-10 h-10"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setAuthMode('forgot')}
          className="text-xs text-accent-blue hover:underline"
        >
          Forgot Password?
        </button>
      </div>

      <Button
        type="submit"
        className="w-full h-10 bg-accent-orange hover:bg-accent-orange/90 text-white font-semibold"
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
    </form>
  )
}

/* ─── Register Form ──────────────────────────────────────── */

function RegisterForm({
  loading,
  setLoading,
  setError,
  onSuccess,
}: {
  loading: boolean
  setLoading: (v: boolean) => void
  setError: (v: string) => void
  onSuccess: (token: string, user: { id: string; name: string; email: string; role: string; avatar?: string }) => void
}) {
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<RegisterFormData>({
    defaultValues: { name: '', email: '', phone: '', password: '', confirmPassword: '' },
  })

  const onSubmit = async (data: RegisterFormData) => {
    setError('')
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
      /* Auto-login after registration */
      const token = json.token ?? ''
      const user = json.user
      if (token && user) {
        onSuccess(token, user)
      } else {
        /* If register didn't auto-login, try logging in */
        const loginRes = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: data.email, password: data.password }),
        })
        const loginJson = await loginRes.json()
        if (loginRes.ok) {
          onSuccess(loginJson.token ?? '', loginJson.user)
        } else {
          setError('Account created. Please login to continue.')
          useAppStore.getState().setAuthMode('login')
        }
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
      <div className="space-y-2">
        <Label htmlFor="reg-name" className="text-xs font-medium">Full Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            id="reg-name"
            type="text"
            placeholder="John Doe"
            className="pl-9 h-10"
            {...register('name', {
              required: 'Name is required',
              minLength: { value: 2, message: 'Name must be at least 2 characters' },
            })}
          />
        </div>
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="reg-email" className="text-xs font-medium">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            id="reg-email"
            type="email"
            placeholder="you@example.com"
            className="pl-9 h-10"
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
            })}
          />
        </div>
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="reg-phone" className="text-xs font-medium">Phone Number</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            id="reg-phone"
            type="tel"
            placeholder="9876543210"
            className="pl-9 h-10"
            {...register('phone', {
              required: 'Phone number is required',
              pattern: {
                value: /^[6-9]\d{9}$/,
                message: 'Enter a valid 10-digit Indian phone number',
              },
            })}
          />
        </div>
        {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="reg-password" className="text-xs font-medium">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            id="reg-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Min 6 characters"
            className="pl-9 pr-10 h-10"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="reg-confirm-password" className="text-xs font-medium">
          Confirm Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            id="reg-confirm-password"
            type="password"
            placeholder="Re-enter password"
            className="pl-9 h-10"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) => value === getValues('password') || 'Passwords do not match',
            })}
          />
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full h-10 bg-accent-orange hover:bg-accent-orange/90 text-white font-semibold"
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
    </form>
  )
}
