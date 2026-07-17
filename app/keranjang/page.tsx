'use client'

import { useCart } from '@/hooks/useCart'
import { formatRupiah } from '@/lib/utils'
import Link from 'next/link'

export default function KeranjangPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart()

  if (items.length === 0) {
    return (
      <main style={{ padding: 40 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
          Keranjang Belanja
        </h1>
        <p style={{ color: '#666' }}>Keranjang kamu masih kosong.</p>
        <Link href="/katalog" style={{ color: '#111', fontWeight: 600 }}>
          Lihat Katalog →
        </Link>
      </main>
    )
  }

  return (
    <main style={{ padding: 40 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>
        Keranjang Belanja
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map(({ product, quantity }) => (
          <div
            key={product.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '1px solid #e5e5e5',
              borderRadius: 8,
              padding: 16,
            }}
          >
            <div>
              <p style={{ fontWeight: 600 }}>{product.name}</p>
              <p style={{ fontSize: 14, color: '#666' }}>
                {formatRupiah(product.price_sell)} x {quantity}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={() => updateQuantity(product.id, quantity - 1)}
                style={{ width: 28, height: 28, cursor: 'pointer' }}
              >
                −
              </button>
              <span>{quantity}</span>
              <button
                onClick={() => updateQuantity(product.id, quantity + 1)}
                style={{ width: 28, height: 28, cursor: 'pointer' }}
              >
                +
              </button>
              <button
                onClick={() => removeItem(product.id)}
                style={{ marginLeft: 12, color: 'red', cursor: 'pointer' }}
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid #e5e5e5',
          paddingTop: 16,
        }}
      >
        <span style={{ fontSize: 18, fontWeight: 700 }}>
          Total: {formatRupiah(totalPrice)}
        </span>
        <Link
          href="/checkout"
          style={{
            background: '#111',
            color: '#fff',
            padding: '10px 24px',
            borderRadius: 6,
            fontWeight: 600,
          }}
        >
          Checkout
        </Link>
      </div>
    </main>
  )
}