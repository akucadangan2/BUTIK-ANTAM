'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DaftarPage() {
  const router = useRouter()
  const supabase = createClient()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setInfo('')

    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok dengan password.')
      return
    }

    setLoading(true)

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, phone } },
    })

    if (signUpError || !data.user) {
      setError(signUpError?.message || 'Gagal mendaftar')
      setLoading(false)
      return
    }

    if (data.session) {
      router.push('/akun')
      router.refresh()
      setLoading(false)
      return
    }

    // Fallback: kalau signUp tidak langsung memberi sesi, coba login otomatis.
    // Kalau proyek Supabase memang tidak lagi mewajibkan konfirmasi email, ini akan berhasil.
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (!signInError && signInData.session) {
      router.push('/akun')
      router.refresh()
    } else {
      setInfo('Pendaftaran berhasil! Silakan cek email Anda untuk konfirmasi sebelum login.')
    }

    setLoading(false)
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
        .ba-eye-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--muted);
          display: flex;
          align-items: center;
          padding: 4px;
        }
        .ba-eye-btn:hover { color: var(--text); }

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

      {/* Panel kiri — branding */}
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
            Bergabung Bersama Kami
          </h1>
          <p style={{ fontSize: 'clamp(13px, 3vw, 15px)', color: '#9CA3AF', maxWidth: 340, lineHeight: 1.7 }}>
            Daftar sekarang untuk mulai belanja emas Antam asli, bersertifikat,
            dan lacak semua pesanan Anda di satu tempat.
          </p>
        </div>
      </div>

      {/* Panel kanan — form */}
      <div className="ba-auth-form-panel">
        <div className="ba-auth-card">
          <h2 style={{ fontSize: 'clamp(20px, 4.5vw, 24px)', fontWeight: 800, color: 'var(--text)', marginBottom: 6 }}>Daftar Akun</h2>
          <p style={{ fontSize: 'clamp(13px, 3vw, 14px)', color: 'var(--muted)', marginBottom: 'clamp(20px, 5vw, 28px)' }}>
            Lengkapi data di bawah untuk membuat akun baru.
          </p>

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
                Nama Lengkap
              </label>
              <input
                className="ba-auth-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border)', borderRadius: 10, fontSize: 14 }}
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
                No. HP
              </label>
              <input
                className="ba-auth-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border)', borderRadius: 10, fontSize: 14 }}
              />
            </div>

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
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="ba-auth-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  style={{ width: '100%', padding: '12px 44px 12px 14px', border: '1px solid var(--border)', borderRadius: 10, fontSize: 14 }}
                />
                <button
                  type="button"
                  className="ba-eye-btn"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)' }}
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.9 18.9 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
                Konfirmasi Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="ba-auth-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  style={{ width: '100%', padding: '12px 44px 12px 14px', border: '1px solid var(--border)', borderRadius: 10, fontSize: 14 }}
                />
                <button
                  type="button"
                  className="ba-eye-btn"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)' }}
                  aria-label={showConfirmPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showConfirmPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.9 18.9 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p style={{ fontSize: 13, color: '#DC2626', background: '#FEF2F2', padding: '10px 12px', borderRadius: 8 }}>
                {error}
              </p>
            )}
            {info && (
              <p style={{ fontSize: 13, color: '#065F46', background: '#ECFDF5', padding: '10px 12px', borderRadius: 8 }}>
                {info}
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
              {loading ? 'Memproses...' : 'Daftar'}
            </button>

            <p style={{ fontSize: 13, textAlign: 'center', color: 'var(--muted)', marginTop: 6 }}>
              Sudah punya akun?{' '}
              <Link href="/login" style={{ color: 'var(--gold-dark)', fontWeight: 700 }}>
                Masuk di sini
              </Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  )
}