import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import BeritaSidebar from '@/components/BeritaSidebar'

export default async function ArtikelDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!article) return notFound()

  const paragraphs = article.content.split('\n').filter((p: string) => p.trim() !== '')

  return (
    <main style={{ padding: '48px 40px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <article style={{ flex: '1 1 500px', maxWidth: 720 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--gold-dark)', textTransform: 'uppercase' }}>
            {article.category}
          </span>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: 'var(--text)', margin: '10px 0 12px' }}>
            {article.title}
          </h1>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 28 }}>
            {new Date(article.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            {' · '}{article.author}
          </p>

          {article.cover_image_url && (
            <div
              style={{
                width: '100%',
                height: 320,
                borderRadius: 14,
                marginBottom: 28,
                background: `url(${article.cover_image_url}) center/cover`,
              }}
            />
          )}

          <div style={{ fontSize: 16, color: 'var(--text)', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {paragraphs.map((p: string, i: number) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </article>

        <BeritaSidebar />
      </div>
    </main>
  )
}