'use client'

import { AuthContainer, AuthFormContainer, AuthSubtitle, AuthTitle } from '@/components/auth-animations'
import { NavBar } from '@/components/nav-bar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5'
import { toast } from 'sonner'

function ResetPasswordForm() {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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

  /**
   * Handle form submission
   * @param e - Form event
   * @returns void
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) {
      toast.error(t('auth.resetPassword.invalidResetLinkError'))
      return
    }

    if (password !== confirmPassword) {
      toast.error(t('auth.passwordsDoNotMatch'))
      return
    }

    const validations = validatePassword(password)
    if (!validations.every(v => v.met)) {
      toast.error(t('auth.resetPassword.passwordRequirementsNotMet'))
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

      toast.success(t('auth.resetPassword.passwordResetSuccessfully'))
      router.push('/sign-in')
    }
    catch (error) {
      console.error('Reset password error:', error)
      toast.error(error instanceof Error ? error.message : t('auth.resetPassword.failedToResetPassword'))
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
              <h2 className="text-3xl font-bold">{t('auth.resetPassword.invalidResetLink')}</h2>
              <p className="text-muted-foreground">{t('auth.resetPassword.invalidResetLinkMessage')}</p>
              <Button
                onClick={() => router.push('/forgot-password')}
                className="mt-4"
              >
                {t('auth.resetPassword.requestNewResetLink')}
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
          <AuthContainer>
            <div className="text-center space-y-4">
              <AuthTitle>
                {t('auth.resetPassword.title')}
              </AuthTitle>
              <AuthSubtitle>
                {t('auth.resetPassword.subtitle')}
              </AuthSubtitle>
            </div>

            <AuthFormContainer>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">{t('auth.resetPassword.newPassword')}</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t('auth.resetPassword.newPasswordPlaceholder')}
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
                  <Label htmlFor="confirmPassword">{t('auth.resetPassword.confirmNewPassword')}</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder={t('auth.resetPassword.confirmNewPasswordPlaceholder')}
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
                    <p className="text-red-500 text-sm mt-1">{t('auth.passwordsDoNotMatch')}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 mt-6 cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? t('auth.resetPassword.resettingPassword') : t('auth.resetPassword.resetPasswordButton')}
                </Button>
              </form>

              <div className="text-center text-sm text-muted-foreground">
                {t('auth.forgotPassword.rememberPassword')}
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
          </AuthContainer>
        </div>
      </div>
    </div>
  )
}

export default function ResetPassword() {
  const { t } = useTranslation()

  return (
    <Suspense fallback={(
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">{t('auth.resetPassword.loading')}</h2>
          <p className="text-muted-foreground">{t('auth.resetPassword.verifyingResetLink')}</p>
        </div>
      </div>
    )}
    >
      <ResetPasswordForm />
    </Suspense>
  )
}
