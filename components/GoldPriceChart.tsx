'use client'

import { useState, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { formatRupiah } from '@/lib/utils'

interface PricePoint {
  price_date: string
  price_per_gram_sell: number
  price_per_gram_buyback: number
}

const RANGES = [
  { key: '7hari', label: '7 Hari', days: 7 },
  { key: '1bulan', label: '1 Bulan', days: 30 },
  { key: '3bulan', label: '3 Bulan', days: 90 },
  { key: '6bulan', label: '6 Bulan', days: 180 },
  { key: '1tahun', label: '1 Tahun', days: 365 },
]

export default function GoldPriceChart({ prices }: { prices: PricePoint[] }) {
  const [range, setRange] = useState('1bulan')
  const [mode, setMode] = useState<'sell' | 'buyback'>('sell')

  const filtered = useMemo(() => {
    const days = RANGES.find((r) => r.key === range)?.days ?? 30
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)
    return prices
      .filter((p) => new Date(p.price_date) >= cutoff)
      .map((p) => ({
        date: new Date(p.price_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
        value: mode === 'sell' ? p.price_per_gram_sell : p.price_per_gram_buyback,
      }))
  }, [prices, range, mode])

  return (
    <div style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 16, padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>Grafik Harga Emas</h3>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => setMode('sell')}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              border: 'none',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              background: mode === 'sell' ? 'var(--gold)' : 'transparent',
              color: mode === 'sell' ? 'var(--text)' : 'var(--muted)',
            }}
          >
            Harga Jual
          </button>
          <button
            onClick={() => setMode('buyback')}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              border: 'none',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              background: mode === 'buyback' ? 'var(--gold)' : 'transparent',
              color: mode === 'buyback' ? 'var(--text)' : 'var(--muted)',
            }}
          >
            Harga Buyback
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={filtered}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} minTickGap={30} />
          <YAxis
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            tickFormatter={(v) => `${(v / 1000000).toFixed(1)}jt`}
            width={50}
          />
          <Tooltip
            formatter={(value) => formatRupiah(Number(value))}
            contentStyle={{ background: '#1A1A2E', border: 'none', borderRadius: 8, fontSize: 13 }}
            labelStyle={{ color: '#9CA3AF' }}
          />
          <Line type="monotone" dataKey="value" stroke="#F5B400" strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>

      <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
        {RANGES.map((r) => (
          <button
            key={r.key}
            onClick={() => setRange(r.key)}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              background: range === r.key ? 'var(--text)' : 'transparent',
              color: range === r.key ? '#fff' : 'var(--muted)',
            }}
          >
            {r.label}
          </button>
        ))}
      </div>
    </div>
  )
}