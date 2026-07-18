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
    <main style={{ padding: 'clamp(20px, 5vw, 48px) clamp(16px, 5vw, 40px)', maxWidth: 1000, margin: '0 auto' }}>
      <style>{`
        .harga-table-wrapper { display: block; }
        .harga-card-list { display: none; }
        @media (max-width: 680px) {
          .harga-table-wrapper { display: none; }
          .harga-card-list { display: flex; flex-direction: column; gap: 12px; }
        }
      `}</style>

      <div style={{ border: '1px solid var(--border)', borderRadius: 14, padding: 'clamp(16px, 4vw, 32px)', marginBottom: 28 }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <h1 style={{ fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 800, color: 'var(--text)', marginBottom: 6 }}>
            Harga Jual & Beli Emas Fisik Hari Ini
          </h1>
          <p style={{ fontSize: 'clamp(11px, 2.5vw, 12px)', color: 'var(--muted)' }}>Last Update: {lastUpdateLabel}</p>
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
          {categories.map((c) => {
            const isActive = activeSlug === c.slug
            const tabStyle = {
              padding: 'clamp(7px, 2vw, 9px) clamp(12px, 3vw, 18px)',
              borderRadius: 10,
              fontSize: 'clamp(11px, 2.5vw, 13px)',
              fontWeight: 700,
              border: isActive ? '2px solid var(--gold)' : '1px solid var(--border)',
              color: isActive ? 'var(--text)' : 'var(--muted)',
              background: isActive ? 'var(--bg-alt)' : 'var(--bg)',
              whiteSpace: 'nowrap' as const,
            }
            const tabHref = '/harga-emas?merek=' + c.slug
            return (
              <Link key={c.id} href={tabHref} style={tabStyle}>
                {c.name}
              </Link>
            )
          })}
        </div>

        {/* TABEL — DESKTOP */}
        <div className="harga-table-wrapper" style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}>
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
                    whiteSpace: 'nowrap' as const,
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
                          whiteSpace: 'nowrap',
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

        {/* KARTU — MOBILE */}
        <div className="harga-card-list">
          {products.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--muted)', padding: 20, fontSize: 13 }}>
              Belum ada produk untuk merek ini.
            </p>
          )}

          {products.map((p) => {
            const buybackText = p.price_buyback ? formatRupiah(p.price_buyback) : '—'
            return (
              <div key={p.id} style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ background: 'var(--gold)', padding: '8px 14px', fontSize: 13, fontWeight: 800, color: '#1A1A2E' }}>
                  {p.weight_gram} gram
                </div>

                <div style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>Harga Beli ({currentYear})</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{formatRupiah(p.price_sell)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: pastYears.length > 0 ? 10 : 0 }}>
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>Buyback ({currentYear})</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold-dark)' }}>{buybackText}</span>
                  </div>

                  {pastYears.length > 0 && (
                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 5 }}>
                      {pastYears.map((y) => {
                        const pastPrice = getPastBuyback(p.weight_gram, y)
                        return (
                          <div key={y} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: 11, color: 'var(--muted)' }}>Buyback {y}</span>
                            <span style={{ fontSize: 12, color: 'var(--muted)' }}>{pastPrice ? formatRupiah(pastPrice) : '—'}</span>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 20, flexWrap: 'wrap', gap: 16 }}>
          <ul style={{ fontSize: 'clamp(11px, 2.2vw, 12px)', color: 'var(--muted)', paddingLeft: 18, lineHeight: 1.8, margin: 0 }}>
            <li>Harga terima barang akan disesuaikan dengan kondisi barang.</li>
            <li>Harga di atas sudah termasuk biaya sertifikat.</li>
            <li>Harga dapat berubah sewaktu-waktu tanpa pemberitahuan terlebih dahulu.</li>
          </ul>

          <Link
            href="/katalog"
            style={{
              border: '1px solid var(--gold)',
              color: 'var(--gold-dark)',
              padding: 'clamp(7px, 2vw, 9px) clamp(14px, 3vw, 20px)',
              borderRadius: 8,
              fontSize: 'clamp(12px, 2.5vw, 13px)',
              fontWeight: 700,
              whiteSpace: 'nowrap',
            }}
          >
            Lihat Katalog »
          </Link>
        </div>
      </div>

      <BuybackSimulator categories={categories} products={allProducts} />

      {history.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <h2 style={{ fontSize: 'clamp(15px, 3.5vw, 18px)', fontWeight: 800, color: 'var(--text)', marginBottom: 14 }}>
            Tren Harga Emas
          </h2>
          <GoldPriceChart prices={history} />
        </div>
      )}
    </main>
  )
}