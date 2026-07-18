import { createClient } from '@/lib/supabase-server'
import ProductForm from '@/components/admin/ProductForm'

export default async function TambahProdukPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from('product_categories')
    .select('id, name, slug')
    .order('name', { ascending: true })

  return (
    <main style={{ padding: 40 }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', marginBottom: 24 }}>
        Tambah Produk Baru
      </h1>
      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, padding: 28 }}>
        <ProductForm categories={categories ?? []} />
      </div>
    </main>
  )
}