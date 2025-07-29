'use client'

import type { Template, TemplateCategory } from '@/types/templates'
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { MAX_VISIBLE_TAGS, SKELETON_COUNT } from '@/lib/constants'
import { useTemplateData } from '@/lib/hooks/use-template-data'
import { getCategoryDisplayName } from '@/lib/utils'
import * as Sentry from '@sentry/nextjs'
import { motion } from 'framer-motion'
import { Clock, Heart, Star, TrendingUp, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface TemplateListProps {
  searchQuery: string
  category: TemplateCategory
}

const formatters = {
  usageCount: (count: number) => count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count.toString(),
  rating: (rating: number) => rating.toFixed(1),
}

function TemplateCardSkeleton() {
  return (
    <Card className="border-border bg-card/50 animate-pulse">
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
  )
}

interface TemplateCardProps {
  template: Template
  index: number
  onTemplateClick: (template: Template) => void
  onUseTemplate: (templateId: string, e: React.MouseEvent) => void
}

function TemplateCard({ template, index, onTemplateClick, onUseTemplate }: TemplateCardProps) {
  const { t } = useTranslation()

  const hasStats = useMemo(() => {
    return (template.rating || 0) > 0
      || (template.usageCount || 0) > 0
      || (template._count?.favorites || 0) > 0
  }, [template])

  const displayTags = useMemo(() => {
    if (!template.tags || template.tags.length === 0)
      return []
    return template.tags.slice(0, MAX_VISIBLE_TAGS)
  }, [template.tags])

  const extraTagsCount = useMemo(() => {
    return template.tags ? Math.max(0, template.tags.length - MAX_VISIBLE_TAGS) : 0
  }, [template.tags])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      onClick={() => onTemplateClick(template)}
    >
      <Card className="border-border bg-card/50 hover:bg-card/70 transition-all duration-300 hover:border-border/50 group cursor-pointer h-full flex flex-col">
        <CardHeader className="p-6 flex-1">
          <div className="flex items-start justify-between mb-3">
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary border-primary/30 pointer-events-none"
            >
              {getCategoryDisplayName(template.category, t)}
            </Badge>
            {template.isPremium && (
              <Badge className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30 pointer-events-none">
                {t('templates.list.premium')}
              </Badge>
            )}
          </div>

          <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {template.title}
          </CardTitle>

          <CardDescription className="text-muted-foreground leading-relaxed line-clamp-3 flex-1">
            {template.description}
          </CardDescription>

          {hasStats && (
            <TooltipProvider>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
                {(template.rating || 0) > 0 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 cursor-help">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span>{formatters.rating(template.rating!)}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {t('templates.stats.rating')}
                        {' '}
                        (
                        {template.rating}
                        /5.0)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                )}
                {(template.usageCount || 0) > 0 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 cursor-help">
                        <TrendingUp className="w-4 h-4" />
                        <span>{formatters.usageCount(template.usageCount!)}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {t('templates.stats.usage')}
                        {' '}
                        {template.usageCount}
                        {' '}
                        {t('templates.stats.times')}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                )}
                {(template._count?.favorites || 0) > 0 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 cursor-help">
                        <Heart className="w-4 h-4" />
                        <span>{template._count?.favorites}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {template._count?.favorites}
                        {' '}
                        {t('templates.stats.favorites')}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </TooltipProvider>
          )}

          {displayTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {displayTags.map(tag => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs border-border text-muted-foreground hover:text-foreground"
                >
                  {tag}
                </Badge>
              ))}
              {extraTagsCount > 0 && (
                <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                  +
                  {extraTagsCount}
                </Badge>
              )}
            </div>
          )}

          <div className="flex gap-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation()
                onTemplateClick(template)
              }}
            >
              <Clock className="w-4 h-4 mr-2" />
              {t('templates.actions.viewDetails')}
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
              onClick={e => onUseTemplate(template.id, e)}
            >
              <Users className="w-4 h-4 mr-2" />
              {t('templates.actions.useTemplate')}
            </Button>
          </div>
        </CardHeader>
      </Card>
    </motion.div>
  )
}

interface PaginationComponentProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

function PaginationComponent({ currentPage, totalPages, onPageChange }: PaginationComponentProps) {
  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < totalPages

  const pageNumbers = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1).filter((page) => {
      const isCurrentPage = page === currentPage
      const isNearCurrentPage = Math.abs(page - currentPage) <= 2
      const isFirstOrLast = page === 1 || page === totalPages
      return isCurrentPage || isNearCurrentPage || isFirstOrLast
    })
  }, [currentPage, totalPages])

  const handlePageChange = useCallback((page: number, e: React.MouseEvent) => {
    e.preventDefault()
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      Sentry.addBreadcrumb({
        category: 'user-action',
        message: 'Pagination click',
        level: 'info',
        data: { fromPage: currentPage, toPage: page },
      })
      onPageChange(page)
    }
  }, [currentPage, totalPages, onPageChange])

  if (totalPages <= 1)
    return null

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={e => handlePageChange(currentPage - 1, e)}
            className={!canGoPrevious ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>

        {pageNumbers.map((page, index) => {
          const prevPage = pageNumbers[index - 1]
          const showEllipsis = prevPage && page - prevPage > 1

          return (
            <div key={page} className="flex items-center">
              {showEllipsis && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink
                  href="#"
                  isActive={page === currentPage}
                  onClick={e => handlePageChange(page, e)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            </div>
          )
        })}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={e => handlePageChange(currentPage + 1, e)}
            className={!canGoNext ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export function TemplateList({ searchQuery, category }: TemplateListProps) {
  const { t } = useTranslation()
  const router = useRouter()

  const {
    templates,
    loading,
    error,
    pagination,
    currentPage,
    fetchTemplates,
    refetch,
  } = useTemplateData(searchQuery, category)

  const totalPages = Math.ceil(pagination.total / pagination.limit)

  const handleTemplateClick = useCallback((template: Template) => {
    Sentry.addBreadcrumb({
      category: 'user-action',
      message: 'Template clicked',
      level: 'info',
      data: {
        templateId: template.id,
        templateTitle: template.title,
        templateCategory: template.category,
        isPremium: template.isPremium,
      },
    })
    router.push(`/templates/${template.id}`)
  }, [router])

  const handleUseTemplate = useCallback((templateId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(`/builder?template=${templateId}`)
  }, [router])

  const handlePageChange = useCallback((page: number) => {
    fetchTemplates(page)
  }, [fetchTemplates])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <TemplateCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{t('templates.list.error')}</p>
        <Button onClick={refetch} variant="outline">
          {t('templates.list.tryAgain')}
        </Button>
      </div>
    )
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t('templates.list.noResults')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template, index) => (
          <TemplateCard
            key={template.id}
            template={template}
            index={index}
            onTemplateClick={handleTemplateClick}
            onUseTemplate={handleUseTemplate}
          />
        ))}
      </div>

      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
