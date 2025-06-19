'use client'

import type { TemplateCategory } from '../page'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { motion } from 'framer-motion'
import { Clock, Heart, Star, TrendingUp, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

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
  usageCount?: number
  _count?: {
    reviews: number
    favorites: number
  }
  createdAt?: string
  isPremium?: boolean
}

interface TemplateListProps {
  searchQuery: string
  category: TemplateCategory
}

interface PaginationInfo {
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

export function TemplateList({ searchQuery, category }: TemplateListProps) {
  const router = useRouter()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    limit: 6,
    offset: 0,
    hasMore: false,
  })
  const [currentPage, setCurrentPage] = useState(1)
  const fetchTemplates = async (page = 1) => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (category !== 'All')
        params.set('category', category)
      if (searchQuery)
        params.set('search', searchQuery)

      params.set('limit', '6')
      params.set('offset', ((page - 1) * 6).toString())

      const response = await fetch(`/api/templates?${params}`)
      if (!response.ok)
        throw new Error('Failed to fetch templates')

      const data = await response.json()
      setTemplates(data.templates || [])
      setPagination(data.pagination || {
        total: 0,
        limit: 6,
        offset: 0,
        hasMore: false,
      })
      setCurrentPage(page)
    }
    catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load templates')
    }
    finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    setCurrentPage(1)
    fetchTemplates(1)
  }, [searchQuery, category])

  const handlePageChange = (page: number) => {
    fetchTemplates(page)
  }

  const totalPages = Math.ceil(pagination.total / pagination.limit)
  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < totalPages

  const formatUsageCount = (count: number) => {
    if (count >= 1000)
      return `${(count / 1000).toFixed(1)}k`
    return count.toString()
  }

  const formatRating = (rating: number) => {
    return rating.toFixed(1)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array.from({ length: 6 })].map((_, i) => (
          <Card key={i} className="border-border bg-card/50 animate-pulse">
            <CardHeader className="p-6">
              <div className="h-6 bg-muted rounded mb-2" />
              <div className="h-4 bg-muted rounded mb-4" />
              <div className="flex gap-2 mb-4">
                <div className="h-6 w-16 bg-muted rounded" />
                <div className="h-6 w-16 bg-muted rounded" />
              </div>
              <div className="h-10 bg-muted rounded" />
            </CardHeader>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => fetchTemplates(currentPage)} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No templates found for your search criteria.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="border-border bg-card/50 hover:bg-card/70 transition-all duration-300 hover:border-border/50 group cursor-pointer h-full flex flex-col">
              <CardHeader className="p-6 flex-1">
                <div className="flex items-start justify-between mb-3">
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary border-primary/30 pointer-events-none"
                  >
                    {template.category}
                  </Badge>
                  {template.isPremium && (
                    <Badge className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30 pointer-events-none">
                      Premium
                    </Badge>
                  )}
                </div>

                <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {template.title}
                </CardTitle>

                <CardDescription className="text-muted-foreground leading-relaxed line-clamp-3 flex-1">
                  {template.description}
                </CardDescription>

                {/* Statistics */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
                  {template.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span>{formatRating(template.rating)}</span>
                    </div>
                  )}
                  {template.usageCount && template.usageCount > 0 && (
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>{formatUsageCount(template.usageCount)}</span>
                    </div>
                  )}
                  {template._count?.favorites && template._count.favorites > 0 && (
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{template._count.favorites}</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {template.tags && template.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {template.tags.slice(0, 3).map(tag => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs border-border text-muted-foreground hover:text-foreground"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {template.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                        +
                        {template.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 cursor-pointer"
                    onClick={() => router.push(`/templates/${template.id}`)}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => router.push(`/builder?template=${template.id}`)}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Use Template
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (canGoPrevious)
                    handlePageChange(currentPage - 1)
                }}
                className={!canGoPrevious ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              const isCurrentPage = page === currentPage
              const isNearCurrentPage = Math.abs(page - currentPage) <= 2
              const isFirstOrLast = page === 1 || page === totalPages

              if (!isNearCurrentPage && !isFirstOrLast) {
                if (page === currentPage - 3 || page === currentPage + 3) {
                  return (
                    <PaginationItem key={page}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )
                }
                return null
              }

              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={isCurrentPage}
                    onClick={(e) => {
                      e.preventDefault()
                      handlePageChange(page)
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            })}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (canGoNext)
                    handlePageChange(currentPage + 1)
                }}
                className={!canGoNext ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

    </div>
  )
}
