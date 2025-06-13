'use client'

import { NavBar } from '@/components/nav-bar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { motion } from 'framer-motion'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FaGithub, FaMicrosoft } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5'
import { toast } from 'sonner'

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

const buttonVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
}

export default function SignIn() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      if (result?.error) {
        if (result.error === 'Invalid credentials')
          toast.error('Invalid email or password')
        else
          toast.error('Something went wrong')
      }
      else {
        toast.success('Signed in successfully')
        router.push('/')
      }
    }
    catch (error) {
      toast.error('Failed to sign in')
      console.error(error)
    }
    finally {
      setIsLoading(false)
    }
  }

  const handleSocialSignIn = (provider: string) => {
    toast.loading('Redirecting to provider...')
    signIn(provider, { callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800/20">
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
                Welcome Back
              </motion.h2>
              <motion.p
                className="text-gray-400"
                variants={fadeIn}
              >
                Sign in to continue building your AI assistant
              </motion.p>
            </div>

            <motion.div
              className="space-y-6"
              variants={fadeIn}
            >
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="bg-[#2a2a2a] border-gray-700 text-white h-12"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="password">Password</Label>
                    <button
                      type="button"
                      className="text-sm text-[#FAFAFA] hover:underline cursor-pointer"
                      onClick={() => {
                        router.push('/forgot-password')
                      }}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="bg-[#2a2a2a] border-gray-700 text-white pr-10 h-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <IoEyeOffOutline className="h-5 w-5" /> : <IoEyeOutline className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-white text-black hover:bg-gray-100 h-12 mt-6 cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-black text-gray-400">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <motion.div variants={buttonVariants} whileHover="hover">
                  <Button
                    variant="outline"
                    className="w-full h-12 bg-white/10 text-white hover:bg-white/20 border border-gray-700 cursor-pointer"
                    onClick={() => handleSocialSignIn('google')}
                  >
                    <FcGoogle className="h-5 w-5" />
                  </Button>
                </motion.div>
                <motion.div variants={buttonVariants} whileHover="hover">
                  <Button
                    variant="outline"
                    className="w-full h-12 bg-white/10 text-white hover:bg-white/20 border border-gray-700 cursor-pointer"
                    onClick={() => handleSocialSignIn('github')}
                  >
                    <FaGithub className="h-5 w-5" />
                  </Button>
                </motion.div>
                <motion.div variants={buttonVariants} whileHover="hover">
                  <Button
                    variant="outline"
                    className="w-full h-12 bg-white/10 text-white hover:bg-white/20 border border-gray-700 cursor-pointer"
                    onClick={() => handleSocialSignIn('azure-ad')}
                  >
                    <FaMicrosoft className="h-5 w-5" />
                  </Button>
                </motion.div>
              </div>

              <div className="text-center text-sm text-gray-400">
                Don't have an account?
                {' '}
                <button
                  type="button"
                  className="text-[#FAFAFA] hover:underline cursor-pointer"
                  onClick={() => router.push('/sign-up')}
                >
                  Sign up
                </button>
              </div>
            </motion.div>

            <motion.p
              className="text-center text-sm text-gray-500"
              variants={fadeIn}
            >
              By continuing, you agree to our
              {' '}
              <a
                href="/terms"
                className="underline text-[#FAFAFA] hover:text-[#e5e5e5] transition-colors"
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
                className="underline text-[#FAFAFA] hover:text-[#e5e5e5] transition-colors"
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
