'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

interface StatusData {
  status: string
  count: number
  revenue: number
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Bekliyor', color: '#F59E0B' },
  PAYMENT_RECEIVED: { label: 'Ödeme Alındı', color: '#3B82F6' },
  PROCESSING: { label: 'Hazırlanıyor', color: '#8B5CF6' },
  SHIPPED: { label: 'Kargoda', color: '#6366F1' },
  DELIVERED: { label: 'Teslim Edildi', color: '#10B981' },
  CANCELLED: { label: 'İptal', color: '#FF3B5C' },
}

export function OrderStatusChart({ data }: { data: StatusData[] }) {
  const chartData = data.map((d) => ({
    name: STATUS_CONFIG[d.status]?.label || d.status,
    value: d.count,
    color: STATUS_CONFIG[d.status]?.color || '#A1A1A1',
  }))

  if (chartData.length === 0) {
    return (
      <div className="h-[280px] flex items-center justify-center text-sm text-[var(--muted-foreground)]">
        Henüz sipariş verisi yok
      </div>
    )
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ borderRadius: 12, border: '1px solid #1C1C1C', background: '#0D0D0D', color: '#FAFAFA', fontSize: 13 }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any, name: any) => [value, name]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-2 justify-center mt-2">
        {chartData.map((d, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-[var(--muted-foreground)]">{d.name}</span>
            <span className="font-semibold text-[var(--foreground)]">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
