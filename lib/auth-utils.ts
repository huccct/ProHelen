import { toast } from 'sonner'

export interface PasswordValidation {
  met: boolean
  message: string
}

export function validatePassword(password: string, t: (key: string) => string): PasswordValidation[] {
  const requirements = [
    { regex: /.{8,}/, message: t('auth.eightCharacters') },
    { regex: /[A-Z]/, message: t('auth.uppercaseLetter') },
    { regex: /[a-z]/, message: t('auth.lowercaseLetter') },
    { regex: /\d/, message: t('auth.oneNumber') },
  ]
  return requirements.map(req => ({
    met: req.regex.test(password),
    message: req.message,
  }))
}

export function validatePasswordRequirements(password: string, t: (key: string) => string): boolean {
  const validations = validatePassword(password, t)
  return validations.every(v => v.met)
}

export function handleAuthError(error: unknown, t: (key: string) => string, fallbackKey: string) {
  console.error('Auth error:', error)
  toast.error(error instanceof Error ? error.message : t(fallbackKey))
}

export function handleAuthSuccess(message: string, redirect?: () => void) {
  toast.success(message)
  if (redirect) {
    setTimeout(redirect, 500)
  }
}
