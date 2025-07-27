'use client'

import type { InputFieldProps } from '@/types/auth'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function InputField({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  name,
}: InputFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={name || id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-input border-border text-foreground h-12"
        required={required}
      />
    </div>
  )
}
