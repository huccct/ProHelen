'use client'

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

// shared animations
export const authAnimations = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  },
  titleSlide: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: 'easeOut' },
  },
  buttonVariants: {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: 'easeInOut',
      },
    },
  },
}

interface AuthContainerProps {
  children: ReactNode
  className?: string
}

// auth container
export function AuthContainer({ children, className = '' }: AuthContainerProps) {
  return (
    <motion.div
      className={`w-full max-w-md space-y-8 ${className}`}
      variants={authAnimations.fadeIn}
      initial="initial"
      animate="animate"
    >
      {children}
    </motion.div>
  )
}

interface AuthTitleProps {
  children: ReactNode
  className?: string
}

// auth title
export function AuthTitle({ children, className = '' }: AuthTitleProps) {
  return (
    <motion.h2
      className={`text-3xl sm:text-4xl font-bold tracking-tight ${className}`}
      {...authAnimations.titleSlide}
    >
      {children}
    </motion.h2>
  )
}

interface AuthSubtitleProps {
  children: ReactNode
  className?: string
}

// auth subtitle
export function AuthSubtitle({ children, className = '' }: AuthSubtitleProps) {
  return (
    <motion.p
      className={`text-muted-foreground ${className}`}
      variants={authAnimations.fadeIn}
    >
      {children}
    </motion.p>
  )
}

interface AuthFormContainerProps {
  children: ReactNode
  className?: string
}

// auth form container
export function AuthFormContainer({ children, className = '' }: AuthFormContainerProps) {
  return (
    <motion.div
      className={`space-y-6 ${className}`}
      variants={authAnimations.fadeIn}
    >
      {children}
    </motion.div>
  )
}

interface AuthButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  [key: string]: any
}

// social login button
export function AuthSocialButton({ children, className: _className = '', ..._props }: AuthButtonProps) {
  return (
    <motion.div variants={authAnimations.buttonVariants} whileHover="hover">
      {children}
    </motion.div>
  )
}

interface AuthLegalTextProps {
  children: ReactNode
  className?: string
}

// legal text
export function AuthLegalText({ children, className = '' }: AuthLegalTextProps) {
  return (
    <motion.p
      className={`text-center text-sm text-muted-foreground ${className}`}
      variants={authAnimations.fadeIn}
    >
      {children}
    </motion.p>
  )
}
