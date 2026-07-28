import { getMuseReply } from '@/lib/muse-conversations'
import { isConfigured, USE_MOCKS } from './config'
import type { StylistRequest, StylistResponse } from './types'

/**
 * Styling intelligence boundary.
 *
 * Today this delegates to the local rule-based `getMuseReply`. When a real LLM
 * is wired in, `generateLiveResponse` is the only thing that changes — it would
 * build a prompt from the message, the weather, and the user's wardrobe memory,
 * then stream a structured response back in the same `StylistResponse` shape.
 */

async function generateLiveResponse(
  req: StylistRequest,
): Promise<StylistResponse> {
  // TODO: Replace with a real model call, e.g. the AI SDK:
  //   const { object } = await generateObject({
  //     model: 'openai/gpt-4o',
  //     schema: stylistResponseSchema,
  //     system: MUSE_PERSONA,
  //     prompt: buildStylistPrompt(req),  // message + weather + wardrobe memory
  //   })
  //   return object
  throw new Error('Live stylist not implemented yet')
}

export async function getStylistResponse(
  req: StylistRequest,
): Promise<StylistResponse> {
  if (!USE_MOCKS && isConfigured('stylist')) {
    return generateLiveResponse(req)
  }

  // Local reasoning. The weather is accepted here so the call site already
  // passes it through; the live implementation will fold it into the prompt.
  const reply = getMuseReply(req.message, {
    hasPriorReply: req.hasPriorReply,
  })

  // Simulate the "thinking" beat so the typing indicator reads naturally.
  await new Promise((r) => setTimeout(r, 1400))
  return reply
}
