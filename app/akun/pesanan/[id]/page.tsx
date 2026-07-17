import { createClient } from '@/lib/supabase-server'
import { formatRupiah } from '@/lib/utils'
import PayNowButton from '@/components/PayNowButton'
import { notFound } from 'next/navigation'

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  pending: { bg: '#FEF3C7', color: '#92400E' },
  dibayar: { bg: '#DBEAFE', color: '#1E40AF' },
  diproses: { bg: '#EDE9FE', color: '#5B21B6' },
  selesai: { bg: '#D1FAE5', color: '#065F46' },
  batal: { bg: '#FEE2E2', color: '#991B1B' },
}

export default async function PesananDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()

  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .eq('user_id', userData.user?.id ?? '')
    .single()

  if (!order) return notFound()

  const { data: orderItems } = await supabase.from('order_items').select('*').eq('order_id', id)

  const statusStyle = STATUS_STYLES[order.status] ?? STATUS_STYLES.pending

  return (
    <main style={{ padding: '48px 40px', maxWidth: 700, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)' }}>{order.order_code}</h1>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
            {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            padding: '5px 14px',
            borderRadius: 999,
            background: statusStyle.bg,
            color: statusStyle.color,
            textTransform: 'capitalize',
          }}
        >
          {order.status}
        </span>
      </div>

      {order.status === 'pending' && (
        <div style={{ border: '1px solid var(--border)', borderRadius: 14, padding: 24, marginBottom: 20, background: 'var(--bg-alt)' }}>
          <p style={{ fontSize: 14, color: 'var(--text)', marginBottom: 14 }}>
            Pesanan Anda menunggu pembayaran. Selesaikan pembayaran sekarang.
          </p>
          <PayNowButton
            orderCode={order.order_code}
            amount={order.total_amount}
            customerName={order.customer_name}
            customerEmail={order.customer_email}
            customerPhone={order.customer_phone}
          />
        </div>
      )}

      <div style={{ border: '1px solid var(--border)', borderRadius: 14, padding: 24, marginBottom: 20 }}>
        <h2 style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>Alamat Pengiriman</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>
          Metode: <span style={{ color: 'var(--text)', fontWeight: 600, textTransform: 'uppercase' }}>{order.shipping_method}</span>
        </p>
        <p style={{ fontSize: 13, color: 'var(--muted)' }}>{order.customer_address || '-'}</p>
      </div>

      <div style={{ border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '14px 24px', background: 'var(--bg-alt)', fontWeight: 800, fontSize: 14 }}>
          Barang Dipesan
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {orderItems?.map((item) => (
              <tr key={item.id} style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: '14px 24px', fontSize: 14 }}>{item.product_name}</td>
                <td style={{ padding: '14px 24px', fontSize: 14, textAlign: 'center', color: 'var(--muted)' }}>x{item.quantity}</td>
                <td style={{ padding: '14px 24px', fontSize: 14, textAlign: 'right', fontWeight: 600 }}>
                  {formatRupiah(item.price * item.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ borderTop: '2px solid var(--border)' }}>
              <td colSpan={2} style={{ padding: '14px 24px', fontWeight: 800 }}>Total</td>
              <td style={{ padding: '14px 24px', textAlign: 'right', fontWeight: 800 }}>{formatRupiah(order.total_amount)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </main>
  )
}