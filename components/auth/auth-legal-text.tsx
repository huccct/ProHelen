'use client'

import { AuthLegalText as AuthLegalTextComponent } from '@/components/auth/auth-animations'
import { useTranslation } from 'react-i18next'

export function AuthLegalText() {
  const { t } = useTranslation()

  return (
    <AuthLegalTextComponent>
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
    </AuthLegalTextComponent>
  )
}
