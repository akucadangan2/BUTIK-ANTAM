# 🪙 Butik Antam

**Toko emas batangan online** — Antam & UBS Gold, katalog, checkout dengan verifikasi pembayaran manual, dan panel admin lengkap.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%2B%20Auth-3ECF8E?logo=supabase)](https://supabase.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://vercel.com/)

**🔗 [butikantam.my.id](https://butikantam.my.id)**

</div>

---

## 📋 Daftar Isi

- [Tentang Proyek](#-tentang-proyek)
- [Tech Stack](#-tech-stack)
- [Fitur](#-fitur)
- [Struktur Folder](#-struktur-folder)
- [Environment Variables](#-environment-variables)
- [Setup Lokal](#-setup-lokal)
- [Skema Database](#-skema-database)
- [Autentikasi & Role](#-autentikasi--role)
- [Alur Pembayaran](#-alur-pembayaran-manual)
- [Update Harga Emas](#-update-harga-emas)
- [Catatan Penting (Gotcha)](#-catatan-penting--gotcha)
- [Deployment](#-deployment)
- [Roadmap](#-roadmap)

---

## 🎯 Tentang Proyek

Platform e-commerce untuk penjualan emas batangan fisik (Antam & UBS Gold). Fokus pada kesederhanaan operasional untuk toko kecil-menengah: **tanpa payment gateway otomatis** — pembeli membayar via QRIS/transfer, upload bukti, lalu admin verifikasi manual dari dashboard. Cocok untuk bisnis yang belum butuh (atau belum bisa) integrasi gateway pembayaran resmi.

## 🛠 Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Bahasa | TypeScript |
| Styling | Inline styles + CSS variables (`app/globals.css`) — tanpa Tailwind |
| Backend/DB | Supabase (Postgres, Auth, Storage) |
| Hosting | Vercel |
| Grafik | Recharts |
| Domain | DomaiNesia (`.my.id`), DNS → Vercel |

## ✨ Fitur

- 🛍️ Katalog produk dengan filter kategori & halaman detail
- 🛒 Keranjang belanja (localStorage)
- 💳 Checkout → invoice QRIS → konfirmasi pembayaran dengan upload bukti
- 👤 Autentikasi pelanggan (daftar, login, lupa password, riwayat pesanan)
- 🛠️ Panel admin: kelola produk, kelola berita, kelola pesanan, verifikasi pembayaran
- 📈 Grafik & tabel harga emas historis, auto-update harian via cron + tombol manual
- 📰 CMS berita sederhana dengan kategori & pencarian
- 📱 Responsif penuh (mobile-first, breakpoint eksplisit untuk perubahan layout besar)

## 📁 Struktur Folder

```
app/
├── (public pages)         → katalog, harga-emas, layanan, berita, faq — server component
├── admin/                 → dashboard admin, dilindungi middleware (cek role via profiles)
├── akun/                  → area pelanggan (profil, riwayat pesanan)
├── api/
│   ├── cron/               → dipanggil Vercel Cron (lihat vercel.json)
│   └── admin/               → dipanggil tombol manual di dashboard admin
├── checkout/               → keranjang → checkout → invoice → konfirmasi bayar
├── login/, daftar/, reset-password/, lupa-password/
│                            → auth pages (page.tsx + client Form terpisah, wajib <Suspense>)
components/
├── admin/                 → komponen khusus dashboard admin
├── (shared)                → Navbar, Footer, ProductCard, GoldPriceChart, dll
hooks/
└── useCart.tsx             → cart state (CartProvider di root layout)
lib/
├── supabase-client.ts      → client browser (anon/publishable key)
├── supabase-server.ts      → client server component (cookie-based session)
├── supabase-admin.ts       → client SERVICE_ROLE key, bypass RLS — server/API only
├── gold-price-sync.ts      → fetch harga dari API eksternal
├── utils.ts                → formatRupiah, slugify
└── types.ts                 → tipe TypeScript
middleware.ts                → proteksi /admin, /akun, /checkout + cek role admin
vercel.json                  → jadwal cron update harga emas
```

## 🔑 Environment Variables

Buat `.env.local` di root (jangan pernah commit file ini):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxxxx      # aman diekspos ke browser
SUPABASE_SERVICE_ROLE_KEY=sb_secret_xxxxx               # RAHASIA, server-only, bypass RLS
CRON_SECRET=string_acak_buatan_sendiri                  # proteksi endpoint /api/cron/*
NEXT_PUBLIC_APP_URL=http://localhost:3000               # ganti ke domain production saat deploy
```

> ⚠️ Ambil key dari **Supabase Dashboard → Settings → API Keys** tab **"Publishable and secret API keys"** (bukan tab Legacy). Jangan tertukar antara publishable (browser) dan secret (server-only).

> ⚠️ **Vercel tidak otomatis membaca `.env.local`** — semua variable harus diinput ulang manual di **Vercel Dashboard → Settings → Environment Variables**, lalu redeploy.

## 🚀 Setup Lokal

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## 🗄️ Skema Database

| Tabel | Fungsi |
|---|---|
| `product_categories` | Kategori produk (LM Antam, UBS Gold, dll) |
| `products` | Produk + harga jual/buyback/coret, stok, status |
| `product_buyback_yearly` | Histori harga buyback per tahun |
| `gold_prices` | Harga referensi harian (widget landing + grafik) |
| `orders`, `order_items` | Pesanan pelanggan |
| `payment_confirmations` | Bukti transfer yang diupload pelanggan |
| `payment_settings` | Nomor WA admin (single row) |
| `profiles` | Extend `auth.users` — `role`: `customer` \| `admin` |
| `articles` | Berita/CMS |

> Semua SQL dijalankan manual lewat SQL Editor sepanjang pengembangan — belum ada file migrasi terstruktur. Lihat [Roadmap](#-roadmap).

**Pola RLS wajib diikuti:**
```sql
-- Kebijakan publik: SELALU dua role, jangan cuma anon
create policy "..." on nama_tabel for select to anon, authenticated using (true);

-- Kebijakan admin: selalu cek lewat tabel profiles
exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
```
Grant tabel (`grant select/insert/update on x to anon, authenticated`) harus dijalankan terpisah dari `create policy` — RLS policy tidak cukup tanpa grant dasarnya.

## 🔐 Autentikasi & Role

- Trigger `handle_new_user()` otomatis membuat baris `profiles` (`role` default `customer`) begitu ada user baru — baca metadata `full_name` & `phone` dari `signUp({ options: { data } })`.
- Naikkan akun jadi admin:
  ```sql
  insert into profiles (id, full_name, role)
  select id, 'Nama Admin', 'admin' from auth.users where email = 'email@domain.com'
  on conflict (id) do update set role = 'admin';
  ```
- **"Confirm email" sengaja dimatikan** di Supabase Dashboard (Authentication → Providers → Email) — daftar langsung dapat sesi aktif. Reset password tetap lewat email (alur terpisah).
- Reset password pakai PKCE flow — wajib `exchangeCodeForSession(code)` sebelum `updateUser()`, kalau tidak akan dapat error *"Auth session missing!"*.

## 💳 Alur Pembayaran (Manual)

```
Checkout → order status "pending"
   ↓
/checkout/pembayaran/[kode] → tampil QRIS statis
   ↓
Pembeli klik "Konfirmasi Pembayaran" → upload bukti → payment_confirmations
   ↓
Admin verifikasi manual di /admin/pesanan/[id] → ubah status: dibayar → diproses → selesai
```

Tidak ada webhook otomatis — 100% verifikasi manual oleh admin. Bukti transfer & KTP disimpan di Supabase Storage bucket privat `customer-uploads`, diakses admin lewat signed URL (expire 1 jam).

## 📊 Update Harga Emas

- **Otomatis** — Vercel Cron memanggil `/api/cron/update-gold-price` harian (dilindungi `Authorization: Bearer CRON_SECRET`)
- **Manual** — tombol "Update Harga Sekarang" di dashboard admin
- Sumber data: [`logam-mulia-api.iamutaki.workers.dev`](https://github.com/iamutaki/logam-mulia-api) (API publik pihak ketiga) — kalau berubah struktur, cek `lib/gold-price-sync.ts`

## ⚠️ Catatan Penting / Gotcha

> Baca sebelum ubah kode — ini bug/kesalahan yang paling sering muncul selama development.

1. **`useSearchParams()` wajib `<Suspense>`** — build production gagal kalau tidak, meski dev mode terlihat baik-baik saja. Pola di project ini: `page.tsx` (server + Suspense wrapper) + komponen client terpisah (`XxxForm.tsx`).
2. **Pakai `<Link>` dari `next/link`, bukan `<a>`** untuk semua link internal maupun eksternal di JSX — beberapa kali tag `<a>` gagal ter-copy dengan benar dan bikin JSX corrupt.
3. **Tidak ada logo/gambar berhak cipta pihak lain** di project ini (logo Antam resmi, logo kurir JNE/AnterAja/Paxel) — badge kurir sengaja pakai teks+warna. Ganti ke logo asli hanya dari sumber resmi brand terkait.
4. **Grid CSS pakai `auto-fit`**, bukan kolom tetap (`repeat(2, 1fr)`) — supaya item tunggal tidak menyisakan kolom kosong.
5. **Ukuran responsif pakai `clamp(min, preferred, max)`**, kecuali perubahan struktur besar (tabel→kartu di mobile) yang pakai `@media` eksplisit di dalam `<style>` inline.
6. **PowerShell ≠ Bash** — jangan asumsikan command Unix jalan di Windows tanpa Git Bash/WSL.
7. **Path dengan `[ ]` di PowerShell** (folder route dinamis) butuh flag `-LiteralPath` di `Get-Content`/`Remove-Item`, karena default dianggap wildcard.

## ☁️ Deployment

- Push ke `main` → Vercel auto-deploy
- Env var baru **tidak memicu redeploy otomatis** pada deployment lama — jalankan:
  ```bash
  git commit --allow-empty -m "trigger redeploy"
  git push
  ```
- Domain custom via DNS record `A` (root) + `CNAME` (`www`) ke Vercel — cek propagasi di [dnschecker.org](https://dnschecker.org)

## 🗺️ Roadmap

- [ ] Halaman `/tentang`
- [ ] Testimoni asli pelanggan (saat ini generik, sengaja tanpa quote palsu)
- [ ] Upload gambar produk langsung dari admin (saat ini via URL manual)
- [ ] Migrasi SQL ad-hoc → file migrasi terstruktur (`supabase/migrations/*.sql`)

---

<div align="center">

Dibangun untuk Butik Antam — toko emas Antam & UBS Gold terpercaya.