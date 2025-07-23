'use client'

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface UsageChartProps {
  data: {
    blockType: string
    usageCount: number
  }[]
}

export function UsageChart({ data }: UsageChartProps) {
  const chartData = data.map(item => ({
    name: item.blockType.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1),
    ).join(' '),
    value: item.usageCount,
  }))

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={value => `${value}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1f2937',
            border: 'none',
            borderRadius: '0.375rem',
            color: '#ffffff',
          }}
          wrapperStyle={{ outline: 'none' }}
          itemStyle={{ color: '#ffffff' }}
          labelStyle={{ color: '#ffffff' }}
        />
        <Bar
          dataKey="value"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
