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

  const { data: settings } = await supabase
    .from('payment_settings')
    .select('bank_name, bank_account_number, bank_account_holder')
    .limit(1)
    .single()

  const transferredTo = settings
    ? `${settings.bank_name} ${settings.bank_account_number} a.n. ${settings.bank_account_holder}`
    : 'BRI - Hubungi admin WhatsApp'

  return (
    <main style={{ padding: 'clamp(24px, 6vw, 48px) clamp(16px, 5vw, 40px)', maxWidth: 480, margin: '0 auto' }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', marginBottom: 24, textAlign: 'center' }}>
        Konfirmasi Pembayaran
      </h1>

      <PaymentConfirmationForm
        orderId={order.id}
        orderCode={order.order_code}
        defaultAmount={order.total_amount}
        transferredTo={transferredTo}
      />
    </main>
  )
}