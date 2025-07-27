'use client'

import type { AuthFooterProps } from '@/types/auth'

export function AuthFooter({ text, linkText, onLinkClick }: AuthFooterProps) {
  return (
    <div className="text-center text-sm text-muted-foreground">
      {text}
      {' '}
      <button
        type="button"
        className="text-foreground hover:underline cursor-pointer"
        onClick={onLinkClick}
      >
        {linkText}
      </button>
    </div>
  )
}
