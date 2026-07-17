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
    <main style={{ padding: '48px 40px', maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', marginBottom: 24 }}>
        Akun Saya
      </h1>

      <div style={{ border: '1px solid var(--border)', borderRadius: 14, padding: 24, marginBottom: 32 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>Profil</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
          Email: <span style={{ color: 'var(--text)', fontWeight: 600 }}>{userData.user?.email}</span>
        </p>
        <EditProfileForm
          userId={userData.user?.id ?? ''}
          initialName={profile?.full_name ?? ''}
          initialPhone={profile?.phone ?? ''}
        />
      </div>

      <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)', marginBottom: 16 }}>
        Riwayat Pesanan
      </h2>

      {(!orders || orders.length === 0) && (
        <p style={{ color: 'var(--muted)' }}>Belum ada pesanan.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {orders?.map((order) => {
          const statusStyle = STATUS_STYLES[order.status] ?? STATUS_STYLES.pending
          return (
            <Link
              key={order.id}
              href={`/akun/pesanan/${order.id}`}
              style={{
                textDecoration: 'none', // Tambahan agar teks tidak bergaris bawah
                border: '1px solid var(--border)', 
                borderRadius: 12, 
                padding: 18, 
                display: 'flex', 
                justifyContent: 'space-between', 
                flexWrap: 'wrap', 
                gap: 12 
              }}
            >
              <div>
                <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{order.order_code}</p>
                <p style={{ fontSize: 12, color: 'var(--muted)' }}>
                  {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{formatRupiah(order.total_amount)}</p>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: 999,
                    background: statusStyle.bg,
                    color: statusStyle.color,
                    textTransform: 'capitalize',
                  }}
                >
                  {order.status}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </main>
  )
}