'use client'

import type { SubmitButtonProps } from '@/types/auth'
import { Button } from '@/components/ui/button'

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
