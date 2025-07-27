import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'

export interface PasswordValidation {
  met: boolean
  message: string
}

interface BaseComponentProps {
  children: ReactNode
  className?: string
}

export interface AuthLayoutProps extends BaseComponentProps {
  hideSignIn?: boolean
}

export type AuthContainerProps = BaseComponentProps
export type AuthTitleProps = BaseComponentProps
export type AuthSubtitleProps = BaseComponentProps
export type AuthFormContainerProps = BaseComponentProps
export type AuthLegalTextProps = BaseComponentProps

export interface AuthButtonProps extends BaseComponentProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> {
  onClick?: () => void
}

export interface AuthFooterProps {
  text: string
  linkText: string
  onLinkClick: () => void
}

interface BaseInputProps {
  id: string
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  required?: boolean
}

export interface InputFieldProps extends BaseInputProps, Pick<InputHTMLAttributes<HTMLInputElement>, 'type' | 'name'> {}

export interface PasswordFieldProps extends BaseInputProps {
  showStrengthIndicator?: boolean
  error?: string
}

export interface SocialLoginButtonsProps {
  onSocialSignIn: (provider: string) => void
}

export interface SubmitButtonProps extends BaseComponentProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'> {
  isLoading: boolean
  loadingText: string
}
