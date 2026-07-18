'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin') || pathname === '/login') return null

  const waLink = 'https://wa.me/6289563522389'
  const mailLink = 'mailto:Herusukoco395@gmail.com'

  return (
    <footer style={{ background: 'var(--bg-alt)', borderTop: '1px solid var(--border)' }}>
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: 'clamp(32px, 6vw, 56px) clamp(20px, 5vw, 40px) clamp(20px, 4vw, 32px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 'clamp(24px, 5vw, 32px)',
        }}
      >
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
                minWidth: 0,
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
                flexShrink: 0,
              }}
            >
              →
            </button>
          </div>

          <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginTop: 24, marginBottom: 10 }}>
            Hubungi Kami
          </h4>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat WhatsApp"
              style={iconCircleStyle}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.38c1.45.79 3.08 1.21 4.76 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.87 9.87 0 0 0 12.04 2Zm0 18.15h-.01c-1.48 0-2.94-.4-4.21-1.15l-.3-.18-3.13.82.84-3.05-.2-.31a8.18 8.18 0 0 1-1.25-4.37c0-4.53 3.69-8.22 8.23-8.22 2.2 0 4.26.86 5.82 2.42a8.16 8.16 0 0 1 2.41 5.81c0 4.53-3.69 8.23-8.2 8.23Zm4.51-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.84-.86 2.04 0 1.2.88 2.37 1 2.53.12.17 1.73 2.64 4.2 3.7.59.25 1.05.4 1.41.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.11-.23-.17-.48-.29Z" />
              </svg>
            </Link>
            <Link
              href={mailLink}
              aria-label="Kirim Email"
              style={iconCircleStyle}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 6-10 7L2 6" />
              </svg>
            </Link>
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>Perusahaan</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: 'var(--muted)' }}>
            <Link href="/tentang">Tentang Kami</Link>
            <Link href="/layanan">Layanan Kami</Link>
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>Bantuan</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: 'var(--muted)' }}>
            <Link href="/faq">FAQ</Link>
            <Link href={waLink} target="_blank" rel="noopener noreferrer">Hubungi Kami</Link>
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>Jam Operasional</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: 'var(--muted)' }}>
            <span>Senin – Jumat</span>
            <span>08.30 – 16.00 WIB</span>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', padding: 'clamp(16px, 3vw, 20px) clamp(20px, 5vw, 40px)' }}>
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

const iconCircleStyle = {
  width: 38,
  height: 38,
  borderRadius: '50%',
  background: 'var(--bg)',
  border: '1px solid var(--border)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
} as const