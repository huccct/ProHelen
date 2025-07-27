'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface InputFieldProps {
  id: string
  label: string
  type?: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  name?: string
}

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
