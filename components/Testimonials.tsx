import Link from 'next/link'

const points = [
  { label: 'Emas 99,99%', desc: 'Asli & bersertifikat resmi' },
  { label: 'Proses Cepat', desc: 'Dikirim 1 hari kerja setelah bayar' },
  { label: 'Buyback Transparan', desc: 'Harga jual kembali sesuai pasar' },
]

export default function Testimonials() {
  return (
    <section style={{ padding: 'clamp(32px, 6vw, 56px) clamp(20px, 5vw, 40px)', maxWidth: 1200, margin: '0 auto' }}>
      <div
        style={{
          background: 'var(--bg-alt)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          padding: 'clamp(28px, 6vw, 48px) clamp(20px, 5vw, 40px)',
          textAlign: 'center',
        }}
      >
        <h2 style={{ fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 800, color: 'var(--text)', marginBottom: 10 }}>
          Belanja Emas dengan Tenang
        </h2>
        <p style={{ color: 'var(--muted)', maxWidth: 480, margin: '0 auto clamp(20px, 4vw, 32px)', fontSize: 'clamp(13px, 2.8vw, 15px)' }}>
          Setiap transaksi kami proses dengan transparan, mulai dari harga,
          keaslian barang, hingga pengiriman ke tangan Anda.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 'clamp(16px, 4vw, 24px)',
            maxWidth: 640,
            margin: '0 auto clamp(20px, 4vw, 32px)',
          }}
        >
          {points.map((p) => (
            <div key={p.label}>
              <div style={{ fontSize: 'clamp(14px, 3vw, 16px)', fontWeight: 800, color: 'var(--gold-dark)', marginBottom: 4 }}>
                {p.label}
              </div>
              <div style={{ fontSize: 'clamp(12px, 2.5vw, 13px)', color: 'var(--muted)' }}>{p.desc}</div>
            </div>
          ))}
        </div>

        <Link
          href="/katalog"
          style={{
            display: 'inline-block',
            background: 'var(--gold)',
            color: 'var(--text)',
            padding: 'clamp(11px, 2.5vw, 13px) clamp(22px, 5vw, 28px)',
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 'clamp(13px, 2.8vw, 14px)',
          }}
        >
          Mulai Belanja
        </Link>
      </div>
    </section>
  )
}