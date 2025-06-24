'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Clock, Edit, Globe, Heart, HeartOff, MoreVertical, Share, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

// Instruction data type
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
}

interface InstructionGridProps {
  searchQuery: string
  filter?: 'all' | 'personal' | 'favorites' | 'published'
  viewMode?: 'grid' | 'list'
  sortBy?: string
}

interface PaginationInfo {
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive'
}

function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
}: ConfirmModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="cursor-pointer">
            {cancelText}
          </Button>
          <Button
            variant={variant === 'destructive' ? 'destructive' : 'outline'}
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className="cursor-pointer"
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function InstructionGrid({
  searchQuery,
  filter = 'all',
  viewMode = 'grid',
  sortBy = 'updated',
}: InstructionGridProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const [instructions, setInstructions] = useState<Instruction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    limit: 6,
    offset: 0,
    hasMore: false,
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean, instruction: Instruction | null }>({
    isOpen: false,
    instruction: null,
  })
  const [publishModal, setPublishModal] = useState<{ isOpen: boolean, instruction: Instruction | null }>({
    isOpen: false,
    instruction: null,
  })

  // Fetch instructions list with pagination
  const fetchInstructions = async (page = 1) => {
    try {
      setLoading(true)
      const params = new URLSearchParams()

      if (searchQuery)
        params.set('search', searchQuery)
      if (filter !== 'all')
        params.set('filter', filter)
      if (sortBy)
        params.set('sortBy', sortBy)

      params.set('limit', '6')
      params.set('offset', ((page - 1) * 6).toString())

      const response = await fetch(`/api/instructions?${params}`)

      if (!response.ok) {
        throw new Error(t('myInstructions.failedToLoad'))
      }

      const data = await response.json()
      setInstructions(data.instructions || [])
      setPagination(data.pagination || {
        total: 0,
        limit: 6,
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
  }

  useEffect(() => {
    setCurrentPage(1)
    fetchInstructions(1)
  }, [searchQuery, filter, sortBy])

  const handlePageChange = (page: number) => {
    fetchInstructions(page)
  }

  const totalPages = Math.ceil(pagination.total / pagination.limit)
  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < totalPages

  // Delete instruction
  const handleDelete = async (instructionId: string) => {
    try {
      const response = await fetch(`/api/instructions/${instructionId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete instruction')
      }

      toast.success(t('myInstructions.instructionDeleted'))
      // If we deleted the last item on the current page and it's not page 1, go to previous page
      if (instructions.length === 1 && currentPage > 1) {
        fetchInstructions(currentPage - 1)
      }
      else {
        fetchInstructions(currentPage) // Refresh current page
      }
    }
    catch (error) {
      console.error('Error deleting instruction:', error)
      toast.error(t('myInstructions.deleteFailed'))
    }
  }

  // Toggle favorite status
  const handleToggleFavorite = async (instruction: Instruction) => {
    try {
      const response = await fetch(`/api/instructions/${instruction.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...instruction,
          isFavorite: !instruction.isFavorite,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update favorite status')
      }

      toast.success(instruction.isFavorite ? t('myInstructions.removedFromFavorites') : t('myInstructions.addedToFavorites'))
      fetchInstructions(currentPage) // Refresh current page
    }
    catch (error) {
      console.error('Error toggling favorite:', error)
      toast.error(t('myInstructions.favoriteOperationFailed'))
    }
  }

  // Duplicate instruction
  const handleDuplicate = async (instruction: Instruction) => {
    try {
      const response = await fetch('/api/instructions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `${instruction.title} (Copy)`,
          description: instruction.description,
          content: instruction.content,
          tags: instruction.tags,
          flowData: instruction.flowData,
          category: instruction.category,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to duplicate instruction')
      }

      toast.success(t('myInstructions.instructionDuplicated'))
      fetchInstructions(currentPage) // Refresh current page
    }
    catch (error) {
      console.error('Error duplicating instruction:', error)
      toast.error(t('myInstructions.duplicateFailed'))
    }
  }

  // Publish to template library
  const handlePublish = async (instruction: Instruction) => {
    try {
      const response = await fetch(`/api/instructions/${instruction.id}/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}), // Send empty object to avoid JSON parsing error
      })

      if (!response.ok) {
        throw new Error('Failed to publish instruction')
      }

      toast.success(t('myInstructions.instructionPublished'))
      fetchInstructions(currentPage) // Refresh current page
    }
    catch (error) {
      console.error('Error publishing instruction:', error)
      toast.error(t('myInstructions.publishFailed'))
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {[...Array.from({ length: 6 })].map((_, i) => (
            <Card key={i} className="bg-card border-border animate-pulse">
              <CardHeader className="p-6">
                <div className="h-6 bg-muted rounded mb-2" />
                <div className="h-4 bg-muted rounded mb-4" />
                <div className="flex gap-2 mb-4">
                  <div className="h-6 w-16 bg-muted rounded" />
                  <div className="h-6 w-16 bg-muted rounded" />
                </div>
                <div className="h-4 bg-muted rounded" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => fetchInstructions(currentPage)} variant="outline">
          {t('myInstructions.tryAgain')}
        </Button>
      </div>
    )
  }

  if (instructions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">
          {searchQuery ? t('myInstructions.noMatchingInstructions') : t('myInstructions.noInstructionsYet')}
        </div>
        <Button
          onClick={() => router.push('/builder')}
          className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
        >
          {t('myInstructions.createNewInstruction')}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {instructions.map(instruction => (
          <Card
            key={instruction.id}
            className={`bg-card border-border hover:border-border/80 hover:shadow-md hover:shadow-muted/20 transition-all duration-200 ${
              viewMode === 'list' ? 'flex flex-row items-center p-4' : ''
            }`}
          >
            <div className={viewMode === 'list' ? 'flex-1' : ''}>
              <CardHeader className={`pb-2 ${viewMode === 'list' ? 'pb-0' : ''}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3
                        className="text-xl font-semibold text-foreground cursor-pointer hover:text-foreground/80 transition-colors truncate"
                        onClick={() => router.push(`/builder?instruction=${instruction.id}`)}
                      >
                        {instruction.title}
                      </h3>
                      {instruction.isPublished && (
                        <Badge variant="secondary" className="bg-green-900/30 text-green-300 border-green-700 pointer-events-none">
                          <Globe className="w-3 h-3 mr-1" />
                          {t('myInstructions.published')}
                        </Badge>
                      )}
                      {instruction.isFavorite && (
                        <Heart className="w-4 h-4 text-red-400 fill-current" />
                      )}
                    </div>
                    {instruction.category && (
                      <Badge variant="outline" className="text-xs">
                        {instruction.category}
                      </Badge>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card border-border text-foreground">
                      <DropdownMenuItem
                        className="cursor-pointer hover:bg-muted focus:bg-muted"
                        onClick={() => router.push(`/builder?instruction=${instruction.id}`)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        {t('myInstructions.edit')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer hover:bg-muted focus:bg-muted"
                        onClick={() => handleDuplicate(instruction)}
                      >
                        {t('myInstructions.duplicate')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer hover:bg-muted focus:bg-muted"
                        onClick={() => handleToggleFavorite(instruction)}
                      >
                        {instruction.isFavorite
                          ? (
                              <>
                                <HeartOff className="mr-2 h-4 w-4" />
                                {t('myInstructions.removeFromFavorites')}
                              </>
                            )
                          : (
                              <>
                                <Heart className="mr-2 h-4 w-4" />
                                {t('myInstructions.addToFavorites')}
                              </>
                            )}
                      </DropdownMenuItem>
                      {!instruction.isPublished && (
                        <DropdownMenuItem
                          className="cursor-pointer hover:bg-muted focus:bg-muted"
                          onClick={() => setPublishModal({ isOpen: true, instruction })}
                        >
                          <Share className="mr-2 h-4 w-4" />
                          {t('myInstructions.publishToLibrary')}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="cursor-pointer hover:bg-muted focus:bg-muted text-destructive hover:text-destructive/80"
                        onClick={() => setDeleteModal({ isOpen: true, instruction })}
                      >
                        {t('myInstructions.delete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              {viewMode === 'grid' && (
                <>
                  <CardContent>
                    <p className="text-foreground text-sm min-h-[60px] line-clamp-3">
                      {instruction.description || t('myInstructions.noDescription')}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {instruction.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full hover:bg-muted/80 hover:text-foreground transition-colors">
                          {tag}
                        </span>
                      ))}
                      {instruction.tags.length > 3 && (
                        <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                          +
                          {instruction.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="border-t border-border pt-3 text-xs text-muted-foreground flex justify-between">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(instruction.updatedAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Sparkles className="h-3 w-3 mr-1" />
                      {t('myInstructions.usedTimes', { count: instruction.usageCount })}
                    </div>
                  </CardFooter>
                </>
              )}
            </div>

            {viewMode === 'list' && (
              <div className="ml-4 flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  {instruction.tags.slice(0, 2).map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(instruction.updatedAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  {instruction.usageCount}
                </div>
              </div>
            )}
          </Card>
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
                className={!canGoPrevious ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
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
                    className="cursor-pointer"
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
                className={!canGoNext ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, instruction: null })}
        onConfirm={() => deleteModal.instruction && handleDelete(deleteModal.instruction.id)}
        title={t('myInstructions.deleteInstruction.title')}
        description={t('myInstructions.deleteInstruction.description')}
        confirmText={t('myInstructions.deleteInstruction.confirm')}
        cancelText={t('myInstructions.deleteInstruction.cancel')}
        variant="destructive"
      />

      {/* Publish Confirmation Modal */}
      <ConfirmModal
        isOpen={publishModal.isOpen}
        onClose={() => setPublishModal({ isOpen: false, instruction: null })}
        onConfirm={() => publishModal.instruction && handlePublish(publishModal.instruction)}
        title={t('myInstructions.publishInstruction.title')}
        description={t('myInstructions.publishInstruction.description')}
        confirmText={t('myInstructions.publishInstruction.confirm')}
        cancelText={t('myInstructions.publishInstruction.cancel')}
      />
    </div>
  )
}
