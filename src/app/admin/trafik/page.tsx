'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Globe, Smartphone, Monitor, Tablet, Eye, Users, TrendingUp,
  ArrowUpRight, ArrowDownRight, Clock, MousePointerClick, RefreshCw,
  Search, ExternalLink, BarChart3, Activity
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

interface TrafikStats {
  overview: {
    totalViews: number
    uniqueSessions: number
    todayViews: number
    yesterdayViews: number
    avgViewsPerSession: number
  }
  bySource: Array<{ source: string; count: number }>
  byDevice: Array<{ device: string; count: number }>
  byBrowser: Array<{ browser: string; count: number }>
  byOS: Array<{ os: string; count: number }>
  byMedium: Array<{ medium: string; count: number }>
  byCampaign: Array<{ campaign: string; count: number }>
  topPages: Array<{ path: string; count: number; unique_sessions: number }>
  dailyViews: Array<{ date: string; views: number; sessions: number }>
  hourlyToday: Array<{ hour: number; count: number }>
  recentViews: Array<{
    id: string; path: string; source: string | null; medium: string | null
    campaign: string | null; device: string | null; browser: string | null
    os: string | null; referrer: string | null; createdAt: string
  }>
}

const SOURCE_COLORS: Record<string, string> = {
  google: '#4285F4',
  facebook: '#1877F2',
  instagram: '#E4405F',
  twitter: '#1DA1F2',
  youtube: '#FF0000',
  tiktok: '#E8E8E8',
  direct: '#10B981',
  referral: '#8B5CF6',
  bing: '#008373',
  yandex: '#FF0000',
  pinterest: '#E60023',
  linkedin: '#0A66C2',
  other: '#6B7280',
}

const SOURCE_LABELS: Record<string, string> = {
  google: 'Google',
  facebook: 'Facebook',
  instagram: 'Instagram',
  twitter: 'Twitter / X',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  direct: 'Direkt',
  referral: 'Referans',
  bing: 'Bing',
  yandex: 'Yandex',
  pinterest: 'Pinterest',
  linkedin: 'LinkedIn',
  organic: 'Organik',
  social: 'Sosyal Medya',
  cpc: 'Reklam (CPC)',
  none: 'Dogrudan',
}

const DEVICE_ICONS: Record<string, React.ElementType> = {
  mobile: Smartphone,
  tablet: Tablet,
  desktop: Monitor,
}

