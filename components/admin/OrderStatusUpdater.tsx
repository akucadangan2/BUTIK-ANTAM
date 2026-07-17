'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'

const STATUS_OPTIONS = ['pending', 'dibayar', 'diproses', 'selesai', 'batal']

export default function OrderStatusUpdater({ orderId, currentStatus }: { orderId: number; currentStatus: string }) {
  const router = useRouter()
  const supabase = createClient()
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)

  async function handleUpdate() {
    setLoading(true)
    await supabase.from('orders').update({ status }).eq('id', orderId)
    setLoading(false)
    router.refresh()
  }

  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        style={{ padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14, textTransform: 'capitalize' }}
      >
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <button
        onClick={handleUpdate}
        disabled={loading || status === currentStatus}
        style={{
          padding: '10px 20px',
          background: 'var(--gold)',
          border: 'none',
          borderRadius: 8,
          fontWeight: 700,
          fontSize: 14,
          cursor: loading || status === currentStatus ? 'default' : 'pointer',
          opacity: loading || status === currentStatus ? 0.5 : 1,
        }}
      >
        {loading ? 'Menyimpan...' : 'Update Status'}
      </button>
    </div>
  )
}