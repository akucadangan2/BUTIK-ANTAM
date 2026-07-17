'use client'

import { useState } from 'react'

interface Props {
  orderCode: string
  amount: number
  customerName: string
  customerEmail: string
  customerPhone: string
}

export default function PayNowButton({ orderCode, amount, customerName, customerEmail, customerPhone }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handlePay() {
    setLoading(true)
    setError('')

    const res = await fetch('/api/doku/create-transaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderCode,
        amount,
        customerName,
        customerEmail,
        customerPhone,
      }),
    })

    const data = await res.json()

    if (!res.ok || !data.paymentUrl) {
      setError(data.error || 'Gagal memulai pembayaran')
      setLoading(false)
      return
    }

    window.location.href = data.paymentUrl
  }

  return (
    <div>
      {error && (
        <p style={{ fontSize: 13, color: '#DC2626', background: '#FEF2F2', padding: '10px 12px', borderRadius: 8, marginBottom: 12 }}>
          {error}
        </p>
      )}
      <button
        onClick={handlePay}
        disabled={loading}
        style={{
          width: '100%',
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
        {loading ? 'Memproses...' : 'Bayar Sekarang'}
      </button>
    </div>
  )
}