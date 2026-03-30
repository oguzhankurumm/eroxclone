'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Props {
  data: Array<{ date: string; revenue: number; orders: number }>
}

export function RevenueChart({ data }: Props) {
  const formatted = data.map((d) => ({
    ...d,
    date: new Date(d.date).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' }),
  }))

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={formatted} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FB4D8A" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#FB4D8A" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#77777b' }} />
        <YAxis tick={{ fontSize: 11, fill: '#77777b' }} tickFormatter={(v) => `₺${(v / 1000).toFixed(0)}k`} />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: '1px solid #eee', fontSize: 13 }}
          formatter={(value: number, name: string) => [
            name === 'revenue' ? `₺${value.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}` : value,
            name === 'revenue' ? 'Gelir' : 'Sipariş',
          ]}
          labelStyle={{ fontWeight: 600, color: '#003033' }}
        />
        <Area type="monotone" dataKey="revenue" stroke="#FB4D8A" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
