/**
 * Shared domain + service types for Muse.
 *
 * These describe the boundary between the UI and the (future) backend
 * integrations. Every service below returns Promises and typed payloads that
 * intentionally resemble the real provider responses, so that swapping a mock
 * for a live API is a matter of changing the implementation — never the
 * call sites or the component props.
 */

/* ------------------------------------------------------------------ *
 * Wardrobe + outfits
 * ------------------------------------------------------------------ */

export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter' | 'All season'

export interface WardrobeItem {
  id: string
  name: string
  image: string
  category: string
  color: string
  colorSwatch: string
  season: string
  tags: string[]
}

export interface OutfitRecommendation {
  title: string
  occasion: string
  image: string
  pieces: string[]
}

export interface ShoppingSuggestion {
  name: string
  brand: string
  price: string
  image: string
  reason: string
  /** Present once a real Product API is wired in. */
  url?: string
}

/* ------------------------------------------------------------------ *
 * Weather (Weather API boundary)
 * ------------------------------------------------------------------ */

export interface WeatherSnapshot {
  location: string
  /** Degrees, in the unit below. */
  temperature: number
  unit: 'C' | 'F'
  /** Machine-friendly condition key, e.g. "sunny", "rain", "clouds". */
  condition: string
  /** Human summary, e.g. "Sunny with a light breeze". */
  summary: string
  high: number
  low: number
  /** 0–1 probability of precipitation. */
  precipitation: number
  /** Short natural-language dressing hint derived from the forecast. */
  stylingNote: string
}

/* ------------------------------------------------------------------ *
 * Stylist (Muse conversational reasoning)
 * ------------------------------------------------------------------ */

export interface StylistRequest {
  message: string
  /** Whether Muse has already replied in this session (drives pushback tone). */
  hasPriorReply?: boolean
  /** Optional forecast so Muse can factor the weather into her advice. */
  weather?: WeatherSnapshot | null
}

export interface StylistResponse {
  text: string
  transcript?: string
  reasoning?: string
  outfits?: OutfitRecommendation[]
  shopping?: ShoppingSuggestion[]
}

/* ------------------------------------------------------------------ *
 * Voice (ElevenLabs Conversational AI boundary)
 * ------------------------------------------------------------------ */

export type VoiceSessionStatus =
  | 'idle'
  | 'connecting'
  | 'listening'
  | 'thinking'
  | 'speaking'
  | 'error'

export interface VoiceSession {
  id: string
  status: VoiceSessionStatus
  /** Signed URL / token the client would use to open the realtime socket. */
  connectionUrl: string
  agentId: string
}

export interface VoiceTurn {
  /** Final transcribed user speech. */
  transcript: string
  /** Muse's spoken reply as text. */
  reply: string
  /** URL to synthesized audio once TTS is wired in. */
  audioUrl?: string
}

/* ------------------------------------------------------------------ *
 * Vision (OpenAI Vision / clothing recognition boundary)
 * ------------------------------------------------------------------ */

export interface VisionAnalysis {
  category: string
  color: string
  colorSwatch: string
  season: string
  tags: string[]
  /** 0–1 model confidence. */
  confidence: number
  /** Free-text description of the garment. */
  description: string
}

/* ------------------------------------------------------------------ *
 * Products (real shopping recommendations boundary)
 * ------------------------------------------------------------------ */

export interface ProductQuery {
  /** Free text, e.g. "cream tailored blazer under $300". */
  query?: string
  occasion?: string
  maxPrice?: number
  /** Item ids already owned, so results can complement the wardrobe. */
  ownedItemIds?: string[]
}

export interface Product {
  id: string
  name: string
  brand: string
  price: string
  image: string
  url: string
  reason: string
}

export interface ProductEvaluation {
  id: string
  name: string
  brand: string
  price: string
  image: string
  verdict: 'buy' | 'maybe' | 'skip'
  /** 0–100 versatility against the current wardrobe. */
  versatility: number
  spoken: string
  pairsWith: string[]
  styling: string[]
  watchOut?: string
}

/* ------------------------------------------------------------------ *
 * Wardrobe memory (embedding-based personalization boundary)
 * ------------------------------------------------------------------ */

export interface WardrobeEmbedding {
  itemId: string
  /** Vector representation of the piece (image + attributes). */
  vector: number[]
  model: string
}

export interface WearEvent {
  itemId: string
  wornAt: string
  occasion?: string
  pairedWith?: string[]
}

export interface StyleProfile {
  /** Short adjectives describing the user's taste, learned over time. */
  descriptors: string[]
  favoriteColors: string[]
  /** Item ids ranked by how central they are to the user's style. */
  coreItemIds: string[]
}
