'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'

export default function CancelOrderButton({ orderId }: { orderId: number }) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  async function handleCancel() {
    if (!confirm('Batalkan pesanan ini?')) return
    setLoading(true)
    await supabase.from('orders').update({ status: 'batal' }).eq('id', orderId)
    setLoading(false)
    router.push('/katalog')
  }

  return (
    <button
      onClick={handleCancel}
      disabled={loading}
      style={{
        width: '100%',
        padding: '12px 0',
        background: 'transparent',
        border: '1px solid var(--border)',
        color: '#DC2626',
        borderRadius: 10,
        fontWeight: 700,
        fontSize: 14,
        cursor: loading ? 'default' : 'pointer',
      }}
    >
      {loading ? 'Membatalkan...' : 'Batalkan Order'}
    </button>
  )
}