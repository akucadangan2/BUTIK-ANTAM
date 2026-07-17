'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import type { Article } from '@/lib/types'

export default function ArticleRow({ article }: { article: Article }) {
  const router = useRouter()
  const supabase = createClient()

  async function handleDelete() {
    if (!confirm(`Hapus artikel "${article.title}"?`)) return
    await supabase.from('articles').delete().eq('id', article.id)
    router.refresh()
  }

  return (
    <tr style={{ borderTop: '1px solid var(--border)' }}>
      <td style={{ padding: '14px 22px', fontSize: 14, color: 'var(--text)', fontWeight: 600 }}>{article.title}</td>
      <td style={{ padding: '14px 22px', fontSize: 13, color: 'var(--muted)' }}>{article.category}</td>
      <td style={{ padding: '14px 22px' }}>
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: 999,
            background: article.is_published ? '#D1FAE5' : '#F3F4F6',
            color: article.is_published ? '#065F46' : '#6B7280',
          }}
        >
          {article.is_published ? 'Terbit' : 'Draf'}
        </span>
      </td>
      <td style={{ padding: '14px 22px', display: 'flex', gap: 14 }}>
        <Link href={`/admin/berita/${article.id}`} style={{ color: 'var(--gold-dark)', fontWeight: 700, fontSize: 13 }}>
          Edit
        </Link>
        <button
          onClick={handleDelete}
          style={{ color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13 }}
        >
          Hapus
        </button>
      </td>
    </tr>
  )
}