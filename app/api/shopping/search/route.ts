import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

interface SerpShoppingResult {
  title?: string
  source?: string
  price?: string
  extracted_price?: number
  thumbnail?: string
  link?: string
  product_link?: string
  rating?: number
  reviews?: number
}

export interface ShoppingProduct {
  name: string
  brand: string
  price: string
  image: string
  link: string
  query: string
}

/**
 * Turn whatever the user pasted into a Google Shopping query.
 * A product URL becomes its last meaningful path segment ("relaxed-camel-knit
 * -cardigan-0987.html" -> "relaxed camel knit cardigan"); plain text is used
 * as-is.
 */
function deriveQuery(input: string): string {
  const raw = input.trim()
  let url: URL | null = null
  try {
    url = new URL(raw.startsWith('http') ? raw : `https://${raw}`)
  } catch {
    url = null
  }

  // Not a URL — treat as a spoken/typed query.
  if (!url || !url.hostname.includes('.')) return raw

  const segments = url.pathname
    .split('/')
    .map((s) => decodeURIComponent(s))
    .filter(Boolean)

  // Prefer the longest slug-like segment (product name usually lives there).
  const slug =
    segments
      .filter((s) => /[a-z]/i.test(s))
      .sort((a, b) => b.length - a.length)[0] ?? ''

  const words = slug
    .replace(/\.(html?|php|aspx?)$/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\d{3,}\b/g, ' ') // drop long product IDs
    .replace(/\b(p|prod|product|dp|sku|id|ref)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  // Fall back to the brand hostname if the slug was pure IDs.
  if (words.length < 3) {
    const host = url.hostname.replace(/^www\./, '').split('.')[0]
    return host
  }
  return words
}

export async function GET(request: Request) {
  // Prefer the dedicated SerpAPI variable; fall back to API_KEY for back-compat.
  const apiKey = process.env.SERPAPI_API_KEY ?? process.env.API_KEY
  const { searchParams } = new URL(request.url)
  const input = searchParams.get('q') ?? ''

  if (!input.trim()) {
    return NextResponse.json({ error: 'Enter a product link or name.' }, { status: 400 })
  }

  const query = deriveQuery(input)

  if (!apiKey) {
    return NextResponse.json(
      { error: 'missing_key', query, product: null },
      { status: 200 },
    )
  }

  const endpoint =
    'https://serpapi.com/search.json?engine=google_shopping' +
    `&q=${encodeURIComponent(query)}` +
    '&gl=us&hl=en&num=10' +
    `&api_key=${apiKey}`

  try {
    const res = await fetch(endpoint, { cache: 'no-store' })
    const data = (await res.json()) as {
      error?: string
      shopping_results?: SerpShoppingResult[]
    }

    if (data.error) {
      console.log('[v0] serpapi error:', data.error)
      const reason = /invalid api key/i.test(data.error) ? 'invalid_key' : 'serp_error'
      return NextResponse.json({ error: reason, query, product: null }, { status: 200 })
    }

    const first = data.shopping_results?.find((r) => r.title)
    if (!first) {
      return NextResponse.json({ error: 'no_results', query, product: null }, { status: 200 })
    }

    const product: ShoppingProduct = {
      name: first.title ?? query,
      brand: first.source ?? 'Online store',
      price:
        first.price ??
        (typeof first.extracted_price === 'number'
          ? `$${first.extracted_price}`
          : 'View price'),
      image: first.thumbnail ?? '',
      link: first.product_link ?? first.link ?? input,
      query,
    }

    return NextResponse.json({ product })
  } catch (err) {
    console.log('[v0] serpapi fetch failed:', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'fetch_failed', query, product: null }, { status: 200 })
  }
}
