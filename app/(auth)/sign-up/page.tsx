'use client'

import { AuthFormContainer, AuthLegalText, AuthSocialButton, AuthSubtitle, AuthTitle } from '@/components/auth/auth-animations'
import { AuthLayout } from '@/components/auth/auth-layout'
import { PasswordField } from '@/components/auth/password-field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { handleAuthError, handleAuthSuccess, validatePasswordRequirements } from '@/lib/auth-utils'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaGithub, FaMicrosoft } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'

export default function SignUp() {
  const { t } = useTranslation()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!validatePasswordRequirements(formData.password, t)) {
        throw new Error(t('auth.passwordRequirementsNotMet'))
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error(t('auth.passwordsDoNotMatch'))
      }

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

      handleAuthSuccess(t('auth.accountCreated'), () => router.push('/sign-in'))
    }
    catch (error) {
      handleAuthError(error, t, 'auth.failedToRegister')
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="text-center space-y-4">
        <AuthTitle>{t('auth.signUp.title')}</AuthTitle>
        <AuthSubtitle>{t('auth.signUp.subtitle')}</AuthSubtitle>
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

          <PasswordField
            id="password"
            label={t('auth.password')}
            placeholder={t('auth.passwordPlaceholder')}
            value={formData.password}
            onChange={value => setFormData(prev => ({ ...prev, password: value }))}
            showStrengthIndicator
            required
          />

          <PasswordField
            id="confirmPassword"
            label={t('auth.confirmPassword')}
            placeholder={t('auth.confirmPasswordPlaceholder')}
            value={formData.confirmPassword}
            onChange={value => setFormData(prev => ({ ...prev, confirmPassword: value }))}
            error={formData.confirmPassword && formData.password !== formData.confirmPassword ? t('auth.passwordsDoNotMatch') : undefined}
            required
          />

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
    </AuthLayout>
  )
}
