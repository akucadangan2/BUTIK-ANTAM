import { createClient } from '@/lib/supabase-server'
import ArticleForm from '@/components/admin/ArticleForm'
import { notFound } from 'next/navigation'

export default async function EditArtikelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: article } = await supabase.from('articles').select('*').eq('id', id).single()

  if (!article) return notFound()

return (
    <main style={{ padding: 40 }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', marginBottom: 24 }}>
        Edit Artikel
      </h1>
      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, padding: 28 }}>
        <ArticleForm initial={article} />
      </div>
    </main>
  )
}