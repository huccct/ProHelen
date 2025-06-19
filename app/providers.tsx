'use client'

import { TooltipProvider } from '@/components/ui/tooltip'
import { ThemeProvider } from '@/lib/theme-context'
import { SessionProvider } from 'next-auth/react'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
