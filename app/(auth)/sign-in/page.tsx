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

export default function SignIn() {
  const { t } = useTranslation()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  /**
   * Email sign in
   * @param e - Form event
   */
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
        if (result.error === 'Invalid credentials')
          toast.error(t('auth.signIn.errors.invalidCredentials'))
        else
          toast.error(t('auth.signIn.errors.somethingWrong'))
      }
      else {
        toast.success(t('auth.signIn.success'))
        router.push('/')
      }
    }
    catch (error) {
      toast.error(t('auth.signIn.errors.failedToSignIn'))
      console.error(error)
    }
    finally {
      setIsLoading(false)
    }
  }

  /**
   * Social sign in
   * @param provider - Provider name (google, github, azure-ad)
   * @returns void
   */
  const handleSocialSignIn = (provider: string) => {
    toast.loading(t('auth.signIn.redirecting'))
    signIn(provider, { callbackUrl: '/' })
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
                {t('auth.signIn.title')}
              </AuthTitle>
              <AuthSubtitle>
                {t('auth.signIn.subtitle')}
              </AuthSubtitle>
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
                      onClick={() => {
                        router.push('/forgot-password')
                      }}
                    >
                      {t('auth.forgotPasswordLink')}
                      ?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t('auth.passwordPlaceholder')}
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
          </AuthContainer>
        </div>
      </div>
    </div>
  )
}
