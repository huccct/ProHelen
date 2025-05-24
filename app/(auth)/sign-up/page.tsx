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

export default function SignUp() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // form validation
      if (formData.password.length < 8) {
        throw new Error('Password must be at least 8 characters long')
      }

      if (!/[A-Z]/.test(formData.password)) {
        throw new Error('Password must contain at least one uppercase letter')
      }

      if (!/[a-z]/.test(formData.password)) {
        throw new Error('Password must contain at least one lowercase letter')
      }

      if (!/\d/.test(formData.password)) {
        throw new Error('Password must contain at least one number')
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match')
      }

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to register')
      }

      toast.success('Account created successfully! Redirecting to login...')

      setTimeout(() => {
        router.push('/sign-in')
      }, 500)
    }
    catch (error) {
      console.error('Registration error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to register')
    }
    finally {
      setIsLoading(false)
    }
  }

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
    if (!formData.password)
      return null

    const validations = validatePassword(formData.password)
    const strength = validations.filter(v => v.met).length

    return (
      <div className="space-y-2 mt-2">
        <div className="flex gap-1">
          {[...Array.from({ length: 4 })].map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${i < strength ? 'bg-green-500' : 'bg-gray-700'}`}
            />
          ))}
        </div>
        <ul className="text-xs space-y-1">
          {validations.map((validation, index) => (
            <li
              key={index}
              className={`flex items-center gap-1 ${validation.met ? 'text-green-500' : 'text-gray-400'}`}
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

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar hideSignIn />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
                Create your account
              </motion.h2>
              <motion.p
                className="text-gray-400"
                variants={fadeIn}
              >
                Start building your personalized AI assistant
              </motion.p>
            </div>

            <motion.div
              className="space-y-6"
              variants={fadeIn}
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-[#2a2a2a] border-gray-700 text-white h-12"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-[#2a2a2a] border-gray-700 text-white h-12"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
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
                  <PasswordStrengthIndicator />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="bg-[#2a2a2a] border-gray-700 text-white pr-10 h-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                    >
                      {showConfirmPassword ? <IoEyeOffOutline className="h-5 w-5" /> : <IoEyeOutline className="h-5 w-5" />}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-white text-black hover:bg-gray-100 h-12 mt-6 cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating account...' : 'Create account'}
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
                    onClick={() => signIn('google', { callbackUrl: '/' })}
                  >
                    <FcGoogle className="h-5 w-5" />
                  </Button>
                </motion.div>
                <motion.div variants={buttonVariants} whileHover="hover">
                  <Button
                    variant="outline"
                    className="w-full h-12 bg-white/10 text-white hover:bg-white/20 border border-gray-700 cursor-pointer"
                    onClick={() => signIn('github', { callbackUrl: '/' })}
                  >
                    <FaGithub className="h-5 w-5" />
                  </Button>
                </motion.div>
                <motion.div variants={buttonVariants} whileHover="hover">
                  <Button
                    variant="outline"
                    className="w-full h-12 bg-white/10 text-white hover:bg-white/20 border border-gray-700 cursor-pointer"
                    onClick={() => signIn('azure-ad', { callbackUrl: '/' })}
                  >
                    <FaMicrosoft className="h-5 w-5" />
                  </Button>
                </motion.div>
              </div>

              <div className="text-center text-sm text-gray-400">
                Already have an account?
                {' '}
                <button
                  type="button"
                  className="text-[#FAFAFA] hover:underline cursor-pointer"
                  onClick={() => router.push('/sign-in')}
                >
                  Sign in
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
