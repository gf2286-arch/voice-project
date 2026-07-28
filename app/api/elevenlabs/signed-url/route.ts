import { NextResponse } from 'next/server'

/**
 * Connection bootstrap for the ElevenLabs Conversational AI agent.
 *
 * The browser calls this before opening a voice session. It returns the agent
 * id to connect to and, when the agent is private, a short-lived signed URL
 * minted server-side so the API key never reaches the client.
 *
 * - Public agent  -> `{ agentId, signedUrl: null }`, client connects directly.
 * - Private agent -> `{ agentId, signedUrl }`, client connects over WebSocket.
 */

// Gabi's Muse agent. Override per-environment with ELEVENLABS_AGENT_ID.
const DEFAULT_AGENT_ID = 'agent_2501kyn5zg3ffd299vpsvv8m6e3d'

export const dynamic = 'force-dynamic'

export async function GET() {
  const agentId = process.env.ELEVENLABS_AGENT_ID || DEFAULT_AGENT_ID
  const apiKey = process.env.ELEVENLABS_API_KEY

  // No API key configured: assume a public agent and let the browser connect
  // with just the agent id.
  if (!apiKey) {
    return NextResponse.json({ agentId, signedUrl: null })
  }

  // Private agent: sign the connection server-side. If signing fails for any
  // reason, fall back to a public connection so the mic still works.
  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${encodeURIComponent(
        agentId,
      )}`,
      { headers: { 'xi-api-key': apiKey }, cache: 'no-store' },
    )

    if (!res.ok) {
      return NextResponse.json({ agentId, signedUrl: null })
    }

    const data = (await res.json()) as { signed_url?: string }
    return NextResponse.json({ agentId, signedUrl: data.signed_url ?? null })
  } catch {
    return NextResponse.json({ agentId, signedUrl: null })
  }
}
