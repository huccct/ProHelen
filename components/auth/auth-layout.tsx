'use client'

import type { AuthLayoutProps } from '@/types/auth'
import { AuthContainer } from '@/components/auth/auth-animations'
import { NavBar } from '@/components/common/nav-bar'
import { useAppSettings } from '../common/app-settings-context'

export function AuthLayout({ children, hideSignIn = false }: AuthLayoutProps) {
  const { siteName } = useAppSettings()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/20">
        <NavBar hideSignIn={hideSignIn} siteName={siteName} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
          <AuthContainer>
            {children}
          </AuthContainer>
        </div>
      </div>
    </div>
  )
}
