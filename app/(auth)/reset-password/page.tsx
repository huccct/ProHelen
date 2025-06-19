'use client'

import { NavBar } from '@/components/nav-bar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5'
import { toast } from 'sonner'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const validatePassword = (password: string) => {
    const requirements = [
      { regex: /.{8,}/, message: 'At least 8 characters' },
      { regex: /[A-Z]/, message: 'One uppercase letter' },
      { regex: /[a-z]/, message: 'One lowercase letter' },
      { regex: /\d/, message: 'One number' },
    ]
    return requirements.map(req => ({
      met: req.regex.test(password),
      message: req.message,
    }))
  }

  const PasswordStrengthIndicator = () => {
    if (!password)
      return null

    const validations = validatePassword(password)
    const strength = validations.filter(v => v.met).length

    return (
      <div className="space-y-2 mt-2">
        <div className="flex gap-1">
          {[...Array.from({ length: 4 })].map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${i < strength ? 'bg-green-500' : 'bg-muted'}`}
            />
          ))}
        </div>
        <ul className="text-xs space-y-1">
          {validations.map((validation, index) => (
            <li
              key={index}
              className={`flex items-center gap-1 ${validation.met ? 'text-green-500' : 'text-muted-foreground'}`}
            >
              {validation.met ? '✓' : '○'}
              {' '}
              {validation.message}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) {
      toast.error('Invalid reset link')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    const validations = validatePassword(password)
    if (!validations.every(v => v.met)) {
      toast.error('Password does not meet requirements')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password,
        }),
      })

      const data = await res.json()

      if (!res.ok)
        throw new Error(data.error)

      toast.success('Password reset successfully')
      router.push('/sign-in')
    }
    catch (error) {
      console.error('Reset password error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to reset password')
    }
    finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/20">
          <NavBar hideSignIn />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">Invalid Reset Link</h2>
              <p className="text-muted-foreground">This password reset link is invalid or has expired.</p>
              <Button
                onClick={() => router.push('/forgot-password')}
                className="mt-4"
              >
                Request New Reset Link
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/20">
        <NavBar hideSignIn />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
          <motion.div
            className="w-full max-w-md space-y-8"
            variants={fadeIn}
            initial="initial"
            animate="animate"
          >
            <div className="text-center space-y-4">
              <motion.h2
                className="text-3xl sm:text-4xl font-bold tracking-tight"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                Reset your password
              </motion.h2>
              <motion.p
                className="text-muted-foreground"
                variants={fadeIn}
              >
                Please enter your new password below.
              </motion.p>
            </div>

            <motion.div
              className="space-y-6"
              variants={fadeIn}
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your new password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="bg-input border-border text-foreground pr-10 h-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      {showPassword ? <IoEyeOffOutline className="h-5 w-5" /> : <IoEyeOutline className="h-5 w-5" />}
                    </button>
                  </div>
                  <PasswordStrengthIndicator />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your new password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="bg-input border-border text-foreground pr-10 h-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      {showConfirmPassword ? <IoEyeOffOutline className="h-5 w-5" /> : <IoEyeOutline className="h-5 w-5" />}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 mt-6 cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? 'Resetting password...' : 'Reset password'}
                </Button>
              </form>

              <div className="text-center text-sm text-muted-foreground">
                Remember your password?
                {' '}
                <button
                  type="button"
                  className="text-foreground hover:underline cursor-pointer"
                  onClick={() => router.push('/sign-in')}
                >
                  Sign in
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default function ResetPassword() {
  return (
    <Suspense fallback={(
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Loading...</h2>
          <p className="text-muted-foreground">Please wait while we verify your reset link.</p>
        </div>
      </div>
    )}
    >
      <ResetPasswordForm />
    </Suspense>
  )
}
