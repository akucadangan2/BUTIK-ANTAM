import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { formatRupiah } from '@/lib/utils'
import OrderStatusUpdater from '@/components/admin/OrderStatusUpdater'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase-admin'

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  pending: { bg: '#FEF3C7', color: '#92400E' },
  dibayar: { bg: '#DBEAFE', color: '#1E40AF' },
  diproses: { bg: '#EDE9FE', color: '#5B21B6' },
  selesai: { bg: '#D1FAE5', color: '#065F46' },
  batal: { bg: '#FEE2E2', color: '#991B1B' },
}

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: order } = await supabase.from('orders').select('*').eq('id', id).single()
  if (!order) return notFound()

  const { data: orderItems } = await supabase.from('order_items').select('*').eq('order_id', id)

  const { data: confirmation } = await supabase
    .from('payment_confirmations')
    .select('*')
    .eq('order_id', order.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const adminStorage = createAdminClient()
  let ktpUrl: string | null = null
  let proofUrl: string | null = null

  if (order.ktp_photo_path) {
    const { data } = await adminStorage.storage
      .from('customer-uploads')
      .createSignedUrl(order.ktp_photo_path, 3600)
    ktpUrl = data?.signedUrl ?? null
  }

  if (confirmation?.proof_image_path) {
    const { data } = await adminStorage.storage
      .from('customer-uploads')
      .createSignedUrl(confirmation.proof_image_path, 3600)
    proofUrl = data?.signedUrl ?? null
  }

  const statusStyle = STATUS_STYLES[order.status] ?? STATUS_STYLES.pending

  return (
    <main style={{ padding: 'clamp(20px, 4vw, 40px)', maxWidth: 800 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'clamp(18px, 4vw, 28px)', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 800, color: 'var(--text)' }}>{order.order_code}</h1>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
            {new Date(order.created_at).toLocaleDateString('id-ID', {
              day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
            })}
          </p>
        </div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            padding: '4px 14px',
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

      <div style={cardStyle}>
        <h2 style={cardTitleStyle}>Ubah Status Pesanan</h2>
        <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
      </div>

      <div style={{ display: 'flex', gap: 'clamp(12px, 3vw, 20px)', flexWrap: 'wrap', marginBottom: 'clamp(14px, 3vw, 20px)' }}>
        <div style={{ ...cardStyle, flex: '1 1 260px', marginBottom: 0 }}>
          <h2 style={cardTitleStyle}>Info Pembeli</h2>
          <p style={infoLineStyle}>
            Nama: <span style={infoValueStyle}>{order.customer_name}</span>
          </p>
          <p style={infoLineStyle}>
            HP: <span style={infoValueStyle}>{order.customer_phone}</span>
          </p>
          <p style={{ ...infoLineStyle, wordBreak: 'break-all' }}>
            Email: <span style={infoValueStyle}>{order.customer_email}</span>
          </p>
        </div>

        <div style={{ ...cardStyle, flex: '1 1 260px', marginBottom: 0 }}>
          <h2 style={cardTitleStyle}>Pengiriman</h2>
          <p style={infoLineStyle}>
            Metode: <span style={{ ...infoValueStyle, textTransform: 'uppercase' }}>{order.shipping_method}</span>
          </p>
          <p style={infoLineStyle}>
            Alamat: <span style={infoValueStyle}>{order.customer_address || '-'}</span>
          </p>
        </div>
      </div>

      <div style={cardStyle}>
        <h2 style={cardTitleStyle}>Konfirmasi Pembayaran dari Pelanggan</h2>

        {!confirmation && (
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>
            Pelanggan belum mengirimkan konfirmasi pembayaran.
          </p>
        )}

        {confirmation && (
          <>
            <p style={infoLineStyle}>
              Waktu Bayar: <span style={infoValueStyle}>{new Date(confirmation.payment_time).toLocaleString('id-ID')}</span>
            </p>
            <p style={infoLineStyle}>
              Dibayar Ke: <span style={infoValueStyle}>{confirmation.transferred_to}</span>
            </p>
            <p style={infoLineStyle}>
              Dari: <span style={infoValueStyle}>{confirmation.source_bank} a.n. {confirmation.source_account_name}</span>
            </p>
            <p style={{ ...infoLineStyle, marginBottom: 12 }}>
              Jumlah Dikonfirmasi: <span style={infoValueStyle}>{formatRupiah(confirmation.amount)}</span>
            </p>

            {proofUrl ? (
              <>
                <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>Bukti Transfer:</p>
                <Link href={proofUrl} target="_blank" rel="noopener noreferrer">
                  <img
                    src={proofUrl}
                    alt="Bukti Transfer"
                    style={{ maxWidth: '100%', width: 'clamp(160px, 60vw, 320px)', borderRadius: 8, border: '1px solid var(--border)', display: 'block' }}
                  />
                </Link>
                <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>Klik gambar untuk melihat ukuran penuh.</p>
              </>
            ) : (
              <p style={{ fontSize: 13, color: '#DC2626' }}>Bukti transfer tidak ditemukan atau gagal dimuat.</p>
            )}
          </>
        )}
      </div>

      <div style={cardStyle}>
        <h2 style={cardTitleStyle}>Foto KTP/NPWP</h2>
        {ktpUrl ? (
          <>
            <Link href={ktpUrl} target="_blank" rel="noopener noreferrer">
              <img
                src={ktpUrl}
                alt="KTP"
                style={{ maxWidth: '100%', width: 'clamp(160px, 60vw, 320px)', borderRadius: 8, border: '1px solid var(--border)', display: 'block' }}
              />
            </Link>
            <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>Klik gambar untuk melihat ukuran penuh.</p>
          </>
        ) : (
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>Pelanggan tidak melampirkan foto KTP/NPWP.</p>
        )}
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

const cardStyle: React.CSSProperties = {
  border: '1px solid var(--border)',
  borderRadius: 14,
  padding: 'clamp(14px, 3.5vw, 24px)',
  marginBottom: 'clamp(14px, 3vw, 20px)',
}

const cardTitleStyle: React.CSSProperties = {
  fontSize: 13.5,
  fontWeight: 800,
  color: 'var(--text)',
  marginBottom: 14,
}

const infoLineStyle: React.CSSProperties = {
  fontSize: 12.5,
  color: 'var(--muted)',
  marginBottom: 4,
}

const infoValueStyle: React.CSSProperties = {
  color: 'var(--text)',
  fontWeight: 600,
}