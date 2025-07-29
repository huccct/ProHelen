export interface PaginationInfo {
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

export interface Template {
  id: string
  title: string
  description: string
  category: string
  useCases: string[]
  content?: string
  overview?: string
  features?: string[]
  examples?: { title: string, content: string }[]
  tags?: string[]
  rating?: number
  ratingCount?: number
  usageCount?: number
  _count?: {
    reviews: number
    favorites: number
  }
  createdAt?: string
  isPremium?: boolean
}

export type TemplateCategory = string

export interface Review {
  id: string
  rating: number
  comment?: string
  userId: string
  user: {
    name?: string
    email: string
  }
  createdAt: string
}
