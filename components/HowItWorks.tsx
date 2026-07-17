const steps = [
  {
    title: 'Pilih Emas yang Diinginkan',
    desc: 'Cek katalog dan harga emas terupdate, pilih ukuran gram sesuai kebutuhan Anda.',
    icon: (
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
        <rect x="14" y="26" width="44" height="28" rx="6" fill="#FDECC8" />
        <rect x="14" y="26" width="44" height="28" rx="6" stroke="#F5B400" strokeWidth="2" />
        <path d="M22 26 L30 16 H42 L50 26" stroke="#F5B400" strokeWidth="2" fill="none" />
        <text x="36" y="44" textAnchor="middle" fontSize="12" fontWeight="700" fill="#D89600">Au</text>
      </svg>
    ),
  },
  {
    title: 'Konfirmasi & Bayar',
    desc: 'Selesaikan pembayaran lewat transfer bank atau QRIS, lalu kirim bukti konfirmasi.',
    icon: (
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
        <rect x="18" y="14" width="36" height="46" rx="4" fill="#FDECC8" stroke="#F5B400" strokeWidth="2" />
        <line x1="26" y1="26" x2="46" y2="26" stroke="#D89600" strokeWidth="2" />
        <line x1="26" y1="34" x2="46" y2="34" stroke="#D89600" strokeWidth="2" />
        <circle cx="46" cy="48" r="10" fill="#F5B400" />
        <path d="M42 48 L45 51 L51 44" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Ambil atau Terima Kiriman',
    desc: 'Barang siap diambil H+1 di toko, atau dikirim langsung ke alamat Anda.',
    icon: (
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
        <path d="M16 28 L36 16 L56 28 L56 52 L36 64 L16 52 Z" fill="#FDECC8" stroke="#F5B400" strokeWidth="2" />
        <path d="M16 28 L36 40 L56 28" stroke="#D89600" strokeWidth="2" fill="none" />
        <line x1="36" y1="40" x2="36" y2="64" stroke="#D89600" strokeWidth="2" />
      </svg>
    ),
  },
]

export default function HowItWorks() {
  return (
    <section style={{ padding: '64px 40px', maxWidth: 1200, margin: '0 auto' }}>
      <h2 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', textAlign: 'center', marginBottom: 10 }}>
        Cara Belanja di Butik Antam
      </h2>
      <p style={{ color: 'var(--muted)', textAlign: 'center', marginBottom: 44, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
        Tiga langkah mudah, tanpa perlu antri ke toko.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
        {steps.map((step, i) => (
          <div key={step.title} style={{ textAlign: 'center' }}>
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: '50%',
                background: 'var(--bg-alt)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              {step.icon}
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold-dark)', marginBottom: 6 }}>
              LANGKAH {i + 1}
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
              {step.title}
            </h3>
            <p style={{ fontSize: 14, color: 'var(--muted)', maxWidth: 260, margin: '0 auto' }}>
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}