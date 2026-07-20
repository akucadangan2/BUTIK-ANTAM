'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/produk', label: 'Produk', icon: '🪙' },
  { href: '/admin/berita', label: 'Berita', icon: '📰' },
  { href: '/admin/pengaturan-pembayaran', label: 'Pembayaran', icon: '💳' },
]

interface Props {
  open: boolean
  onClose: () => void
}

export default function AdminSidebar({ open, onClose }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <>
      <style>{`
        .admin-sidebar {
          width: 220px;
          flex-shrink: 0;
          background: #1A1A2E;
          color: #fff;
          min-height: 100vh;
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          transition: transform 0.25s ease;
        }
        .admin-sidebar-close { display: none; }
        .admin-sidebar-overlay { display: none; }
        @media (max-width: 860px) {
          .admin-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            z-index: 101;
            transform: translateX(-100%);
            box-shadow: 4px 0 24px rgba(0,0,0,0.3);
          }
          .admin-sidebar.open { transform: translateX(0); }
          .admin-sidebar-close {
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
          .admin-sidebar-overlay.open {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.45);
            z-index: 100;
          }
        }
      `}</style>

      <div className={`admin-sidebar-overlay${open ? ' open' : ''}`} onClick={onClose} />

      <aside className={`admin-sidebar${open ? ' open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px 28px' }}>
          <div style={{ fontSize: 17, fontWeight: 800 }}>
            BUTIK <span style={{ color: 'var(--gold)' }}>ANTAM</span>
          </div>
          <button
            onClick={onClose}
            className="admin-sidebar-close"
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 18 }}
            aria-label="Tutup menu"
          >
            ✕
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          {NAV.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  color: active ? '#1A1A2E' : '#D1D5DB',
                  background: active ? 'var(--gold)' : 'transparent',
                }}
              >
                <span>{item.icon}</span> {item.label}
              </Link>
            )
          })}
        </nav>

        <button
          onClick={handleLogout}
          style={{
            background: 'transparent',
            border: '1px solid #374151',
            color: '#D1D5DB',
            padding: '10px 12px',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          ↩ Keluar
        </button>
      </aside>
    </>
  )
}