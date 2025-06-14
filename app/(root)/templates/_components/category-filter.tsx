'use client'

import type { TemplateCategory } from '../page'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface CategoryFilterProps {
  activeCategory: TemplateCategory
  onCategoryChange: (category: TemplateCategory) => void
}

export function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
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
        // 如果API失败，使用默认分类
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
        {/* 加载状态的骨架屏 */}
        {[...Array.from({ length: 5 })].map((_, i) => (
          <div
            key={i}
            className="px-4 py-2 rounded-full bg-zinc-800 animate-pulse h-8 w-20"
          />
        ))}
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
              ? 'bg-white text-black hover:bg-gray-100'
              : 'bg-zinc-900 text-gray-300 hover:bg-zinc-800'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          {category}
        </motion.button>
      ))}
    </div>
  )
}
