'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import Link from 'next/link'

export default function LupaPasswordPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const redirectUrl = `${window.location.origin}/reset-password`

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(20px, 5vw, 40px)' }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <h1 style={{ fontSize: 'clamp(20px, 4.5vw, 24px)', fontWeight: 800, color: 'var(--text)', marginBottom: 6 }}>
          Lupa Password
        </h1>
        <p style={{ fontSize: 'clamp(13px, 3vw, 14px)', color: 'var(--muted)', marginBottom: 24 }}>
          Masukkan email akun Anda, kami akan kirim link untuk membuat password baru.
        </p>

        {sent ? (
          <div style={{ fontSize: 13, color: '#065F46', background: '#ECFDF5', padding: '12px 14px', borderRadius: 8 }}>
            Link reset password sudah dikirim ke <strong>{email}</strong>. Silakan cek inbox
            (atau folder spam) email Anda.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              style={{
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
              {loading ? 'Mengirim...' : 'Kirim Link Reset'}
            </button>
          </form>
        )}

        <p style={{ fontSize: 13, textAlign: 'center', color: 'var(--muted)', marginTop: 20 }}>
          <Link href="/login" style={{ color: 'var(--gold-dark)', fontWeight: 700 }}>
            ← Kembali ke Login
          </Link>
        </p>
      </div>
    </main>
  )
}