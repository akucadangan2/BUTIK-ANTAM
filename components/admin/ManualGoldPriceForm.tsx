'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'

export default function ManualGoldPriceForm() {
  const router = useRouter()
  const supabase = createClient()

  const [sell, setSell] = useState('')
  const [buyback, setBuyback] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    const { error } = await supabase
      .from('gold_prices')
      .upsert(
        {
          price_date: new Date().toISOString().split('T')[0],
          price_per_gram_sell: parseInt(sell, 10),
          price_per_gram_buyback: parseInt(buyback, 10),
        },
        { onConflict: 'price_date' }
      )

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
    setSell('')
    setBuyback('')
    router.refresh()
  }

  return (
    <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, padding: 22, marginBottom: 28 }}>
      <p style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Update Harga Manual</p>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
        Isi harga per gram hari ini secara manual, kalau update otomatis sedang tidak tersedia.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: '1 1 160px' }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
            Harga Jual / gram
          </label>
          <input
            type="number"
            placeholder="2450000"
            value={sell}
            onChange={(e) => setSell(e.target.value)}
            required
            style={{ width: '100%', padding: 10, border: '1px solid var(--border)', borderRadius: 8 }}
          />
        </div>

        <div style={{ flex: '1 1 160px' }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
            Harga Buyback / gram
          </label>
          <input
            type="number"
            placeholder="2320000"
            value={buyback}
            onChange={(e) => setBuyback(e.target.value)}
            required
            style={{ width: '100%', padding: 10, border: '1px solid var(--border)', borderRadius: 8 }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 22px',
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
          {loading ? 'Menyimpan...' : 'Simpan Harga'}
        </button>
      </form>

      {error && (
        <p style={{ fontSize: 13, color: '#DC2626', background: '#FEF2F2', padding: '10px 12px', borderRadius: 8, marginTop: 12 }}>
          {error}
        </p>
      )}
      {success && (
        <p style={{ fontSize: 13, color: '#065F46', background: '#ECFDF5', padding: '10px 12px', borderRadius: 8, marginTop: 12 }}>
          Harga hari ini berhasil disimpan.
        </p>
      )}
    </div>
  )
}