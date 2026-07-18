import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { formatRupiah } from '@/lib/utils'
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

  const { data: confirmation } = await supabase
    .from('payment_confirmations')
    .select('id, created_at')
    .eq('order_id', id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const statusStyle = STATUS_STYLES[order.status] ?? STATUS_STYLES.pending

  return (
    <main style={{ padding: 'clamp(20px, 5vw, 48px) clamp(16px, 5vw, 40px)', maxWidth: 700, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'clamp(18px, 4vw, 28px)', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ fontSize: 'clamp(17px, 4vw, 22px)', fontWeight: 800, color: 'var(--text)' }}>{order.order_code}</h1>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
            {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            padding: '4px 12px',
            borderRadius: 999,
            background: statusStyle.bg,
            color: statusStyle.color,
            textTransform: 'capitalize',
            whiteSpace: 'nowrap',
          }}
        >
          {order.status}
        </span>
      </div>

      {order.status === 'pending' && confirmation && (
        <div style={{ border: '1px solid var(--border)', borderRadius: 14, padding: 'clamp(14px, 3.5vw, 24px)', marginBottom: 'clamp(14px, 3vw, 20px)', background: '#EFF6FF' }}>
          <p style={{ fontSize: 13.5, color: '#1E40AF', fontWeight: 700, marginBottom: 4 }}>
            Menunggu Verifikasi Admin
          </p>
          <p style={{ fontSize: 12.5, color: '#1E3A8A', lineHeight: 1.6 }}>
            Bukti pembayaran Anda sudah kami terima pada{' '}
            {new Date(confirmation.created_at).toLocaleString('id-ID')}. Admin akan
            memverifikasi dalam waktu 1x24 jam kerja.
          </p>
        </div>
      )}

      {order.status === 'pending' && !confirmation && (
        <div style={{ border: '1px solid var(--border)', borderRadius: 14, padding: 'clamp(14px, 3.5vw, 24px)', marginBottom: 'clamp(14px, 3vw, 20px)', background: 'var(--bg-alt)' }}>
          <p style={{ fontSize: 13.5, color: 'var(--text)', marginBottom: 12 }}>
            Pesanan Anda menunggu pembayaran. Selesaikan pembayaran sekarang.
          </p>
          <Link
            href={`/checkout/pembayaran/${order.order_code}`}
            style={{
              display: 'block',
              textAlign: 'center',
              width: '100%',
              padding: 'clamp(11px, 2.8vw, 13px) 0',
              background: 'var(--gold)',
              color: '#1A1A2E',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 'clamp(13px, 3vw, 14px)',
              textDecoration: 'none',
            }}
          >
            Lanjutkan Pembayaran
          </Link>
        </div>
      )}

      <div style={{ border: '1px solid var(--border)', borderRadius: 14, padding: 'clamp(14px, 3.5vw, 24px)', marginBottom: 'clamp(14px, 3vw, 20px)' }}>
        <h2 style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--text)', marginBottom: 10 }}>Alamat Pengiriman</h2>
        <p style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 4 }}>
          Metode: <span style={{ color: 'var(--text)', fontWeight: 600, textTransform: 'uppercase' }}>{order.shipping_method}</span>
        </p>
        <p style={{ fontSize: 12.5, color: 'var(--muted)' }}>{order.customer_address || '-'}</p>
      </div>

      <div style={{ border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: 'clamp(11px, 3vw, 14px) clamp(14px, 3.5vw, 24px)', background: 'var(--bg-alt)', fontWeight: 800, fontSize: 13.5 }}>
          Barang Dipesan
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {orderItems?.map((item) => (
            <div
              key={item.id}
              style={{
                borderTop: '1px solid var(--border)',
                padding: 'clamp(11px, 3vw, 14px) clamp(14px, 3.5vw, 24px)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 13, color: 'var(--text)' }}>{item.product_name}</p>
                <p style={{ fontSize: 11.5, color: 'var(--muted)' }}>x{item.quantity}</p>
              </div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                {formatRupiah(item.price * item.quantity)}
              </p>
            </div>
          ))}

          <div
            style={{
              borderTop: '2px solid var(--border)',
              padding: 'clamp(11px, 3vw, 14px) clamp(14px, 3.5vw, 24px)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <p style={{ fontWeight: 800, fontSize: 14, color: 'var(--text)' }}>Total</p>
            <p style={{ fontWeight: 800, fontSize: 14, color: 'var(--text)' }}>{formatRupiah(order.total_amount)}</p>
          </div>
        </div>
      </div>
    </main>
  )
}