const PIE_COLORS = ['#FB4D8A', '#3B82F6', '#4285F4', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4', '#EC4899', '#14B8A6']

function SourceIcon({ source }: { source: string }) {
  if (source === 'google') return <Search className="w-4 h-4" />
  return <Globe className="w-4 h-4" />
}

async function fetchTrafikStats(days: number): Promise<TrafikStats> {
  const res = await fetch(`/api/admin/trafik?days=${days}`)
  if (!res.ok) throw new Error('Trafik verileri yuklenemedi')
  return res.json()
}

export default function TrafikPage() {
  const [days, setDays] = useState(30)

  const { data: stats, isLoading, isError, error, isFetching, refetch } = useQuery({
    queryKey: ['admin-trafik', days],
    queryFn: () => fetchTrafikStats(days),
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)] animate-pulse">
              <div className="h-4 bg-[var(--surface-3)] rounded w-24 mb-4" />
              <div className="h-8 bg-[var(--surface-3)] rounded w-32 mb-2" />
              <div className="h-3 bg-[var(--surface-3)] rounded w-20" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)] h-[400px] animate-pulse">
              <div className="h-5 bg-[var(--surface-3)] rounded w-40 mb-6" />
              <div className="h-[320px] bg-[var(--surface-3)] rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (isError || !stats) {
    return (
      <div className="text-center py-20">
        <p className="text-[var(--muted-foreground)]">{error instanceof Error ? error.message : 'Trafik verileri yuklenemedi'}</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-sm font-medium hover:bg-[var(--primary)]/80 transition"
        >
          Tekrar Dene
        </button>
      </div>
    )
  }

  const todayChange = stats.overview.yesterdayViews === 0
    ? (stats.overview.todayViews > 0 ? 100 : 0)
    : ((stats.overview.todayViews - stats.overview.yesterdayViews) / stats.overview.yesterdayViews * 100)
  const todayPositive = todayChange >= 0

  const dailyData = stats.dailyViews.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
  }))

  const hourlyData = Array.from({ length: 24 }, (_, i) => {
    const found = stats.hourlyToday.find((h) => h.hour === i)
    return { hour: `${i.toString().padStart(2, '0')}:00`, count: found?.count || 0 }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[var(--foreground)]">Trafik Analizi</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-0.5">Google, Facebook, Instagram ve diger kaynaklardan gelen trafik</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2 rounded-xl border border-[var(--border)] hover:bg-[var(--surface-2)] transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-[var(--muted-foreground)] ${isFetching ? 'animate-spin' : ''}`} />
          </button>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="px-3 py-2 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--foreground)] bg-[var(--card)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]"
          >
            <option value={7}>Son 7 gun</option>
            <option value={14}>Son 14 gun</option>
            <option value={30}>Son 30 gun</option>
            <option value={60}>Son 60 gun</option>
            <option value={90}>Son 90 gun</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[var(--card)] rounded-xl p-5 border border-[var(--border)] hover:border-[var(--surface-4)] transition">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <span className={`flex items-center gap-0.5 text-xs font-semibold ${todayPositive ? 'text-green-600' : 'text-red-500'}`}>
              {todayPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {todayChange >= 0 ? '+' : ''}{todayChange.toFixed(0)}%
            </span>
          </div>
          <p className="text-2xl font-bold text-[var(--foreground)]">{stats.overview.todayViews.toLocaleString('tr-TR')}</p>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">Bugunki Goruntulenme</p>
          <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">Dun: {stats.overview.yesterdayViews.toLocaleString('tr-TR')}</p>
        </div>

        <div className="bg-[var(--card)] rounded-xl p-5 border border-[var(--border)] hover:border-[var(--surface-4)] transition">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[var(--foreground)]">{stats.overview.totalViews.toLocaleString('tr-TR')}</p>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">Toplam Goruntulenme</p>
          <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">Son {days} gun</p>
        </div>

        <div className="bg-[var(--card)] rounded-xl p-5 border border-[var(--border)] hover:border-[var(--surface-4)] transition">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[var(--foreground)]">{stats.overview.uniqueSessions.toLocaleString('tr-TR')}</p>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">Tekil Ziyaretci</p>
          <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">Son {days} gun</p>
        </div>

        <div className="bg-[var(--card)] rounded-xl p-5 border border-[var(--border)] hover:border-[var(--surface-4)] transition">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <MousePointerClick className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[var(--foreground)]">{stats.overview.avgViewsPerSession}</p>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">Ort. Sayfa / Oturum</p>
          <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">Son {days} gun</p>
        </div>
      </div>

      {/* Row 2: Daily Views Chart + Traffic Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-[var(--primary)]" />
            <h3 className="text-base font-bold text-[var(--foreground)]">Gunluk Trafik</h3>
          </div>
          {dailyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FB4D8A" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FB4D8A" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="sessionsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1C1C1C" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#A1A1A1' }} stroke="#1C1C1C" />
                <YAxis tick={{ fontSize: 11, fill: '#A1A1A1' }} stroke="#1C1C1C" />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #1C1C1C', background: '#0D0D0D', color: '#FAFAFA', fontSize: 13 }}
                  labelStyle={{ fontWeight: 600, color: '#FAFAFA' }}
                  formatter={(value, name) => [Number(value).toLocaleString('tr-TR'), name === 'views' ? 'Goruntulenme' : 'Oturum']}
                />
                <Legend formatter={(value) => value === 'views' ? 'Goruntulenme' : 'Oturum'} />
                <Area type="monotone" dataKey="views" stroke="#FB4D8A" fill="url(#viewsGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="sessions" stroke="#3B82F6" fill="url(#sessionsGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-sm text-[var(--muted-foreground)]">Henuz veri yok</div>
          )}
        </div>

        <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-[var(--primary)]" />
            <h3 className="text-base font-bold text-[var(--foreground)]">Trafik Kaynaklari</h3>
          </div>
          {stats.bySource.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={stats.bySource}
                    dataKey="count"
                    nameKey="source"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {stats.bySource.map((entry, i) => (
                      <Cell key={entry.source} fill={SOURCE_COLORS[entry.source] || PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #1C1C1C', background: '#0D0D0D', color: '#FAFAFA', fontSize: 13 }} labelStyle={{ fontWeight: 600, color: '#FAFAFA' }} formatter={(value) => Number(value).toLocaleString('tr-TR')} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {stats.bySource.map((s) => {
                  const pct = stats.overview.totalViews > 0 ? (s.count / stats.overview.totalViews * 100).toFixed(1) : '0'
                  return (
                    <div key={s.source} className="flex items-center gap-2 text-sm">
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: SOURCE_COLORS[s.source] || '#6B7280' }}
                      />
                      <SourceIcon source={s.source} />
                      <span className="flex-1 text-[var(--foreground)] font-medium truncate">
                        {SOURCE_LABELS[s.source] || s.source}
                      </span>
                      <span className="text-[var(--muted-foreground)] text-xs">{pct}%</span>
                      <span className="font-semibold text-[var(--foreground)] w-12 text-right">{s.count.toLocaleString('tr-TR')}</span>
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-sm text-[var(--muted-foreground)]">Henuz veri yok</div>
          )}
        </div>
      </div>

      {/* Row 3: Hourly Chart + Device/Browser/OS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-[var(--primary)]" />
            <h3 className="text-base font-bold text-[var(--foreground)]">Bugun Saatlik Dagilim</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1C1C1C" />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#A1A1A1' }} stroke="#1C1C1C" interval={2} />
              <YAxis tick={{ fontSize: 11, fill: '#A1A1A1' }} stroke="#1C1C1C" />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid #1C1C1C', background: '#0D0D0D', color: '#FAFAFA', fontSize: 13 }}
                labelStyle={{ fontWeight: 600, color: '#FAFAFA' }}
                formatter={(value) => [Number(value).toLocaleString('tr-TR'), 'Goruntulenme']}
              />
              <Bar dataKey="count" fill="#FB4D8A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
          <div className="flex items-center gap-2 mb-4">
            <Smartphone className="w-5 h-5 text-[var(--primary)]" />
            <h3 className="text-base font-bold text-[var(--foreground)]">Cihaz & Tarayici</h3>
          </div>

          <div className="mb-5">
            <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-2">Cihaz</p>
            <div className="space-y-2">
              {stats.byDevice.map((d) => {
                const Icon = DEVICE_ICONS[d.device] || Monitor
                const pct = stats.overview.totalViews > 0 ? (d.count / stats.overview.totalViews * 100) : 0
                return (
                  <div key={d.device}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="flex items-center gap-2 text-[var(--foreground)] font-medium">
                        <Icon className="w-4 h-4" />
                        {d.device === 'mobile' ? 'Mobil' : d.device === 'tablet' ? 'Tablet' : 'Masaustu'}
                      </span>
                      <span className="text-[var(--muted-foreground)] text-xs">{d.count.toLocaleString('tr-TR')} ({pct.toFixed(0)}%)</span>
                    </div>
                    <div className="h-2 bg-[var(--surface-3)] rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--primary)] rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mb-5">
            <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-2">Tarayici</p>
            <div className="space-y-1.5">
              {stats.byBrowser.slice(0, 5).map((b) => {
                const pct = stats.overview.totalViews > 0 ? (b.count / stats.overview.totalViews * 100) : 0
                return (
                  <div key={b.browser} className="flex items-center justify-between text-sm">
                    <span className="text-[var(--foreground)]">{b.browser}</span>
                    <span className="text-[var(--muted-foreground)] text-xs">{b.count.toLocaleString('tr-TR')} ({pct.toFixed(0)}%)</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-2">Isletim Sistemi</p>
            <div className="space-y-1.5">
              {stats.byOS.slice(0, 5).map((o) => {
                const pct = stats.overview.totalViews > 0 ? (o.count / stats.overview.totalViews * 100) : 0
                return (
                  <div key={o.os} className="flex items-center justify-between text-sm">
                    <span className="text-[var(--foreground)]">{o.os}</span>
                    <span className="text-[var(--muted-foreground)] text-xs">{o.count.toLocaleString('tr-TR')} ({pct.toFixed(0)}%)</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Medium breakdown + Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="p-5 border-b border-[var(--border)] flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[var(--primary)]" />
            <h3 className="text-base font-bold text-[var(--foreground)]">Trafik Turu (Medium)</h3>
          </div>
          {stats.byMedium.length > 0 ? (
            <div className="p-5">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.byMedium} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1C1C1C" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#A1A1A1' }} stroke="#1C1C1C" />
                  <YAxis
                    type="category"
                    dataKey="medium"
                    tick={{ fontSize: 12, fill: '#A1A1A1' }}
                    stroke="#1C1C1C"
                    width={80}
                    tickFormatter={(v) => SOURCE_LABELS[v] || v}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: '1px solid #1C1C1C', background: '#0D0D0D', color: '#FAFAFA', fontSize: 13 }}
                    labelStyle={{ fontWeight: 600, color: '#FAFAFA' }}
                    formatter={(value) => [Number(value).toLocaleString('tr-TR'), 'Goruntulenme']}
                    labelFormatter={(label) => SOURCE_LABELS[label as string] || label}
                  />
                  <Bar dataKey="count" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-[var(--muted-foreground)]">Henuz veri yok</div>
          )}
        </div>

        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="p-5 border-b border-[var(--border)] flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-[var(--primary)]" />
            <h3 className="text-base font-bold text-[var(--foreground)]">Kampanyalar (UTM)</h3>
          </div>
          {stats.byCampaign.length > 0 ? (
            <div className="divide-y divide-[var(--border)]">
              {stats.byCampaign.map((c, i) => (
                <div key={c.campaign} className="flex items-center gap-3 px-5 py-3 hover:bg-[var(--surface-2)]">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    i < 3 ? 'bg-[var(--primary)] text-white' : 'bg-[var(--surface-3)] text-[var(--muted-foreground)]'
                  }`}>
                    {i + 1}
                  </span>
                  <span className="flex-1 text-sm font-medium text-[var(--foreground)] truncate">{c.campaign}</span>
                  <span className="text-sm font-semibold text-[var(--foreground)]">{c.count.toLocaleString('tr-TR')}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-[var(--muted-foreground)]">
              Henuz UTM kampanyasi yok
              <p className="text-xs mt-1 text-[var(--muted-foreground)]/70">Linklerinize ?utm_campaign=isim ekleyin</p>
            </div>
          )}
        </div>
      </div>

      {/* Row 5: Top Pages */}
      <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="p-5 border-b border-[var(--border)] flex items-center gap-2">
          <Eye className="w-5 h-5 text-[var(--primary)]" />
          <h3 className="text-base font-bold text-[var(--foreground)]">En Cok Ziyaret Edilen Sayfalar</h3>
        </div>
        {stats.topPages.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)] text-left">
                  <th className="px-5 py-2.5 text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">#</th>
                  <th className="px-5 py-2.5 text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Sayfa</th>
                  <th className="px-5 py-2.5 text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider text-right">Goruntulenme</th>
                  <th className="px-5 py-2.5 text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider text-right">Tekil Ziyaretci</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {stats.topPages.map((p, i) => (
                  <tr key={p.path} className="hover:bg-[var(--surface-2)]">
                    <td className="px-5 py-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        i < 3 ? 'bg-[var(--primary)] text-white' : 'bg-[var(--surface-3)] text-[var(--muted-foreground)]'
                      }`}>
                        {i + 1}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm font-medium text-[var(--foreground)] font-mono">{p.path}</td>
                    <td className="px-5 py-3 text-sm font-semibold text-[var(--foreground)] text-right">{p.count.toLocaleString('tr-TR')}</td>
                    <td className="px-5 py-3 text-sm text-[var(--muted-foreground)] text-right">{p.unique_sessions.toLocaleString('tr-TR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-sm text-[var(--muted-foreground)]">Henuz veri yok</div>
        )}
      </div>

      {/* Row 6: Recent visits log */}
      <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="p-5 border-b border-[var(--border)] flex items-center gap-2">
          <Activity className="w-5 h-5 text-[var(--primary)]" />
          <h3 className="text-base font-bold text-[var(--foreground)]">Son Ziyaretler (Canli)</h3>
        </div>
        {stats.recentViews.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)] text-left">
                  <th className="px-4 py-2.5 text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Zaman</th>
                  <th className="px-4 py-2.5 text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Sayfa</th>
                  <th className="px-4 py-2.5 text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Kaynak</th>
                  <th className="px-4 py-2.5 text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Cihaz</th>
                  <th className="px-4 py-2.5 text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Tarayici</th>
                  <th className="px-4 py-2.5 text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">Referrer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {stats.recentViews.map((v) => (
                  <tr key={v.id} className="hover:bg-[var(--surface-2)] text-xs">
                    <td className="px-4 py-2.5 text-[var(--muted-foreground)] whitespace-nowrap">
                      {new Date(v.createdAt).toLocaleString('tr-TR', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-[var(--foreground)] font-medium max-w-[200px] truncate">{v.path}</td>
                    <td className="px-4 py-2.5">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
                        style={{ backgroundColor: SOURCE_COLORS[v.source || 'other'] || '#6B7280' }}
                      >
                        {SOURCE_LABELS[v.source || 'other'] || v.source}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-[var(--muted-foreground)] capitalize">{v.device === 'mobile' ? 'Mobil' : v.device === 'desktop' ? 'Masaustu' : v.device}</td>
                    <td className="px-4 py-2.5 text-[var(--muted-foreground)]">{v.browser} / {v.os}</td>
                    <td className="px-4 py-2.5 text-[var(--muted-foreground)] max-w-[200px] truncate">{v.referrer || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-sm text-[var(--muted-foreground)]">Henuz ziyaret verisi yok</div>
        )}
      </div>
    </div>
  )
}
