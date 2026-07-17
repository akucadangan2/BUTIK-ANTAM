'use client'

import { useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { createClient } from '@/lib/supabase-client'
import { formatRupiah } from '@/lib/utils'

const SHIPPING_COST = 30000

// 1. Update konstanta COURIERS untuk menggunakan logo alih-alih warna dan badge
const COURIERS = [
  { 
    value: 'jne', 
    label: 'JNE Reguler', 
    desc: '2-4 hari kerja', 
    logo: 'https://zonalogo.com/assets/logo-jne.webp?asset=1529&w=240' 
  },
  { 
    value: 'anteraja', 
    label: 'AnterAja', 
    desc: '2-3 hari kerja', 
    logo: 'https://zonalogo.com/assets/logo-anteraja.webp?asset=1539&w=240' 
  },
  { 
    value: 'paxel', 
    label: 'Paxel', 
    desc: 'Same day / next day (kota besar)', 
    logo: 'https://zonalogo.com/assets/logo-paxel-png-svg.webp?asset=1841&w=240' 
  },
]

export default function CheckoutPage() {
  const { items, totalPrice } = useCart()
  const supabase = createClient()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [province, setProvince] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [courier, setCourier] = useState('jne')
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

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_code: orderCode,
        user_id: userData.user?.id ?? null,
        customer_name: name,
        customer_phone: phone,
        customer_email: email,
        customer_address: fullAddress,
        payment_method: 'doku',
        shipping_method: courier,
        total_amount: grandTotal,
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

    const res = await fetch('/api/doku/create-transaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderCode,
        amount: grandTotal,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
      }),
    })

    const data = await res.json()

    if (!res.ok || !data.paymentUrl) {
      setError(data.error || 'Gagal memulai pembayaran')
      setLoading(false)
      return
    }

    window.location.href = data.paymentUrl
  }

  if (items.length === 0) {
    return (
      <main style={{ padding: 60, textAlign: 'center' }}>
        <p style={{ color: 'var(--muted)' }}>Keranjang kosong, tidak ada yang bisa di-checkout.</p>
      </main>
    )
  }

  return (
    <main style={{ padding: '40px 40px 60px', maxWidth: 1100, margin: '0 auto' }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', marginBottom: 28 }}>Checkout</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* KOLOM KIRI — FORM */}
        <div style={{ flex: '1 1 480px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Informasi Kontak */}
          <div style={{ border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', marginBottom: 16 }}>
              Informasi Kontak
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input
                placeholder="Nama Lengkap"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={inputStyle}
              />
              <div style={{ display: 'flex', gap: 12 }}>
                <input
                  placeholder="No. HP / WhatsApp"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  style={{ ...inputStyle, flex: 1 }}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ ...inputStyle, flex: 1 }}
                />
              </div>
            </div>
          </div>

          {/* Alamat Pengiriman */}
          <div style={{ border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', marginBottom: 16 }}>
              Alamat Pengiriman
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <textarea
                placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                required
                rows={2}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
              <div style={{ display: 'flex', gap: 12 }}>
                <input
                  placeholder="Kota / Kabupaten"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  style={{ ...inputStyle, flex: 2 }}
                />
                <input
                  placeholder="Provinsi"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  required
                  style={{ ...inputStyle, flex: 2 }}
                />
                <input
                  placeholder="Kode Pos"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                  style={{ ...inputStyle, flex: 1 }}
                />
              </div>
            </div>
          </div>

          {/* Kurir Pengiriman */}
          <div style={{ border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)' }}>Kurir Pengiriman</h2>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#16A34A', background: '#F0FDF4', padding: '3px 10px', borderRadius: 999 }}>
                Termasuk Asuransi
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {COURIERS.map((c) => (
                <label
                  key={c.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: 14,
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
                    style={{ accentColor: 'var(--gold)' }}
                  />
                  
                  {/* 2. Ganti Box Warna dengan Box Logo */}
                  <div
                    style={{
                      width: 50,
                      height: 36,
                      borderRadius: 6,
                      background: '#fff',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      overflow: 'hidden',
                      padding: 4, // memberikan jarak (padding) agar logo tidak menempel ke border
                    }}
                  >
                    <img 
                      src={c.logo} 
                      alt={`Logo ${c.label}`} 
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                    />
                  </div>

                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{c.label}</p>
                    <p style={{ fontSize: 12, color: 'var(--muted)' }}>{c.desc}</p>
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{formatRupiah(SHIPPING_COST)}</p>
                </label>
              ))}
            </div>

            <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 12 }}>
              Pengambilan langsung di toko untuk sementara tidak tersedia.
            </p>
          </div>
        </div>

        {/* KOLOM KANAN — RINGKASAN PESANAN */}
        <div style={{ flex: '0 1 340px', minWidth: 300, position: 'sticky', top: 20 }}>
          <div style={{ border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', marginBottom: 16 }}>
              Ringkasan Pesanan
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {items.map((i) => (
                <div key={i.product.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--text)' }}>
                    {i.product.name} <span style={{ color: 'var(--muted)' }}>x{i.quantity}</span>
                  </span>
                  <span style={{ fontWeight: 600, color: 'var(--text)' }}>
                    {formatRupiah(i.product.price_sell * i.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--muted)' }}>
                <span>Subtotal</span>
                <span>{formatRupiah(totalPrice)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--muted)' }}>
                <span>Ongkos Kirim</span>
                <span>{formatRupiah(SHIPPING_COST)}</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', marginTop: 12, paddingTop: 12, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)' }}>Total</span>
              <span className="price" style={{ fontSize: 19, fontWeight: 800, color: 'var(--text)' }}>
                {formatRupiah(grandTotal)}
              </span>
            </div>

            {error && (
              <p style={{ fontSize: 13, color: '#DC2626', background: '#FEF2F2', padding: '10px 12px', borderRadius: 8, marginTop: 16 }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 20,
                width: '100%',
                padding: '13px 0',
                background: 'var(--gold)',
                border: 'none',
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 14,
                color: '#1A1A2E',
                cursor: loading ? 'default' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Memproses...' : 'Bayar Sekarang'}
            </button>
          </div>
        </div>
      </form>
    </main>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '11px 14px',
  border: '1px solid var(--border)',
  borderRadius: 8,
  fontSize: 14,
  fontFamily: 'inherit',
  width: '100%',
}