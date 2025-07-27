'use client'

import type { SocialLoginButtonsProps } from '@/types/auth'
import { AuthSocialButton } from '@/components/auth/auth-animations'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { FaGithub, FaMicrosoft } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'

export function SocialLoginButtons({ onSocialSignIn }: SocialLoginButtonsProps) {
  const { t } = useTranslation()

  return (
    <>
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
            onClick={() => onSocialSignIn('google')}
          >
            <FcGoogle className="h-5 w-5" />
          </Button>
        </AuthSocialButton>
        <AuthSocialButton>
          <Button
            variant="outline"
            className="w-full h-12 cursor-pointer"
            onClick={() => onSocialSignIn('github')}
          >
            <FaGithub className="h-5 w-5" />
          </Button>
        </AuthSocialButton>
        <AuthSocialButton>
          <Button
            variant="outline"
            className="w-full h-12 cursor-pointer"
            onClick={() => onSocialSignIn('azure-ad')}
          >
            <FaMicrosoft className="h-5 w-5" />
          </Button>
        </AuthSocialButton>
      </div>
    </>
  )
}
