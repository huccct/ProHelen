'use client'

import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'

interface AppSettings {
  siteName: string
  siteDescription: string
  maintenanceMode: boolean
}

const AppSettingsContext = createContext<AppSettings | null>(null)

export function AppSettingsProvider({
  children,
  settings,
}: {
  children: ReactNode
  settings: AppSettings
}) {
  return (
    <AppSettingsContext.Provider value={settings}>
      {children}
    </AppSettingsContext.Provider>
  )
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext)
  if (!context) {
    throw new Error('useAppSettings must be used within AppSettingsProvider')
  }
  return context
}
