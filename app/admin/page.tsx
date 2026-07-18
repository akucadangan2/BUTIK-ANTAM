import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { formatRupiah } from '@/lib/utils'
import UpdateGoldPriceButton from '@/components/admin/UpdateGoldPriceButton'
import ManualGoldPriceForm from '@/components/admin/ManualGoldPriceForm'

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
    <main style={{ padding: 'clamp(16px, 4vw, 40px)' }}>
      <style>{`
        .admin-dashboard-table { display: block; }
        .admin-dashboard-cards { display: none; }
        @media (max-width: 720px) {
          .admin-dashboard-table { display: none; }
          .admin-dashboard-cards { display: flex; flex-direction: column; gap: 12px; }
        }
      `}</style>

      <h1 style={{ fontSize: 'clamp(20px, 4vw, 26px)', fontWeight: 800, color: 'var(--text)', marginBottom: 'clamp(16px, 3vw, 28px)' }}>
        Dashboard
      </h1>

      <UpdateGoldPriceButton />
      <ManualGoldPriceForm />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'clamp(12px, 3vw, 20px)', marginBottom: 'clamp(20px, 4vw, 32px)' }}>
        {[
          { label: 'Total Pesanan', value: totalOrders },
          { label: 'Total Pendapatan', value: formatRupiah(totalRevenue) },
          { label: 'Menunggu Konfirmasi', value: pendingCount },
        ].map((s) => (
          <div key={s.label} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, padding: 'clamp(14px, 3vw, 22px)' }}>
            <p style={{ fontSize: 'clamp(10px, 2vw, 12px)', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
              {s.label}
            </p>
            <p style={{ fontSize: 'clamp(17px, 3.5vw, 24px)', fontWeight: 800, color: 'var(--text)' }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 14, fontSize: 16 }}>
        Pesanan Terbaru
      </div>

      {/* TABEL — DESKTOP */}
      <div className="admin-dashboard-table" style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
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

      {/* KARTU — MOBILE */}
      <div className="admin-dashboard-cards">
        {orders?.map((order) => {
          const style = STATUS_STYLES[order.status] ?? STATUS_STYLES.pending
          return (
            <div key={order.id} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{order.order_code}</span>
                <span
                  style={{
                    fontSize: 11,
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: 'var(--text)' }}>{order.customer_name}</span>
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>{order.customer_phone}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginTop: 2 }}>
                  {formatRupiah(order.total_amount)}
                </span>
              </div>

              <Link
                href={`/admin/pesanan/${order.id}`}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'center',
                  padding: '10px 0',
                  background: 'var(--gold)',
                  color: '#1A1A2E',
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 13,
                  textDecoration: 'none',
                }}
              >
                Lihat Detail →
              </Link>
            </div>
          )
        })}
        {(!orders || orders.length === 0) && (
          <p style={{ textAlign: 'center', color: 'var(--muted)', padding: 24 }}>Belum ada pesanan.</p>
        )}
      </div>
    </main>
  )
}