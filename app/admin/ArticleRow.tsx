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
    <tr style={{ borderBottom: '1px solid var(--border)' }}>
      <td style={{ padding: 10 }}>{article.title}</td>
      <td style={{ padding: 10 }}>{article.category}</td>
      <td style={{ padding: 10 }}>{article.is_published ? 'Terbit' : 'Draf'}</td>
      <td style={{ padding: 10, display: 'flex', gap: 12 }}>
        <Link href={`/admin/berita/${article.id}`} style={{ color: 'var(--gold-dark)', fontWeight: 600 }}>
          Edit
        </Link>
        <button onClick={handleDelete} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
          Hapus
        </button>
      </td>
    </tr>
  )
}