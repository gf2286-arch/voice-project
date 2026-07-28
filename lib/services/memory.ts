import { isConfigured, USE_MOCKS } from './config'
import type {
  StyleProfile,
  WardrobeEmbedding,
  WardrobeItem,
  WearEvent,
} from './types'

/**
 * Embedding-based wardrobe memory boundary.
 *
 * This is what makes Muse feel personal over time: every piece is embedded,
 * every wear is recorded, and suggestions are ranked by similarity to what the
 * user actually reaches for. Today it returns light mocks; the live version
 * writes to and queries a vector store.
 */

async function embedLive(_item: WardrobeItem): Promise<WardrobeEmbedding> {
  // TODO: Generate an embedding from the item's image + attributes, e.g.:
  //   const { embedding } = await embed({
  //     model: 'openai/text-embedding-3-small',
  //     value: `${_item.name} ${_item.category} ${_item.color} ${_item.tags.join(' ')}`,
  //   })
  //   await vectorDb.upsert({ id: _item.id, vector: embedding })
  throw new Error('Live embeddings not implemented yet')
}

export async function embedItem(
  item: WardrobeItem,
): Promise<WardrobeEmbedding> {
  if (!USE_MOCKS && isConfigured('memory')) {
    return embedLive(item)
  }
  await new Promise((r) => setTimeout(r, 120))
  return { itemId: item.id, vector: [], model: 'mock-embeddings' }
}

/** Record that the user wore an item (feeds future personalization). */
export async function recordWear(_event: WearEvent): Promise<void> {
  if (!USE_MOCKS && isConfigured('memory')) {
    // TODO: Persist the wear event and update recency/frequency signals.
    throw new Error('Live wear tracking not implemented yet')
  }
}

/**
 * Return the ids of wardrobe items most similar to a query item — the
 * primitive behind "what pairs with this" and personalized suggestions.
 */
export async function findSimilarItems(
  _itemId: string,
  _limit = 5,
): Promise<string[]> {
  if (!USE_MOCKS && isConfigured('memory')) {
    // TODO: Nearest-neighbor search over the wardrobe vectors.
    throw new Error('Live similarity search not implemented yet')
  }
  await new Promise((r) => setTimeout(r, 150))
  return []
}

/** The user's learned style profile, refined as more data comes in. */
export async function getStyleProfile(): Promise<StyleProfile> {
  if (!USE_MOCKS && isConfigured('memory')) {
    // TODO: Derive from wear history + embedding clusters.
    throw new Error('Live style profile not implemented yet')
  }
  await new Promise((r) => setTimeout(r, 150))
  return {
    descriptors: ['tonal', 'effortless', 'quietly polished', 'international'],
    favoriteColors: ['Cream', 'Camel', 'Rose', 'Black'],
    coreItemIds: [],
  }
}
