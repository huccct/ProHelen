'use client'

import { AuthFormContainer, AuthSubtitle, AuthTitle } from '@/components/auth/auth-animations'
import { AuthFooter } from '@/components/auth/auth-footer'
import { AuthLayout } from '@/components/auth/auth-layout'
import { AuthLegalText } from '@/components/auth/auth-legal-text'
import { InputField } from '@/components/auth/input-field'
import { PasswordField } from '@/components/auth/password-field'
import { SocialLoginButtons } from '@/components/auth/social-login-buttons'
import { SubmitButton } from '@/components/auth/submit-button'
import { handleAuthError, handleAuthSuccess, validatePasswordRequirements } from '@/lib/auth-utils'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

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

  const handleSocialSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: '/' })
  }

  return (
    <AuthLayout>
      <div className="text-center space-y-4">
        <AuthTitle>{t('auth.signUp.title')}</AuthTitle>
        <AuthSubtitle>{t('auth.signUp.subtitle')}</AuthSubtitle>
      </div>

      <AuthFormContainer>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            id="name"
            label={t('auth.fullName')}
            placeholder={t('auth.fullNamePlaceholder')}
            value={formData.name}
            onChange={value => setFormData(prev => ({ ...prev, name: value }))}
            required
          />

          <InputField
            id="email"
            label={t('auth.emailAddress')}
            type="email"
            placeholder={t('auth.emailPlaceholder')}
            value={formData.email}
            onChange={value => setFormData(prev => ({ ...prev, email: value }))}
            required
          />

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

          <SubmitButton
            isLoading={isLoading}
            loadingText={t('auth.creatingAccount')}
          >
            {t('auth.createAccount')}
          </SubmitButton>
        </form>

        <SocialLoginButtons onSocialSignIn={handleSocialSignIn} />

        <AuthFooter
          text={t('auth.alreadyHaveAccount')}
          linkText={t('auth.signInButton')}
          onLinkClick={() => router.push('/sign-in')}
        />
      </AuthFormContainer>

      <AuthLegalText />
    </AuthLayout>
  )
}
