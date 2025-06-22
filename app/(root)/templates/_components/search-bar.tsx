'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IoSearch } from 'react-icons/io5'

interface SearchBarProps {
  onSearch: (query: string) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const { t } = useTranslation()
  const [localQuery, setLocalQuery] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocalQuery(value)
    onSearch(value)
  }

  return (
    <div className="relative w-full md:w-64">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <IoSearch className="w-5 h-5 text-muted-foreground" />
      </div>
      <input
        type="text"
        value={localQuery}
        onChange={handleChange}
        className="w-full p-3 pl-10 text-sm bg-card border border-border rounded-lg focus:ring-ring focus:border-ring text-foreground placeholder-muted-foreground"
        placeholder={t('templates.searchPlaceholder')}
      />
    </div>
  )
}
