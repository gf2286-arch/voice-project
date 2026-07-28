'use client'

import { useCallback, useRef, useState } from 'react'
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
 *  - microphone permission handling (releasing the probe stream so it does not
 *    contend with the SDK's own capture),
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
  // Guards against a click firing start() twice before status updates.
  const startingRef = useRef(false)

  const conversation = useConversation({
    onConnect: ({ conversationId }) => {
      console.log('[v0] voice connected:', conversationId)
    },
    onDisconnect: (details) => {
      console.log('[v0] voice disconnected:', details)
      startingRef.current = false
    },
    onStatusChange: ({ status }) => {
      console.log('[v0] voice status:', status)
    },
    onModeChange: ({ mode }) => {
      // "listening" = mic is open for you; "speaking" = Muse is talking.
      console.log('[v0] voice mode:', mode)
    },
    onVadScore: ({ vadScore }) => {
      // Non-zero while you speak. If this stays ~0 while talking, the agent is
      // not receiving mic audio (device/permission issue).
      if (vadScore > 0.5) console.log('[v0] voice VAD (hearing you):', vadScore)
    },
    onMessage: ({ message, source, role }) => {
      if (!message) return
      const isUser = role === 'user' || source === 'user'
      console.log(`[v0] voice message (${isUser ? 'user' : 'muse'}):`, message)
      if (isUser) onUserTranscript?.(message)
      else onAgentReply?.(message)
    },
    onError: (message: string, context?: unknown) => {
      console.log('[v0] voice error:', message, context)
      const msg = message || 'Voice connection error.'
      setError(msg)
      onError?.(msg)
    },
    onDebug: (info: unknown) => {
      console.log('[v0] voice debug:', info)
    },
  })

  const { status: rawStatus, isSpeaking, startSession, endSession } =
    conversation

  const start = useCallback(async () => {
    if (startingRef.current) return
    startingRef.current = true
    setError(null)

    // 1) Prompt for mic permission, then immediately release the probe stream.
    //    Holding these tracks open can starve the SDK's own capture, which is a
    //    common cause of "connected but the agent can't hear me".
    try {
      const probe = await navigator.mediaDevices.getUserMedia({ audio: true })
      probe.getTracks().forEach((track) => track.stop())
    } catch {
      const msg = 'Microphone access is needed to talk with Muse.'
      setError(msg)
      onError?.(msg)
      startingRef.current = false
      return
    }

    // 2) Ask the server how to connect (public agent id or signed URL).
    try {
      const res = await fetch('/api/elevenlabs/signed-url', { cache: 'no-store' })
if (!res.ok) throw new Error(`Connection setup failed (${res.status}).`)

const { agentId, conversationToken } = (await res.json()) as {
  agentId: string
  conversationToken: string | null
}

if (conversationToken) {
  console.log('[v0] voice starting: private (webrtc)')
  await startSession({ conversationToken, connectionType: 'webrtc' })
} else {
  console.log('[v0] voice starting: public (webrtc), agent', agentId)
  await startSession({ agentId, connectionType: 'webrtc' })
}
      if (signedUrl) {
        // Private agent: authenticated WebSocket connection.
        console.log('[v0] voice starting: private (websocket)')
        await startSession({ signedUrl, connectionType: 'websocket' })
      } else {
        // Public agent: voice connections use WebRTC, which captures the mic.
        console.log('[v0] voice starting: public (webrtc), agent', agentId)
        await startSession({ agentId, connectionType: 'webrtc' })
      }
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Could not start the voice session.'
      console.log('[v0] voice start failed:', msg)
      setError(msg)
      onError?.(msg)
      startingRef.current = false
    }
  }, [startSession, onError])

  const stop = useCallback(async () => {
    try {
      await endSession()
    } catch {
      // Ignore — the session is already closing or closed.
    } finally {
      startingRef.current = false
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
