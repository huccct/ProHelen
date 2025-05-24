'use client'

import type { TemplateCategory } from '../page'
import { motion } from 'framer-motion'

interface CategoryFilterProps {
  activeCategory: TemplateCategory
  onCategoryChange: (category: TemplateCategory) => void
}

const categories: TemplateCategory[] = ['All', 'Goal Setting', 'Education', 'Career', 'Productivity']

export function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
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
