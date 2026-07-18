import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import ProductRow from '@/components/admin/ProductRow'
import type { Product } from '@/lib/types'

export default async function AdminProdukPage() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*, category:product_categories(name, slug)')
    .order('created_at', { ascending: false })

  return (
    <main style={{ padding: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)' }}>Kelola Produk</h1>
        <Link
          href="/admin/produk/baru"
          style={{ background: 'var(--gold)', color: 'var(--text)', padding: '11px 22px', borderRadius: 8, fontWeight: 700, fontSize: 14 }}
        >
          + Tambah Produk
        </Link>
      </div>

      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
          <thead>
            <tr style={{ textAlign: 'left', background: 'var(--bg-alt)' }}>
              <th style={{ padding: '12px 22px', fontSize: 12, color: 'var(--muted)', fontWeight: 700 }}>Nama</th>
              <th style={{ padding: '12px 22px', fontSize: 12, color: 'var(--muted)', fontWeight: 700 }}>Kategori</th>
              <th style={{ padding: '12px 22px', fontSize: 12, color: 'var(--muted)', fontWeight: 700 }}>Harga</th>
              <th style={{ padding: '12px 22px', fontSize: 12, color: 'var(--muted)', fontWeight: 700 }}>Stok</th>
              <th style={{ padding: '12px 22px', fontSize: 12, color: 'var(--muted)', fontWeight: 700 }}>Status</th>
              <th style={{ padding: '12px 22px', fontSize: 12, color: 'var(--muted)', fontWeight: 700 }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((p: Product) => (
              <ProductRow key={p.id} product={p} />
            ))}
            {(!products || products.length === 0) && (
              <tr>
                <td colSpan={6} style={{ padding: 30, textAlign: 'center', color: 'var(--muted)' }}>
                  Belum ada produk.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}