import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import BeritaSidebar from '@/components/BeritaSidebar'
import type { Article } from '@/lib/types'

const CATEGORIES = ['News', 'Promo', 'Emas', 'Tips Keuangan']

export default async function BeritaPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string; q?: string }>
}) {
  const { kategori, q } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('articles')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  if (kategori) query = query.eq('category', kategori)
  if (q) query = query.ilike('title', `%${q}%`)

  const { data: articles } = await query

  return (
    <main style={{ padding: '48px 40px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ fontSize: 12, letterSpacing: '0.06em', color: 'var(--gold-dark)', fontWeight: 700, marginBottom: 8 }}>
        BERITA & TIPS
      </div>
      <h1 style={{ fontSize: 30, fontWeight: 800, color: 'var(--text)', marginBottom: 24 }}>
        Berita & Tips Emas
      </h1>

      {/* Filter kategori */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 36 }}>
        <Link
          href="/berita"
          style={{
            padding: '7px 16px',
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 700,
            background: !kategori ? 'var(--text)' : 'var(--bg-alt)',
            color: !kategori ? '#fff' : 'var(--muted)',
            border: '1px solid var(--border)',
          }}
        >
          Semua
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c}
            href={`/berita?kategori=${encodeURIComponent(c)}`}
            style={{
              padding: '7px 16px',
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 700,
              background: kategori === c ? 'var(--text)' : 'var(--bg-alt)',
              color: kategori === c ? '#fff' : 'var(--muted)',
              border: '1px solid var(--border)',
            }}
          >
            {c}
          </Link>
        ))}
      </div>

      {q && (
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          Menampilkan hasil pencarian untuk &ldquo;{q}&rdquo;
        </p>
      )}

      <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Kolom utama */}
        <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: 32 }}>
          {(!articles || articles.length === 0) && (
            <p style={{ color: 'var(--muted)' }}>Tidak ada artikel ditemukan.</p>
          )}

          {articles?.map((a: Article) => (
            <article key={a.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: 32 }}>
              <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>
                {new Date(a.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                {' · Oleh '}{a.author}
              </p>

              <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', marginBottom: 16 }}>
                <Link href={`/berita/${a.slug}`}>{a.title}</Link>
              </h2>

              <Link href={`/berita/${a.slug}`}>
                <div
                  style={{
                    width: '100%',
                    height: 280,
                    borderRadius: 12,
                    marginBottom: 16,
                    background: a.cover_image_url ? `url(${a.cover_image_url}) center/cover` : 'var(--bg-alt)',
                  }}
                />
              </Link>

              {a.excerpt && (
                <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 16 }}>
                  {a.excerpt}
                </p>
              )}

              <Link
                href={`/berita/${a.slug}`}
                style={{
                  display: 'inline-block',
                  border: '1px solid var(--border)',
                  padding: '9px 20px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  color: 'var(--text)',
                }}
              >
                Baca Selengkapnya
              </Link>
            </article>
          ))}
        </div>

        {/* Sidebar */}
        <BeritaSidebar />
      </div>
    </main>
  )
}