import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import PaymentConfirmationForm from '@/components/PaymentConfirmationForm'

export default async function KonfirmasiPembayaranPage({ params }: { params: Promise<{ kode: string }> }) {
  const { kode } = await params
  const supabase = await createClient()

  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('order_code', kode)
    .single()

  if (!order) return notFound()

  return (
    <main style={{ padding: 'clamp(16px, 5vw, 48px) clamp(16px, 5vw, 40px)', maxWidth: 460, margin: '0 auto' }}>
      <h1 style={{ fontSize: 'clamp(18px, 4vw, 22px)', fontWeight: 800, color: 'var(--text)', marginBottom: 'clamp(16px, 4vw, 24px)', textAlign: 'center' }}>
        Konfirmasi Pembayaran
      </h1>

      <PaymentConfirmationForm
        orderId={order.id}
        orderCode={order.order_code}
        defaultAmount={order.total_amount}
        transferredTo="QRIS Butik Antam"
      />
    </main>
  )
}