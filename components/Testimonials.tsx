import Link from 'next/link'

const points = [
  { label: 'Emas 99.99%', desc: 'Asli & bersertifikat resmi Antam' },
  { label: 'Ambil H+1', desc: 'Proses cepat setelah pembayaran' },
  { label: 'Buyback Transparan', desc: 'Harga jual kembali sesuai pasar' },
]

export default function Testimonials() {
  return (
    <section style={{ padding: '56px 40px', maxWidth: 1200, margin: '0 auto' }}>
      <div
        style={{
          background: 'var(--bg-alt)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          padding: '48px 40px',
          textAlign: 'center',
        }}
      >
        <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>
          Jadilah Pelanggan Pertama Kami
        </h2>
        <p style={{ color: 'var(--muted)', maxWidth: 480, margin: '0 auto 32px', fontSize: 15 }}>
          Kami baru saja meluncurkan toko online ini — belanja sekarang dan
          rasakan pengalaman jual beli emas yang transparan dan terpercaya.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 24,
            maxWidth: 640,
            margin: '0 auto 32px',
          }}
        >
          {points.map((p) => (
            <div key={p.label}>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--gold-dark)', marginBottom: 4 }}>
                {p.label}
              </div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>{p.desc}</div>
            </div>
          ))}
        </div>

        <Link
          href="/katalog"
          style={{
            display: 'inline-block',
            background: 'var(--gold)',
            color: 'var(--text)',
            padding: '13px 28px',
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          Mulai Belanja
        </Link>
      </div>
    </section>
  )
}