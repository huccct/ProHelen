'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

const recentInstructions = [
  {
    id: '1',
    title: 'Study Plan Assistant',
    description: 'Helps create and maintain study schedules',
    lastUsed: '2 hours ago',
  },
  {
    id: '2',
    title: 'Time Management Helper',
    description: 'Assists with daily task prioritization',
    lastUsed: '1 day ago',
  },
  {
    id: '3',
    title: 'Career Path Advisor',
    description: 'Provides career development guidance',
    lastUsed: '3 days ago',
  },
]

export function RecentInstructions() {
  const router = useRouter()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recentInstructions.map((instruction, index) => (
        <motion.div
          key={instruction.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => router.push(`/builder/${instruction.id}`)}
        >
          <Card className="bg-zinc-900/50 border-gray-800 cursor-pointer hover:bg-zinc-900/70 transition-colors">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">{instruction.title}</CardTitle>
              <CardDescription className="text-base text-gray-300">{instruction.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-400">
                Last used:
                {instruction.lastUsed}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
