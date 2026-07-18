'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError || !data.user) {
      setError(signInError?.message || 'Login gagal')
      setLoading(false)
      return
    }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()

    const redirectTo = searchParams.get('redirect')
    const target = redirectTo || (profile?.role === 'admin' ? '/admin' : '/akun')

    router.push(target)
    router.refresh()
  }

  return (
    <main className="ba-auth-main">
      <style>{`
        @keyframes baFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes baFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -30px) scale(1.08); }
        }
        @keyframes baFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-25px, 20px) scale(1.05); }
        }
        .ba-auth-main {
          min-height: 100vh;
          display: flex;
        }
        .ba-auth-brand {
          flex: 1 1 45%;
          position: relative;
          overflow: hidden;
          background: linear-gradient(160deg, #1A1A2E 0%, #2A2440 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 60px;
          min-height: 100vh;
        }
        .ba-auth-form-panel {
          flex: 1 1 55%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }
        .ba-auth-card { animation: baFadeUp 0.5s ease both; width: 100%; max-width: 380px; }
        .ba-auth-input {
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .ba-auth-input:focus {
          outline: none;
          border-color: var(--gold);
          box-shadow: 0 0 0 3px rgba(245, 180, 0, 0.15);
        }
        .ba-auth-btn {
          transition: background 0.2s, transform 0.1s;
        }
        .ba-auth-btn:hover:not(:disabled) {
          background: var(--gold-dark);
        }
        .ba-auth-btn:active:not(:disabled) {
          transform: scale(0.98);
        }
        .ba-blob-1 { animation: baFloat1 7s ease-in-out infinite; }
        .ba-blob-2 { animation: baFloat2 9s ease-in-out infinite; }

        @media (max-width: 780px) {
          .ba-auth-main { flex-direction: column; min-height: auto; }
          .ba-auth-brand {
            min-height: 0;
            flex: 0 0 auto;
            padding: 32px 24px;
          }
          .ba-auth-form-panel { padding: 28px 20px 40px; }
        }
      `}</style>

      <div className="ba-auth-brand">
        <div
          className="ba-blob-1"
          style={{
            position: 'absolute',
            top: '-80px',
            left: '-60px',
            width: 280,
            height: 280,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,180,0,0.25) 0%, rgba(245,180,0,0) 70%)',
          }}
        />
        <div
          className="ba-blob-2"
          style={{
            position: 'absolute',
            bottom: '-100px',
            right: '-60px',
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,180,0,0.18) 0%, rgba(245,180,0,0) 70%)',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 'clamp(18px, 4vw, 22px)', fontWeight: 800, color: '#fff', marginBottom: 'clamp(10px, 3vw, 20px)' }}>
            BUTIK <span style={{ color: 'var(--gold)' }}>ANTAM</span>
          </div>
          <h1 style={{ fontSize: 'clamp(22px, 5vw, 32px)', fontWeight: 800, color: '#fff', lineHeight: 1.3, marginBottom: 'clamp(8px, 2vw, 16px)', maxWidth: 380 }}>
            Selamat Datang Kembali
          </h1>
          <p style={{ fontSize: 'clamp(13px, 3vw, 15px)', color: '#9CA3AF', maxWidth: 340, lineHeight: 1.7 }}>
            Masuk untuk melihat riwayat pesanan, kelola profil, dan belanja emas
            Antam asli dengan lebih mudah.
          </p>
        </div>
      </div>

      <div className="ba-auth-form-panel">
        <div className="ba-auth-card">
          <h2 style={{ fontSize: 'clamp(20px, 4.5vw, 24px)', fontWeight: 800, color: 'var(--text)', marginBottom: 6 }}>Masuk</h2>
          <p style={{ fontSize: 'clamp(13px, 3vw, 14px)', color: 'var(--muted)', marginBottom: 'clamp(20px, 5vw, 28px)' }}>
            Masukkan email dan password akun Anda.
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
                Email
              </label>
              <input
                type="email"
                className="ba-auth-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border)', borderRadius: 10, fontSize: 14 }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
                Password
              </label>
              <input
                type="password"
                className="ba-auth-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border)', borderRadius: 10, fontSize: 14 }}
              />
            </div>

            {error && (
              <p style={{ fontSize: 13, color: '#DC2626', background: '#FEF2F2', padding: '10px 12px', borderRadius: 8 }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="ba-auth-btn"
              style={{
                marginTop: 6,
                padding: '13px 0',
                background: 'var(--gold)',
                border: 'none',
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 14,
                color: '#1A1A2E',
                cursor: loading ? 'default' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>

            <p style={{ fontSize: 13, textAlign: 'center', color: 'var(--muted)', marginTop: 6 }}>
              Belum punya akun?{' '}
              <Link href="/daftar" style={{ color: 'var(--gold-dark)', fontWeight: 700 }}>
                Daftar di sini
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  )
}