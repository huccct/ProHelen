'use client'

import { NavBar } from '@/components/nav-bar'
import { RecentInstructions } from './_components/recent-instructions'
import { StatsOverview } from './_components/stats-overview'
import { TemplateGrid } from './_components/template-grid'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
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
        <section>
          <h2 className="text-2xl font-semibold mb-6">Suggested Templates</h2>
          <TemplateGrid />
        </section>
      </main>
    </div>
  )
}
