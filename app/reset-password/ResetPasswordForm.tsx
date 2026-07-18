'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import Link from 'next/link'

export default function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const exchanged = useRef(false)

  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    async function init() {
      if (exchanged.current) return
      exchanged.current = true

      // Kalau sesi sudah ada (misal halaman di-reload setelah kode dipakai), langsung siap
      const { data: existing } = await supabase.auth.getSession()
      if (existing.session) {
        setStatus('ready')
        return
      }

      const code = searchParams.get('code')
      if (!code) {
        setStatus('error')
        return
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) {
        setStatus('error')
        return
      }

      setStatus('ready')
    }

    init()
  }, [searchParams, supabase])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok.')
      return
    }

    setSubmitting(true)

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      setSubmitting(false)
      return
    }

    setSuccess(true)
    setSubmitting(false)

    setTimeout(() => {
      router.push('/login')
    }, 2000)
  }

  if (status === 'loading') {
    return <p style={{ fontSize: 13, color: 'var(--muted)' }}>Memverifikasi link...</p>
  }

  if (status === 'error') {
    return (
      <div>
        <p style={{ fontSize: 13, color: '#DC2626', background: '#FEF2F2', padding: '12px 14px', borderRadius: 8, marginBottom: 16 }}>
          Link reset password tidak valid atau sudah kedaluwarsa.
        </p>
        <Link href="/lupa-password" style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold-dark)' }}>
          Minta link baru →
        </Link>
      </div>
    )
  }

  if (success) {
    return (
      <div style={{ fontSize: 13, color: '#065F46', background: '#ECFDF5', padding: '12px 14px', borderRadius: 8 }}>
        Password berhasil diubah. Mengarahkan ke halaman login...
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
          Password Baru
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border)', borderRadius: 10, fontSize: 14 }}
        />
      </div>

      <div>
        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
          Konfirmasi Password Baru
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
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
        disabled={submitting}
        style={{
          padding: '13px 0',
          background: 'var(--gold)',
          border: 'none',
          borderRadius: 10,
          fontWeight: 700,
          fontSize: 14,
          color: '#1A1A2E',
          cursor: submitting ? 'default' : 'pointer',
          opacity: submitting ? 0.7 : 1,
        }}
      >
        {submitting ? 'Menyimpan...' : 'Simpan Password Baru'}
      </button>
    </form>
  )
}