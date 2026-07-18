'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { slugify } from '@/lib/utils'
import type { Product } from '@/lib/types'

interface Category {
  id: number
  name: string
  slug: string
}

export default function ProductForm({
  initial,
  categories,
}: {
  initial?: Product
  categories: Category[]
}) {
  const router = useRouter()
  const supabase = createClient()

  const [categoryId, setCategoryId] = useState(initial?.category_id ?? categories[0]?.id ?? 0)
  const [name, setName] = useState(initial?.name ?? '')
  const [weightGram, setWeightGram] = useState(initial?.weight_gram?.toString() ?? '')
  const [priceSell, setPriceSell] = useState(initial?.price_sell?.toString() ?? '')
  const [priceOriginal, setPriceOriginal] = useState(initial?.price_original?.toString() ?? '')
  const [priceBuyback, setPriceBuyback] = useState(initial?.price_buyback?.toString() ?? '')
  const [stock, setStock] = useState(initial?.stock?.toString() ?? '0')
  const [status, setStatus] = useState(initial?.status ?? 'ready')
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [isActive, setIsActive] = useState(initial?.is_active ?? true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const payload = {
      category_id: categoryId,
      name,
      slug: initial?.slug ?? slugify(name) + '-' + Date.now(),
      weight_gram: parseFloat(weightGram),
      price_sell: parseInt(priceSell, 10),
      price_original: priceOriginal ? parseInt(priceOriginal, 10) : null,
      price_buyback: priceBuyback ? parseInt(priceBuyback, 10) : null,
      stock: parseInt(stock, 10),
      status,
      image_url: imageUrl || null,
      description: description || null,
      is_active: isActive,
    }

    const { error } = initial
      ? await supabase.from('products').update(payload).eq('id', initial.id)
      : await supabase.from('products').insert(payload)

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/admin/produk')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 560 }}>
      <div>
        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
          Kategori
        </label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(Number(e.target.value))}
          required
          style={{ width: '100%', padding: 10, border: '1px solid var(--border)', borderRadius: 8 }}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
          Nama Produk
        </label>
        <input
          placeholder="Contoh: LM Antam 99.99% 5 gram"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ width: '100%', padding: 10, border: '1px solid var(--border)', borderRadius: 8 }}
        />
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
            Berat (gram)
          </label>
          <input
            type="number"
            step="0.001"
            placeholder="5"
            value={weightGram}
            onChange={(e) => setWeightGram(e.target.value)}
            required
            style={{ width: '100%', padding: 10, border: '1px solid var(--border)', borderRadius: 8 }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
            Stok
          </label>
          <input
            type="number"
            placeholder="10"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
            style={{ width: '100%', padding: 10, border: '1px solid var(--border)', borderRadius: 8 }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
            Harga Jual (Rp)
          </label>
          <input
            type="number"
            placeholder="2450000"
            value={priceSell}
            onChange={(e) => setPriceSell(e.target.value)}
            required
            style={{ width: '100%', padding: 10, border: '1px solid var(--border)', borderRadius: 8 }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
            Harga Buyback (Rp, opsional)
          </label>
          <input
            type="number"
            placeholder="2320000"
            value={priceBuyback}
            onChange={(e) => setPriceBuyback(e.target.value)}
            style={{ width: '100%', padding: 10, border: '1px solid var(--border)', borderRadius: 8 }}
          />
        </div>
      </div>

      <div>
        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
          Harga Coret (Rp, isi kalau sedang promo)
        </label>
        <input
          type="number"
          placeholder="Kosongkan kalau tidak ada diskon"
          value={priceOriginal}
          onChange={(e) => setPriceOriginal(e.target.value)}
          style={{ width: '100%', padding: 10, border: '1px solid var(--border)', borderRadius: 8 }}
        />
      </div>

      <div>
        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
          Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as 'ready' | 'preorder' | 'habis')}
          style={{ width: '100%', padding: 10, border: '1px solid var(--border)', borderRadius: 8 }}
        >
          <option value="ready">Ready</option>
          <option value="preorder">PreOrder</option>
          <option value="habis">Habis</option>
        </select>
      </div>

      <div>
        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
          URL Gambar (opsional)
        </label>
        <input
          placeholder="https://... atau /images/nama-file.png"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          style={{ width: '100%', padding: 10, border: '1px solid var(--border)', borderRadius: 8 }}
        />
      </div>

      <div>
        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
          Deskripsi (opsional)
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: '100%', padding: 10, border: '1px solid var(--border)', borderRadius: 8, fontFamily: 'inherit' }}
        />
      </div>

      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
        <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
        Tampilkan di katalog (aktif)
      </label>

      {error && (
        <p style={{ fontSize: 13, color: '#DC2626', background: '#FEF2F2', padding: '10px 12px', borderRadius: 8 }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: '12px 0',
          background: 'var(--gold)',
          border: 'none',
          borderRadius: 8,
          fontWeight: 700,
          cursor: loading ? 'default' : 'pointer',
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? 'Menyimpan...' : initial ? 'Simpan Perubahan' : 'Tambah Produk'}
      </button>
    </form>
  )
}