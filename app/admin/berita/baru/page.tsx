import ArticleForm from '@/components/admin/ArticleForm'

export default function TulisArtikelPage() {
  return (
    <main style={{ padding: 40 }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', marginBottom: 24 }}>
        Tulis Artikel Baru
      </h1>
      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, padding: 28 }}>
        <ArticleForm />
      </div>
    </main>
  )
}