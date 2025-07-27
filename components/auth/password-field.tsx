'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5'

interface PasswordFieldProps {
  id: string
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  showStrengthIndicator?: boolean
  error?: string
  required?: boolean
}

export function PasswordField({
  id,
  label,
  placeholder,
  value,
  onChange,
  showStrengthIndicator = false,
  error,
  required = false,
}: PasswordFieldProps) {
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)

  const validatePassword = (password: string) => {
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

  const PasswordStrengthIndicator = () => {
    if (!showStrengthIndicator || !value)
      return null

    const validations = validatePassword(value)
    const strength = validations.filter(v => v.met).length

    return (
      <div className="space-y-2 mt-2">
        <div className="flex gap-1">
          {[...Array.from({ length: 4 })].map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${i < strength ? 'bg-green-500' : 'bg-muted'}`}
            />
          ))}
        </div>
        <ul className="text-xs space-y-1">
          {validations.map((validation, index) => (
            <li
              key={index}
              className={`flex items-center gap-1 ${validation.met ? 'text-green-500' : 'text-muted-foreground'}`}
            >
              {validation.met ? '✓' : '○'}
              {' '}
              {validation.message}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="bg-input border-border text-foreground pr-10 h-12"
          required={required}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
        >
          {showPassword ? <IoEyeOffOutline className="h-5 w-5" /> : <IoEyeOutline className="h-5 w-5" />}
        </button>
      </div>
      <PasswordStrengthIndicator />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}
