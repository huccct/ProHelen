import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { NODE_CATEGORIES } from './constants'

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

export function containsKeywords(content: string, keywords: string[]): boolean {
  const lowerContent = content.toLowerCase()
  return keywords.some(keyword => lowerContent.includes(keyword))
}

export function categorizeNodeType(nodeType: string): string {
  for (const [category, types] of Object.entries(NODE_CATEGORIES)) {
    if (types.includes(nodeType as never)) {
      return category.toLowerCase()
    }
  }
  return 'other'
}
