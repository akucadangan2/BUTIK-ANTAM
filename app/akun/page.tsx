import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { formatRupiah } from '@/lib/utils'
import EditProfileForm from '@/components/EditProfileForm'

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  pending: { bg: '#FEF3C7', color: '#92400E' },
  dibayar: { bg: '#DBEAFE', color: '#1E40AF' },
  diproses: { bg: '#EDE9FE', color: '#5B21B6' },
  selesai: { bg: '#D1FAE5', color: '#065F46' },
  batal: { bg: '#FEE2E2', color: '#991B1B' },
}

export default async function AkunPage() {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userData.user?.id ?? '')
    .single()

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userData.user?.id ?? '')
    .order('created_at', { ascending: false })

  return (
    <main style={{ padding: 'clamp(20px, 5vw, 48px) clamp(16px, 5vw, 40px)', maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ fontSize: 'clamp(20px, 4vw, 26px)', fontWeight: 800, color: 'var(--text)', marginBottom: 'clamp(16px, 4vw, 24px)' }}>
        Akun Saya
      </h1>

      <div style={{ border: '1px solid var(--border)', borderRadius: 14, padding: 'clamp(16px, 4vw, 24px)', marginBottom: 'clamp(24px, 5vw, 32px)' }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>Profil</h2>
        <p style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 14, wordBreak: 'break-all' }}>
          Email: <span style={{ color: 'var(--text)', fontWeight: 600 }}>{userData.user?.email}</span>
        </p>
        <EditProfileForm
          userId={userData.user?.id ?? ''}
          initialName={profile?.full_name ?? ''}
          initialPhone={profile?.phone ?? ''}
        />
      </div>

      <h2 style={{ fontSize: 'clamp(15px, 3.5vw, 18px)', fontWeight: 800, color: 'var(--text)', marginBottom: 14 }}>
        Riwayat Pesanan
      </h2>

      {(!orders || orders.length === 0) && (
        <p style={{ color: 'var(--muted)', fontSize: 13.5 }}>Belum ada pesanan.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {orders?.map((order) => {
          const statusStyle = STATUS_STYLES[order.status] ?? STATUS_STYLES.pending
          return (
            <Link
              key={order.id}
              href={`/akun/pesanan/${order.id}`}
              style={{
                textDecoration: 'none',
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: 'clamp(12px, 3vw, 18px)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <div style={{ flex: 1, minWidth: 0, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text)' }}>{order.order_code}</p>
                  <p style={{ fontSize: 11.5, color: 'var(--muted)' }}>
                    {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <span
                    style={{
                      display: 'inline-block',
                      marginTop: 5,
                      fontSize: 10.5,
                      fontWeight: 700,
                      padding: '2px 9px',
                      borderRadius: 999,
                      background: statusStyle.bg,
                      color: statusStyle.color,
                      textTransform: 'capitalize',
                    }}
                  >
                    {order.status}
                  </span>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text)', whiteSpace: 'nowrap' }}>
                    {formatRupiah(order.total_amount)}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--gold-dark)', fontWeight: 700, marginTop: 4 }}>
                    Lihat Detail
                  </p>
                </div>
              </div>

              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M9 18l6-6-6-6" />
              </svg>
            </Link>
          )
        })}
      </div>
    </main>
  )
}