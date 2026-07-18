import { Suspense } from 'react'
import ResetPasswordForm from './ResetPasswordForm'

export default function ResetPasswordPage() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(20px, 5vw, 40px)' }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <h1 style={{ fontSize: 'clamp(20px, 4.5vw, 24px)', fontWeight: 800, color: 'var(--text)', marginBottom: 6 }}>
          Buat Password Baru
        </h1>
        <p style={{ fontSize: 'clamp(13px, 3vw, 14px)', color: 'var(--muted)', marginBottom: 24 }}>
          Masukkan password baru untuk akun Anda.
        </p>

        <Suspense fallback={<div>Memuat...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  )
}