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
    title: 'Pengiriman ke Seluruh Indonesia',
    desc: 'Setiap pesanan kami kirim langsung ke alamat Anda dengan asuransi penuh, aman sampai tujuan di mana pun Anda berada di Indonesia.',
    cta: { label: 'Mulai Belanja', href: '/katalog' },
    icon: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <rect x="6" y="16" width="20" height="14" rx="2" fill="#F5B400" />
        <path d="M26 20h8l4 5v5h-12z" fill="#D89600" />
        <circle cx="13" cy="32" r="4" fill="#fff" stroke="#F5B400" strokeWidth="2.5" />
        <circle cx="31" cy="32" r="4" fill="#fff" stroke="#D89600" strokeWidth="2.5" />
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
          gap: clamp(24px, 6vw, 56px);
          padding: clamp(32px, 7vw, 56px) 0;
          border-bottom: 1px solid var(--border);
        }
        .service-row:last-child { border-bottom: none; }
        .service-row.reverse { flex-direction: row-reverse; }
        .service-visual {
          flex: 0 0 clamp(120px, 30vw, 240px);
          height: clamp(120px, 30vw, 240px);
          border-radius: clamp(14px, 3vw, 24px);
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-alt);
          position: relative;
        }
        .service-visual::before {
          content: '';
          position: absolute;
          inset: clamp(10px, 2.5vw, 18px);
          border: 1px dashed var(--border);
          border-radius: clamp(10px, 2vw, 16px);
        }
        .service-icon-badge {
          width: clamp(52px, 14vw, 84px);
          height: clamp(52px, 14vw, 84px);
          border-radius: 50%;
          background: #FFF8E7;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 1;
        }
        .service-icon-badge svg {
          width: 55%;
          height: 55%;
        }
        .service-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: clamp(13px, 3vw, 14px);
          font-weight: 700;
          color: var(--text);
          padding: 12px 4px;
          border-bottom: 2px solid var(--gold);
          transition: gap 0.2s;
        }
        .service-cta:hover { gap: 14px; }
        @media (max-width: 720px) {
          .service-row, .service-row.reverse { flex-direction: column; align-items: flex-start; }
          .service-visual { flex: 0 0 auto; width: clamp(120px, 40vw, 180px); align-self: center; }
        }
      `}</style>

      {/* HERO */}
      <section style={{ position: 'relative', padding: 'clamp(40px, 8vw, 72px) clamp(16px, 5vw, 40px) clamp(32px, 6vw, 56px)', maxWidth: 1000, margin: '0 auto' }}>
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
          <div style={{ fontSize: 12, letterSpacing: '0.08em', color: 'var(--gold-dark)', fontWeight: 700, marginBottom: 12 }}>
            LAYANAN KAMI
          </div>
          <h1 style={{ fontSize: 'clamp(24px, 6vw, 38px)', fontWeight: 800, color: 'var(--text)', marginBottom: 14, maxWidth: 620, lineHeight: 1.2 }}>
            Solusi Lengkap Jual Beli Emas Anda
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 'clamp(13px, 3vw, 16px)', maxWidth: 480 }}>
            Dari membeli, menjual kembali, hingga pengiriman ke seluruh
            Indonesia — semua kebutuhan emas Anda kami layani langsung.
          </p>
        </div>
      </section>

      {/* SERVICES */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '0 clamp(16px, 5vw, 40px)' }}>
        {services.map((s, i) => (
          <div key={s.title} className={`service-row${i % 2 === 1 ? ' reverse' : ''}`}>
            <div className="service-visual">
              <div className="service-icon-badge">{s.icon}</div>
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 'clamp(17px, 4vw, 22px)', fontWeight: 800, color: 'var(--text)', marginBottom: 10 }}>
                {s.title}
              </h3>
              <p style={{ fontSize: 'clamp(13px, 3vw, 15px)', color: 'var(--muted)', lineHeight: 1.6, marginBottom: 16, maxWidth: 480 }}>
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
      <section style={{ padding: 'clamp(40px, 8vw, 64px) clamp(16px, 5vw, 40px)', background: 'var(--bg-alt)', marginTop: 'clamp(24px, 5vw, 40px)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 800, color: 'var(--text)', marginBottom: 10 }}>
            Siap Belanja Emas Hari Ini?
          </h2>
          <p style={{ color: 'var(--muted)', marginBottom: 22, fontSize: 'clamp(13px, 3vw, 15px)' }}>
            Cek katalog dan harga terbaru, lalu pesan dalam hitungan menit.
          </p>
          <Link
            href="/katalog"
            style={{
              display: 'inline-block',
              background: 'var(--gold)',
              color: 'var(--text)',
              padding: 'clamp(11px, 3vw, 14px) clamp(22px, 5vw, 32px)',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 'clamp(13px, 3vw, 14px)',
            }}
          >
            Lihat Katalog Sekarang
          </Link>
        </div>
      </section>
    </main>
  )
}