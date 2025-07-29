'use client'

import type { TemplateCategory } from '@/types/templates'
import { getCategoryDisplayName } from '@/lib/utils'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface CategoryFilterProps {
  activeCategory: TemplateCategory
  onCategoryChange: (category: TemplateCategory) => void
}

export function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
  const { t } = useTranslation()
  const [categories, setCategories] = useState<TemplateCategory[]>(['All'])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/templates/categories')
        if (response.ok) {
          const data = await response.json()
          setCategories(data.categories || ['All'])
        }
      }
      catch (error) {
        console.error('Failed to fetch categories:', error)
        setCategories(['All', 'Goal Setting', 'Education', 'Career', 'Productivity'])
      }
      finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-wrap gap-3">
        {[...Array.from({ length: 5 })].map((_, i) => (
          <div
            key={i}
            className="px-4 py-2 rounded-full bg-muted animate-pulse h-8 w-20"
          />
        ))}
        <div className="text-sm text-muted-foreground self-center ml-2">
          {t('templates.filter.loading')}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-3">
      {categories.map(category => (
        <motion.button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
            activeCategory === category
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-card text-muted-foreground hover:bg-muted'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          {getCategoryDisplayName(category, t)}
        </motion.button>
      ))}
    </div>
  )
}
