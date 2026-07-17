'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin') || pathname === '/login') return null

  return (
    <footer style={{ background: 'var(--bg-alt)', borderTop: '1px solid var(--border)' }}>
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '56px 40px 32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 32,
        }}
      >
        {/* Newsletter + Sosial */}
        <div style={{ gridColumn: 'span 2', minWidth: 240 }}>
          <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>
            Jadilah yang Pertama Tahu
          </h4>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16, maxWidth: 280 }}>
            Info promo dan update harga emas langsung ke email Anda.
          </p>
          <div style={{ display: 'flex', maxWidth: 320 }}>
            <input
              type="email"
              placeholder="Isi email Anda"
              style={{
                flex: 1,
                padding: '10px 14px',
                border: '1px solid var(--border)',
                borderRight: 'none',
                borderRadius: '8px 0 0 8px',
                fontSize: 13,
              }}
            />
            <button
              style={{
                background: 'var(--gold)',
                border: 'none',
                borderRadius: '0 8px 8px 0',
                padding: '0 16px',
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              →
            </button>
          </div>

          <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginTop: 24, marginBottom: 10 }}>
            Ikuti Kami
          </h4>
          <div style={{ display: 'flex', gap: 10 }}>
            {['IG', 'FB', 'TT'].map((s) => (
              <span
                key={s}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  fontWeight: 700,
                  color: 'var(--muted)',
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Perusahaan */}
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>Perusahaan</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: 'var(--muted)' }}>
            <Link href="/tentang">Tentang Kami</Link>
            <Link href="/layanan">Layanan Kami</Link>
          </div>
        </div>

        {/* Bantuan */}
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>Bantuan</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: 'var(--muted)' }}>
            <Link href="/faq">FAQ</Link>
            <a href="https://wa.me/6289563522389">Hubungi Kami</a>
          </div>
        </div>

        {/* Kontak */}
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>Kontak Kami</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: 'var(--muted)' }}>
            <span>Senin – Jumat</span>
            <span>08.30 – 16.00 WIB</span>
            <a href="tel:0895635223839" style={{ color: 'var(--text)', fontWeight: 600 }}>0895-6352-23839</a>
            <a href="mailto:Herusukoco395@gmail.com" style={{ color: 'var(--text)', fontWeight: 600, wordBreak: 'break-all' }}>
              Herusukoco395@gmail.com
            </a>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', padding: '20px 40px' }}>
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            fontSize: 12,
            color: 'var(--muted)',
          }}
        >
          <span>© {new Date().getFullYear()} Butik Antam. Emas 99.99% bersertifikat.</span>
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
            <Link href="/syarat-ketentuan">Syarat & Ketentuan</Link>
            <Link href="/kebijakan-privasi">Kebijakan Privasi</Link>
            <Link href="/refund-policy">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}