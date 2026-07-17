import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { formatRupiah } from '@/lib/utils'
import GoldPriceChart from '@/components/GoldPriceChart'
import BuybackSimulator from '@/components/BuybackSimulator'
import type { Product } from '@/lib/types'

export default async function HargaEmasPage({
  searchParams,
}: {
  searchParams: Promise<{ merek?: string }>
}) {
  const { merek } = await searchParams
  const supabase = await createClient()
  const currentYear = new Date().getFullYear()

  const categoriesResult = await supabase
    .from('product_categories')
    .select('id, name, slug')
    .order('name', { ascending: true })
  const categories = categoriesResult.data ?? []

  const activeSlug = merek ?? categories[0]?.slug
  const activeCategory = categories.find((c) => c.slug === activeSlug)

  const productsResult = await supabase
    .from('products')
    .select('*, category:product_categories(name, slug)')
    .eq('is_active', true)
    .eq('category_id', activeCategory?.id ?? 0)
    .order('weight_gram', { ascending: true })
  const products: Product[] = productsResult.data ?? []

  const yearlyResult = await supabase
    .from('product_buyback_yearly')
    .select('weight_gram, year, buyback_price')
    .eq('category_id', activeCategory?.id ?? 0)
    .order('year', { ascending: false })
  const yearlyRows = yearlyResult.data ?? []

  const pastYears = Array.from(new Set(yearlyRows.map((r) => r.year))).sort((a, b) => b - a)

  function getPastBuyback(weightGram: number, year: number) {
    const row = yearlyRows.find((r) => r.weight_gram === weightGram && r.year === year)
    return row ? row.buyback_price : null
  }

  const allProductsResult = await supabase
    .from('products')
    .select('*, category:product_categories(name, slug)')
    .eq('is_active', true)
    .order('weight_gram', { ascending: true })
  const allProducts: Product[] = allProductsResult.data ?? []

  const historyResult = await supabase
    .from('gold_prices')
    .select('price_date, price_per_gram_sell, price_per_gram_buyback')
    .order('price_date', { ascending: true })
  const history = historyResult.data ?? []

  const now = new Date()
  const lastUpdateLabel = now.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <main style={{ padding: '48px 40px', maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ border: '1px solid var(--border)', borderRadius: 14, padding: 32, marginBottom: 32 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', marginBottom: 6 }}>
            Harga Jual & Beli Emas Fisik Hari Ini
          </h1>
          <p style={{ fontSize: 12, color: 'var(--muted)' }}>Last Update: {lastUpdateLabel}</p>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 28, flexWrap: 'wrap' }}>
          {categories.map((c) => {
            const isActive = activeSlug === c.slug
            const tabStyle = {
              padding: '9px 18px',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              border: isActive ? '2px solid var(--gold)' : '1px solid var(--border)',
              color: isActive ? 'var(--text)' : 'var(--muted)',
              background: isActive ? 'var(--bg-alt)' : 'var(--bg)',
            }
            const tabHref = '/harga-emas?merek=' + c.slug
            return (
              <Link key={c.id} href={tabHref} style={tabStyle}>
                {c.name}
              </Link>
            )
          })}
        </div>

<div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
              <thead>
                <tr>
                  <th
                    rowSpan={2}
                    style={{
                      position: 'sticky',
                      left: 0,
                      background: 'var(--gold)',
                      padding: '14px 20px',
                      fontSize: 12,
                      fontWeight: 800,
                      textAlign: 'left',
                      color: '#1A1A2E',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      borderRight: '1px solid rgba(0,0,0,0.1)',
                    }}
                  >
                    Pecahan
                  </th>
                  <th
                    colSpan={2}
                    style={{
                      background: 'var(--gold)',
                      padding: '10px 20px',
                      fontSize: 12,
                      fontWeight: 800,
                      color: '#1A1A2E',
                      textAlign: 'center',
                      borderLeft: '1px solid rgba(0,0,0,0.1)',
                    }}
                  >
                    Tahun {currentYear}
                  </th>
                  {pastYears.map((y) => (
                    <th
                      key={y}
                      style={{
                        background: 'var(--gold)',
                        padding: '10px 20px',
                        fontSize: 12,
                        fontWeight: 800,
                        color: '#1A1A2E',
                        textAlign: 'center',
                        borderLeft: '1px solid rgba(0,0,0,0.1)',
                      }}
                    >
                      Tahun {y}
                    </th>
                  ))}
                </tr>
                <tr style={{ background: '#1A1A2E' }}>
                  <th style={{ padding: '10px 20px', fontSize: 12, color: '#D1D5DB', textAlign: 'right', fontWeight: 600 }}>
                    Harga Beli
                  </th>
                  <th style={{ padding: '10px 20px', fontSize: 12, color: '#D1D5DB', textAlign: 'right', fontWeight: 600 }}>
                    Buyback
                  </th>
                  {pastYears.map((y) => (
                    <th key={y} style={{ padding: '10px 20px', fontSize: 12, color: '#D1D5DB', textAlign: 'right', fontWeight: 600 }}>
                      Buyback
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.length === 0 && (
                  <tr>
                    <td colSpan={2 + pastYears.length} style={{ padding: 28, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
                      Belum ada produk untuk merek ini.
                    </td>
                  </tr>
                )}

                {products.map((p, i) => {
                  const rowBg = i % 2 === 0 ? 'var(--bg)' : 'var(--bg-alt)'
                  const buybackText = p.price_buyback ? formatRupiah(p.price_buyback) : '—'
                  const cellStyle = {
                    padding: '13px 20px',
                    fontSize: 13,
                    textAlign: 'right' as const,
                    color: 'var(--text)',
                    fontVariantNumeric: 'tabular-nums' as const,
                  }
                  return (
                    <tr key={p.id} style={{ background: rowBg }}>
                      <td
                        style={{
                          position: 'sticky',
                          left: 0,
                          background: rowBg,
                          padding: '13px 20px',
                          fontSize: 13,
                          fontWeight: 700,
                          color: 'var(--gold-dark)',
                          borderTop: '1px solid var(--border)',
                          borderRight: '1px solid var(--border)',
                        }}
                      >
                        {p.weight_gram} gr
                      </td>
                      <td style={{ ...cellStyle, borderTop: '1px solid var(--border)' }}>
                        {formatRupiah(p.price_sell)}
                      </td>
                      <td style={{ ...cellStyle, borderTop: '1px solid var(--border)', fontWeight: 600 }}>
                        {buybackText}
                      </td>
                      {pastYears.map((y) => {
                        const pastPrice = getPastBuyback(p.weight_gram, y)
                        return (
                          <td key={y} style={{ ...cellStyle, borderTop: '1px solid var(--border)', color: 'var(--muted)' }}>
                            {pastPrice ? formatRupiah(pastPrice) : '—'}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 20, flexWrap: 'wrap', gap: 16 }}>
          <ul style={{ fontSize: 12, color: 'var(--muted)', paddingLeft: 18, lineHeight: 1.8, margin: 0 }}>
            <li>Harga terima barang akan disesuaikan dengan kondisi barang.</li>
            <li>Harga di atas sudah termasuk biaya sertifikat.</li>
            <li>Harga dapat berubah sewaktu-waktu tanpa pemberitahuan terlebih dahulu.</li>
          </ul>

          <Link
            href="/katalog"
            style={{ border: '1px solid var(--gold)', color: 'var(--gold-dark)', padding: '9px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}
          >
            Lihat Katalog »
          </Link>
        </div>
      </div>

      <BuybackSimulator categories={categories} products={allProducts} />

      {history.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', marginBottom: 16 }}>
            Tren Harga Emas
          </h2>
          <GoldPriceChart prices={history} />
        </div>
      )}
    </main>
  )
}