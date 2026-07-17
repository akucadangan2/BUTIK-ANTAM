'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { slugify } from '@/lib/utils'
import type { Article } from '@/lib/types'

const CATEGORIES = ['News', 'Promo', 'Emas', 'Tips Keuangan']

export default function ArticleForm({ initial }: { initial?: Article }) {
  const router = useRouter()
  const supabase = createClient()

  const [title, setTitle] = useState(initial?.title ?? '')
  const [category, setCategory] = useState(initial?.category ?? 'News')
  const [coverUrl, setCoverUrl] = useState(initial?.cover_image_url ?? '')
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? '')
  const [content, setContent] = useState(initial?.content ?? '')
  const [isPublished, setIsPublished] = useState(initial?.is_published ?? true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const payload = {
      title,
      slug: initial?.slug ?? slugify(title),
      category,
      cover_image_url: coverUrl || null,
      excerpt: excerpt || null,
      content,
      is_published: isPublished,
      updated_at: new Date().toISOString(),
    }

    const { error } = initial
      ? await supabase.from('articles').update(payload).eq('id', initial.id)
      : await supabase.from('articles').insert(payload)

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/admin/berita')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 640 }}>
      <input
        placeholder="Judul artikel"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        style={{ padding: 10, border: '1px solid var(--border)', borderRadius: 8 }}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{ padding: 10, border: '1px solid var(--border)', borderRadius: 8 }}
      >
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <input
        placeholder="URL gambar cover (opsional)"
        value={coverUrl}
        onChange={(e) => setCoverUrl(e.target.value)}
        style={{ padding: 10, border: '1px solid var(--border)', borderRadius: 8 }}
      />

      <textarea
        placeholder="Ringkasan singkat (excerpt, opsional)"
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
        rows={2}
        style={{ padding: 10, border: '1px solid var(--border)', borderRadius: 8 }}
      />

      <textarea
        placeholder="Isi artikel (pisahkan paragraf dengan Enter)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        rows={12}
        style={{ padding: 10, border: '1px solid var(--border)', borderRadius: 8, fontFamily: 'inherit' }}
      />

      <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
        <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
        Publikasikan sekarang
      </label>

      {error && <p style={{ color: 'red', fontSize: 13 }}>{error}</p>}

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: '12px 0',
          background: 'var(--gold)',
          border: 'none',
          borderRadius: 8,
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        {loading ? 'Menyimpan...' : initial ? 'Simpan Perubahan' : 'Terbitkan Artikel'}
      </button>
    </form>
  )
}