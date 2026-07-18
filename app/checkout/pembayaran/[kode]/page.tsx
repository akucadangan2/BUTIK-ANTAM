import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { formatRupiah } from '@/lib/utils'
import { notFound } from 'next/navigation'
import CancelOrderButton from '@/components/CancelOrderButton'

export default async function PembayaranPage({ params }: { params: Promise<{ kode: string }> }) {
  const { kode } = await params
  const supabase = await createClient()

  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('order_code', kode)
    .single()

  if (!order) return notFound()

  const { data: settings } = await supabase
    .from('payment_settings')
    .select('whatsapp_number')
    .limit(1)
    .single()

  const waMessage = encodeURIComponent(
    `Halo Admin Butik Antam, saya butuh bantuan untuk pesanan ${order.order_code}.`
  )
  const waLink = `https://wa.me/${settings?.whatsapp_number}?text=${waMessage}`

  return (
    <main style={{ padding: 'clamp(24px, 6vw, 48px) clamp(16px, 5vw, 40px)', maxWidth: 480, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <p style={{ fontSize: 13, color: 'var(--muted)' }}>Invoice</p>
        <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>{order.order_code}</p>
        <p style={{ fontSize: 'clamp(20px, 5vw, 26px)', fontWeight: 800, color: 'var(--gold-dark)', marginTop: 8 }}>
          {formatRupiah(order.total_amount)}
        </p>
        <span
          style={{
            display: 'inline-block',
            marginTop: 8,
            fontSize: 11,
            fontWeight: 700,
            padding: '4px 12px',
            borderRadius: 999,
            background: '#FEF3C7',
            color: '#92400E',
          }}
        >
          Belum Dibayar
        </span>
      </div>

      <div style={{ border: '1px solid var(--border)', borderRadius: 14, padding: 'clamp(16px, 4vw, 20px)', marginBottom: 20 }}>
        <img
          src="/images/QRIS BUTIK ANTAM.jpg"
          alt="QRIS Butik Antam"
          style={{ width: '100%', borderRadius: 8, display: 'block' }}
        />
      </div>

      <div style={{ border: '1px solid var(--border)', borderRadius: 14, padding: 'clamp(16px, 4vw, 20px)', marginBottom: 20 }}>
        <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>
          Scan QRIS di atas untuk membayar, atau transfer manual ke rekening
          BRI kami. Setelah membayar, klik <strong>Konfirmasi Pembayaran</strong>{' '}
          dan lampirkan bukti transfer.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        <Link
          href={`/checkout/pembayaran/${order.order_code}/konfirmasi`}
          style={{
            display: 'block',
            textAlign: 'center',
            width: '100%',
            padding: 'clamp(13px, 3vw, 15px) 0',
            background: 'var(--gold)',
            color: '#1A1A2E',
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 'clamp(14px, 3vw, 15px)',
            textDecoration: 'none',
          }}
        >
          Konfirmasi Pembayaran
        </Link>

        <CancelOrderButton orderId={order.id} />
      </div>

      <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)' }}>
        Butuh bantuan atau ada kendala lain?{' '}
        <Link href={waLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-dark)', fontWeight: 700 }}>
          Hubungi Admin
        </Link>
      </p>
    </main>
  )
}