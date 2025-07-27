'use client'

import { Button } from '@/components/ui/button'
import { useTheme } from '@/lib/theme-context'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="w-9 h-9 p-0 hover:bg-muted cursor-pointer"
    >
      <span className="sr-only">Toggle theme</span>
      {theme === 'dark'
        ? (
            <Sun className="h-4 w-4 text-foreground" />
          )
        : (
            <Moon className="h-4 w-4 text-foreground" />
          )}
    </Button>
  )
}
