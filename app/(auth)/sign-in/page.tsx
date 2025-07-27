'use client'

import { AuthFormContainer, AuthLegalText, AuthSocialButton, AuthSubtitle, AuthTitle } from '@/components/auth/auth-animations'
import { AuthLayout } from '@/components/auth/auth-layout'
import { PasswordField } from '@/components/auth/password-field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { handleAuthError, handleAuthSuccess } from '@/lib/auth-utils'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaGithub, FaMicrosoft } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
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
          <div className="space-y-2">
            <Label htmlFor="email">{t('auth.emailAddress')}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t('auth.emailPlaceholder')}
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="bg-input border-border text-foreground h-12"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="password">{t('auth.password')}</Label>
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

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 mt-6 cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? t('auth.signIn.signingIn') : t('auth.signInButton')}
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
              onClick={() => handleSocialSignIn('google')}
            >
              <FcGoogle className="h-5 w-5" />
            </Button>
          </AuthSocialButton>
          <AuthSocialButton>
            <Button
              variant="outline"
              className="w-full h-12 cursor-pointer"
              onClick={() => handleSocialSignIn('github')}
            >
              <FaGithub className="h-5 w-5" />
            </Button>
          </AuthSocialButton>
          <AuthSocialButton>
            <Button
              variant="outline"
              className="w-full h-12 cursor-pointer"
              onClick={() => handleSocialSignIn('azure-ad')}
            >
              <FaMicrosoft className="h-5 w-5" />
            </Button>
          </AuthSocialButton>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          {t('auth.dontHaveAccount')}
          {' '}
          <button
            type="button"
            className="text-foreground hover:underline cursor-pointer"
            onClick={() => router.push('/sign-up')}
          >
            {t('auth.signUpButton')}
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
