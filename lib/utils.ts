import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCategoryDisplayName(category: string, t: (key: string, options?: any) => string) {
  const categoryToKeyMap: Record<string, string> = {
    'All': 'all',
    'Goal Setting': 'goalSetting',
    'Education': 'education',
    'Career': 'career',
    'Productivity': 'productivity',
    'Technology': 'technology',
    'Business': 'business',
    'Marketing': 'marketing',
    'Analytics': 'analytics',
    'Design': 'design',
    'Innovation': 'innovation',
    'Finance': 'finance',
  }

  const translationKey = categoryToKeyMap[category]
  if (translationKey) {
    return t(`templates.categories.${translationKey}`)
  }

  const generatedKey = category.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/gi, '')
  const translatedValue = t(`templates.categories.${generatedKey}`, { defaultValue: category })

  return translatedValue
}
