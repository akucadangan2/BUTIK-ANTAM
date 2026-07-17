import { createClient } from '@/lib/supabase-server'
import ProductCard from '@/components/ProductCard'
import KatalogBanner from '@/components/KatalogBanner'
import CheckoutSteps from '@/components/CheckoutSteps'
import type { Product } from '@/lib/types'

export default async function KatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>
}) {
  const { kategori } = await searchParams
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('product_categories')
    .select('id, name, slug')
    .order('name', { ascending: true })

  let query = supabase
    .from('products')
    .select('*, category:product_categories(name, slug)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (kategori) {
    const cat = categories?.find((c) => c.slug === kategori)
    if (cat) query = query.eq('category_id', cat.id)
  }

  const { data: products, error } = await query

  if (error) {
    return <div style={{ padding: 40 }}>Error: {error.message}</div>
  }

  const promoProducts = products?.filter((p: Product) => p.price_original) ?? []
  const regularProducts = products?.filter((p: Product) => !p.price_original) ?? []

  const sectionPad = 'clamp(16px, 5vw, 40px)'

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto' }}>
      <style>{`
        .katalog-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        @media (min-width: 480px) {
          .katalog-grid { grid-template-columns: repeat(3, 1fr); gap: 16px; }
        }
        @media (min-width: 700px) {
          .katalog-grid { grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 20px; }
        }
      `}</style>

      <KatalogBanner />
      <CheckoutSteps current="katalog" />

      {/* Banner PRODUK KAMI */}
      <div
        style={{
          background: 'var(--gold)',
          padding: `clamp(14px, 3vw, 22px) ${sectionPad}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1 style={{ fontSize: 'clamp(16px, 3vw, 22px)', fontWeight: 800, color: '#1A1A2E', letterSpacing: '0.02em', margin: 0 }}>
          PRODUK KAMI
        </h1>
        <span style={{ fontSize: 20 }}>🛒</span>
      </div>

      <div style={{ padding: `clamp(20px, 5vw, 32px) ${sectionPad} clamp(32px, 6vw, 56px)` }}>
        <p style={{ color: 'var(--muted)', marginBottom: 20, maxWidth: 480, fontSize: 'clamp(13px, 2vw, 15px)' }}>
          Emas 99.99% asli dengan sertifikat resmi. Barang dapat diambil H+1
          setelah konfirmasi pembayaran.
        </p>

        {/* Filter kategori */}
        <form method="GET" style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
          <select
            name="kategori"
            defaultValue={kategori ?? ''}
            style={{
              padding: '10px 14px',
              border: '1px solid var(--border)',
              borderRadius: 8,
              fontSize: 14,
              flex: '1 1 180px',
              minWidth: 0,
            }}
          >
            <option value="">-Semua-</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
          <button
            type="submit"
            style={{
              background: 'var(--gold)',
              border: 'none',
              padding: '10px 22px',
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            Cari
          </button>
        </form>

        {(!products || products.length === 0) && (
          <p style={{ color: 'var(--muted)' }}>Tidak ada produk pada kategori ini.</p>
        )}

        {/* Kotak Promo — border kuning tebal */}
        {promoProducts.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', marginBottom: 14 }}>
              Promo Spesial
            </h2>
            <div
              style={{
                border: '3px solid var(--gold)',
                borderRadius: 14,
                padding: 'clamp(12px, 3vw, 24px)',
                background: 'var(--bg-alt)',
              }}
            >
              <div className="katalog-grid">
                {promoProducts.map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Produk reguler */}
        {regularProducts.length > 0 && (
          <div>
            {promoProducts.length > 0 && (
              <h2 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', marginBottom: 14 }}>
                Semua Produk
              </h2>
            )}
            <div className="katalog-grid">
              {regularProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}