import { NextResponse } from 'next/server'

const DEFAULT_AGENT_ID = 'agent_2501kyn5zg3ffd299vpsvv8m6e3d'

export const dynamic = 'force-dynamic'

export async function GET() {
  const agentId = process.env.ELEVENLABS_AGENT_ID || DEFAULT_AGENT_ID
  const apiKey = process.env.ELEVENLABS_API_KEY

  if (!apiKey) {
    return NextResponse.json({ agentId, conversationToken: null })
  }

  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${encodeURIComponent(agentId)}`,
      { headers: { 'xi-api-key': apiKey }, cache: 'no-store' },
    )

    if (!res.ok) {
      return NextResponse.json({ agentId, conversationToken: null })
    }

    const data = (await res.json()) as { token?: string }
    return NextResponse.json({ agentId, conversationToken: data.token ?? null })
  } catch {
    return NextResponse.json({ agentId, conversationToken: null })
  }
}
