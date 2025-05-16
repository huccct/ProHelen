'use client'

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

const templates = [
  {
    id: '1',
    title: 'SMART Goal Setting',
    description: 'Template for creating specific, measurable, achievable, relevant, and time-bound goals',
    category: 'Goal Setting',
  },
  {
    id: '2',
    title: 'Study Schedule',
    description: 'Structured template for creating personalized study plans',
    category: 'Education',
  },
  {
    id: '3',
    title: 'Career Planning',
    description: 'Guide for mapping out career development steps',
    category: 'Career',
  },
  {
    id: '4',
    title: 'Time Management',
    description: 'Framework for effective time allocation and task prioritization',
    category: 'Productivity',
  },
]

export function TemplateGrid() {
  const router = useRouter()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {templates.map((template, index) => (
        <motion.div
          key={template.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => router.push(`/templates/${template.id}`)}
        >
          <Card className="bg-zinc-900/50 border-gray-800 cursor-pointer hover:bg-zinc-900/70 transition-colors">
            <CardHeader>
              <div className="text-sm font-medium text-blue-400 mb-1">{template.category}</div>
              <CardTitle className="text-xl font-bold text-white">{template.title}</CardTitle>
              <CardDescription className="text-base text-gray-300 mt-2">{template.description}</CardDescription>
            </CardHeader>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
