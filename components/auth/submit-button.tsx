'use client'

import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface SubmitButtonProps {
  isLoading: boolean
  loadingText: string
  children: ReactNode
  className?: string
  [key: string]: any
}

export function SubmitButton({
  isLoading,
  loadingText,
  children,
  className = 'w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 mt-6 cursor-pointer',
  ...props
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      className={className}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? loadingText : children}
    </Button>
  )
}
