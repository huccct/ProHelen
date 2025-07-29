import type { Instruction, PaginationInfo } from '@/types/my-instructions'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GRID_CONFIG } from '../constants'
import { useInstructionApi } from './use-instruction-api'

export function useInstructionData(searchQuery: string, filter: string, sortBy: string) {
  const [instructions, setInstructions] = useState<Instruction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    limit: GRID_CONFIG.PAGE_SIZE,
    offset: 0,
    hasMore: false,
  })
  const [currentPage, setCurrentPage] = useState(1)

  const api = useInstructionApi()
  const { t } = useTranslation()

  const loadInstructions = useCallback(async (page = 1) => {
    try {
      setLoading(true)
      setError(null)

      const data = await api.fetchInstructions({
        page,
        searchQuery,
        filter,
        sortBy,
      })

      setInstructions(data.instructions || [])
      setPagination(data.pagination || {
        total: 0,
        limit: GRID_CONFIG.PAGE_SIZE,
        offset: 0,
        hasMore: false,
      })
      setCurrentPage(page)
    }
    catch (err) {
      console.error('Error fetching instructions:', err)
      setError(err instanceof Error ? err.message : t('myInstructions.failedToLoad'))
    }
    finally {
      setLoading(false)
    }
  }, [api, searchQuery, filter, sortBy, t])

  const refreshCurrentPage = useCallback(() => {
    loadInstructions(currentPage)
  }, [loadInstructions, currentPage])

  const refreshWithPageAdjustment = useCallback(() => {
    if (instructions.length === 1 && currentPage > 1) {
      loadInstructions(currentPage - 1)
    }
    else {
      refreshCurrentPage()
    }
  }, [instructions.length, currentPage, loadInstructions, refreshCurrentPage])

  useEffect(() => {
    setCurrentPage(1)
    loadInstructions(1)
  }, [searchQuery, filter, sortBy])

  return {
    instructions,
    loading,
    error,
    pagination,
    currentPage,
    loadInstructions,
    refreshCurrentPage,
    refreshWithPageAdjustment,
  }
}
