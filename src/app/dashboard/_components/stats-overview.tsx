'use client'

import { Card, CardHeader } from '@/components/ui/card'
import { motion } from 'framer-motion'

const stats = [
  {
    title: 'Total Instructions',
    value: '12',
    change: '+2 this week',
  },
  {
    title: 'Active Templates',
    value: '5',
    change: '+1 this month',
  },
  {
    title: 'Completion Rate',
    value: '94%',
    change: '+5% vs last month',
  },
]

export function StatsOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-zinc-900/50 border-gray-800">
            <CardHeader>
              <h3 className="text-base font-medium text-gray-200">{stat.title}</h3>
              <div className="flex items-baseline mt-2">
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="ml-2 flex items-baseline text-sm font-semibold text-emerald-400">
                  {stat.change}
                </p>
              </div>
            </CardHeader>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
 