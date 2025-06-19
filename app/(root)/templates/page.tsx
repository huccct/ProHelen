'use client'

import { NavBar } from '@/components/nav-bar'
import { useState } from 'react'
import { CategoryFilter } from './_components/category-filter'
import { SearchBar } from './_components/search-bar'
import { TemplateList } from './_components/template-list'

// template categories - now dynamic from database
export type TemplateCategory = string

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<TemplateCategory>('All')

  // handle search query change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  // handle category filter change
  const handleCategoryChange = (category: TemplateCategory) => {
    setActiveCategory(category)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/20">
        <NavBar />
      </div>
      <main className="container mx-auto px-4 py-8 pt-28">
        <div className="flex flex-col space-y-6">
          <h1 className="text-3xl font-bold">Templates</h1>

          <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
            <p className="text-muted-foreground max-w-2xl">
              Choose from our pre-built templates to quickly create customized instructions
              for different educational and productivity needs.
            </p>
            <SearchBar onSearch={handleSearchChange} />
          </div>

          <CategoryFilter
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />

          <TemplateList
            searchQuery={searchQuery}
            category={activeCategory}
          />
        </div>
      </main>
    </div>
  )
}
