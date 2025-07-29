export interface Instruction {
  id: string
  title: string
  description: string | null
  content: string
  tags: string[]
  flowData?: any
  userId: string
  usageCount: number
  lastUsedAt: string | null
  isPublished: boolean
  publishedTemplate?: {
    id: string
    title: string
    isPublic: boolean
  }
  publishedAt: string | null
  category: string | null
  isFavorite: boolean
  createdAt: string
  updatedAt: string
  isDraft: boolean
}

export interface InstructionGridProps {
  searchQuery: string
  filter?: 'all' | 'personal' | 'favorites' | 'published'
  viewMode?: 'grid' | 'list'
  sortBy?: string
}

export interface PaginationInfo {
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

export interface ModalState {
  type: string | null
  isOpen: boolean
  instruction: Instruction | null
}

export interface ApiError {
  error?: string
}

export interface FetchInstructionsParams {
  page?: number
  searchQuery?: string
  filter?: string
  sortBy?: string
}
