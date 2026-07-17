import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import type { Article } from '@/lib/types'

export default async function BeritaSidebar() {
  const supabase = await createClient()
  const { data: recent } = await supabase
    .from('articles')
    .select('id, title, slug, cover_image_url')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(5)

  return (
    <aside style={{ flex: '0 0 280px', display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Pencarian */}
      <form action="/berita" method="GET">
        <input
          type="text"
          name="q"
          placeholder="Cari artikel..."
          style={{
            width: '100%',
            padding: '10px 14px',
            border: '1px solid var(--border)',
            borderRadius: 8,
            fontSize: 14,
          }}
        />
      </form>

      {/* Artikel Terbaru */}
      <div>
        <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 14 }}>
          Artikel Terbaru
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {recent?.map((a: Pick<Article, 'id' | 'title' | 'slug' | 'cover_image_url'>) => (
            <Link key={a.id} href={`/berita/${a.slug}`} style={{ display: 'flex', gap: 10 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  flexShrink: 0,
                  borderRadius: 8,
                  background: a.cover_image_url ? `url(${a.cover_image_url}) center/cover` : 'var(--bg-alt)',
                }}
              />
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', lineHeight: 1.4 }}>
                {a.title}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
          Jadilah yang Pertama Tahu
        </h4>
        <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>
          Info promo dan tips emas langsung ke email Anda.
        </p>
        <div style={{ display: 'flex' }}>
          <input
            type="email"
            placeholder="Email Anda"
            style={{
              flex: 1,
              padding: '8px 12px',
              border: '1px solid var(--border)',
              borderRight: 'none',
              borderRadius: '8px 0 0 8px',
              fontSize: 12,
            }}
          />
          <button
            style={{ background: 'var(--gold)', border: 'none', borderRadius: '0 8px 8px 0', padding: '0 14px', fontWeight: 700, cursor: 'pointer' }}
          >
            →
          </button>
        </div>
      </div>
    </aside>
  )
}