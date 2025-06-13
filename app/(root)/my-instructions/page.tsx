'use client'

import { NavBar } from '@/components/nav-bar'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { InstructionGrid } from './_components/instruction-grid'

export default function MyInstructionsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800/20">
        <NavBar />
      </div>
      <main className="container mx-auto px-4 py-8 pt-28">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">My Instructions</h1>
            <Button
              onClick={() => router.push('/builder')}
              className="bg-white text-black font-semibold shadow-sm hover:bg-gray-100 cursor-pointer"
            >
              Create New Instruction
            </Button>
          </div>

          <div className="flex items-center relative">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search instructions..."
                className="bg-zinc-900 border border-gray-800 rounded-md py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-1 focus:ring-gray-200 text-white"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <div className="ml-4 space-x-2">
              <Button
                variant="outline"
                className="border-gray-700 text-white hover:text-white hover:border-gray-500 hover:bg-zinc-800 cursor-pointer"
              >
                Date Created
              </Button>
              <Button
                variant="outline"
                className="border-gray-700 text-white hover:text-white hover:border-gray-500 hover:bg-zinc-800 cursor-pointer"
              >
                Most Used
              </Button>
            </div>
          </div>

          <InstructionGrid searchQuery={searchQuery} />
        </div>
      </main>
    </div>
  )
}
