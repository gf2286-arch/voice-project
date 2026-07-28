'use client'

import { useCallback, useState } from 'react'
import { useConversation } from '@elevenlabs/react'

export type MuseVoiceStatus = 'idle' | 'connecting' | 'active'

interface UseMuseVoiceOptions {
  /** Final transcript of something the user said. */
  onUserTranscript?: (text: string) => void
  /** A spoken reply from Muse (the agent), as text. */
  onAgentReply?: (text: string) => void
  onError?: (message: string) => void
}

/**
 * Real-time voice conversation with the Muse ElevenLabs agent.
 *
 * Wraps ElevenLabs' `useConversation` and adds:
 *  - microphone permission handling,
 *  - fetching the connection config from our server route (which supports both
 *    public and private agents), and
 *  - a simplified idle/connecting/active status plus a toggle().
 *
 * Must be used inside the `<ConversationProvider>` mounted in the root layout.
 */
export function useMuseVoice({
  onUserTranscript,
  onAgentReply,
  onError,
}: UseMuseVoiceOptions = {}) {
  const [error, setError] = useState<string | null>(null)

  const conversation = useConversation({
    onMessage: ({ message, source }) => {
      if (!message) return
      if (source === 'user') onUserTranscript?.(message)
      else onAgentReply?.(message)
    },
    onError: (message: string) => {
      const msg = message || 'Voice connection error.'
      setError(msg)
      onError?.(msg)
    },
  })

  const { status: rawStatus, isSpeaking, startSession, endSession } =
    conversation

  const start = useCallback(async () => {
    setError(null)

    // 1) Microphone permission — required to capture speech.
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch {
      const msg = 'Microphone access is needed to talk with Muse.'
      setError(msg)
      onError?.(msg)
      return
    }

    // 2) Ask the server how to connect (public agent id or signed URL).
    try {
      const res = await fetch('/api/elevenlabs/signed-url', {
        cache: 'no-store',
      })
      const { agentId, signedUrl } = (await res.json()) as {
        agentId: string
        signedUrl: string | null
      }

      if (signedUrl) {
        await startSession({ signedUrl, connectionType: 'websocket' })
      } else {
        await startSession({ agentId, connectionType: 'webrtc' })
      }
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Could not start the voice session.'
      setError(msg)
      onError?.(msg)
    }
  }, [startSession, onError])

  const stop = useCallback(async () => {
    try {
      await endSession()
    } catch {
      // Ignore — the session is already closing or closed.
    }
  }, [endSession])

  const status: MuseVoiceStatus =
    rawStatus === 'connected'
      ? 'active'
      : rawStatus === 'connecting'
        ? 'connecting'
        : 'idle'

  const toggle = useCallback(() => {
    if (rawStatus === 'connected' || rawStatus === 'connecting') {
      void stop()
    } else {
      void start()
    }
  }, [rawStatus, start, stop])

  return { status, isSpeaking, error, start, stop, toggle }
}
