import { createAdminClient } from '@/lib/supabase-admin'

interface SourcePriceEntry {
  materialType: string
  weight: number
  weightUnit: string
  sellPrice: number
  buybackPrice: number | null
  recordedDate: string
}

// Urutan prioritas sumber — dicoba satu-satu sampai ketemu data Antam yang lengkap (jual + buyback)
const CANDIDATE_SOURCES = ['anekalogam', 'galeri24', 'hargaemas-org', 'hargaemas-com']

async function fetchFromSource(source: string): Promise<SourcePriceEntry[]> {
  const res = await fetch(`https://logam-mulia-api.iamutaki.workers.dev/api/prices/${source}`, {
    cache: 'no-store',
  })
  if (!res.ok) return []
  const json = await res.json()
  return json.data ?? []
}

function findAntamPerGram(entries: SourcePriceEntry[]) {
  const antamEntries = entries.filter((d) => d.materialType?.toLowerCase().includes('antam'))
  if (antamEntries.length === 0) return null

  const exact = antamEntries.find((d) => d.weight === 1 && d.weightUnit === 'gr')
  if (exact && exact.sellPrice && exact.buybackPrice) {
    return { sell: exact.sellPrice, buyback: exact.buybackPrice }
  }

  const withBuyback = antamEntries
    .filter((d) => d.sellPrice && d.buybackPrice)
    .sort((a, b) => a.weight - b.weight)[0]

  if (!withBuyback) return null

  return {
    sell: Math.round(withBuyback.sellPrice / withBuyback.weight),
    buyback: Math.round((withBuyback.buybackPrice as number) / withBuyback.weight),
  }
}

export async function syncGoldPriceFromSource() {
  for (const source of CANDIDATE_SOURCES) {
    const entries = await fetchFromSource(source)
    const result = findAntamPerGram(entries)
    if (result) {
      const supabase = createAdminClient()

      const { error } = await supabase
        .from('gold_prices')
        .upsert(
          {
            price_date: new Date().toISOString().split('T')[0],
            price_per_gram_sell: result.sell,
            price_per_gram_buyback: result.buyback,
          },
          { onConflict: 'price_date' }
        )

      if (error) throw new Error(error.message)

      return { ...result, source }
    }
  }

  throw new Error('Tidak ada sumber yang menyediakan data harga Antam lengkap (jual & buyback) saat ini.')
}