'use client'

import { useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { createClient } from '@/lib/supabase-client'
import { formatRupiah } from '@/lib/utils'
import { useRouter } from 'next/navigation'

const SHIPPING_COST = 30000

const COURIERS = [
  { value: 'jne', label: 'JNE Reguler', desc: '2-4 hari kerja', badge: 'JNE', color: '#DC2626' },
  { value: 'anteraja', label: 'AnterAja', desc: '2-3 hari kerja', badge: 'AJ', color: '#EA580C' },
  { value: 'paxel', label: 'Paxel', desc: 'Same day / next day (kota besar)', badge: 'PX', color: '#0D9488' },
]

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const router = useRouter()
  const supabase = createClient()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [province, setProvince] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [courier, setCourier] = useState('jne')
  const [ktpFile, setKtpFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const grandTotal = totalPrice + SHIPPING_COST

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data: userData } = await supabase.auth.getUser()
    const orderCode = `ORD-${Date.now()}`
    const fullAddress = `${street}, ${city}, ${province} ${postalCode}`
    const selectedCourier = COURIERS.find((c) => c.value === courier)

    let ktpPath: string | null = null
    if (ktpFile) {
      const ext = ktpFile.name.split('.').pop()
      const path = `ktp/${orderCode}-ktp.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('customer-uploads')
        .upload(path, ktpFile)
      if (!uploadError) {
        ktpPath = path
      }
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_code: orderCode,
        user_id: userData.user?.id ?? null,
        customer_name: name,
        customer_phone: phone,
        customer_email: email,
        customer_address: fullAddress,
        payment_method: 'manual',
        shipping_method: courier,
        total_amount: grandTotal,
        ktp_photo_path: ktpPath,
      })
      .select()
      .single()

    if (orderError || !order) {
      setError(orderError?.message || 'Gagal membuat pesanan')
      setLoading(false)
      return
    }

    const orderItems = [
      ...items.map((i) => ({
        order_id: order.id,
        product_id: i.product.id,
        product_name: i.product.name,
        price: i.product.price_sell,
        quantity: i.quantity,
      })),
      {
        order_id: order.id,
        product_id: null,
        product_name: `Ongkos Kirim (${selectedCourier?.label})`,
        price: SHIPPING_COST,
        quantity: 1,
      },
    ]

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems)

    if (itemsError) {
      setError(itemsError.message)
      setLoading(false)
      return
    }

    clearCart()
    router.push(`/checkout/pembayaran/${orderCode}`)
  }

  if (items.length === 0) {
    return (
      <main style={{ padding: 60, textAlign: 'center' }}>
        <p style={{ color: 'var(--muted)' }}>Keranjang kosong, tidak ada yang bisa di-checkout.</p>
      </main>
    )
  }

  return (
    <main style={{ padding: 'clamp(20px, 5vw, 40px) clamp(16px, 5vw, 40px) clamp(32px, 6vw, 60px)', maxWidth: 1100, margin: '0 auto' }}>
      <h1 style={{ fontSize: 'clamp(20px, 4vw, 26px)', fontWeight: 800, color: 'var(--text)', marginBottom: 'clamp(16px, 4vw, 28px)' }}>
        Checkout
      </h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 'clamp(16px, 4vw, 32px)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 480px', display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 20px)', minWidth: 0 }}>
          <div style={cardStyle}>
            <h2 style={cardTitleStyle}>Informasi Kontak</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                placeholder="Nama Lengkap"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={inputStyle}
              />
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <input
                  placeholder="No. HP / WhatsApp"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  style={{ ...inputStyle, flex: '1 1 140px' }}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ ...inputStyle, flex: '1 1 140px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
                  Foto KTP/NPWP (opsional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setKtpFile(e.target.files?.[0] ?? null)}
                  style={{ fontSize: 12.5, maxWidth: '100%' }}
                />
                <p style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 4 }}>
                  Membantu mempercepat verifikasi untuk transaksi nominal besar.
                </p>
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <h2 style={cardTitleStyle}>Alamat Pengiriman</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <textarea
                placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                required
                rows={2}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <input
                  placeholder="Kota / Kabupaten"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  style={{ ...inputStyle, flex: '2 1 120px' }}
                />
                <input
                  placeholder="Provinsi"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  required
                  style={{ ...inputStyle, flex: '2 1 120px' }}
                />
                <input
                  placeholder="Kode Pos"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                  style={{ ...inputStyle, flex: '1 1 90px' }}
                />
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
              <h2 style={{ ...cardTitleStyle, marginBottom: 0 }}>Kurir Pengiriman</h2>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: '#16A34A', background: '#F0FDF4', padding: '3px 9px', borderRadius: 999, whiteSpace: 'nowrap' }}>
                Termasuk Asuransi
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {COURIERS.map((c) => (
                <label
                  key={c.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'clamp(8px, 2vw, 14px)',
                    padding: 'clamp(10px, 2.5vw, 14px)',
                    border: courier === c.value ? '2px solid var(--gold)' : '1px solid var(--border)',
                    borderRadius: 10,
                    cursor: 'pointer',
                    background: courier === c.value ? 'var(--bg-alt)' : 'transparent',
                  }}
                >
                  <input
                    type="radio"
                    name="courier"
                    value={c.value}
                    checked={courier === c.value}
                    onChange={(e) => setCourier(e.target.value)}
                    style={{ accentColor: 'var(--gold)', flexShrink: 0 }}
                  />
                  <div
                    style={{
                      width: 'clamp(28px, 7vw, 36px)',
                      height: 'clamp(28px, 7vw, 36px)',
                      borderRadius: 8,
                      background: c.color,
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 'clamp(9px, 2vw, 11px)',
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    {c.badge}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 'clamp(12.5px, 2.8vw, 14px)', fontWeight: 700, color: 'var(--text)' }}>{c.label}</p>
                    <p style={{ fontSize: 'clamp(10.5px, 2.3vw, 12px)', color: 'var(--muted)' }}>{c.desc}</p>
                  </div>
                  <p style={{ fontSize: 'clamp(11.5px, 2.5vw, 13px)', fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap' }}>
                    {formatRupiah(SHIPPING_COST)}
                  </p>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div style={{ flex: '0 1 340px', minWidth: 280, position: 'sticky', top: 20, width: '100%' }}>
          <div style={cardStyle}>
            <h2 style={cardTitleStyle}>Ringkasan Pesanan</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
              {items.map((i) => (
                <div key={i.product.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, gap: 8 }}>
                  <span style={{ color: 'var(--text)' }}>
                    {i.product.name} <span style={{ color: 'var(--muted)' }}>x{i.quantity}</span>
                  </span>
                  <span style={{ fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap' }}>
                    {formatRupiah(i.product.price_sell * i.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--muted)' }}>
                <span>Subtotal</span>
                <span>{formatRupiah(totalPrice)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--muted)' }}>
                <span>Ongkos Kirim</span>
                <span>{formatRupiah(SHIPPING_COST)}</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', marginTop: 10, paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>Total</span>
              <span className="price" style={{ fontSize: 'clamp(16px, 3.5vw, 19px)', fontWeight: 800, color: 'var(--text)' }}>
                {formatRupiah(grandTotal)}
              </span>
            </div>

            {error && (
              <p style={{ fontSize: 12.5, color: '#DC2626', background: '#FEF2F2', padding: '9px 11px', borderRadius: 8, marginTop: 14 }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 16,
                width: '100%',
                padding: 'clamp(11px, 2.8vw, 13px) 0',
                background: 'var(--gold)',
                border: 'none',
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 'clamp(13px, 3vw, 14px)',
                color: '#1A1A2E',
                cursor: loading ? 'default' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Memproses...' : 'Selesaikan Order'}
            </button>
          </div>
        </div>
      </form>
    </main>
  )
}

const cardStyle: React.CSSProperties = {
  border: '1px solid var(--border)',
  borderRadius: 14,
  padding: 'clamp(14px, 3.5vw, 24px)',
}

const cardTitleStyle: React.CSSProperties = {
  fontSize: 'clamp(13.5px, 3vw, 15px)',
  fontWeight: 800,
  color: 'var(--text)',
  marginBottom: 14,
}

const inputStyle: React.CSSProperties = {
  padding: 'clamp(9px, 2.3vw, 11px) clamp(11px, 2.8vw, 14px)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  fontSize: 'clamp(13px, 3vw, 14px)',
  fontFamily: 'inherit',
  width: '100%',
  minWidth: 0,
}