'use client'

import type { Instruction, InstructionGridProps, ModalState } from '@/types/my-instructions'
import { ConfirmModal } from '@/components/confirm-modal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
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
import { GRID_CONFIG, MODAL_TYPES } from '@/lib/constants'
import { useInstructionApi } from '@/lib/hooks/use-instruction-api'
import { useInstructionData } from '@/lib/hooks/use-instruction-data'
import { CheckCircle, Clock, Copy, Edit, Globe, Heart, HeartOff, MoreVertical, Share, Unlink } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

const SkeletonCard = memo(() => (
  <Card className="bg-card border-border animate-pulse">
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
))

SkeletonCard.displayName = 'SkeletonCard'

interface TagsProps {
  tags: string[]
  maxVisible: number
}

const Tags = memo<TagsProps>(({ tags, maxVisible }) => {
  const visibleTags = tags.slice(0, maxVisible)
  const hiddenCount = Math.max(0, tags.length - maxVisible)

  return (
    <div className="flex flex-wrap gap-2">
      {visibleTags.map(tag => (
        <span
          key={tag}
          className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full hover:bg-muted/80 hover:text-foreground transition-colors"
        >
          {tag}
        </span>
      ))}
      {hiddenCount > 0 && (
        <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
          +
          {hiddenCount}
        </span>
      )}
    </div>
  )
})

Tags.displayName = 'Tags'

interface InstructionBadgesProps {
  instruction: Instruction
}

const InstructionBadges = memo<InstructionBadgesProps>(({ instruction }) => {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-2">
      {instruction.isPublished && (
        <Badge variant="secondary" className="bg-green-900/30 text-green-300 border-green-700 pointer-events-none">
          <Globe className="w-3 h-3 mr-1" />
          {t('myInstructions.published')}
        </Badge>
      )}
      {instruction.isFavorite && (
        <Heart className="w-5 h-5 text-red-400 fill-current flex-shrink-0" />
      )}
      {instruction.isDraft && (
        <Badge variant="secondary" className="text-xs">
          {t('common.draft')}
        </Badge>
      )}
    </div>
  )
})

InstructionBadges.displayName = 'InstructionBadges'

interface InstructionMenuProps {
  instruction: Instruction
  onEdit: () => void
  onDuplicate: () => void
  onToggleFavorite: () => void
  onPublish: () => void
  onUnpublish: () => void
  onCompleteDraft: () => void
  onDelete: () => void
}

