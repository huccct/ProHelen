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
      <DialogContent className="bg-zinc-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-gray-400">
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
        throw new Error('Failed to fetch instructions')
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
      setError(err instanceof Error ? err.message : 'Failed to load instructions')
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

      toast.success('Instruction deleted successfully')
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
      toast.error('Failed to delete, please try again')
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

      toast.success(instruction.isFavorite ? 'Removed from favorites' : 'Added to favorites')
      fetchInstructions(currentPage) // Refresh current page
    }
    catch (error) {
      console.error('Error toggling favorite:', error)
      toast.error('Operation failed, please try again')
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

      toast.success('Instruction duplicated successfully')
      fetchInstructions(currentPage) // Refresh current page
    }
    catch (error) {
      console.error('Error duplicating instruction:', error)
      toast.error('Failed to duplicate, please try again')
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
      })

      if (!response.ok) {
        throw new Error('Failed to publish instruction')
      }

      toast.success('Instruction published to template library')
      fetchInstructions(currentPage) // Refresh current page
    }
    catch (error) {
      console.error('Error publishing instruction:', error)
      toast.error('Failed to publish, please try again')
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {[...Array.from({ length: 6 })].map((_, i) => (
            <Card key={i} className="bg-zinc-900 border-gray-800 animate-pulse">
              <CardHeader className="p-6">
                <div className="h-6 bg-gray-700 rounded mb-2" />
                <div className="h-4 bg-gray-700 rounded mb-4" />
                <div className="flex gap-2 mb-4">
                  <div className="h-6 w-16 bg-gray-700 rounded" />
                  <div className="h-6 w-16 bg-gray-700 rounded" />
                </div>
                <div className="h-4 bg-gray-700 rounded" />
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
        <p className="text-red-400 mb-4">{error}</p>
        <Button onClick={() => fetchInstructions(currentPage)} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  if (instructions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          {searchQuery ? 'No matching instructions found' : 'You haven\'t created any instructions yet'}
        </div>
        <Button
          onClick={() => router.push('/builder')}
          className="bg-white text-black hover:bg-gray-100 cursor-pointer"
        >
          Create New Instruction
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
            className={`bg-zinc-900 border-gray-800 hover:border-gray-300 hover:shadow-md hover:shadow-gray-900/20 transition-all duration-200 ${
              viewMode === 'list' ? 'flex flex-row items-center p-4' : ''
            }`}
          >
            <div className={viewMode === 'list' ? 'flex-1' : ''}>
              <CardHeader className={`pb-2 ${viewMode === 'list' ? 'pb-0' : ''}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3
                        className="text-xl font-semibold text-white cursor-pointer hover:text-gray-200 transition-colors truncate"
                        onClick={() => router.push(`/builder?instruction=${instruction.id}`)}
                      >
                        {instruction.title}
                      </h3>
                      {instruction.isPublished && (
                        <Badge variant="secondary" className="bg-green-900/30 text-green-300 border-green-700 pointer-events-none">
                          <Globe className="w-3 h-3 mr-1" />
                          Published
                        </Badge>
                      )}
                      {instruction.isFavorite && (
                        <Heart className="w-4 h-4 text-red-400 fill-current" />
                      )}
                    </div>
                    {instruction.category && (
                      <Badge variant="outline" className="border-gray-700 text-gray-400 text-xs">
                        {instruction.category}
                      </Badge>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-zinc-800 cursor-pointer">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-zinc-800 border-zinc-700 text-white">
                      <DropdownMenuItem
                        className="cursor-pointer hover:bg-zinc-700 focus:bg-zinc-700"
                        onClick={() => router.push(`/builder?instruction=${instruction.id}`)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer hover:bg-zinc-700 focus:bg-zinc-700"
                        onClick={() => handleDuplicate(instruction)}
                      >
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer hover:bg-zinc-700 focus:bg-zinc-700"
                        onClick={() => handleToggleFavorite(instruction)}
                      >
                        {instruction.isFavorite
                          ? (
                              <>
                                <HeartOff className="mr-2 h-4 w-4" />
                                Remove from favorites
                              </>
                            )
                          : (
                              <>
                                <Heart className="mr-2 h-4 w-4" />
                                Add to favorites
                              </>
                            )}
                      </DropdownMenuItem>
                      {!instruction.isPublished && (
                        <DropdownMenuItem
                          className="cursor-pointer hover:bg-zinc-700 focus:bg-zinc-700"
                          onClick={() => setPublishModal({ isOpen: true, instruction })}
                        >
                          <Share className="mr-2 h-4 w-4" />
                          Publish to template library
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="cursor-pointer hover:bg-zinc-700 focus:bg-zinc-700 text-red-400 hover:text-red-300"
                        onClick={() => setDeleteModal({ isOpen: true, instruction })}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              {viewMode === 'grid' && (
                <>
                  <CardContent>
                    <p className="text-gray-300 text-sm min-h-[60px] line-clamp-3">
                      {instruction.description || 'No description'}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {instruction.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="bg-zinc-800 text-gray-300 text-xs px-2 py-1 rounded-full hover:bg-zinc-700 hover:text-white transition-colors">
                          {tag}
                        </span>
                      ))}
                      {instruction.tags.length > 3 && (
                        <span className="bg-zinc-800 text-gray-300 text-xs px-2 py-1 rounded-full">
                          +
                          {instruction.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="border-t border-gray-800 pt-3 text-xs text-gray-400 flex justify-between">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(instruction.updatedAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Used
                      {' '}
                      {instruction.usageCount}
                      {' '}
                      times
                    </div>
                  </CardFooter>
                </>
              )}
            </div>

            {viewMode === 'list' && (
              <div className="ml-4 flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  {instruction.tags.slice(0, 2).map(tag => (
                    <Badge key={tag} variant="outline" className="border-gray-700 text-gray-400 text-xs">
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
        title="Delete Instruction"
        description="Are you sure you want to delete this instruction? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />

      {/* Publish Confirmation Modal */}
      <ConfirmModal
        isOpen={publishModal.isOpen}
        onClose={() => setPublishModal({ isOpen: false, instruction: null })}
        onConfirm={() => publishModal.instruction && handlePublish(publishModal.instruction)}
        title="Publish to Template Library"
        description="Are you sure you want to publish this instruction to the template library? Other users will be able to see and use it."
        confirmText="Publish"
        cancelText="Cancel"
      />
    </div>
  )
}
