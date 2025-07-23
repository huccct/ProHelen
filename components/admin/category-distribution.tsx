'use client'

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const COLORS = [
  '#2563eb',
  '#16a34a',
  '#dc2626',
  '#ca8a04',
  '#9333ea',
  '#0891b2',
  '#be185d',
  '#854d0e',
]

interface CategoryDistributionProps {
  data: {
    category: string
    _count: number
  }[]
}

export function CategoryDistribution({ data }: CategoryDistributionProps) {
  const chartData = data.map(item => ({
    name: item.category,
    value: item._count,
  }))

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent ?? 0 * 100).toFixed(0)}%`}
        >
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
