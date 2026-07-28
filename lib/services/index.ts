/**
 * Muse service layer.
 *
 * A single import surface for every backend boundary. Components should import
 * from `@/lib/services` and never reach into a provider SDK directly — that
 * keeps integrations swappable and the UI unaware of what is mock vs. live.
 */

export * from './types'
export {
  INTEGRATIONS,
  getIntegration,
  isConfigured,
  USE_MOCKS,
  type IntegrationConfig,
  type IntegrationStatus,
  type IntegrationCategory,
} from './config'

export { getWeather } from './weather'
export { getStylistResponse } from './stylist'
export { startVoiceSession, sendVoiceUtterance, endVoiceSession } from './voice'
export { analyzeGarment } from './vision'
export { searchProducts, evaluateProductLink } from './products'
export {
  embedItem,
  recordWear,
  findSimilarItems,
  getStyleProfile,
} from './memory'
