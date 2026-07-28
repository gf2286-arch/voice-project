import { isConfigured, USE_MOCKS } from './config'
import type { VoiceSession, VoiceTurn } from './types'

/**
 * ElevenLabs Conversational AI boundary.
 *
 * The UI drives voice through three calls: open a session (which yields a
 * signed realtime URL), stream turns, and end the session. Today these are
 * mocked so the animated mic + transcript UX works end to end without a
 * backend. Wiring ElevenLabs means implementing the three `*Live` helpers.
 */

async function startLiveSession(): Promise<VoiceSession> {
  // TODO: Ask a server route to mint a signed conversation URL, e.g.
  //   GET /api/voice/session ->
  //     const res = await fetch(
  //       'https://api.elevenlabs.io/v1/convai/conversation/get-signed-url' +
  //       `?agent_id=${process.env.ELEVENLABS_AGENT_ID}`,
  //       { headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY! } },
  //     )
  //     return res.json()
  throw new Error('Live voice sessions not implemented yet')
}

export async function startVoiceSession(): Promise<VoiceSession> {
  if (!USE_MOCKS && isConfigured('voice')) {
    return startLiveSession()
  }
  await new Promise((r) => setTimeout(r, 250))
  return {
    id: `mock-${Date.now()}`,
    status: 'listening',
    connectionUrl: 'wss://mock.local/voice',
    agentId: 'muse-demo-agent',
  }
}

/**
 * In production this is handled by the realtime socket streaming audio both
 * ways. The mock echoes back a transcript so the conversation UI stays live.
 */
export async function sendVoiceUtterance(
  _session: VoiceSession,
  transcript: string,
): Promise<VoiceTurn> {
  if (!USE_MOCKS && isConfigured('voice')) {
    throw new Error('Live voice streaming not implemented yet')
  }
  await new Promise((r) => setTimeout(r, 200))
  return { transcript, reply: '', audioUrl: undefined }
}

export async function endVoiceSession(_session: VoiceSession): Promise<void> {
  // No-op in mock mode; closes the realtime socket in production.
}
