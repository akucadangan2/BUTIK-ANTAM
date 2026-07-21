import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { formatRupiah } from '@/lib/utils'

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  pending: { bg: '#FEF3C7', color: '#92400E' },
  dibayar: { bg: '#DBEAFE', color: '#1E40AF' },
  diproses: { bg: '#EDE9FE', color: '#5B21B6' },
  selesai: { bg: '#D1FAE5', color: '#065F46' },
  batal: { bg: '#FEE2E2', color: '#991B1B' },
}

const STATUS_TABS = [
  { key: '', label: 'Semua' },
  { key: 'pending', label: 'Pending' },
  { key: 'dibayar', label: 'Dibayar' },
  { key: 'diproses', label: 'Diproses' },
  { key: 'selesai', label: 'Selesai' },
  { key: 'batal', label: 'Batal' },
]

export default async function AdminPesananPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const supabase = await createClient()

  let query = supabase.from('orders').select('*').order('created_at', { ascending: false })
  if (status) query = query.eq('status', status)

  const { data: orders } = await query

  return (
    <main style={{ padding: 'clamp(14px, 4vw, 40px)', paddingBottom: 'clamp(80px, 15vw, 40px)' }}>
      <h1 style={{ fontSize: 'clamp(18px, 4vw, 26px)', fontWeight: 800, color: 'var(--text)', marginBottom: 14 }}>
        Pesanan
      </h1>

      {/* Filter status — sticky, bisa digeser di HP */}
      <div
        style={{
          display: 'flex',
          gap: 6,
          overflowX: 'auto',
          paddingBottom: 8,
          marginBottom: 14,
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {STATUS_TABS.map((tab) => {
          const isActive = (status ?? '') === tab.key
          return (
            <Link
              key={tab.key}
              href={tab.key ? `/admin/pesanan?status=${tab.key}` : '/admin/pesanan'}
              style={{
                padding: '7px 14px',
                borderRadius: 999,
                fontSize: 12.5,
                fontWeight: 700,
                whiteSpace: 'nowrap',
                flexShrink: 0,
                background: isActive ? 'var(--text)' : 'var(--bg)',
                color: isActive ? '#fff' : 'var(--muted)',
                border: '1px solid var(--border)',
              }}
            >
              {tab.label}
            </Link>
          )
        })}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {orders?.map((order) => {
          const style = STATUS_STYLES[order.status] ?? STATUS_STYLES.pending
          return (
            <Link
              key={order.id}
              href={`/admin/pesanan/${order.id}`}
              style={{
                display: 'block',
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: 14,
                textDecoration: 'none',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text)' }}>{order.order_code}</span>
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    padding: '3px 9px',
                    borderRadius: 999,
                    background: style.bg,
                    color: style.color,
                    textTransform: 'capitalize',
                  }}
                >
                  {order.status}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <p style={{ fontSize: 12.5, color: 'var(--text)' }}>{order.customer_name}</p>
                  <p style={{ fontSize: 11, color: 'var(--muted)' }}>{order.customer_phone}</p>
                </div>
                <p style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text)' }}>{formatRupiah(order.total_amount)}</p>
              </div>
            </Link>
          )
        })}

        {(!orders || orders.length === 0) && (
          <p style={{ textAlign: 'center', color: 'var(--muted)', padding: 30, fontSize: 13 }}>
            Tidak ada pesanan{status ? ` dengan status "${status}"` : ''}.
          </p>
        )}
      </div>
    </main>
  )
}