import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { formatRupiah } from '@/lib/utils'
import UpdateGoldPriceButton from '@/components/admin/UpdateGoldPriceButton'

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  pending: { bg: '#FEF3C7', color: '#92400E' },
  dibayar: { bg: '#DBEAFE', color: '#1E40AF' },
  diproses: { bg: '#EDE9FE', color: '#5B21B6' },
  selesai: { bg: '#D1FAE5', color: '#065F46' },
  batal: { bg: '#FEE2E2', color: '#991B1B' },
}

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  const totalOrders = orders?.length ?? 0
  const totalRevenue = orders?.reduce((sum, o) => sum + o.total_amount, 0) ?? 0
  const pendingCount = orders?.filter((o) => o.status === 'pending').length ?? 0
  const recentOrders = orders?.slice(0, 3) ?? []

  return (
    <main style={{ padding: 'clamp(14px, 4vw, 40px)', paddingBottom: 'clamp(80px, 15vw, 40px)' }}>
      <h1 style={{ fontSize: 'clamp(18px, 4vw, 26px)', fontWeight: 800, color: 'var(--text)', marginBottom: 16 }}>
        Dashboard
      </h1>

      {pendingCount > 0 && (
        <Link
          href="/admin/pesanan?status=pending"
          style={{
            display: 'block',
            background: '#FEF3C7',
            color: '#92400E',
            padding: '12px 16px',
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 13,
            marginBottom: 16,
            textDecoration: 'none',
          }}
        >
          🔔 {pendingCount} pesanan menunggu konfirmasi →
        </Link>
      )}

      <UpdateGoldPriceButton />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'Total Pesanan', value: totalOrders },
          { label: 'Pendapatan', value: formatRupiah(totalRevenue) },
          { label: 'Pending', value: pendingCount },
        ].map((s) => (
          <div key={s.label} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: 14 }}>
            <p style={{ fontSize: 10.5, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>
              {s.label}
            </p>
            <p style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)' }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>Pesanan Terbaru</h2>
        <Link href="/admin/pesanan" style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--gold-dark)' }}>
          Lihat Semua →
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {recentOrders.map((order) => {
          const style = STATUS_STYLES[order.status] ?? STATUS_STYLES.pending
          return (
            <Link
              key={order.id}
              href={`/admin/pesanan/${order.id}`}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: 12,
                textDecoration: 'none',
              }}
            >
              <div>
                <p style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text)' }}>{order.order_code}</p>
                <p style={{ fontSize: 11, color: 'var(--muted)' }}>{order.customer_name}</p>
              </div>
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
            </Link>
          )
        })}
        {recentOrders.length === 0 && (
          <p style={{ color: 'var(--muted)', fontSize: 13, padding: 20, textAlign: 'center' }}>Belum ada pesanan.</p>
        )}
      </div>
    </main>
  )
}