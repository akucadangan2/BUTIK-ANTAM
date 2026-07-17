import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import type { Article } from '@/lib/types'

export default async function Highlights() {
  const supabase = await createClient()
  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(3)

  if (!articles || articles.length === 0) return null

  return (
    <section style={{ padding: '56px 40px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)' }}>Highlights</h2>
        <Link href="/berita" style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold-dark)' }}>
          Lihat Semua Artikel →
        </Link>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
        {articles.map((a: Article) => (
          <Link
            key={a.id}
            href={`/berita/${a.slug}`}
            style={{ border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}
          >
            <div
              style={{
                height: 140,
                background: a.cover_image_url ? `url(${a.cover_image_url}) center/cover` : 'var(--bg-alt)',
              }}
            />
            <div style={{ padding: 18 }}>
              <span style={{ fontSize: 11, color: 'var(--gold-dark)', fontWeight: 700 }}>
                {a.category.toUpperCase()}
              </span>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginTop: 6 }}>{a.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}