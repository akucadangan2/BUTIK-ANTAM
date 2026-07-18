'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatRupiah } from '@/lib/utils'

export default function UpdateGoldPriceButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ sell: number; buyback: number } | null>(null)
  const [error, setError] = useState('')

  async function handleUpdate() {
    setLoading(true)
    setError('')
    setResult(null)

    const res = await fetch('/api/admin/update-gold-price', { method: 'POST' })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Gagal update harga')
      setLoading(false)
      return
    }

    setResult(data.updated)
    setLoading(false)
    router.refresh()
  }

  return (
    <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, padding: 22, marginBottom: 28 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>Harga Emas Referensi</p>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>
            Ambil harga terbaru dari sumber Antam untuk widget & grafik landing page.
          </p>
        </div>
        <button
          onClick={handleUpdate}
          disabled={loading}
          style={{
            padding: '10px 20px',
            background: 'var(--gold)',
            border: 'none',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 14,
            cursor: loading ? 'default' : 'pointer',
            opacity: loading ? 0.7 : 1,
            whiteSpace: 'nowrap',
          }}
        >
          {loading ? 'Memperbarui...' : 'Update Harga Sekarang'}
        </button>
      </div>

      {error && (
        <p style={{ fontSize: 13, color: '#DC2626', background: '#FEF2F2', padding: '10px 12px', borderRadius: 8, marginTop: 14 }}>
          {error}
        </p>
      )}

      {result && (
        <div style={{ display: 'flex', gap: 24, marginTop: 14, padding: '12px 14px', background: '#ECFDF5', borderRadius: 8 }}>
          <p style={{ fontSize: 13, color: '#065F46' }}>
            <strong>Jual:</strong> {formatRupiah(result.sell)}/gr
          </p>
          <p style={{ fontSize: 13, color: '#065F46' }}>
            <strong>Buyback:</strong> {formatRupiah(result.buyback)}/gr
          </p>
        </div>
      )}
    </div>
  )
}