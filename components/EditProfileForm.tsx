'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'

interface Props {
  userId: string
  initialName: string
  initialPhone: string
}

export default function EditProfileForm({ userId, initialName, initialPhone }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [name, setName] = useState(initialName)
  const [phone, setPhone] = useState(initialPhone)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setSaved(false)

    await supabase
      .from('profiles')
      .update({ full_name: name, phone })
      .eq('id', userId)

    setLoading(false)
    setSaved(true)
    router.refresh()
  }

  return (
    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
          Nama Lengkap
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14 }}
        />
      </div>

      <div>
        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>
          No. HP
        </label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14 }}
        />
      </div>

      {saved && (
        <p style={{ fontSize: 13, color: '#065F46', background: '#ECFDF5', padding: '8px 12px', borderRadius: 8 }}>
          Profil berhasil diperbarui.
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{
          alignSelf: 'flex-start',
          padding: '10px 22px',
          background: 'var(--gold)',
          border: 'none',
          borderRadius: 8,
          fontWeight: 700,
          fontSize: 13,
          cursor: loading ? 'default' : 'pointer',
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
      </button>
    </form>
  )
}