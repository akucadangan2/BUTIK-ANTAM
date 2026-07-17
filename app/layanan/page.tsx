import Link from 'next/link'

const services = [
  {
    title: 'Jual Beli Emas Batangan',
    desc: 'Beli emas Antam 99.99% asli bersertifikat langsung dari katalog kami, dengan harga yang terupdate setiap hari — dari pecahan 1 gram hingga ukuran besar.',
    cta: { label: 'Lihat Katalog', href: '/katalog' },
    icon: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <rect x="8" y="16" width="28" height="20" rx="4" fill="#F5B400" />
        <rect x="8" y="16" width="28" height="6" rx="3" fill="#D89600" />
        <circle cx="22" cy="27" r="4" fill="#FFF8E7" />
      </svg>
    ),
  },
  {
    title: 'Buyback, Jual Kembali',
    desc: 'Punya emas Antam dan ingin menjualnya kembali? Kami menerima buyback dengan harga transparan sesuai harga pasar hari itu, tanpa proses berbelit.',
    cta: { label: 'Cek Harga Buyback', href: '/harga-emas' },
    icon: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <path d="M12 18a10 10 0 0 1 17-6l3 3" stroke="#F5B400" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M32 9v6h-6" stroke="#F5B400" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M32 26a10 10 0 0 1-17 6l-3-3" stroke="#D89600" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M12 35v-6h6" stroke="#D89600" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Pre-Order',
    desc: 'Untuk pecahan gram tertentu yang sedang kosong stok, Anda tetap bisa memesan lebih dulu. Kami proses dan hubungi Anda begitu barang tersedia.',
    cta: { label: 'Lihat Produk PreOrder', href: '/katalog' },
    icon: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <circle cx="22" cy="22" r="14" stroke="#F5B400" strokeWidth="3" fill="none" />
        <path d="M22 14v8l6 4" stroke="#F5B400" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Ambil di Toko / Kirim Luar Kota',
    desc: 'Ambil langsung di toko H+1 setelah pembayaran, atau biarkan kami kirimkan dengan asuransi penuh ke alamat Anda di seluruh Indonesia.',
    cta: { label: 'Mulai Belanja', href: '/katalog' },
    icon: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <path d="M8 20 L22 10 L36 20 V34 H8 Z" stroke="#F5B400" strokeWidth="3" fill="none" strokeLinejoin="round" />
        <rect x="18" y="24" width="8" height="10" fill="#F5B400" />
      </svg>
    ),
  },
]

export default function LayananPage() {
  return (
    <main style={{ overflow: 'hidden' }}>
      <style>{`
        .service-row {
          position: relative;
          display: flex;
          align-items: center;
          gap: 56px;
          padding: 56px 0;
          border-bottom: 1px solid var(--border);
        }
        .service-row:last-child { border-bottom: none; }
        .service-row.reverse { flex-direction: row-reverse; }
        .service-visual {
          flex: 0 0 240px;
          height: 240px;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-alt);
          position: relative;
        }
        .service-visual::before {
          content: '';
          position: absolute;
          inset: 18px;
          border: 1px dashed var(--border);
          border-radius: 16px;
        }
        .service-icon-badge {
          width: 84px;
          height: 84px;
          border-radius: 50%;
          background: #FFF8E7;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 1;
        }
        .service-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 700;
          color: var(--text);
          padding: 12px 4px;
          border-bottom: 2px solid var(--gold);
          transition: gap 0.2s;
        }
        .service-cta:hover { gap: 14px; }
        @media (max-width: 720px) {
          .service-row, .service-row.reverse { flex-direction: column; }
          .service-visual { flex: 0 0 auto; width: 100%; }
        }
      `}</style>

      {/* HERO */}
      <section style={{ position: 'relative', padding: '72px 40px 56px', maxWidth: 1000, margin: '0 auto' }}>
        <div
          style={{
            position: 'absolute',
            top: -80,
            right: -60,
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #FDECC8 0%, rgba(253,236,200,0) 70%)',
            zIndex: 0,
          }}
        />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 12, letterSpacing: '0.08em', color: 'var(--gold-dark)', fontWeight: 700, marginBottom: 14 }}>
            LAYANAN KAMI
          </div>
          <h1 style={{ fontSize: 38, fontWeight: 800, color: 'var(--text)', marginBottom: 16, maxWidth: 620, lineHeight: 1.15 }}>
            Solusi Lengkap Jual Beli Emas Anda
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 16, maxWidth: 480 }}>
            Dari membeli, menjual kembali, hingga pengiriman ke seluruh
            Indonesia — semua kebutuhan emas Anda kami layani langsung.
          </p>
        </div>
      </section>

      {/* SERVICES */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '0 40px' }}>
        {services.map((s, i) => (
          <div key={s.title} className={`service-row${i % 2 === 1 ? ' reverse' : ''}`}>
            <div className="service-visual">
              <div className="service-icon-badge">{s.icon}</div>
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>
                {s.title}
              </h3>
              <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 20, maxWidth: 480 }}>
                {s.desc}
              </p>
              <Link href={s.cta.href} className="service-cta">
                {s.cta.label}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* CTA BAWAH */}
      <section style={{ padding: '64px 40px', background: 'var(--bg-alt)', marginTop: 40 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>
            Siap Belanja Emas Hari Ini?
          </h2>
          <p style={{ color: 'var(--muted)', marginBottom: 28 }}>
            Cek katalog dan harga terbaru, lalu pesan dalam hitungan menit.
          </p>
          <Link
            href="/katalog"
            style={{
              display: 'inline-block',
              background: 'var(--gold)',
              color: 'var(--text)',
              padding: '14px 32px',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            Lihat Katalog Sekarang
          </Link>
        </div>
      </section>
    </main>
  )
}