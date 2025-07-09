'use client'

import { AuthContainer, AuthFormContainer, AuthLegalText, AuthSocialButton, AuthSubtitle, AuthTitle } from '@/components/auth-animations'
import { NavBar } from '@/components/nav-bar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaGithub, FaMicrosoft } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5'
import { toast } from 'sonner'

export default function SignUp() {
  const { t } = useTranslation()
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

  /**
   * Handle form submission
   * @param e - Form event
   * @returns void
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // form validation
      if (formData.password.length < 8) {
        throw new Error(t('auth.passwordTooShort'))
      }

      if (!/[A-Z]/.test(formData.password)) {
        throw new Error(t('auth.passwordNoUppercase'))
      }

      if (!/[a-z]/.test(formData.password)) {
        throw new Error(t('auth.passwordNoLowercase'))
      }

      if (!/\d/.test(formData.password)) {
        throw new Error(t('auth.passwordNoNumber'))
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error(t('auth.passwordsDoNotMatch'))
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
        throw new Error(data.error || t('auth.failedToRegister'))
      }

      toast.success(t('auth.accountCreated'))

      setTimeout(() => {
        router.push('/sign-in')
      }, 500)
    }
    catch (error) {
      console.error('Registration error:', error)
      toast.error(error instanceof Error ? error.message : t('auth.failedToRegister'))
    }
    finally {
      setIsLoading(false)
    }
  }

  /**
   * Validate password
   * @param password - Password to validate
   * @returns Array of validation results
   */
  const validatePassword = (password: string) => {
    const requirements = [
      { regex: /.{8,}/, message: t('auth.eightCharacters') },
      { regex: /[A-Z]/, message: t('auth.uppercaseLetter') },
      { regex: /[a-z]/, message: t('auth.lowercaseLetter') },
      { regex: /\d/, message: t('auth.oneNumber') },
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/20">
        <NavBar hideSignIn />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
          <AuthContainer>
            <div className="text-center space-y-4">
              <AuthTitle>
                {t('auth.signUp.title')}
              </AuthTitle>
              <AuthSubtitle>
                {t('auth.signUp.subtitle')}
              </AuthSubtitle>
            </div>

            <AuthFormContainer>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('auth.fullName')}</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder={t('auth.fullNamePlaceholder')}
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-input border-border text-foreground h-12"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('auth.emailAddress')}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={t('auth.emailPlaceholder')}
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-input border-border text-foreground h-12"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t('auth.password')}</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t('auth.passwordPlaceholder')}
                      value={formData.password}
                      onChange={handleChange}
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
                  <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder={t('auth.confirmPasswordPlaceholder')}
                      value={formData.confirmPassword}
                      onChange={handleChange}
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
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{t('auth.passwordsDoNotMatch')}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 mt-6 cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? t('auth.creatingAccount') : t('auth.createAccount')}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-muted-foreground">{t('auth.orContinueWith')}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <AuthSocialButton>
                  <Button
                    variant="outline"
                    className="w-full h-12 cursor-pointer"
                    onClick={() => signIn('google', { callbackUrl: '/' })}
                  >
                    <FcGoogle className="h-5 w-5" />
                  </Button>
                </AuthSocialButton>
                <AuthSocialButton>
                  <Button
                    variant="outline"
                    className="w-full h-12 cursor-pointer"
                    onClick={() => signIn('github', { callbackUrl: '/' })}
                  >
                    <FaGithub className="h-5 w-5" />
                  </Button>
                </AuthSocialButton>
                <AuthSocialButton>
                  <Button
                    variant="outline"
                    className="w-full h-12 cursor-pointer"
                    onClick={() => signIn('azure-ad', { callbackUrl: '/' })}
                  >
                    <FaMicrosoft className="h-5 w-5" />
                  </Button>
                </AuthSocialButton>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                {t('auth.alreadyHaveAccount')}
                {' '}
                <button
                  type="button"
                  className="text-foreground hover:underline cursor-pointer"
                  onClick={() => router.push('/sign-in')}
                >
                  {t('auth.signInButton')}
                </button>
              </div>
            </AuthFormContainer>

            <AuthLegalText>
              {t('auth.byContinuing')}
              {' '}
              <a
                href="/terms"
                className="underline text-foreground hover:text-foreground/80 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('auth.termsOfService')}
              </a>
              {' '}
              {t('auth.and')}
              {' '}
              <a
                href="/privacy"
                className="underline text-foreground hover:text-foreground/80 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('auth.privacyPolicy')}
              </a>
            </AuthLegalText>
          </AuthContainer>
        </div>
      </div>
    </div>
  )
}
