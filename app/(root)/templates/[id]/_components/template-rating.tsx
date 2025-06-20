'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Star } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface TemplateRatingProps {
  templateId: string
  currentRating?: number
  ratingCount?: number
}

interface Review {
  id: string
  rating: number
  comment?: string
  user: {
    name?: string
    email: string
  }
  createdAt: string
}

export function TemplateRating({ templateId, currentRating, ratingCount }: TemplateRatingProps) {
  const { data: session } = useSession()
  const [userRating, setUserRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasUserReviewed, setHasUserReviewed] = useState(false)
  const [reviews, setReviews] = useState<Review[]>([])
  const [showAllReviews, setShowAllReviews] = useState(false)

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

  useEffect(() => {
    fetchReviews()
    if (session?.user?.id) {
      checkUserReview()
    }
  }, [templateId, session?.user?.id])

  const handleSubmitReview = async () => {
    if (!session?.user?.id) {
      toast.error('Please sign in to rate this template')
      return
    }

    if (userRating === 0) {
      toast.error('Please select a rating')
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
        toast.success(hasUserReviewed ? 'Review updated!' : 'Review submitted!')
        setHasUserReviewed(true)
        fetchReviews()
      }
      else {
        throw new Error('Failed to submit review')
      }
    }
    catch (error) {
      toast.error('Failed to submit review')
      console.error('Error submitting review:', error)
    }
    finally {
      setIsSubmitting(false)
    }
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

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3)

  return (
    <Card className="bg-card/50 border-border">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-foreground">Ratings & Reviews</CardTitle>
        {currentRating && ratingCount && (
          <div className="flex items-center gap-3">
            {renderStarRating(currentRating)}
            <span className="text-lg font-semibold">{currentRating.toFixed(1)}</span>
            <span className="text-muted-foreground">
              (
              {ratingCount}
              {' '}
              reviews)
            </span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* User Rating Section */}
        {session?.user
          ? (
              <div className="border-b border-border pb-6">
                <h3 className="text-lg font-medium mb-3">
                  {hasUserReviewed ? 'Your Review' : 'Rate This Template'}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      Rating
                    </label>
                    {renderStarRating(userRating, true, 'w-6 h-6')}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      Comment (optional)
                    </label>
                    <Textarea
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      placeholder="Share your thoughts about this template..."
                      className="min-h-[80px]"
                    />
                  </div>

                  <Button
                    onClick={handleSubmitReview}
                    disabled={isSubmitting || userRating === 0}
                    className="w-full bg-muted hover:bg-muted/80 text-foreground border border-border cursor-pointer"
                  >
                    {isSubmitting ? 'Submitting...' : hasUserReviewed ? 'Update Review' : 'Submit Review'}
                  </Button>
                </div>
              </div>
            )
          : (
              <div className="border-b border-border pb-6">
                <div className="text-center py-4 bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground">Sign in to rate and review this template</p>
                </div>
              </div>
            )}

        {/* Reviews List */}
        {reviews.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-4">Reviews</h3>
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
                    <span className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-foreground mt-2">{review.comment}</p>
                  )}
                </div>
              ))}

              {reviews.length > 3 && !showAllReviews && (
                <Button
                  variant="outline"
                  onClick={() => setShowAllReviews(true)}
                  className="w-full border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 cursor-pointer"
                >
                  Show all
                  {' '}
                  {reviews.length}
                  {' '}
                  reviews
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