const InstructionMenu = memo<InstructionMenuProps>(({
  instruction,
  onEdit,
  onDuplicate,
  onToggleFavorite,
  onPublish,
  onUnpublish,
  onCompleteDraft,
  onDelete,
}) => {
  const { t } = useTranslation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card border-border text-foreground">
        <DropdownMenuItem className="cursor-pointer hover:bg-muted focus:bg-muted" onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          {t('myInstructions.edit')}
        </DropdownMenuItem>

        {instruction.isDraft && (
          <DropdownMenuItem className="cursor-pointer hover:bg-muted focus:bg-muted" onClick={onCompleteDraft}>
            <CheckCircle className="mr-2 h-4 w-4" />
            {t('myInstructions.completeDraft')}
          </DropdownMenuItem>
        )}

        <DropdownMenuItem className="cursor-pointer hover:bg-muted focus:bg-muted" onClick={onDuplicate}>
          <Copy className="mr-2 h-4 w-4" />
          {t('myInstructions.duplicate')}
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer hover:bg-muted focus:bg-muted" onClick={onToggleFavorite}>
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
        {!instruction.isPublished
          ? (
              <DropdownMenuItem className="cursor-pointer hover:bg-muted focus:bg-muted" onClick={onPublish}>
                <Share className="mr-2 h-4 w-4" />
                {t('myInstructions.publishToLibrary')}
              </DropdownMenuItem>
            )
          : (
              <DropdownMenuItem className="cursor-pointer hover:bg-muted focus:bg-muted" onClick={onUnpublish}>
                <Unlink className="mr-2 h-4 w-4" />
                {t('myInstructions.unpublishFromLibrary')}
              </DropdownMenuItem>
            )}
        <DropdownMenuItem
          className="cursor-pointer hover:bg-muted focus:bg-muted text-destructive hover:text-destructive/80"
          onClick={onDelete}
        >
          {t('myInstructions.delete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
})

InstructionMenu.displayName = 'InstructionMenu'

interface InstructionCardProps {
  instruction: Instruction
  viewMode: 'grid' | 'list'
  onEdit: (instruction: Instruction) => void
  onDuplicate: (instruction: Instruction) => void
  onToggleFavorite: (instruction: Instruction) => void
  onCompleteDraft: (instruction: Instruction) => void
  onShowModal: (type: string, instruction: Instruction) => void
}

const InstructionCard = memo<InstructionCardProps>(({
  instruction,
  viewMode,
  onEdit,
  onDuplicate,
  onToggleFavorite,
  onCompleteDraft,
  onShowModal,
}) => {
  const { t } = useTranslation()

  const handleEdit = useCallback(() => onEdit(instruction), [onEdit, instruction])
  const handleDuplicate = useCallback(() => onDuplicate(instruction), [onDuplicate, instruction])
  const handleToggleFavorite = useCallback(() => onToggleFavorite(instruction), [onToggleFavorite, instruction])
  const handlePublish = useCallback(() => onShowModal(MODAL_TYPES.PUBLISH, instruction), [onShowModal, instruction])
  const handleUnpublish = useCallback(() => onShowModal(MODAL_TYPES.UNPUBLISH, instruction), [onShowModal, instruction])
  const handleDelete = useCallback(() => onShowModal(MODAL_TYPES.DELETE, instruction), [onShowModal, instruction])
  const handleCompleteDraft = useCallback(() => onCompleteDraft(instruction), [onCompleteDraft, instruction])

  return (
    <Card
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
                  onClick={handleEdit}
                >
                  {instruction.title}
                </h3>
                <InstructionBadges instruction={instruction} />
              </div>
              {instruction.category && (
                <Badge variant="outline" className="text-xs">
                  {instruction.category}
                </Badge>
              )}
            </div>
            <InstructionMenu
              instruction={instruction}
              onEdit={handleEdit}
              onDuplicate={handleDuplicate}
              onToggleFavorite={handleToggleFavorite}
              onPublish={handlePublish}
              onUnpublish={handleUnpublish}
              onCompleteDraft={handleCompleteDraft}
              onDelete={handleDelete}
            />
          </div>
        </CardHeader>

        {viewMode === 'grid' && (
          <>
            <CardContent>
              <p className="text-foreground text-sm min-h-[60px] line-clamp-3">
                {instruction.description || t('myInstructions.noDescription')}
              </p>
              <div className="mt-3">
                <Tags tags={instruction.tags} maxVisible={GRID_CONFIG.MAX_VISIBLE_TAGS} />
              </div>
            </CardContent>

            <CardFooter className="border-t border-border pt-3 text-xs text-muted-foreground flex justify-between">
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {new Date(instruction.updatedAt).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                {t('myInstructions.usedTimes', { count: instruction.usageCount })}
              </div>
            </CardFooter>
          </>
        )}
      </div>

      {viewMode === 'list' && (
        <div className="ml-4 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Tags tags={instruction.tags} maxVisible={GRID_CONFIG.MAX_LIST_TAGS} />
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {new Date(instruction.updatedAt).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1">
            {instruction.usageCount}
          </div>
        </div>
      )}
    </Card>
  )
})

InstructionCard.displayName = 'InstructionCard'

interface CustomPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const CustomPagination = memo<CustomPaginationProps>(({ currentPage, totalPages, onPageChange }) => {
  const pages = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1).filter((page) => {
      const isCurrentPage = page === currentPage
      const isNearCurrentPage = Math.abs(page - currentPage) <= GRID_CONFIG.PAGINATION_ELLIPSIS_THRESHOLD
      const isFirstOrLast = page === 1 || page === totalPages
      return isCurrentPage || isNearCurrentPage || isFirstOrLast
    })
  }, [currentPage, totalPages])

  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < totalPages

  const handlePrevious = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    if (canGoPrevious)
      onPageChange(currentPage - 1)
  }, [canGoPrevious, currentPage, onPageChange])

  const handleNext = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    if (canGoNext)
      onPageChange(currentPage + 1)
  }, [canGoNext, currentPage, onPageChange])

  const handlePageClick = useCallback((page: number) => (e: React.MouseEvent) => {
    e.preventDefault()
    onPageChange(page)
  }, [onPageChange])

  if (totalPages <= 1)
    return null

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={handlePrevious}
            className={!canGoPrevious ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          />
        </PaginationItem>

        {pages.map((page, index) => {
          const isCurrentPage = page === currentPage
          const shouldShowEllipsis = index > 0 && page - pages[index - 1] > 1

          return (
            <div key={page}>
              {shouldShowEllipsis && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink
                  href="#"
                  isActive={isCurrentPage}
                  onClick={handlePageClick(page)}
                  className="cursor-pointer"
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
            onClick={handleNext}
            className={!canGoNext ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
})

CustomPagination.displayName = 'CustomPagination'

export const InstructionGrid = memo<InstructionGridProps>(({
  searchQuery,
  filter = 'all',
  viewMode = 'grid',
  sortBy = 'updated',
}) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [modalState, setModalState] = useState<ModalState>({
    type: null,
    isOpen: false,
    instruction: null,
  })

  const {
    instructions,
    loading,
    error,
    pagination,
    currentPage,
    loadInstructions,
    refreshCurrentPage,
    refreshWithPageAdjustment,
  } = useInstructionData(searchQuery, filter, sortBy)

  const api = useInstructionApi()

  const totalPages = useMemo(() =>
    Math.ceil(pagination.total / pagination.limit), [pagination.total, pagination.limit])

  const showModal = useCallback((type: string, instruction: Instruction) => {
    setModalState({ type, isOpen: true, instruction })
  }, [])

  const hideModal = useCallback(() => {
    setModalState({ type: null, isOpen: false, instruction: null })
  }, [])

  const handleEdit = useCallback((instruction: Instruction) => {
    router.push(`/builder?instruction=${instruction.id}`)
  }, [router])

  const handleDelete = useCallback(async (instructionId: string) => {
    try {
      await api.deleteInstruction(instructionId)
      toast.success(t('myInstructions.instructionDeleted'))
      refreshWithPageAdjustment()
    }
    catch (error) {
      console.error('Error deleting instruction:', error)
      toast.error(t('myInstructions.deleteFailed'))
    }
    finally {
      hideModal()
    }
  }, [api, t, refreshWithPageAdjustment, hideModal])

  const handleToggleFavorite = useCallback(async (instruction: Instruction) => {
    try {
      await api.updateInstruction({
        ...instruction,
        isFavorite: !instruction.isFavorite,
      })
      toast.success(instruction.isFavorite
        ? t('myInstructions.removedFromFavorites')
        : t('myInstructions.addedToFavorites'),
      )
      refreshCurrentPage()
    }
    catch (error) {
      console.error('Error toggling favorite:', error)
      toast.error(t('myInstructions.favoriteOperationFailed'))
    }
  }, [api, t, refreshCurrentPage])

  const handleDuplicate = useCallback(async (instruction: Instruction) => {
    try {
      await api.duplicateInstruction(instruction)
      toast.success(t('myInstructions.instructionDuplicated'))
      refreshCurrentPage()
    }
    catch (error) {
      console.error('Error duplicating instruction:', error)
      toast.error(t('myInstructions.duplicateFailed'))
    }
  }, [api, t, refreshCurrentPage])

  const handlePublish = useCallback(async (instruction: Instruction) => {
    try {
      await api.publishInstruction(instruction.id)

      if (instruction.isDraft) {
        await api.updateInstruction({
          ...instruction,
          isDraft: false,
        })
      }

      toast.success(t('myInstructions.instructionPublished'))
      refreshCurrentPage()
    }
    catch (error) {
      console.error('Error publishing instruction:', error)
      toast.error(t('myInstructions.publishFailed'))
    }
    finally {
      hideModal()
    }
  }, [api, t, refreshCurrentPage, hideModal])

  const handleUnpublish = useCallback(async (instruction: Instruction) => {
    try {
      await api.unpublishInstruction(instruction.id)
      toast.success(t('myInstructions.instructionUnpublished'))
      refreshCurrentPage()
    }
    catch (error) {
      console.error('Error unpublishing instruction:', error)
      toast.error(t('myInstructions.unpublishFailed'))
    }
    finally {
      hideModal()
    }
  }, [api, t, refreshCurrentPage, hideModal])

  const handleCompleteDraft = useCallback(async (instruction: Instruction) => {
    try {
      await api.updateInstruction({
        ...instruction,
        isDraft: false,
      })
      toast.success(t('myInstructions.draftCompleted'))
      refreshCurrentPage()
    }
    catch (error) {
      console.error('Error completing draft:', error)
      toast.error(t('myInstructions.completeDraftFailed'))
    }
  }, [api, t, refreshCurrentPage])

  const handleModalConfirm = useCallback(() => {
    if (!modalState.instruction)
      return

    switch (modalState.type) {
      case MODAL_TYPES.DELETE:
        handleDelete(modalState.instruction.id)
        break
      case MODAL_TYPES.PUBLISH:
        handlePublish(modalState.instruction)
        break
      case MODAL_TYPES.UNPUBLISH:
        handleUnpublish(modalState.instruction)
        break
      case MODAL_TYPES.COMPLETE_DRAFT:
        handleCompleteDraft(modalState.instruction)
        break
    }
  }, [modalState, handleDelete, handlePublish, handleUnpublish, handleCompleteDraft])

  if (loading) {
    return (
      <div className="space-y-8">
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {Array.from({ length: GRID_CONFIG.PAGE_SIZE }, (_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={refreshCurrentPage} variant="outline">
          {t('myInstructions.tryAgain')}
        </Button>
      </div>
    )
  }

  if (instructions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">
          {searchQuery
            ? t('myInstructions.noMatchingInstructions')
            : t('myInstructions.noInstructionsYet')}
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
          <InstructionCard
            key={instruction.id}
            instruction={instruction}
            viewMode={viewMode}
            onEdit={handleEdit}
            onDuplicate={handleDuplicate}
            onToggleFavorite={handleToggleFavorite}
            onCompleteDraft={handleCompleteDraft}
            onShowModal={showModal}
          />
        ))}
      </div>

      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={loadInstructions}
      />

      <ConfirmModal
        isOpen={modalState.isOpen && modalState.type === MODAL_TYPES.DELETE}
        onClose={hideModal}
        onConfirm={handleModalConfirm}
        title={t('myInstructions.deleteInstruction.title')}
        description={t('myInstructions.deleteInstruction.description')}
        confirmText={t('myInstructions.deleteInstruction.confirm')}
        cancelText={t('myInstructions.deleteInstruction.cancel')}
        variant="destructive"
      />

      <ConfirmModal
        isOpen={modalState.isOpen && modalState.type === MODAL_TYPES.PUBLISH}
        onClose={hideModal}
        onConfirm={handleModalConfirm}
        title={t('myInstructions.publishInstruction.title')}
        description={t('myInstructions.publishInstruction.description')}
        confirmText={t('myInstructions.publishInstruction.confirm')}
        cancelText={t('myInstructions.publishInstruction.cancel')}
      />

      <ConfirmModal
        isOpen={modalState.isOpen && modalState.type === MODAL_TYPES.UNPUBLISH}
        onClose={hideModal}
        onConfirm={handleModalConfirm}
        title={t('myInstructions.unpublishInstruction.title')}
        description={t('myInstructions.unpublishInstruction.description')}
        confirmText={t('myInstructions.unpublishInstruction.confirm')}
        cancelText={t('myInstructions.unpublishInstruction.cancel')}
        variant="default"
      />

      <ConfirmModal
        isOpen={modalState.isOpen && modalState.type === MODAL_TYPES.COMPLETE_DRAFT}
        onClose={hideModal}
        onConfirm={handleModalConfirm}
        title={t('myInstructions.completeDraftInstruction.title')}
        description={t('myInstructions.completeDraftInstruction.description')}
        confirmText={t('myInstructions.completeDraftInstruction.confirm')}
        cancelText={t('myInstructions.completeDraftInstruction.cancel')}
        variant="default"
      />
    </div>
  )
})

InstructionGrid.displayName = 'InstructionGrid'
