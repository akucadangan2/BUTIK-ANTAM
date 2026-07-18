const badges = [
  {
    title: 'Emas Bersertifikat',
    desc: 'Setiap batangan emas yang kami jual asli dan bersertifikat resmi.',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <path d="M20 4 L34 10 V20 C34 28 28 34 20 37 C12 34 6 28 6 20 V10 Z" fill="#F5B400" />
        <path d="M14 20 L18 24 L26 15" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Pengiriman Berasuransi',
    desc: 'Setiap pengiriman dilindungi asuransi penuh hingga barang diterima.',
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
    <section style={{ padding: 'clamp(32px, 6vw, 56px) clamp(20px, 5vw, 40px)', maxWidth: 1200, margin: '0 auto' }}>
      <div
        style={{
          background: 'var(--bg-alt)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: 'clamp(24px, 5vw, 40px)',
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(16px, 4vw, 28px)',
          flexWrap: 'wrap',
          marginBottom: 'clamp(28px, 5vw, 40px)',
        }}
      >
        <div
          style={{
            flexShrink: 0,
            width: 'clamp(56px, 14vw, 72px)',
            height: 'clamp(56px, 14vw, 72px)',
            borderRadius: '50%',
            background: '#FFF8E7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="55%" height="55%" viewBox="0 0 44 44" fill="none">
            <rect x="6" y="16" width="20" height="14" rx="2" fill="#F5B400" />
            <path d="M26 20h8l4 5v5h-12z" fill="#D89600" />
            <circle cx="13" cy="32" r="4" fill="#fff" stroke="#F5B400" strokeWidth="2.5" />
            <circle cx="31" cy="32" r="4" fill="#fff" stroke="#D89600" strokeWidth="2.5" />
          </svg>
        </div>
        <div style={{ flex: '1 1 260px' }}>
          <h2 style={{ fontSize: 'clamp(17px, 3.5vw, 22px)', fontWeight: 800, color: 'var(--text)', marginBottom: 6 }}>
            Pengiriman ke Seluruh Indonesia
          </h2>
          <p style={{ fontSize: 'clamp(13px, 2.8vw, 15px)', color: 'var(--muted)', lineHeight: 1.6 }}>
            Setiap pesanan kami kirim langsung ke alamat Anda dengan asuransi
            penuh, aman sampai tujuan di mana pun Anda berada di Indonesia.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'clamp(16px, 3vw, 28px)' }}>
        {badges.map((b) => (
          <div key={b.title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{ flexShrink: 0 }}>{b.icon}</div>
            <div>
              <h4 style={{ fontSize: 'clamp(13.5px, 3vw, 15px)', fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                {b.title}
              </h4>
              <p style={{ fontSize: 'clamp(12px, 2.6vw, 13px)', color: 'var(--muted)' }}>{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}