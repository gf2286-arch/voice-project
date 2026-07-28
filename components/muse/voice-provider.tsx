'use client'

import { ConversationProvider } from '@elevenlabs/react'

/**
 * Client boundary for ElevenLabs' `ConversationProvider`, which relies on React
 * context and therefore cannot be imported directly into the server layout.
 * Wrapping the app here makes the voice conversation context available to every
 * client component (e.g. the mic on the landing screen and the composer).
 */
export function VoiceProvider({ children }: { children: React.ReactNode }) {
  return <ConversationProvider>{children}</ConversationProvider>
}
