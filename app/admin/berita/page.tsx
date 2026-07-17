import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import ArticleRow from '@/components/admin/ArticleRow'
import type { Article } from '@/lib/types'

export default async function AdminBeritaPage() {
  const supabase = await createClient()
  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <main style={{ padding: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)' }}>Kelola Berita</h1>
        <Link
          href="/admin/berita/baru"
          style={{ background: 'var(--gold)', color: 'var(--text)', padding: '11px 22px', borderRadius: 8, fontWeight: 700, fontSize: 14 }}
        >
          + Tulis Artikel
        </Link>
      </div>

      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', background: 'var(--bg-alt)' }}>
              <th style={{ padding: '12px 22px', fontSize: 12, color: 'var(--muted)', fontWeight: 700 }}>Judul</th>
              <th style={{ padding: '12px 22px', fontSize: 12, color: 'var(--muted)', fontWeight: 700 }}>Kategori</th>
              <th style={{ padding: '12px 22px', fontSize: 12, color: 'var(--muted)', fontWeight: 700 }}>Status</th>
              <th style={{ padding: '12px 22px', fontSize: 12, color: 'var(--muted)', fontWeight: 700 }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {articles?.map((a: Article) => (
              <ArticleRow key={a.id} article={a} />
            ))}
            {(!articles || articles.length === 0) && (
              <tr>
                <td colSpan={4} style={{ padding: 22, textAlign: 'center', color: 'var(--muted)' }}>
                  Belum ada artikel.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}