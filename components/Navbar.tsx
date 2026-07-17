'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { createClient } from '@/lib/supabase-client'
import type { User } from '@supabase/supabase-js'

const NAV_LINKS = [
  { href: '/katalog', label: 'Emas Batangan' },
  { href: '/harga-emas', label: 'Harga Emas' },
  { href: '/layanan', label: 'Layanan Kami' },
  { href: '/berita', label: 'Berita' },
  { href: '/faq', label: 'FAQ' },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { items } = useCart()
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const supabase = createClient()

  const [user, setUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [supabase])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
    router.refresh()
  }

  if (pathname?.startsWith('/admin') || pathname === '/login' || pathname === '/daftar') return null

  return (
    <header
      style={{
        background: 'var(--bg)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 1px 0 var(--border), 0 4px 12px rgba(0,0,0,0.03)',
      }}
    >
      <style>{`
        .ba-nav-desktop { display: flex; }
        .ba-nav-hamburger { display: none; }
        .ba-nav-mobile-panel { display: none; }
        @media (max-width: 860px) {
          .ba-nav-desktop { display: none; }
          .ba-nav-hamburger { display: flex; }
          .ba-nav-mobile-panel.open { display: flex; }
        }
      `}</style>

      <div
        style={{
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Image src="/images/logo.png" alt="Butik Antam" width={36} height={36} style={{ borderRadius: 8 }} />
          <span style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.01em' }}>
            BUTIK <span style={{ color: 'var(--gold-dark)' }}>ANTAM</span>
          </span>
        </Link>

        {/* NAV DESKTOP */}
        <nav className="ba-nav-desktop" style={{ gap: 26, fontSize: 14, fontWeight: 600, alignItems: 'center', flexWrap: 'wrap' }}>
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  color: active ? 'var(--text)' : 'var(--muted)',
                  paddingBottom: 4,
                  borderBottom: active ? '2px solid var(--gold)' : '2px solid transparent',
                  whiteSpace: 'nowrap',
                }}
              >
                {link.label}
              </Link>
            )
          })}

          <Link href="/keranjang" style={{ position: 'relative', color: pathname === '/keranjang' ? 'var(--text)' : 'var(--muted)', display: 'flex', alignItems: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {cartCount > 0 && (
              <span style={{ position: 'absolute', top: -8, right: -10, background: 'var(--gold)', color: 'var(--text)', fontSize: 10, fontWeight: 800, borderRadius: '50%', width: 17, height: 17, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <Link href="/akun" style={{ color: pathname === '/akun' ? 'var(--text)' : 'var(--muted)', fontWeight: 700 }}>
                Akun Saya
              </Link>
              <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', padding: '8px 16px', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                Keluar
              </button>
            </div>
          ) : (
            <Link href="/login" style={{ background: 'var(--gold)', color: 'var(--text)', padding: '9px 20px', borderRadius: 8, fontWeight: 700, whiteSpace: 'nowrap' }}>
              Masuk
            </Link>
          )}
        </nav>

        {/* HAMBURGER (mobile) */}
        <div className="ba-nav-hamburger" style={{ alignItems: 'center', gap: 16 }}>
          <Link href="/keranjang" style={{ position: 'relative', color: 'var(--muted)', display: 'flex' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {cartCount > 0 && (
              <span style={{ position: 'absolute', top: -8, right: -10, background: 'var(--gold)', color: 'var(--text)', fontSize: 10, fontWeight: 800, borderRadius: '50%', width: 17, height: 17, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {cartCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
            aria-label="Buka menu"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="2" strokeLinecap="round">
              {menuOpen ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* PANEL MOBILE */}
      <div
        className={`ba-nav-mobile-panel${menuOpen ? ' open' : ''}`}
        style={{
          flexDirection: 'column',
          borderTop: '1px solid var(--border)',
          padding: '16px 20px 20px',
          gap: 4,
        }}
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              padding: '12px 4px',
              fontSize: 15,
              fontWeight: 600,
              color: pathname === link.href ? 'var(--gold-dark)' : 'var(--text)',
              borderBottom: '1px solid var(--border)',
            }}
          >
            {link.label}
          </Link>
        ))}

        {user ? (
          <>
            <Link href="/akun" style={{ padding: '12px 4px', fontSize: 15, fontWeight: 700, color: 'var(--text)', borderBottom: '1px solid var(--border)' }}>
              Akun Saya
            </Link>
            <button
              onClick={handleLogout}
              style={{ marginTop: 12, padding: '12px 0', background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
            >
              Keluar
            </button>
          </>
        ) : (
          <Link
            href="/login"
            style={{ marginTop: 12, textAlign: 'center', padding: '12px 0', background: 'var(--gold)', color: 'var(--text)', borderRadius: 8, fontWeight: 700, fontSize: 14 }}
          >
            Masuk
          </Link>
        )}
      </div>
    </header>
  )
}