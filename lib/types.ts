export interface ProductCategory {
  id: number
  name: string
  slug: string
}

export interface Product {
  id: number
  category_id: number | null
  name: string
  slug: string
  weight_gram: number
  price_sell: number
  price_buyback: number | null
  price_original: number | null
  stock: number
  status: 'ready' | 'preorder' | 'habis'
  image_url: string | null
  description: string | null
  is_active: boolean
  category?: { name: string; slug: string } | null
}

export interface Article {
  id: number
  title: string
  slug: string
  category: string
  cover_image_url: string | null
  excerpt: string | null
  content: string
  author: string
  is_published: boolean
  published_at: string
}