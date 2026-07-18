'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'

interface Props {
  orderId: number
  orderCode: string
  defaultAmount: number
  transferredTo: string
}

export default function PaymentConfirmationForm({ orderId, orderCode, defaultAmount, transferredTo }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [paymentTime, setPaymentTime] = useState('')
  const [sourceBank, setSourceBank] = useState('')
  const [sourceAccountName, setSourceAccountName] = useState('')
  const [amount, setAmount] = useState(defaultAmount.toString())
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!proofFile) {
      setError('Bukti transfer wajib diunggah.')
      return
    }

    setLoading(true)

    const ext = proofFile.name.split('.').pop()
    const path = `bukti-transfer/${orderCode}-${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('customer-uploads')
      .upload(path, proofFile)

    if (uploadError) {
      setError('Gagal mengunggah bukti transfer: ' + uploadError.message)
      setLoading(false)
      return
    }

    const { error: insertError } = await supabase.from('payment_confirmations').insert({
      order_id: orderId,
      payment_time: new Date(paymentTime).toISOString(),
      transferred_to: transferredTo,
      source_bank: sourceBank,
      source_account_name: sourceAccountName,
      amount: parseInt(amount, 10),
      proof_image_path: path,
    })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    router.push('/akun')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <label style={labelStyle}>Nomor Invoice</label>
        <input value={orderCode} disabled style={{ ...inputStyle, background: 'var(--bg-alt)', color: 'var(--muted)' }} />
      </div>

      <div>
        <label style={labelStyle}>Waktu Pembayaran</label>
        <input
          type="datetime-local"
          value={paymentTime}
          onChange={(e) => setPaymentTime(e.target.value)}
          required
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Ditransfer Ke</label>
        <input value={transferredTo} disabled style={{ ...inputStyle, background: 'var(--bg-alt)', color: 'var(--muted)' }} />
      </div>

      <div>
        <label style={labelStyle}>Bank Asal Anda</label>
        <input
          placeholder="Contoh: BCA"
          value={sourceBank}
          onChange={(e) => setSourceBank(e.target.value)}
          required
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Nama Pemilik Rekening Anda</label>
        <input
          value={sourceAccountName}
          onChange={(e) => setSourceAccountName(e.target.value)}
          required
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Jumlah Transfer (Rp)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Bukti Transfer (wajib)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProofFile(e.target.files?.[0] ?? null)}
          required
          style={{ fontSize: 13 }}
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
          cursor: loading ? 'default' : 'pointer',
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? 'Mengirim...' : 'Konfirmasi'}
      </button>
    </form>
  )
}

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: 'var(--muted)',
  display: 'block',
  marginBottom: 6,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  border: '1px solid var(--border)',
  borderRadius: 8,
  fontSize: 14,
}