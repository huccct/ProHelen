'use client'

import { AuthFormContainer, AuthSubtitle, AuthTitle } from '@/components/auth/auth-animations'
import { AuthFooter } from '@/components/auth/auth-footer'
import { AuthLayout } from '@/components/auth/auth-layout'
import { AuthLegalText } from '@/components/auth/auth-legal-text'
import { PasswordField } from '@/components/auth/password-field'
import { SubmitButton } from '@/components/auth/submit-button'
import { Button } from '@/components/ui/button'
import { handleAuthError, handleAuthSuccess, validatePasswordRequirements } from '@/lib/auth-utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { useTranslation } from 'react-i18next'

function ResetPasswordForm() {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) {
      handleAuthError(new Error(t('auth.resetPassword.invalidResetLinkError')), t, 'auth.resetPassword.invalidResetLinkError')
      return
    }

    if (password !== confirmPassword) {
      handleAuthError(new Error(t('auth.passwordsDoNotMatch')), t, 'auth.passwordsDoNotMatch')
      return
    }

    if (!validatePasswordRequirements(password, t)) {
      handleAuthError(new Error(t('auth.resetPassword.passwordRequirementsNotMet')), t, 'auth.resetPassword.passwordRequirementsNotMet')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()

      if (!res.ok)
        throw new Error(data.error)

      handleAuthSuccess(t('auth.resetPassword.passwordResetSuccessfully'), () => router.push('/sign-in'))
    }
    catch (error) {
      handleAuthError(error, t, 'auth.resetPassword.failedToResetPassword')
    }
    finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <AuthLayout hideSignIn>
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">{t('auth.resetPassword.invalidResetLink')}</h2>
          <p className="text-muted-foreground">{t('auth.resetPassword.invalidResetLinkMessage')}</p>
          <Button onClick={() => router.push('/forgot-password')} className="mt-4">
            {t('auth.resetPassword.requestNewResetLink')}
          </Button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div className="text-center space-y-4">
        <AuthTitle>{t('auth.resetPassword.title')}</AuthTitle>
        <AuthSubtitle>{t('auth.resetPassword.subtitle')}</AuthSubtitle>
      </div>

      <AuthFormContainer>
        <form onSubmit={handleSubmit} className="space-y-4">
          <PasswordField
            id="password"
            label={t('auth.resetPassword.newPassword')}
            placeholder={t('auth.resetPassword.newPasswordPlaceholder')}
            value={password}
            onChange={setPassword}
            showStrengthIndicator
            required
          />

          <PasswordField
            id="confirmPassword"
            label={t('auth.resetPassword.confirmNewPassword')}
            placeholder={t('auth.resetPassword.confirmNewPasswordPlaceholder')}
            value={confirmPassword}
            onChange={setConfirmPassword}
            error={confirmPassword && password !== confirmPassword ? t('auth.passwordsDoNotMatch') : undefined}
            required
          />

          <SubmitButton
            isLoading={isLoading}
            loadingText={t('auth.resetPassword.resettingPassword')}
          >
            {t('auth.resetPassword.resetPasswordButton')}
          </SubmitButton>
        </form>

        <AuthFooter
          text={t('auth.forgotPassword.rememberPassword')}
          linkText={t('auth.signInButton')}
          onLinkClick={() => router.push('/sign-in')}
        />
      </AuthFormContainer>

      <AuthLegalText />
    </AuthLayout>
  )
}

export default function ResetPassword() {
  const { t } = useTranslation()

  return (
    <Suspense
      fallback={(
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
