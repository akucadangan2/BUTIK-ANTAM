import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { formatRupiah } from '@/lib/utils'
import ProductCard from '@/components/ProductCard'
import GoldPriceChart from '@/components/GoldPriceChart'
import HowItWorks from '@/components/HowItWorks'
import ServicesSection from '@/components/ServicesSection'
import Highlights from '@/components/Highlights'
import Testimonials from '@/components/Testimonials'
import type { Product } from '@/lib/types'

export default async function HomePage() {
  const supabase = await createClient()

  const { data: latestPrice } = await supabase
    .from('gold_prices')
    .select('*')
    .order('price_date', { ascending: false })
    .limit(1)
    .single()

  const { data: history } = await supabase
    .from('gold_prices')
    .select('price_date, price_per_gram_sell, price_per_gram_buyback')
    .order('price_date', { ascending: true })

  const { data: featured } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(4)

  const sectionPad = 'clamp(20px, 5vw, 40px)'

  return (
    <main>
      {/* HERO */}
      <section style={{ padding: `clamp(32px, 8vw, 72px) ${sectionPad} clamp(20px, 4vw, 40px)`, maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'center' }}>
          <div style={{ flex: '1 1 320px' }}>
            <h1 style={{ fontSize: 'clamp(26px, 5vw, 42px)', lineHeight: 1.2, fontWeight: 800, color: 'var(--text)', marginBottom: 16 }}>
              Jual Beli Emas Antam,<br />Asli & Bersertifikat
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: 'clamp(14px, 2vw, 16px)', maxWidth: 440, marginBottom: 24 }}>
              Beli emas batangan langsung dari toko, harga transparan dan
              terupdate setiap hari. Kami juga menerima jual kembali (buyback).
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link
                href="/katalog"
                style={{ background: 'var(--gold)', color: 'var(--text)', padding: '13px 24px', borderRadius: 10, fontWeight: 700, fontSize: 14 }}
              >
                Lihat Katalog
              </Link>
              <Link
                href="/keranjang"
                style={{ border: '1px solid var(--border)', color: 'var(--text)', padding: '13px 24px', borderRadius: 10, fontWeight: 700, fontSize: 14 }}
              >
                Keranjang Saya
              </Link>
            </div>
          </div>

          {latestPrice && (
            <div style={{ flex: '1 1 280px', background: '#1A1A2E', borderRadius: 16, padding: 'clamp(18px, 3vw, 28px)' }}>
              <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 14 }}>
                Harga Emas Hari Ini ·{' '}
                {new Date(latestPrice.price_date).toLocaleDateString('id-ID', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontSize: 13, color: '#9CA3AF' }}>Jual</span>
                <span className="price" style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', fontWeight: 800, color: 'var(--gold)' }}>
                  {formatRupiah(latestPrice.price_per_gram_sell)}/gr
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: '#9CA3AF' }}>Buyback</span>
                <span className="price" style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', fontWeight: 800, color: 'var(--gold)' }}>
                  {formatRupiah(latestPrice.price_per_gram_buyback)}/gr
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* GRAFIK HARGA — langsung di landing, seperti IndoGold */}
      {history && history.length > 0 && (
        <section style={{ padding: `0 ${sectionPad} clamp(32px, 6vw, 56px)`, maxWidth: 1200, margin: '0 auto' }}>
          <GoldPriceChart prices={history} />
        </section>
      )}

      {/* KEUNGGULAN */}
      <section style={{ background: 'var(--bg-alt)', padding: `clamp(32px, 6vw, 56px) ${sectionPad}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
          {[
            { title: 'Emas Bersertifikat', desc: 'Setiap batangan emas Antam dilengkapi sertifikat keaslian resmi.' },
            { title: 'Ambil H+1', desc: 'Barang dapat diambil sehari setelah konfirmasi pembayaran diterima.' },
            { title: 'Layanan Buyback', desc: 'Jual kembali emas Anda kapan saja dengan harga buyback terkini.' },
          ].map((item) => (
            <div key={item.title} style={{ background: 'var(--bg)', borderRadius: 14, padding: 20, border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{item.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--muted)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CARA BELANJA */}
      <HowItWorks />

      {/* AMBIL DI TOKO / KIRIM LUAR KOTA */}
      <ServicesSection />

      {/* PRODUK UNGGULAN */}
      {featured && featured.length > 0 && (
        <section style={{ padding: `clamp(32px, 6vw, 56px) ${sectionPad}`, maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
            <h2 style={{ fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 800, color: 'var(--text)' }}>Produk Unggulan</h2>
            <Link href="/katalog" style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold-dark)' }}>
              Lihat Semua →
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
            {featured.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* HIGHLIGHTS / BERITA */}
      <Highlights />

      {/* TESTIMONI */}
      <Testimonials />
    </main>
  )
}