import { isConfigured, USE_MOCKS } from './config'
import type { VisionAnalysis } from './types'

/**
 * OpenAI Vision / clothing-recognition boundary.
 *
 * Given a photo of a garment (a closet upload), returns structured attributes
 * to pre-fill the item card. Today it returns a plausible mock so the upload
 * flow feels complete; wiring OpenAI means implementing `analyzeLive`.
 */

const MOCK_ANALYSES: VisionAnalysis[] = [
  {
    category: 'Knitwear',
    color: 'Oatmeal',
    colorSwatch: 'oklch(0.88 0.03 80)',
    season: 'Autumn',
    tags: ['Cozy', 'Neutral', 'Layerable'],
    confidence: 0.94,
    description: 'A soft oatmeal knit sweater with a relaxed fit.',
  },
  {
    category: 'Dresses',
    color: 'Rose',
    colorSwatch: 'oklch(0.75 0.08 15)',
    season: 'Summer',
    tags: ['Romantic', 'Flowy', 'Evening'],
    confidence: 0.91,
    description: 'A rose-toned midi dress with a fluid drape.',
  },
  {
    category: 'Shoes',
    color: 'Tan',
    colorSwatch: 'oklch(0.7 0.06 60)',
    season: 'All season',
    tags: ['Leather', 'Versatile', 'Everyday'],
    confidence: 0.89,
    description: 'A pair of tan leather shoes suitable year-round.',
  },
]

async function analyzeLive(_imageUrl: string): Promise<VisionAnalysis> {
  // TODO: Replace with a real OpenAI Vision call, e.g. via the AI SDK:
  //   const { object } = await generateObject({
  //     model: 'openai/gpt-4o',
  //     schema: visionAnalysisSchema,
  //     messages: [{
  //       role: 'user',
  //       content: [
  //         { type: 'text', text: 'Identify this garment...' },
  //         { type: 'image', image: new URL(_imageUrl) },
  //       ],
  //     }],
  //   })
  //   return object
  throw new Error('Live vision analysis not implemented yet')
}

export async function analyzeGarment(
  imageUrl: string,
): Promise<VisionAnalysis> {
  if (!USE_MOCKS && isConfigured('vision')) {
    return analyzeLive(imageUrl)
  }
  await new Promise((r) => setTimeout(r, 900))
  // Deterministic pick so the same upload yields a stable result in the demo.
  const index = imageUrl.length % MOCK_ANALYSES.length
  return MOCK_ANALYSES[index]
}
