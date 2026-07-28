/**
 * Integration registry + runtime configuration.
 *
 * This is the single source of truth for which backend integrations exist,
 * what env vars they need, and their current status. The Settings page renders
 * straight from `INTEGRATIONS`, and each service module reads `isConfigured()`
 * to decide whether to hit the real provider or fall back to the bundled mock.
 */

export type IntegrationStatus = 'active' | 'ready' | 'coming-soon'

export type IntegrationCategory = 'intelligence' | 'data' | 'import'

export interface IntegrationConfig {
  id: string
  name: string
  provider: string
  category: IntegrationCategory
  description: string
  /** Env vars that must be present for the live integration to run. */
  envVars: string[]
  status: IntegrationStatus
  /** Docs URL for whoever wires up the real integration later. */
  docsUrl?: string
}

export const INTEGRATIONS: IntegrationConfig[] = [
  {
    id: 'voice',
    name: 'Conversational Voice',
    provider: 'ElevenLabs',
    category: 'intelligence',
    description:
      'Natural, low-latency spoken conversations with Muse. Streams user speech in and synthesized replies back.',
    envVars: ['ELEVENLABS_API_KEY', 'ELEVENLABS_AGENT_ID'],
    status: 'ready',
    docsUrl: 'https://elevenlabs.io/docs/conversational-ai',
  },
  {
    id: 'vision',
    name: 'Outfit & Garment Analysis',
    provider: 'OpenAI Vision',
    category: 'intelligence',
    description:
      'Recognizes clothing from uploaded photos — category, color, season, and tags — to auto-fill the closet.',
    envVars: ['OPENAI_API_KEY'],
    status: 'ready',
    docsUrl: 'https://platform.openai.com/docs/guides/vision',
  },
  {
    id: 'stylist',
    name: 'Styling Intelligence',
    provider: 'Muse reasoning',
    category: 'intelligence',
    description:
      'Turns a request plus the weather and your wardrobe into opinionated outfit recommendations.',
    envVars: ['OPENAI_API_KEY'],
    status: 'active',
  },
  {
    id: 'memory',
    name: 'Wardrobe Memory',
    provider: 'Vector embeddings',
    category: 'intelligence',
    description:
      'Embeds every piece and remembers what you wear, so suggestions get more personal over time.',
    envVars: ['OPENAI_API_KEY', 'VECTOR_DB_URL'],
    status: 'ready',
    docsUrl: 'https://platform.openai.com/docs/guides/embeddings',
  },
  {
    id: 'weather',
    name: 'Weather',
    provider: 'Weather API',
    category: 'data',
    description:
      'Local forecast so Muse dresses you for the actual day — layers when it is cool, breathable when it is warm.',
    envVars: ['WEATHER_API_KEY'],
    status: 'active',
    docsUrl: 'https://www.weatherapi.com/docs/',
  },
  {
    id: 'products',
    name: 'Live Shopping',
    provider: 'Product API',
    category: 'data',
    description:
      'Real, in-stock product results with prices and links for shopping recommendations and link evaluations.',
    envVars: ['PRODUCT_API_KEY'],
    status: 'ready',
  },
  {
    id: 'pinterest',
    name: 'Pinterest Import',
    provider: 'Pinterest',
    category: 'import',
    description:
      'Pull looks and pins from your style boards to teach Muse the aesthetics you are drawn to.',
    envVars: ['PINTEREST_APP_ID', 'PINTEREST_APP_SECRET'],
    status: 'coming-soon',
  },
  {
    id: 'instagram',
    name: 'Instagram Import',
    provider: 'Instagram',
    category: 'import',
    description:
      'Import saved posts and your own grid so Muse can learn from the outfits you already love.',
    envVars: ['INSTAGRAM_APP_ID', 'INSTAGRAM_APP_SECRET'],
    status: 'coming-soon',
  },
  {
    id: 'shopify',
    name: 'Shopify Wishlist Sync',
    provider: 'Shopify',
    category: 'import',
    description:
      'Sync wishlists and past orders from your favorite Shopify stores to evaluate them against your wardrobe.',
    envVars: ['SHOPIFY_STORE_DOMAIN', 'SHOPIFY_STOREFRONT_ACCESS_TOKEN'],
    status: 'coming-soon',
  },
]

export function getIntegration(id: string): IntegrationConfig | undefined {
  return INTEGRATIONS.find((i) => i.id === id)
}

/**
 * Whether a given integration has all of its env vars present.
 *
 * NOTE: API keys are server-only, so this returns a meaningful value only on
 * the server. Client code should treat a `false` result as "run in mock mode"
 * rather than "broken". Today every service ships a mock, so the UI stays
 * fully functional regardless.
 */
export function isConfigured(id: string): boolean {
  const integration = getIntegration(id)
  if (!integration) return false
  if (integration.status === 'coming-soon') return false
  return integration.envVars.every((key) => {
    const value =
      typeof process !== 'undefined' ? process.env?.[key] : undefined
    return typeof value === 'string' && value.length > 0
  })
}

/**
 * Global switch for the whole service layer. When true (the default today),
 * services return bundled demo data. Set `NEXT_PUBLIC_MUSE_LIVE=true` once the
 * real integrations are implemented to flip everything to live mode.
 */
export const USE_MOCKS =
  typeof process === 'undefined' ||
  process.env?.NEXT_PUBLIC_MUSE_LIVE !== 'true'
