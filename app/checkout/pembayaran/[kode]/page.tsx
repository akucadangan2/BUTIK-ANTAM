import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { formatRupiah } from '@/lib/utils'
import { notFound } from 'next/navigation'
import CancelOrderButton from '@/components/CancelOrderButton'

const DEFAULT_WHATSAPP = '62895635223839'

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

  const whatsappNumber = settings?.whatsapp_number || DEFAULT_WHATSAPP

  const waMessage = encodeURIComponent(
    `Halo Admin Butik Antam, saya butuh bantuan untuk pesanan ${order.order_code}.`
  )
  const waLink = `https://wa.me/${whatsappNumber}?text=${waMessage}`

  return (
    <main style={{ padding: 'clamp(16px, 5vw, 48px) clamp(16px, 5vw, 40px) clamp(28px, 6vw, 48px)', maxWidth: 460, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 'clamp(14px, 3vw, 24px)' }}>
        <p style={{ fontSize: 12, color: 'var(--muted)' }}>Invoice</p>
        <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>{order.order_code}</p>
        <p style={{ fontSize: 'clamp(18px, 4.5vw, 24px)', fontWeight: 800, color: 'var(--gold-dark)', marginTop: 6 }}>
          {formatRupiah(order.total_amount)}
        </p>
        <span
          style={{
            display: 'inline-block',
            marginTop: 6,
            fontSize: 10.5,
            fontWeight: 700,
            padding: '3px 11px',
            borderRadius: 999,
            background: '#FEF3C7',
            color: '#92400E',
          }}
        >
          Belum Dibayar
        </span>
      </div>

      <div style={{ border: '1px solid var(--border)', borderRadius: 14, padding: 'clamp(12px, 3.5vw, 18px)', marginBottom: 'clamp(14px, 3vw, 20px)' }}>
        <img
          src="/images/QRIS BUTIK ANTAM.jpg"
          alt="QRIS Butik Antam"
          style={{ width: '100%', maxWidth: 260, margin: '0 auto', borderRadius: 8, display: 'block' }}
        />
        <p style={{ fontSize: 'clamp(11.5px, 2.6vw, 13px)', color: 'var(--muted)', lineHeight: 1.6, marginTop: 'clamp(10px, 2.5vw, 14px)', textAlign: 'center' }}>
          Gunakan kode QRIS di atas untuk pembayaran, maksimal Rp 10.000.000
          per satu kali transaksi.
        </p>
        <p style={{ fontSize: 'clamp(11.5px, 2.6vw, 13px)', color: 'var(--muted)', lineHeight: 1.6, marginTop: 8, textAlign: 'center' }}>
          Untuk melanjutkan pembayaran, silakan tekan WhatsApp admin di bawah.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 'clamp(14px, 3vw, 20px)' }}>
        <Link
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block',
            textAlign: 'center',
            width: '100%',
            padding: 'clamp(11px, 2.8vw, 14px) 0',
            background: '#25D366',
            color: '#fff',
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 'clamp(13px, 3vw, 15px)',
            textDecoration: 'none',
          }}
        >
          WhatsApp Admin
        </Link>

        <Link
          href={`/checkout/pembayaran/${order.order_code}/konfirmasi`}
          style={{
            display: 'block',
            textAlign: 'center',
            width: '100%',
            padding: 'clamp(11px, 2.8vw, 14px) 0',
            background: 'var(--gold)',
            color: '#1A1A2E',
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 'clamp(13px, 3vw, 15px)',
            textDecoration: 'none',
          }}
        >
          Konfirmasi Pembayaran
        </Link>

        <CancelOrderButton orderId={order.id} />
      </div>
    </main>
  )
}