'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/berita', label: 'Berita', icon: '📰' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside
      style={{
        width: 220,
        flexShrink: 0,
        background: '#1A1A2E',
        color: '#fff',
        minHeight: '100vh',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ fontSize: 17, fontWeight: 800, padding: '0 8px 28px' }}>
        BUTIK <span style={{ color: 'var(--gold)' }}>ANTAM</span>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        {NAV.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
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
  )
}