import type { PaginationInfo, Template, TemplateCategory } from '@/types/templates'
import * as Sentry from '@sentry/nextjs'
import { useCallback, useEffect, useRef, useState } from 'react'
import { TEMPLATES_PER_PAGE } from '../constants'
import { useDebounce } from './use-debounce'

export function useTemplateData(searchQuery: string, category: TemplateCategory) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    limit: TEMPLATES_PER_PAGE,
    offset: 0,
    hasMore: false,
  })
  const [currentPage, setCurrentPage] = useState(1)

  const abortControllerRef = useRef<AbortController | null>(null)

  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  const fetchTemplates = useCallback(async (page = 1) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()
    const startTime = performance.now()

    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (category !== 'All')
        params.set('category', category)
      if (debouncedSearchQuery)
        params.set('search', debouncedSearchQuery)
      params.set('limit', TEMPLATES_PER_PAGE.toString())
      params.set('offset', ((page - 1) * TEMPLATES_PER_PAGE).toString())

      Sentry.addBreadcrumb({
        category: 'user-action',
        message: 'Template search',
        level: 'info',
        data: { category, searchQuery: debouncedSearchQuery, page },
      })

      const response = await fetch(`/api/templates?${params}`, {
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      setTemplates(data.templates || [])
      setPagination(data.pagination || {
        total: 0,
        limit: TEMPLATES_PER_PAGE,
        offset: 0,
        hasMore: false,
      })
      setCurrentPage(page)

      const endTime = performance.now()
      Sentry.captureMessage('Template API Performance', {
        level: 'info',
        extra: {
          responseTime: endTime - startTime,
          resultsCount: data.templates?.length || 0,
          totalResults: data.pagination?.total || 0,
          category,
          searchQuery: debouncedSearchQuery,
        },
      })
    }
    catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return
      }

      const errorMessage = err instanceof Error ? err.message : 'Failed to load templates'
      setError(errorMessage)

      Sentry.captureException(err, {
        extra: { category, searchQuery: debouncedSearchQuery, page },
      })
    }
    finally {
      setLoading(false)
    }
  }, [category, debouncedSearchQuery])

  useEffect(() => {
    setCurrentPage(1)
    fetchTemplates(1)
  }, [fetchTemplates])

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  return {
    templates,
    loading,
    error,
    pagination,
    currentPage,
    fetchTemplates,
    refetch: () => fetchTemplates(currentPage),
  }
}
