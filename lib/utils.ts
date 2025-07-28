import type { CustomNodeData } from '@/types/builder'
import type { Node } from '@xyflow/react'
import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { NODE_CATEGORIES, NODE_LABELS, STORE_CONFIG } from './constants'
import i18n from './i18n'

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

export function createNodeId(type: string, nodes: Node<CustomNodeData>[]): string {
  return `${type}-${nodes.length + 1}`
}

export function generateNodeLabel(type: string): string {
  return NODE_LABELS[type] || type.split('_').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1),
  ).join(' ')
}

export function calculateNodePosition(index: number, baseY: number = STORE_CONFIG.BASE_Y) {
  return {
    x: STORE_CONFIG.START_X + (index * STORE_CONFIG.NODE_SPACING),
    y: baseY,
  }
}

export function detectLanguage(text: string): 'zh' | 'en' {
  if (!text)
    return 'en'
  const chineseRegex = /[\u4E00-\u9FFF]/
  return chineseRegex.test(text) ? 'zh' : 'en'
}

export function getInterfaceLanguage(): 'zh' | 'en' {
  return i18n.language?.startsWith('zh') ? 'zh' : 'en'
}
