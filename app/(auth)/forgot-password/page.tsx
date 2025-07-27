'use client'

import { AuthFormContainer, AuthLegalText, AuthSubtitle, AuthTitle } from '@/components/auth/auth-animations'
import { AuthLayout } from '@/components/auth/auth-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
                <div className="space-y-2">
                  <Label htmlFor="email">{t('auth.emailAddress')}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={t('auth.emailPlaceholder')}
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
                  {isLoading ? t('auth.forgotPassword.sendingResetLink') : t('auth.forgotPassword.sendResetLink')}
                </Button>
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
