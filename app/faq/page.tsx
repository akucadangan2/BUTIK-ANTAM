const FAQ_GROUPS = [
  {
    category: 'Umum',
    items: [
      {
        q: 'Apa itu Butik Antam?',
        a: 'Butik Antam adalah toko yang menjual emas batangan Antam 99.99% asli dan bersertifikat resmi, secara langsung baik untuk diambil di toko maupun dikirim ke seluruh Indonesia.',
      },
      {
        q: 'Apakah emas yang dijual benar-benar asli?',
        a: 'Ya. Seluruh emas yang kami jual adalah emas Antam asli dengan sertifikat keaslian resmi yang disertakan pada setiap pembelian.',
      },
      {
        q: 'Apakah harga di website selalu update?',
        a: 'Ya, harga jual dan buyback kami perbarui setiap hari kerja mengikuti pergerakan harga emas terkini. Anda bisa mengeceknya di halaman Harga Emas.',
      },
    ],
  },
  {
    category: 'Pemesanan & Pembayaran',
    items: [
      {
        q: 'Bagaimana cara memesan emas di Butik Antam?',
        a: 'Pilih produk di halaman Katalog, klik "Tambah ke Keranjang", lalu lanjutkan ke halaman Keranjang dan klik Checkout untuk mengisi data pemesanan.',
      },
      {
        q: 'Metode pembayaran apa saja yang tersedia?',
        a: 'Saat ini kami menerima pembayaran melalui Transfer Bank dan QRIS. Detail rekening akan diinformasikan setelah pesanan dibuat.',
      },
      {
        q: 'Apakah ada jumlah minimum pembelian?',
        a: 'Pembelian mengikuti pecahan gram yang tersedia di katalog kami, mulai dari pecahan terkecil yang kami sediakan (biasanya 1 gram ke atas).',
      },
      {
        q: 'Bisakah saya membatalkan pesanan?',
        a: 'Pesanan yang belum dibayar dapat dibatalkan tanpa biaya. Pesanan yang sudah dibayar dan diproses tidak dapat dibatalkan sepihak — selengkapnya di halaman Syarat & Ketentuan.',
      },
    ],
  },
  {
    category: 'Pengiriman & Pengambilan',
    items: [
      {
        q: 'Kapan saya bisa mengambil emas yang sudah dibayar?',
        a: 'Barang dapat diambil di toko H+1 (satu hari kerja) setelah pembayaran Anda kami konfirmasi.',
      },
      {
        q: 'Apakah bisa dikirim ke luar kota?',
        a: 'Bisa. Kami melayani pengiriman ke seluruh Indonesia dengan paket yang diasuransikan penuh hingga barang diterima.',
      },
      {
        q: 'Berapa lama estimasi pengiriman ke luar kota?',
        a: 'Estimasi waktu pengiriman tergantung jarak dan jasa ekspedisi yang digunakan. Detail akan diinformasikan saat proses checkout atau melalui konfirmasi admin.',
      },
    ],
  },
  {
    category: 'Buyback & Pre-Order',
    items: [
      {
        q: 'Bagaimana cara menjual kembali (buyback) emas saya?',
        a: 'Anda bisa menghubungi kami melalui WhatsApp atau email dengan menyertakan detail emas yang ingin dijual. Harga buyback mengikuti harga pasar pada hari transaksi.',
      },
      {
        q: 'Apa itu status "PreOrder" pada produk?',
        a: 'PreOrder berarti pecahan gram tersebut sedang kosong stok. Anda tetap bisa memesan lebih dulu, dan kami akan proses begitu barang tersedia dari distributor.',
      },
    ],
  },
]

export default function FaqPage() {
  return (
    <main style={{ padding: '56px 40px', maxWidth: 820, margin: '0 auto' }}>
      <style>{`
        .faq-item summary {
          cursor: pointer;
          list-style: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 0;
          font-size: 15px;
          font-weight: 700;
          color: var(--text);
        }
        .faq-item summary::-webkit-details-marker { display: none; }
        .faq-item summary::after {
          content: '+';
          font-size: 20px;
          color: var(--gold-dark);
          flex-shrink: 0;
          margin-left: 16px;
          transition: transform 0.2s;
        }
        .faq-item[open] summary::after {
          transform: rotate(45deg);
        }
        .faq-item .faq-answer {
          padding: 0 0 18px;
          color: var(--muted);
          font-size: 14px;
          line-height: 1.7;
        }
        .faq-item {
          border-bottom: 1px solid var(--border);
        }
      `}</style>

      <div style={{ fontSize: 12, letterSpacing: '0.06em', color: 'var(--gold-dark)', fontWeight: 700, marginBottom: 8 }}>
        BANTUAN
      </div>
      <h1 style={{ fontSize: 30, fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>
        Pertanyaan yang Sering Diajukan
      </h1>
      <p style={{ color: 'var(--muted)', marginBottom: 12 }}>
        Punya pertanyaan lain? Hubungi kami di{' '}
        <a href="https://wa.me/6289563522389" style={{ color: 'var(--gold-dark)', fontWeight: 700 }}>
          WhatsApp
        </a>{' '}
        atau{' '}
        <a href="mailto:Herusukoco395@gmail.com" style={{ color: 'var(--gold-dark)', fontWeight: 700 }}>
          email
        </a>
        .
      </p>

      <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 40 }}>
        {FAQ_GROUPS.map((group) => (
          <div key={group.category}>
            <h2 style={{ fontSize: 13, fontWeight: 800, color: 'var(--gold-dark)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
              {group.category}
            </h2>
            <div>
              {group.items.map((item) => (
                <details key={item.q} className="faq-item">
                  <summary>{item.q}</summary>
                  <div className="faq-answer">{item.a}</div>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}