'use client'

import { NavBar } from '@/components/nav-bar'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { RecentInstructions } from './_components/recent-instructions'
import { StatsOverview } from './_components/stats-overview'
import { TemplateGrid } from './_components/template-grid'

export default function DashboardPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800/20">
        <NavBar />
      </div>
      <main className="container mx-auto px-4 py-8 pt-28">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {/* Stats Overview Section */}
        <section className="mb-12">
          <StatsOverview />
        </section>

        {/* Recent Instructions Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Recent Instructions</h2>
          <RecentInstructions />
        </section>

        {/* Template Suggestions Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Suggested Templates</h2>
            <Button
              className="bg-white text-black font-semibold shadow-sm hover:bg-gray-100 cursor-pointer"
              onClick={() => router.push('/templates')}
            >
              View All Templates
            </Button>
          </div>
          <TemplateGrid />
        </section>
      </main>
    </div>
  )
}
