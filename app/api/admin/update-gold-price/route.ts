import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { syncGoldPriceFromSource } from '@/lib/gold-price-sync'

export async function POST() {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()

  if (!userData.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userData.user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const result = await syncGoldPriceFromSource()
    return NextResponse.json({ success: true, updated: result })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Gagal update harga'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}