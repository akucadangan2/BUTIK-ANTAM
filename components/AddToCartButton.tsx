'use client'

import { useCart } from '@/hooks/useCart'
import type { Product } from '@/lib/types'

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart()

  return (
    <button
      onClick={() => addItem(product)}
      style={{
        width: '100%',
        maxWidth: 320,
        padding: '14px 0',
        background: 'var(--gold)',
        border: 'none',
        borderRadius: 10,
        color: '#1A1A2E',
        fontSize: 14,
        fontWeight: 700,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      Tambah ke Keranjang
    </button>
  )
}