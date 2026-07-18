'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { formatRupiah } from '@/lib/utils'
import type { Product } from '@/lib/types'

export default function ProductRow({ product }: { product: Product }) {
  const router = useRouter()
  const supabase = createClient()

  async function handleDelete() {
    if (!confirm(`Hapus produk "${product.name}"?`)) return
    await supabase.from('products').delete().eq('id', product.id)
    router.refresh()
  }

  return (
    <tr style={{ borderTop: '1px solid var(--border)' }}>
      <td style={{ padding: '14px 22px', fontSize: 14, color: 'var(--text)', fontWeight: 600 }}>{product.name}</td>
      <td style={{ padding: '14px 22px', fontSize: 13, color: 'var(--muted)' }}>{product.category?.name ?? '-'}</td>
      <td style={{ padding: '14px 22px', fontSize: 14, color: 'var(--text)' }}>{formatRupiah(product.price_sell)}</td>
      <td style={{ padding: '14px 22px', fontSize: 14, color: 'var(--muted)' }}>{product.stock}</td>
      <td style={{ padding: '14px 22px' }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            padding: '3px 9px',
            borderRadius: 999,
            background: product.is_active ? '#D1FAE5' : '#F3F4F6',
            color: product.is_active ? '#065F46' : '#6B7280',
          }}
        >
          {product.is_active ? 'Aktif' : 'Nonaktif'}
        </span>
      </td>
      <td style={{ padding: '14px 22px', display: 'flex', gap: 14 }}>
        <Link href={`/admin/produk/${product.id}`} style={{ color: 'var(--gold-dark)', fontWeight: 700, fontSize: 13 }}>
          Edit
        </Link>
        <button
          onClick={handleDelete}
          style={{ color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}
        >
          Hapus
        </button>
      </td>
    </tr>
  )
}