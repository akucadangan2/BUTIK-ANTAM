export default function KatalogBanner() {
  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 16,
        margin: 'clamp(12px, 3vw, 20px)',
        minHeight: 'clamp(150px, 26vw, 340px)',
        backgroundImage: 'url(/images/banner-katalog.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'flex-end',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(0deg, rgba(26,26,46,0.85) 0%, rgba(26,26,46,0.35) 55%, rgba(26,26,46,0) 100%)',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          padding: 'clamp(16px, 4vw, 28px)',
          maxWidth: 480,
        }}
      >
        <h2
          style={{
            fontSize: 'clamp(17px, 4vw, 26px)',
            fontWeight: 800,
            fontStyle: 'italic',
            color: '#fff',
            margin: 0,
            marginBottom: 6,
          }}
        >
          Emas Antam Pilihan Anda
        </h2>
        <p style={{ fontSize: 'clamp(11px, 2.5vw, 13px)', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, margin: 0 }}>
          Butik Antam menyediakan berbagai jenis dan ukuran emas Antam asli
          yang sesuai dengan kebutuhan Anda.
        </p>
      </div>
    </div>
  )
}