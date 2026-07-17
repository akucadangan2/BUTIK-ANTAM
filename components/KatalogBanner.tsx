export default function KatalogBanner() {
  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: 'linear-gradient(135deg, #F3E5C8 0%, #E8CB93 55%, #D9B36A 100%)',
        minHeight: 260,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '32px 40px',
        flexWrap: 'wrap',
        gap: 24,
      }}
    >
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0, opacity: 0.12 }}
        viewBox="0 0 1200 260"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="diamondGrid" width="36" height="36" patternUnits="userSpaceOnUse">
            <path d="M18 0L36 18L18 36L0 18Z" fill="none" stroke="#8A6D1F" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="1200" height="260" fill="url(#diamondGrid)" />
      </svg>

      <img
        src="/images/banner-katalog.png"
        alt="Produk emas Butik Antam"
        style={{
          height: 200,
          objectFit: 'contain',
          position: 'relative',
          zIndex: 1,
        }}
      />

      <div
        style={{
          background: 'rgba(255,255,255,0.6)',
          borderRadius: 14,
          padding: '22px 30px',
          maxWidth: 420,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <h2
          style={{
            fontSize: 26,
            fontWeight: 800,
            fontStyle: 'italic',
            color: '#1A1A2E',
            margin: 0,
            borderBottom: '2px solid #1A1A2E',
            paddingBottom: 8,
            display: 'inline-block',
          }}
        >
          Emas Antam Pilihan Anda
        </h2>
        <p style={{ fontSize: 13, color: '#3B3B3B', marginTop: 10, lineHeight: 1.6 }}>
          Butik Antam menyediakan berbagai jenis dan ukuran emas Antam asli
          yang sesuai dengan kebutuhan Anda.
        </p>
      </div>
    </div>
  )
}