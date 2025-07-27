'use client'

import { AuthFormContainer, AuthSubtitle, AuthTitle } from '@/components/auth/auth-animations'
import { AuthFooter } from '@/components/auth/auth-footer'
import { AuthLayout } from '@/components/auth/auth-layout'
import { AuthLegalText } from '@/components/auth/auth-legal-text'
import { InputField } from '@/components/auth/input-field'
import { PasswordField } from '@/components/auth/password-field'
import { SocialLoginButtons } from '@/components/auth/social-login-buttons'
import { SubmitButton } from '@/components/auth/submit-button'
import { handleAuthError, handleAuthSuccess } from '@/lib/auth-utils'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export default function SignIn() {
  const { t } = useTranslation()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
        const errorMessage = result.error === 'Invalid credentials'
          ? t('auth.signIn.errors.invalidCredentials')
          : t('auth.signIn.errors.somethingWrong')
        handleAuthError(new Error(errorMessage), t, 'auth.signIn.errors.failedToSignIn')
      }
      else {
        handleAuthSuccess(t('auth.signIn.success'), () => router.push('/'))
      }
    }
    catch (error) {
      handleAuthError(error, t, 'auth.signIn.errors.failedToSignIn')
    }
    finally {
      setIsLoading(false)
    }
  }

  const handleSocialSignIn = (provider: string) => {
    toast.loading(t('auth.signIn.redirecting'))
    signIn(provider, { callbackUrl: '/' })
  }

  return (
    <AuthLayout>
      <div className="text-center space-y-4">
        <AuthTitle>{t('auth.signIn.title')}</AuthTitle>
        <AuthSubtitle>{t('auth.signIn.subtitle')}</AuthSubtitle>
      </div>

      <AuthFormContainer>
        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <InputField
            id="email"
            label={t('auth.emailAddress')}
            type="email"
            placeholder={t('auth.emailPlaceholder')}
            value={email}
            onChange={setEmail}
            required
          />

          <div className="space-y-2">
            <div className="flex justify-between">
              <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {t('auth.password')}
              </label>
              <button
                type="button"
                className="text-sm text-foreground hover:underline cursor-pointer"
                onClick={() => router.push('/forgot-password')}
              >
                {t('auth.forgotPasswordLink')}
                ?
              </button>
            </div>
            <PasswordField
              id="password"
              label=""
              placeholder={t('auth.passwordPlaceholder')}
              value={password}
              onChange={setPassword}
              required
            />
          </div>

          <SubmitButton
            isLoading={isLoading}
            loadingText={t('auth.signIn.signingIn')}
          >
            {t('auth.signInButton')}
          </SubmitButton>
        </form>

        <SocialLoginButtons onSocialSignIn={handleSocialSignIn} />

        <AuthFooter
          text={t('auth.dontHaveAccount')}
          linkText={t('auth.signUpButton')}
          onLinkClick={() => router.push('/sign-up')}
        />
      </AuthFormContainer>

      <AuthLegalText />
    </AuthLayout>
  )
}
