const STEPS = [
  { key: 'katalog', label: 'Pilih Produk' },
  { key: 'keranjang', label: 'Keranjang Belanja' },
  { key: 'checkout', label: 'Checkout' },
  { key: 'selesai', label: 'Selesai' },
] as const

type StepKey = (typeof STEPS)[number]['key']

export default function CheckoutSteps({ current }: { current: StepKey }) {
  const currentIndex = STEPS.findIndex((s) => s.key === current)

  return (
    <div style={{ background: 'var(--bg-alt)', borderBottom: '1px solid var(--border)', padding: '16px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', fontSize: 14 }}>
        {STEPS.map((step, i) => {
          const isActive = i === currentIndex
          const isPast = i < currentIndex
          return (
            <div key={step.key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--text)' : isPast ? 'var(--gold-dark)' : 'var(--muted)',
                  textDecoration: isActive ? 'underline' : 'none',
                  textUnderlineOffset: 4,
                }}
              >
                {step.label}
              </span>
              {i < STEPS.length - 1 && <span style={{ color: 'var(--muted)' }}>›</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}