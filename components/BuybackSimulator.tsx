'use client'

import { useState, useMemo } from 'react'
import { formatRupiah } from '@/lib/utils'
import type { Product } from '@/lib/types'

interface Category {
  id: number
  name: string
  slug: string
}

export default function BuybackSimulator({
  categories,
  products,
}: {
  categories: Category[]
  products: Product[]
}) {
  const [categoryId, setCategoryId] = useState<number | ''>('')
  const [weight, setWeight] = useState<number | ''>('')

  const availableWeights = useMemo(() => {
    if (!categoryId) return []
    return products
      .filter((p) => p.category_id === categoryId)
      .map((p) => p.weight_gram)
      .sort((a, b) => a - b)
  }, [categoryId, products])

  const result = useMemo(() => {
    if (!categoryId || !weight) return null
    return products.find((p) => p.category_id === categoryId && p.weight_gram === weight) ?? null
  }, [categoryId, weight, products])

  return (
    <div
      style={{
        background: 'var(--bg-alt)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        padding: 28,
        display: 'flex',
        gap: 32,
        flexWrap: 'wrap',
      }}
    >
      <div style={{ flex: '1 1 260px' }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)', marginBottom: 16 }}>
          Simulasi Harga Jual (Buyback)
        </h3>

        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>
          Merek
        </label>
        <select
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value ? Number(e.target.value) : '')
            setWeight('')
          }}
          style={{ width: '100%', padding: 10, border: '1px solid var(--border)', borderRadius: 8, marginBottom: 14, fontSize: 14 }}
        >
          <option value="">- Pilih Merek -</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>
          Pecahan
        </label>
        <select
          value={weight}
          onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : '')}
          disabled={!categoryId}
          style={{ width: '100%', padding: 10, border: '1px solid var(--border)', borderRadius: 8, fontSize: 14 }}
        >
          <option value="">- Pilih Pecahan -</option>
          {availableWeights.map((w) => (
            <option key={w} value={w}>{w} gram</option>
          ))}
        </select>
      </div>

      <div style={{ flex: '1 1 260px', borderLeft: '1px solid var(--border)', paddingLeft: 32 }}>
        <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--muted)', marginBottom: 12 }}>
          Hasil Simulasi
        </h4>
        {result ? (
          <>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>
              {result.category?.name} — {result.weight_gram} gram
            </p>
            <p className="price" style={{ fontSize: 24, fontWeight: 800, color: 'var(--gold-dark)' }}>
              {result.price_buyback ? formatRupiah(result.price_buyback) : 'Belum tersedia'}
            </p>
          </>
        ) : (
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>
            Pilih merek dan pecahan untuk melihat estimasi harga buyback.
          </p>
        )}
        <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 16, lineHeight: 1.6 }}>
          Harga buyback akan disesuaikan dengan kondisi fisik barang saat diterima.
          Keputusan akhir harga berada di pihak Butik Antam.
        </p>
      </div>
    </div>
  )
}