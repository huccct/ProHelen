'use client'

import { NavBar } from '@/components/nav-bar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

export default function ForgotPassword() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok)
        throw new Error(data.error)

      setIsSent(true)
      toast.success('Reset link sent to your email')
    }
    catch (error) {
      console.error('Forgot password error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to send reset link')
    }
    finally {
      setIsLoading(false)
    }
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
                {!isSent
                  ? 'Enter your email address and we\'ll send you instructions to reset your password.'
                  : 'Check your email for a link to reset your password.'}
              </motion.p>
            </div>

            <motion.div
              className="space-y-6"
              variants={fadeIn}
            >
              {!isSent
                ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="bg-input border-border text-foreground h-12"
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 mt-6 cursor-pointer"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Sending reset link...' : 'Send reset link'}
                      </Button>
                    </form>
                  )
                : (
                    <div className="space-y-4">
                      <div className="bg-muted text-foreground p-4 rounded-lg text-sm">
                        We've sent a password reset link to
                        {' '}
                        <strong>{email}</strong>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full h-12 cursor-pointer"
                        onClick={() => {
                          setIsSent(false)
                          setEmail('')
                        }}
                      >
                        Try another email
                      </Button>
                    </div>
                  )}

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

            <motion.p
              className="text-center text-sm text-muted-foreground"
              variants={fadeIn}
            >
              By continuing, you agree to our
              {' '}
              <a
                href="/terms"
                className="underline text-foreground hover:text-foreground/80 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Service
              </a>
              {' '}
              and
              {' '}
              <a
                href="/privacy"
                className="underline text-foreground hover:text-foreground/80 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
