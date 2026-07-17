const services = [
  {
    title: 'Ambil di Toko',
    desc: 'Datang langsung dan ambil emas Anda H+1 setelah pembayaran dikonfirmasi.',
    icon: (
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
        <rect x="16" y="30" width="40" height="26" rx="4" fill="#FDECC8" stroke="#F5B400" strokeWidth="2" />
        <path d="M16 30 L20 16 H52 L56 30" stroke="#F5B400" strokeWidth="2" fill="none" strokeLinejoin="round" />
        <rect x="30" y="40" width="12" height="16" fill="#F5B400" />
      </svg>
    ),
  },
  {
    title: 'Kirim ke Luar Kota',
    desc: 'Tidak perlu datang ke toko. Emas dikirim aman dan diasuransikan ke alamat Anda di seluruh Indonesia.',
    icon: (
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
        <rect x="12" y="26" width="34" height="24" rx="3" fill="#FDECC8" stroke="#F5B400" strokeWidth="2" />
        <path d="M46 32 H56 L60 40 V50 H46 Z" fill="#FDECC8" stroke="#F5B400" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="24" cy="52" r="5" fill="#F5B400" />
        <circle cx="50" cy="52" r="5" fill="#F5B400" />
      </svg>
    ),
  },
]

const badges = [
  {
    title: 'Emas Bersertifikat',
    desc: 'Setiap batangan emas Antam yang kami jual asli dan bersertifikat resmi.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <path d="M20 4 L34 10 V20 C34 28 28 34 20 37 C12 34 6 28 6 20 V10 Z" fill="#F5B400" />
        <path d="M14 20 L18 24 L26 15" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Pengiriman Berasuransi',
    desc: 'Setiap pengiriman ke luar kota dilindungi asuransi hingga barang diterima.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <rect x="6" y="12" width="24" height="18" rx="2" fill="#F5B400" />
        <path d="M30 18 H36 L38 23 V30 H30 Z" fill="#F5B400" />
        <circle cx="14" cy="32" r="3.5" fill="#fff" stroke="#F5B400" strokeWidth="2" />
        <circle cx="32" cy="32" r="3.5" fill="#fff" stroke="#F5B400" strokeWidth="2" />
      </svg>
    ),
  },
  {
    title: 'Pembayaran Aman',
    desc: 'Transfer bank atau QRIS, dengan konfirmasi jelas untuk setiap transaksi.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <rect x="4" y="10" width="32" height="22" rx="3" fill="#F5B400" />
        <rect x="4" y="15" width="32" height="4" fill="#fff" opacity="0.6" />
        <rect x="9" y="24" width="10" height="3" rx="1.5" fill="#fff" />
      </svg>
    ),
  },
]

export default function ServicesSection() {
  return (
    <section style={{ padding: '56px 40px', maxWidth: 1200, margin: '0 auto' }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', textAlign: 'center', marginBottom: 36 }}>
        Cara Menerima Emas Anda
      </h2>

      <div
        style={{
          background: 'var(--bg-alt)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: '40px 32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 40,
          marginBottom: 40,
        }}
      >
        {services.map((s) => (
          <div key={s.title} style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>{s.icon}</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>{s.title}</h3>
            <p style={{ fontSize: 14, color: 'var(--muted)', maxWidth: 320, margin: '0 auto' }}>{s.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 28 }}>
        {badges.map((b) => (
          <div key={b.title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{ flexShrink: 0 }}>{b.icon}</div>
            <div>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{b.title}</h4>
              <p style={{ fontSize: 13, color: 'var(--muted)' }}>{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}