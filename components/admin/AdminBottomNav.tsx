'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { href: '/admin', label: 'Home', icon: '🏠' },
  { href: '/admin/pesanan', label: 'Pesanan', icon: '📦' },
  { href: '/admin/produk', label: 'Produk', icon: '🪙' },
  { href: '/admin/berita', label: 'Berita', icon: '📰' },
]

export default function AdminBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="admin-bottom-nav">
      <style>{`
        .admin-bottom-nav { display: none; }
        @media (max-width: 860px) {
          .admin-bottom-nav {
            display: flex;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: var(--bg);
            border-top: 1px solid var(--border);
            z-index: 95;
            padding-bottom: env(safe-area-inset-bottom, 0px);
          }
        }
      `}</style>
      {TABS.map((tab) => {
        const active = pathname === tab.href || (tab.href !== '/admin' && pathname.startsWith(tab.href))
        return (
          <Link
            key={tab.href}
            href={tab.href}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              padding: '9px 0 7px',
              fontSize: 10.5,
              fontWeight: 700,
              color: active ? 'var(--gold-dark)' : 'var(--muted)',
              textDecoration: 'none',
            }}
          >
            <span style={{ fontSize: 18 }}>{tab.icon}</span>
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
