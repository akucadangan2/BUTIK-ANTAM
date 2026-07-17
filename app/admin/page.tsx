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

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return <div style={{ padding: 40 }}>Error: {error.message}</div>
  }

  const totalOrders = orders?.length ?? 0
  const totalRevenue = orders?.reduce((sum, o) => sum + o.total_amount, 0) ?? 0
  const pendingCount = orders?.filter((o) => o.status === 'pending').length ?? 0

  return (
    <main style={{ padding: 40 }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', marginBottom: 28 }}>
        Dashboard
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 32 }}>
        {[
          { label: 'Total Pesanan', value: totalOrders },
          { label: 'Total Pendapatan', value: formatRupiah(totalRevenue) },
          { label: 'Menunggu Konfirmasi', value: pendingCount },
        ].map((s) => (
          <div key={s.label} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, padding: 22 }}>
            <p style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>
              {s.label}
            </p>
            <p style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border)', fontWeight: 700, color: 'var(--text)' }}>
          Pesanan Terbaru
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', background: 'var(--bg-alt)' }}>
              <th style={{ padding: '12px 22px', fontSize: 12, color: 'var(--muted)', fontWeight: 700 }}>Kode</th>
              <th style={{ padding: '12px 22px', fontSize: 12, color: 'var(--muted)', fontWeight: 700 }}>Nama</th>
              <th style={{ padding: '12px 22px', fontSize: 12, color: 'var(--muted)', fontWeight: 700 }}>HP</th>
              <th style={{ padding: '12px 22px', fontSize: 12, color: 'var(--muted)', fontWeight: 700 }}>Total</th>
              <th style={{ padding: '12px 22px', fontSize: 12, color: 'var(--muted)', fontWeight: 700 }}>Status</th>
              <th style={{ padding: '12px 22px', fontSize: 12, color: 'var(--muted)', fontWeight: 700 }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => {
              const style = STATUS_STYLES[order.status] ?? STATUS_STYLES.pending
              return (
                <tr key={order.id} style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={{ padding: '14px 22px', fontSize: 14, color: 'var(--text)', fontWeight: 600 }}>{order.order_code}</td>
                  <td style={{ padding: '14px 22px', fontSize: 14, color: 'var(--text)' }}>{order.customer_name}</td>
                  <td style={{ padding: '14px 22px', fontSize: 14, color: 'var(--muted)' }}>{order.customer_phone}</td>
                  <td style={{ padding: '14px 22px', fontSize: 14, color: 'var(--text)', fontWeight: 600 }}>{formatRupiah(order.total_amount)}</td>
                  <td style={{ padding: '14px 22px' }}>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: 999,
                        background: style.bg,
                        color: style.color,
                        textTransform: 'capitalize',
                      }}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 22px' }}>
                    <Link href={`/admin/pesanan/${order.id}`} style={{ color: 'var(--gold-dark)', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
                      Detail
                    </Link>
                  </td>
                </tr>
              )
            })}
            {(!orders || orders.length === 0) && (
              <tr>
                <td colSpan={6} style={{ padding: 30, textAlign: 'center', color: 'var(--muted)' }}>
                  Belum ada pesanan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}