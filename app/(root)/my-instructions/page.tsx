'use client'

import { NavBar } from '@/components/nav-bar'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { InstructionGrid } from './_components/instruction-grid'

export default function MyInstructionsPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'created' | 'updated' | 'usage'>('created')

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/20">
        <NavBar />
      </div>
      <main className="container mx-auto px-4 py-8 pt-28">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{t('myInstructions.title')}</h1>
            <Button
              onClick={() => router.push('/builder')}
              className="bg-primary text-primary-foreground font-semibold shadow-sm hover:bg-primary/90 cursor-pointer"
            >
              {t('myInstructions.createNewInstruction')}
            </Button>
          </div>

          <div className="flex items-center relative">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder={t('myInstructions.searchPlaceholder')}
                className="bg-card border border-border rounded-md py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-1 focus:ring-ring text-foreground"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <div className="ml-4 space-x-2">
              <Button
                variant="outline"
                onClick={() => setSortBy('created')}
                className={`cursor-pointer ${
                  sortBy === 'created' ? 'bg-muted border-border' : ''
                }`}
              >
                {t('myInstructions.dateCreated')}
              </Button>
              <Button
                variant="outline"
                onClick={() => setSortBy('usage')}
                className={`cursor-pointer ${
                  sortBy === 'usage' ? 'bg-muted border-border' : ''
                }`}
              >
                {t('myInstructions.mostUsed')}
              </Button>
            </div>
          </div>

          <InstructionGrid searchQuery={searchQuery} sortBy={sortBy} />
        </div>
      </main>
    </div>
  )
}
