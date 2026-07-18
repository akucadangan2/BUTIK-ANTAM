import { createClient } from '@/lib/supabase-server'
import ProductForm from '@/components/admin/ProductForm'
import { notFound } from 'next/navigation'

export default async function EditProdukPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: product } = await supabase.from('products').select('*').eq('id', id).single()
  const { data: categories } = await supabase
    .from('product_categories')
    .select('id, name, slug')
    .order('name', { ascending: true })

  if (!product) return notFound()

  return (
    <main style={{ padding: 40 }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', marginBottom: 24 }}>
        Edit Produk
      </h1>
      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, padding: 28 }}>
        <ProductForm initial={product} categories={categories ?? []} />
      </div>
    </main>
  )
}