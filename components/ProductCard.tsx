'use client'

import { useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { formatRupiah } from '@/lib/utils'
import type { Product } from '@/lib/types'

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [hovered, setHovered] = useState(false)

  const discount = product.price_original
    ? Math.round((1 - product.price_sell / product.price_original) * 100)
    : null

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'box-shadow 0.2s, transform 0.2s',
        boxShadow: hovered ? '0 8px 20px rgba(0,0,0,0.08)' : '0 1px 2px rgba(0,0,0,0.02)',
        transform: hovered ? 'translateY(-3px)' : 'none',
      }}
    >
      {/* Foto produk */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 190,
          background: product.image_url ? `url(${product.image_url}) center/contain no-repeat` : 'var(--bg-alt)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          borderBottom: '1px solid var(--border)',
        }}
      >
        {!product.image_url && (
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <rect x="10" y="18" width="36" height="24" rx="4" fill="var(--gold)" opacity="0.18" />
            <rect x="10" y="18" width="36" height="7" rx="3" fill="var(--gold)" opacity="0.35" />
            <circle cx="28" cy="32" r="6" fill="var(--gold)" opacity="0.3" />
          </svg>
        )}

        {product.status === 'preorder' && (
          <span
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              fontSize: 10,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              background: '#1A1A2E',
              color: '#fff',
              padding: '4px 10px',
              borderRadius: 999,
              fontWeight: 700,
            }}
          >
            PreOrder
          </span>
        )}

        {discount && (
          <span
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              fontSize: 11,
              fontWeight: 800,
              background: '#16A34A',
              color: '#fff',
              padding: '4px 9px',
              borderRadius: 999,
            }}
          >
            -{discount}%
          </span>
        )}
      </div>

      {/* Info produk */}
      <div style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        <span
          style={{
            fontSize: 11,
            color: 'var(--gold-dark)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          {product.category?.name ?? 'Emas Antam'}
        </span>

        <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)', margin: '2px 0 8px' }}>
          {product.weight_gram} gram
        </h3>

        <div style={{ marginBottom: 12 }}>
          <div className="price" style={{ fontSize: 19, fontWeight: 800, color: 'var(--text)', lineHeight: 1.2 }}>
            {formatRupiah(product.price_sell)}
          </div>
          {product.price_original && (
            <div style={{ fontSize: 12, color: 'var(--muted)', textDecoration: 'line-through', marginTop: 2 }}>
              {formatRupiah(product.price_original)}
            </div>
          )}
        </div>

        <button
          onClick={() => addItem(product)}
          style={{
            marginTop: 'auto',
            width: '100%',
            padding: '11px 0',
            background: hovered ? 'var(--gold-dark)' : 'var(--gold)',
            border: 'none',
            borderRadius: 9,
            color: '#1A1A2E',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'background 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          Tambah ke Keranjang
        </button>
      </div>
    </div>
  )
}