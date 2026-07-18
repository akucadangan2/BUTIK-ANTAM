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

const EDUKASI = [
  {
    title: 'Kadar 99,99% Itu Apa?',
    desc: 'Angka ini menunjukkan tingkat kemurnian emas — semakin mendekati 100%, semakin sedikit campuran logam lain di dalamnya. Emas Antam dan UBS yang kami jual sama-sama berkadar 99,99%.',
  },
  {
    title: 'Antam vs UBS, Pilih Mana?',
    desc: 'Keduanya sama-sama emas batangan bersertifikat resmi dengan kadar setara. Perbedaan utamanya ada di produsen dan preferensi pasar — keduanya likuid dan mudah dijual kembali.',
  },
  {
    title: 'Cara Menyimpan Emas dengan Aman',
    desc: 'Simpan di tempat yang tidak mudah diketahui orang lain, pisahkan sertifikat dari fisik emasnya, dan pertimbangkan asuransi kalau nilainya cukup besar.',
  },
]

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

  const { data: ubsCategory } = await supabase
    .from('product_categories')
    .select('id')
    .eq('slug', 'ubs-gold')
    .single()

  const { data: ubsOneGram } = await supabase
    .from('products')
    .select('price_sell, price_buyback')
    .eq('category_id', ubsCategory?.id ?? 0)
    .eq('weight_gram', 1)
    .single()

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
              Jual Beli Emas Antam & UBS,<br />Asli & Bersertifikat
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: 'clamp(14px, 2vw, 16px)', maxWidth: 440, marginBottom: 24 }}>
              Temukan emas batangan ANTAM dan UBS dengan harga yang selalu terbarui. 
              Nikmati proses transaksi yang aman serta layanan buyback yang mudah.
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

          <div style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {latestPrice && (
              <div style={{ background: '#1A1A2E', borderRadius: 16, padding: 'clamp(16px, 3vw, 24px)' }}>
                <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 12 }}>
                  Antam · {new Date(latestPrice.price_date).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 13, color: '#9CA3AF' }}>Jual</span>
                  <span className="price" style={{ fontSize: 'clamp(15px, 2.3vw, 19px)', fontWeight: 800, color: 'var(--gold)' }}>
                    {formatRupiah(latestPrice.price_per_gram_sell)}/gr
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: '#9CA3AF' }}>Buyback</span>
                  <span className="price" style={{ fontSize: 'clamp(15px, 2.3vw, 19px)', fontWeight: 800, color: 'var(--gold)' }}>
                    {formatRupiah(latestPrice.price_per_gram_buyback)}/gr
                  </span>
                </div>
              </div>
            )}

            {ubsOneGram && (
              <div style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 16, padding: 'clamp(16px, 3vw, 24px)' }}>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>
                  UBS Gold · Harga per gram
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 13, color: 'var(--muted)' }}>Jual</span>
                  <span className="price" style={{ fontSize: 'clamp(15px, 2.3vw, 19px)', fontWeight: 800, color: 'var(--text)' }}>
                    {formatRupiah(ubsOneGram.price_sell)}/gr
                  </span>
                </div>
                {ubsOneGram.price_buyback && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, color: 'var(--muted)' }}>Buyback</span>
                    <span className="price" style={{ fontSize: 'clamp(15px, 2.3vw, 19px)', fontWeight: 800, color: 'var(--text)' }}>
                      {formatRupiah(ubsOneGram.price_buyback)}/gr
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* GRAFIK HARGA */}
      {history && history.length > 0 && (
        <section style={{ padding: `0 ${sectionPad} clamp(32px, 6vw, 56px)`, maxWidth: 1200, margin: '0 auto' }}>
          <GoldPriceChart prices={history} />
        </section>
      )}

      {/* KEUNGGULAN */}
      <section style={{ background: 'var(--bg-alt)', padding: `clamp(32px, 6vw, 56px) ${sectionPad}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
          {[
            { title: 'Emas Bersertifikat', desc: 'Setiap batangan emas Antam & UBS dilengkapi sertifikat keaslian resmi.' },
            { title: 'Diproses Cepat', desc: 'Pesanan diproses dan dikirim dalam 1 hari kerja setelah pembayaran dikonfirmasi.' },
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

      {/* PENGIRIMAN */}
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

      {/* EDUKASI EMAS */}
      <section style={{ background: 'var(--bg-alt)', padding: `clamp(32px, 6vw, 56px) ${sectionPad}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, letterSpacing: '0.06em', color: 'var(--gold-dark)', fontWeight: 700, marginBottom: 6 }}>
              SEBELUM BELI, KENALI DULU
            </div>
            <h2 style={{ fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 800, color: 'var(--text)' }}>
              Edukasi Singkat Seputar Emas
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {EDUKASI.map((item, i) => (
              <div key={item.title} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div
                  style={{
                    flexShrink: 0,
                    width: 'clamp(28px, 6vw, 34px)',
                    height: 'clamp(28px, 6vw, 34px)',
                    borderRadius: '50%',
                    background: 'var(--gold)',
                    color: '#1A1A2E',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: 'clamp(12px, 2.5vw, 14px)',
                  }}
                >
                  {i + 1}
                </div>
                <div>
                  <h3 style={{ fontSize: 'clamp(14px, 3vw, 16px)', fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: 'clamp(12.5px, 2.8vw, 14px)', color: 'var(--muted)', lineHeight: 1.6, maxWidth: 620 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/berita"
            style={{ display: 'inline-block', marginTop: 20, fontSize: 13, fontWeight: 700, color: 'var(--gold-dark)' }}
          >
            Baca artikel & tips lainnya →
          </Link>
        </div>
      </section>

      {/* HIGHLIGHTS / BERITA */}
      <Highlights />

      {/* TESTIMONI */}
      <Testimonials />
    </main>
  )
}