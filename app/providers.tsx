'use client'

import { AppSettingsProvider } from '@/components/common/app-settings-context'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ThemeProvider } from '@/lib/theme-context'
import * as Sentry from '@sentry/nextjs'
import { SessionProvider, useSession } from 'next-auth/react'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'
import '@/lib/i18n'

interface AppSettings {
  siteName: string
  siteDescription: string
  maintenanceMode: boolean
}

interface ProvidersProps {
  children: React.ReactNode
  appSettings: AppSettings
}

function SentryMonitoring() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user) {
      Sentry.setUser({
        id: session.user.email as string,
        email: session.user.email as string,
      })
    }
  }, [session])

  useEffect(() => {
    Sentry.addBreadcrumb({
      category: 'navigation',
      message: `Navigated to ${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`,
      level: 'info',
    })

    if (window.performance) {
      window.performance.mark('app-render')

      Promise.resolve().then(() => {
        const metrics = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        if (metrics) {
          Sentry.captureMessage('Page Performance Metrics', {
            level: 'info',
            extra: {
              timeToFirstByte: metrics.responseStart,
              firstContentfulPaint: metrics.domContentLoadedEventStart,
              domInteractive: metrics.domInteractive,
              pageLoad: metrics.loadEventEnd,
              url: pathname,
            },
          })
        }
      })
    }
  }, [pathname, searchParams])

  return null
}

export default function Providers({ children, appSettings }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider defaultTheme="dark">
        <AppSettingsProvider settings={appSettings}>
          <TooltipProvider>
            <Suspense fallback={null}>
              <SentryMonitoring />
            </Suspense>
            {children}
          </TooltipProvider>
        </AppSettingsProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
