'use client'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

interface CheckInRecord {
  check_in_date: string
  weight: number
}

interface WeightChartProps {
  data: CheckInRecord[]
  targetWeight: number
}

export function WeightChart({ data, targetWeight }: WeightChartProps) {
  const formattedData = data.map((item) => ({
    date: new Date(item.check_in_date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
    }),
    Peso: item.weight,
    Meta: targetWeight,
  }))

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis dataKey="date" stroke="#71717a" fontSize={12} tickLine={false} />
          <YAxis stroke="#71717a" fontSize={12} tickLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
          <Tooltip
            contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px' }}
            itemStyle={{ color: '#f4f4f5' }}
            labelStyle={{ color: '#a1a1aa' }}
          />
          <Line type="monotone" dataKey="Peso" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: '#10b981' }} />
          <Line type="monotone" dataKey="Meta" stroke="#e11d48" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}