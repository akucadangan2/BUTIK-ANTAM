import { NextRequest, NextResponse } from 'next/server'
import { syncGoldPriceFromSource } from '@/lib/gold-price-sync'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await syncGoldPriceFromSource()
    return NextResponse.json({ success: true, updated: result })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Gagal update harga'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}