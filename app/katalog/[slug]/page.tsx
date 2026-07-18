import { createClient } from '@/lib/supabase-server'
import { formatRupiah } from '@/lib/utils'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import AddToCartButton from '@/components/AddToCartButton'

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('*, category:product_categories(name, slug)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!product) return notFound()

  const discount = product.price_original
    ? Math.round((1 - product.price_sell / product.price_original) * 100)
    : null

  return (
    <main style={{ padding: 'clamp(20px, 5vw, 48px) clamp(16px, 5vw, 40px)', maxWidth: 1000, margin: '0 auto' }}>
      <Link href="/katalog" style={{ fontSize: 13, color: 'var(--muted)', display: 'inline-block', marginBottom: 20 }}>
        ← Kembali ke Katalog
      </Link>

      <div style={{ display: 'flex', gap: 'clamp(20px, 5vw, 40px)', flexWrap: 'wrap' }}>
        <div
          style={{
            flex: '1 1 320px',
            height: 'clamp(260px, 40vw, 400px)',
            borderRadius: 14,
            border: '1px solid var(--border)',
            background: product.image_url ? `url(${product.image_url}) center/contain no-repeat` : 'var(--bg-alt)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {!product.image_url && (
            <svg width="30%" height="30%" viewBox="0 0 56 56" fill="none">
              <rect x="10" y="18" width="36" height="24" rx="4" fill="var(--gold)" opacity="0.18" />
              <rect x="10" y="18" width="36" height="7" rx="3" fill="var(--gold)" opacity="0.35" />
              <circle cx="28" cy="32" r="6" fill="var(--gold)" opacity="0.3" />
            </svg>
          )}
        </div>

        <div style={{ flex: '1 1 320px' }}>
          <span style={{ fontSize: 12, color: 'var(--gold-dark)', fontWeight: 700, textTransform: 'uppercase' }}>
            {product.category?.name ?? 'Emas Antam'}
          </span>

          <h1 style={{ fontSize: 'clamp(22px, 4.5vw, 30px)', fontWeight: 800, color: 'var(--text)', margin: '8px 0 4px' }}>
            {product.name}
          </h1>

          <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 16 }}>
            {product.weight_gram} gram
          </p>

          {product.status === 'preorder' && (
            <span
              style={{
                display: 'inline-block',
                fontSize: 11,
                fontWeight: 700,
                textTransform: 'uppercase',
                background: '#1A1A2E',
                color: '#fff',
                padding: '4px 10px',
                borderRadius: 999,
                marginBottom: 16,
              }}
            >
              PreOrder
            </span>
          )}

          <div style={{ marginBottom: 20 }}>
            <div className="price" style={{ fontSize: 'clamp(24px, 5vw, 30px)', fontWeight: 800, color: 'var(--text)' }}>
              {formatRupiah(product.price_sell)}
            </div>
            {product.price_original && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                <span style={{ fontSize: 14, color: 'var(--muted)', textDecoration: 'line-through' }}>
                  {formatRupiah(product.price_original)}
                </span>
                {discount && (
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#16A34A' }}>Hemat {discount}%</span>
                )}
              </div>
            )}
          </div>

          {product.description && (
            <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 24 }}>
              {product.description}
            </p>
          )}

          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>
              Stok: <span style={{ color: 'var(--text)', fontWeight: 600 }}>
                {product.stock > 0 ? `${product.stock} tersedia` : 'Habis'}
              </span>
            </p>
            {product.price_buyback && (
              <p style={{ fontSize: 13, color: 'var(--muted)' }}>
                Harga Buyback: <span style={{ color: 'var(--text)', fontWeight: 600 }}>
                  {formatRupiah(product.price_buyback)}
                </span>
              </p>
            )}
          </div>

          <AddToCartButton product={product} />
        </div>
      </div>
    </main>
  )
}