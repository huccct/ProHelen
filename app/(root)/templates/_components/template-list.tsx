'use client'

import type { TemplateCategory } from '../page'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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

export function TemplateList({ searchQuery, category }: TemplateListProps) {
  const router = useRouter()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (category !== 'All')
        params.set('category', category)
      if (searchQuery)
        params.set('search', searchQuery)

      const response = await fetch(`/api/templates?${params}`)
      if (!response.ok)
        throw new Error('Failed to fetch templates')

      const data = await response.json()
      setTemplates(data.templates || [])
    }
    catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load templates')
    }
    finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchTemplates()
  }, [searchQuery, category])

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
          <Card key={i} className="border-gray-800 bg-gray-900/50 animate-pulse">
            <CardHeader className="p-6">
              <div className="h-6 bg-gray-700 rounded mb-2" />
              <div className="h-4 bg-gray-700 rounded mb-4" />
              <div className="flex gap-2 mb-4">
                <div className="h-6 w-16 bg-gray-700 rounded" />
                <div className="h-6 w-16 bg-gray-700 rounded" />
              </div>
              <div className="h-10 bg-gray-700 rounded" />
            </CardHeader>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">{error}</p>
        <Button onClick={fetchTemplates} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No templates found for your search criteria.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template, index) => (
        <motion.div
          key={template.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="border-gray-800 bg-gray-900/50 hover:bg-gray-900/70 transition-all duration-300 hover:border-gray-700 group cursor-pointer h-full flex flex-col">
            <CardHeader className="p-6 flex-1">
              <div className="flex items-start justify-between mb-3">
                <Badge
                  variant="secondary"
                  className="bg-purple-900/30 text-purple-300 border-purple-700"
                >
                  {template.category}
                </Badge>
                {template.isPremium && (
                  <Badge className="bg-yellow-900/30 text-yellow-300 border-yellow-700">
                    Premium
                  </Badge>
                )}
              </div>

              <CardTitle className="text-xl text-white group-hover:text-purple-300 transition-colors line-clamp-2">
                {template.title}
              </CardTitle>

              <CardDescription className="text-gray-400 leading-relaxed line-clamp-3 flex-1">
                {template.description}
              </CardDescription>

              {/* Statistics */}
              <div className="flex items-center gap-4 text-sm text-gray-500 mt-4">
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
                      className="text-xs border-gray-700 text-gray-400 hover:text-gray-300"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {template.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs border-gray-700 text-gray-400">
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
                  className="flex-1 border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 hover:bg-gray-800 cursor-pointer"
                  onClick={() => router.push(`/templates/${template.id}`)}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-white text-black hover:bg-gray-100 cursor-pointer"
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
  )
}
