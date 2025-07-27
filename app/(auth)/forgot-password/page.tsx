'use client'

import { AuthFormContainer, AuthSubtitle, AuthTitle } from '@/components/auth/auth-animations'
import { AuthFooter } from '@/components/auth/auth-footer'
import { AuthLayout } from '@/components/auth/auth-layout'
import { AuthLegalText } from '@/components/auth/auth-legal-text'
import { InputField } from '@/components/auth/input-field'
import { SubmitButton } from '@/components/auth/submit-button'
import { Button } from '@/components/ui/button'
import { handleAuthError, handleAuthSuccess } from '@/lib/auth-utils'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ForgotPassword() {
  const { t } = useTranslation()
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok)
        throw new Error(data.error)

      setIsSent(true)
      handleAuthSuccess(t('auth.forgotPassword.resetLinkSent'))
    }
    catch (error) {
      handleAuthError(error, t, 'auth.forgotPassword.failedToSendResetLink')
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="text-center space-y-4">
        <AuthTitle>{t('auth.forgotPassword.title')}</AuthTitle>
        <AuthSubtitle>
          {!isSent ? t('auth.forgotPassword.subtitle') : t('auth.forgotPassword.subtitleSent')}
        </AuthSubtitle>
      </div>

      <AuthFormContainer>
        {!isSent
          ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <InputField
                  id="email"
                  label={t('auth.emailAddress')}
                  type="email"
                  placeholder={t('auth.emailPlaceholder')}
                  value={email}
                  onChange={setEmail}
                  required
                />

                <SubmitButton
                  isLoading={isLoading}
                  loadingText={t('auth.forgotPassword.sendingResetLink')}
                >
                  {t('auth.forgotPassword.sendResetLink')}
                </SubmitButton>
              </form>
            )
          : (
              <div className="space-y-4">
                <div className="bg-muted text-foreground p-4 rounded-lg text-sm">
                  {t('auth.forgotPassword.sentTo')}
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
                  {t('auth.forgotPassword.tryAnotherEmail')}
                </Button>
              </div>
            )}

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
