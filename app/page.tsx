'use client'

import { useCallback, useEffect, useState } from 'react'
import useSWR from 'swr'
import { Plus } from 'lucide-react'
import { Sidebar } from '@/components/muse/sidebar'
import { Landing } from '@/components/muse/landing'
import { Conversation, type Message } from '@/components/muse/conversation'
import { MicOrb } from '@/components/muse/mic-orb'
import { Closet } from '@/components/muse/closet'
import { OutfitHistory } from '@/components/muse/outfit-history'
import { ShoppingAssistant } from '@/components/muse/shopping-assistant'
import { Settings } from '@/components/muse/settings'
import { getWeather } from '@/lib/services'
import { useMuseVoice } from '@/lib/use-muse-voice'

const USER_NAME = 'Gabi'

function makeId() {
  return Math.random().toString(36).slice(2)
}

function greetingFor(date: Date) {
  const h = date.getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function Page() {
  const [active, setActive] = useState('home')
  const [messages, setMessages] = useState<Message[]>([])

  // Time-of-day greeting resolved on the client to avoid hydration mismatch.
  // Defaults to "Good morning" so the first paint matches the calm intro.
  const [timeGreeting, setTimeGreeting] = useState('Good morning')
  useEffect(() => {
    setTimeGreeting(greetingFor(new Date()))
  }, [])

  // Local forecast via the Weather service boundary (mock today, live later).
  const { data: weather } = useSWR('weather:new-york', () =>
    getWeather('New York, NY'),
  )

  const started = messages.length > 0

  // Push a raw voice transcript straight into the conversation. The agent is
  // the stylist here, so voice turns don't run through the mock stylist.
  const appendMessage = useCallback((role: 'user' | 'muse', text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    setMessages((prev) => [...prev, { id: makeId(), role, text: trimmed }])
  }, [])

  const voice = useMuseVoice({
    onUserTranscript: (text) => appendMessage('user', text),
    onAgentReply: (text) => appendMessage('muse', text),
  })

  const voiceActive = voice.status !== 'idle'
  const voiceLabel =
    voice.status === 'connecting'
      ? 'Connecting…'
      : voice.status === 'active'
        ? voice.isSpeaking
          ? 'Muse is speaking…'
          : 'Listening…'
        : 'Tap to speak'

  // Return to the voice-first opening screen and end any live session.
  const goHome = useCallback(() => {
    setActive('home')
    setMessages([])
    if (voice.status !== 'idle') voice.toggle()
  }, [voice])

  // Voice-first landing: no chrome until the conversation begins.
  if (!started) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Landing
          greeting={`${timeGreeting}, ${USER_NAME}.`}
          listening={voiceActive}
          statusLabel={voiceLabel}
          errorMessage={voice.error}
          onToggleListening={voice.toggle}
        />
      </div>
    )
  }

  return (
    <div className="muse-app-in flex h-screen overflow-hidden bg-background text-foreground">
      <div className="muse-slide-in-left flex h-full">
        <Sidebar active={active} onNavigate={setActive} onHome={goHome} />
      </div>

      <main className="relative flex flex-1 flex-col overflow-hidden">
        {/* Ambient wash */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(60% 50% at 50% 0%, oklch(0.92 0.05 55 / 0.6) 0%, transparent 70%), radial-gradient(45% 40% at 90% 100%, oklch(0.85 0.08 20 / 0.28) 0%, transparent 70%)',
          }}
        />

        {active === 'closet' ? (
          <div key="closet" className="muse-fade-up flex-1 overflow-y-auto pt-8">
            <Closet voice={voice} />
          </div>
        ) : active === 'history' ? (
          <div key="history" className="muse-fade-up flex-1 overflow-y-auto pt-8">
            <OutfitHistory voice={voice} />
          </div>
        ) : active === 'shopping' ? (
          <div key="shopping" className="muse-fade-up flex-1 overflow-y-auto pt-8">
            <ShoppingAssistant />
          </div>
        ) : active === 'settings' ? (
          <div key="settings" className="muse-fade-up flex-1 overflow-y-auto pt-8">
            <Settings />
          </div>
        ) : (
          <>
        {/* Top bar */}
        <header className="flex items-center justify-between px-8 py-5">
          <div>
            <h2 className="font-serif text-xl text-foreground">
              {`${timeGreeting}, ${USER_NAME}`}
            </h2>
            <p className="text-sm text-muted-foreground">
              {weather
                ? `Continuing your session · ${weather.temperature}° and ${weather.condition}`
                : 'Continuing your styling session'}
            </p>
          </div>
          <button
            type="button"
            onClick={goHome}
            className="group flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground/80 shadow-sm transition-all duration-300 hover:border-primary/30 hover:text-foreground active:scale-95"
          >
            <Plus
              size={16}
              strokeWidth={2}
              className="transition-transform duration-300 group-hover:rotate-90"
              aria-hidden
            />
            New session
          </button>
        </header>

        {/* Body */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          <Conversation
            messages={messages}
            thinking={voice.status === 'connecting'}
          />
        </div>

        {/* Voice bar — Muse is voice-first, so the mic is the only control */}
        <div className="px-6 pb-8 pt-2">
          <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-3">
            <MicOrb size="sm" listening={voiceActive} onClick={voice.toggle} />
            <p
              aria-live="polite"
              className="h-5 text-sm font-medium tracking-wide text-muted-foreground/90"
            >
              {voiceLabel}
            </p>
            {voice.error ? (
              <p role="alert" className="text-pretty text-xs text-destructive">
                {voice.error}
              </p>
            ) : null}
          </div>
        </div>
          </>
        )}
      </main>
    </div>
  )
}
