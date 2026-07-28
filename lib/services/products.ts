import { isConfigured, USE_MOCKS } from './config'
import type { Product, ProductEvaluation, ProductQuery } from './types'

/**
 * Product / shopping boundary.
 *
 * Two operations: search for pieces that complement the wardrobe, and evaluate
 * a pasted product link. Today both are mocked; the live versions call a
 * product search API and (optionally) a scraping/enrichment step for links.
 */

async function searchLive(_query: ProductQuery): Promise<Product[]> {
  // TODO: Replace with a real product search API, e.g.
  //   const res = await fetch(`https://api.products.example/search`, {
  //     method: 'POST',
  //     headers: { authorization: `Bearer ${process.env.PRODUCT_API_KEY}` },
  //     body: JSON.stringify(_query),
  //   })
  //   return (await res.json()).items
  throw new Error('Live product search not implemented yet')
}

export async function searchProducts(
  query: ProductQuery,
): Promise<Product[]> {
  if (!USE_MOCKS && isConfigured('products')) {
    return searchLive(query)
  }
  await new Promise((r) => setTimeout(r, 500))
  // The UI currently supplies its own curated demo results; return empty so it
  // falls back to those rather than inventing unrelated products.
  return []
}

async function evaluateLive(_url: string): Promise<ProductEvaluation> {
  // TODO: Fetch product metadata from the link (Open Graph / provider API),
  // then score it against the wardrobe embeddings from the memory service.
  throw new Error('Live product evaluation not implemented yet')
}

/**
 * Evaluate a pasted product link. The Shopping Assistant currently resolves
 * evaluations from keywords in the URL locally; this boundary exists so that
 * logic can move server-side (real metadata + wardrobe scoring) without
 * touching the component.
 */
export async function evaluateProductLink(
  url: string,
): Promise<ProductEvaluation | null> {
  if (!USE_MOCKS && isConfigured('products')) {
    return evaluateLive(url)
  }
  await new Promise((r) => setTimeout(r, 700))
  return null
}
