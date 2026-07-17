'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/hooks/useCart'

export default function SuksesContent() {
  const params = useSearchParams()
  const kode = params.get('kode')
  const { clearCart } = useCart()

  useEffect(() => {
    clearCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main style={{ padding: 40, textAlign: 'center' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
        Pesanan Berhasil Dibuat! 🎉
      </h1>
      <p style={{ color: '#666', marginBottom: 4 }}>Kode Pesanan Kamu:</p>
      <p style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>{kode}</p>
      <p style={{ color: '#666', marginBottom: 24 }}>
        Silakan lakukan pembayaran dan konfirmasi ke admin kami.
      </p>
      <Link href="/katalog" style={{ color: '#111', fontWeight: 600 }}>
        ← Kembali ke Katalog
      </Link>
    </main>
  )
}