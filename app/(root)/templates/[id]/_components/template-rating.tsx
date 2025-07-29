'use client'

import type { Review } from '@/types/templates'
import { ConfirmModal } from '@/components/confirm-modal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Star, Trash2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

interface TemplateRatingProps {
  templateId: string
  currentRating?: number
  ratingCount?: number
}

export function TemplateRating({ templateId, currentRating, ratingCount }: TemplateRatingProps) {
  const { t } = useTranslation()
  const { data: session } = useSession()
  const [userRating, setUserRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasUserReviewed, setHasUserReviewed] = useState(false)
  const [reviews, setReviews] = useState<Review[]>([])
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/templates/${templateId}/reviews`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews || [])
      }
    }
    catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }

  const checkUserReview = async () => {
    if (!session?.user?.id)
      return

    try {
      const response = await fetch(`/api/templates/${templateId}/reviews?userId=${session.user.id}`)
      if (response.ok) {
        const data = await response.json()
        if (data.userReview) {
          setHasUserReviewed(true)
          setUserRating(data.userReview.rating)
          setComment(data.userReview.comment || '')
        }
      }
    }
    catch (error) {
      console.error('Error checking user review:', error)
    }
  }

  const validateComment = (text: string): boolean => {
    if (text.length > 1000)
      return false

    const scriptPattern = /<script|javascript:|on\w+\s*=|data:text\/html/i
    if (scriptPattern.test(text))
      return false

    const specialCharRatio = (text.match(/[^\w\s\u4E00-\u9FFF]/g) || []).length / text.length
    if (specialCharRatio > 0.5)
      return false

    return true
  }

  useEffect(() => {
    fetchReviews()
    if (session?.user?.id) {
      checkUserReview()
    }
  }, [templateId, session?.user?.id])

  const handleSubmitReview = async () => {
    if (!session?.user?.id) {
      toast.error(t('templateDetail.signInToRate'))
      return
    }

    if (userRating === 0) {
      toast.error(t('templateDetail.selectRating'))
      return
    }

    if (hasUserReviewed && comment.trim() === '') {
      toast.error(t('templateDetail.commentRequired') || 'Comment is required when updating a review')
      return
    }

    if (comment.trim() && !validateComment(comment.trim())) {
      toast.error(t('templateDetail.invalidComment'))
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/templates/${templateId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: userRating,
          comment: comment.trim() || undefined,
        }),
      })

      if (response.ok) {
        const isFirstTimeReview = !hasUserReviewed
        toast.success(hasUserReviewed ? t('templateDetail.reviewUpdated') : t('templateDetail.reviewSubmitted'))
        setHasUserReviewed(true)

        if (isFirstTimeReview) {
          setUserRating(0)
          setComment('')
        }

        fetchReviews()
      }
      else {
        throw new Error('Failed to submit review')
      }
    }
    catch (error) {
      toast.error(t('templateDetail.reviewFailed'))
      console.error('Error submitting review:', error)
    }
    finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteReview = async () => {
    if (!session?.user?.id) {
      toast.error(t('templateDetail.signInToDelete'))
      return
    }

    if (!hasUserReviewed) {
      toast.error(t('templateDetail.noReviewToDelete'))
      return
    }

    try {
      const response = await fetch(`/api/templates/${templateId}/reviews`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        toast.success(t('templateDetail.reviewDeleted'))
        setHasUserReviewed(false)
        setUserRating(0)
        setComment('')
        fetchReviews()
      }
      else {
        throw new Error('Failed to delete review')
      }
    }
    catch (error) {
      toast.error(t('templateDetail.deleteFailed'))
      console.error('Error deleting review:', error)
    }
  }

  const showDeleteConfirmModal = () => {
    setShowDeleteModal(true)
  }

  const hideDeleteConfirmModal = () => {
    setShowDeleteModal(false)
  }

  const renderStarRating = (rating: number, interactive = false, size = 'w-5 h-5') => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= (interactive ? (hoverRating || userRating) : rating)
          return (
            <Star
              key={star}
              className={`${size} transition-colors cursor-${interactive ? 'pointer' : 'default'} ${
                filled ? 'text-yellow-500 fill-current' : 'text-muted-foreground'
              }`}
              onClick={() => interactive && setUserRating(star)}
              onMouseEnter={() => interactive && setHoverRating(star)}
              onMouseLeave={() => interactive && setHoverRating(0)}
            />
          )
        })}
      </div>
    )
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return t('templateDetail.now')
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? t('templateDetail.timeUnits.minute') : t('templateDetail.timeUnits.minutes')} ${t('templateDetail.ago')}`
    }

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? t('templateDetail.timeUnits.hour') : t('templateDetail.timeUnits.hours')} ${t('templateDetail.ago')}`
    }

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 30) {
      return `${diffInDays} ${diffInDays === 1 ? t('templateDetail.timeUnits.day') : t('templateDetail.timeUnits.days')} ${t('templateDetail.ago')}`
    }

    const diffInMonths = Math.floor(diffInDays / 30)
    if (diffInMonths < 12) {
      return `${diffInMonths} ${diffInMonths === 1 ? t('templateDetail.timeUnits.month') : t('templateDetail.timeUnits.months')} ${t('templateDetail.ago')}`
    }

    const diffInYears = Math.floor(diffInDays / 365)
    return `${diffInYears} ${diffInYears === 1 ? t('templateDetail.timeUnits.year') : t('templateDetail.timeUnits.years')} ${t('templateDetail.ago')}`
  }

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3)

  return (
    <Card className="bg-card/50 border-border">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-foreground">{t('templateDetail.ratingsReviews')}</CardTitle>
        {currentRating && ratingCount && (
          <div className="flex items-center gap-3">
            {renderStarRating(currentRating)}
            <span className="text-lg font-semibold">{currentRating.toFixed(1)}</span>
            <span className="text-muted-foreground">
              (
              {ratingCount}
              {' '}
              {t('templateDetail.reviews')}
              )
            </span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {session?.user
          ? (
              <div className="border-b border-border pb-6">
                <h3 className="text-lg font-medium mb-3">
                  {hasUserReviewed ? t('templateDetail.yourReview') : t('templateDetail.rateTemplate')}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      {t('templateDetail.rating')}
                    </label>
                    {renderStarRating(userRating, true, 'w-6 h-6')}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      {t('templateDetail.comment')}
                    </label>
                    <Textarea
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      placeholder={t('templateDetail.commentPlaceholder')}
                      className="min-h-[80px] max-h-[150px] resize-none overflow-y-auto scrollbar"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleSubmitReview}
                      disabled={isSubmitting || userRating === 0}
                      className="flex-1 bg-muted hover:bg-muted/80 text-foreground border border-border cursor-pointer"
                    >
                      {isSubmitting ? t('templateDetail.submitting') : hasUserReviewed ? t('templateDetail.updateReview') : t('templateDetail.submitReview')}
                    </Button>

                  </div>
                </div>
              </div>
            )
          : (
              <div className="border-b border-border pb-6">
                <div className="text-center py-4 bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground">{t('templateDetail.signInToReview')}</p>
                </div>
              </div>
            )}

        {reviews.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-4">{t('templateDetail.reviews')}</h3>
            <div className="space-y-4">
              {displayedReviews.map(review => (
                <div key={review.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {renderStarRating(review.rating, false, 'w-4 h-4')}
                      <span className="text-sm font-medium">
                        {review.user.name || review.user.email.split('@')[0]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(review.createdAt)}
                      </span>
                      {session?.user?.id === review.userId && (
                        <Button
                          onClick={showDeleteConfirmModal}
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-red-500 hover:bg-red-500 hover:text-white cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-foreground mt-2">{review.comment}</p>
                  )}
                </div>
              ))}

              {reviews.length > 3 && (
                <Button
                  variant="outline"
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="w-full border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 cursor-pointer"
                >
                  {showAllReviews
                    ? t('templateDetail.showLessReviews')
                    : `${t('templateDetail.showAllReviews')} (${reviews.length})`}
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={hideDeleteConfirmModal}
        onConfirm={handleDeleteReview}
        title={t('templateDetail.deleteReview.title')}
        description={t('templateDetail.deleteReview.description')}
        confirmText={t('templateDetail.deleteReview.confirm')}
        cancelText={t('templateDetail.deleteReview.cancel')}
        variant="destructive"
      />
    </Card>
  )
}
