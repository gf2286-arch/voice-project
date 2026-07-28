'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { Sparkles, Plus, ArrowUp } from 'lucide-react'
import { Sidebar } from '@/components/muse/sidebar'
import { Landing } from '@/components/muse/landing'
import { Conversation, type Message } from '@/components/muse/conversation'
import { MicOrb } from '@/components/muse/mic-orb'
import { Closet } from '@/components/muse/closet'
import { OutfitHistory } from '@/components/muse/outfit-history'
import { ShoppingAssistant } from '@/components/muse/shopping-assistant'
import { Settings } from '@/components/muse/settings'
import { getStylistResponse, getWeather } from '@/lib/services'

const USER_NAME = 'Gabi'

const SUGGESTIONS = [
  'I have a rooftop dinner in SoHo tonight',
  "I'm interviewing at a startup",
  "I'm going to Paris for five days",
  'I want to look expensive without buying anything',
]

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
  const [listening, setListening] = useState(false)
  const [thinking, setThinking] = useState(false)
  const [draft, setDraft] = useState('')

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

  function sendMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed) return
    setListening(false)
    setDraft('')
    setMessages((prev) => [
      ...prev,
      { id: makeId(), role: 'user', text: trimmed },
    ])
    setThinking(true)
    const hasPriorReply = messages.some((m) => m.role === 'muse')
    // Route through the stylist service so the reasoning can move server-side
    // (LLM + weather + wardrobe memory) without touching this call site.
    getStylistResponse({
      message: trimmed,
      hasPriorReply,
      weather: weather ?? null,
    }).then((reply) => {
      setThinking(false)
      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: 'muse',
          text: reply.text,
          transcript: reply.transcript,
          reasoning: reply.reasoning,
          outfits: reply.outfits,
          shopping: reply.shopping,
        },
      ])
    })
  }

  // Voice-first landing: no chrome until the conversation begins.
  if (!started) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Landing
          greeting={`${timeGreeting}, ${USER_NAME}.`}
          listening={listening}
          onToggleListening={() => setListening((v) => !v)}
          suggestions={SUGGESTIONS}
          onSelectSuggestion={sendMessage}
        />
      </div>
    )
  }

  return (
    <div className="muse-app-in flex h-screen overflow-hidden bg-background text-foreground">
      <div className="muse-slide-in-left flex h-full">
        <Sidebar active={active} onNavigate={setActive} />
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
            <Closet />
          </div>
        ) : active === 'history' ? (
          <div key="history" className="muse-fade-up flex-1 overflow-y-auto pt-8">
            <OutfitHistory />
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
            onClick={() => setMessages([])}
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
            thinking={thinking}
            onFollowUp={sendMessage}
          />
        </div>

        {/* Composer / voice bar */}
        <div className="px-6 pb-6">
            <div className="muse-elev-lg mx-auto flex w-full max-w-3xl items-center gap-3 rounded-full border border-border bg-card/80 p-2 pl-5 backdrop-blur-md transition-all duration-300 focus-within:border-primary/35">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles size={16} className="text-primary" aria-hidden />
              </span>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (
                    e.key === 'Enter' &&
                    !e.nativeEvent.isComposing &&
                    e.keyCode !== 229
                  ) {
                    e.preventDefault()
                    sendMessage(draft)
                  }
                }}
                placeholder="Speak or type to Muse…"
                aria-label="Message Muse"
                className="flex-1 bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
              />
              {draft.trim() ? (
                <button
                  type="button"
                  onClick={() => sendMessage(draft)}
                  aria-label="Send message"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform hover:scale-105 active:scale-95"
                >
                  <ArrowUp size={18} strokeWidth={2.2} aria-hidden />
                </button>
              ) : (
                <MicOrb
                  size="sm"
                  listening={listening}
                  onClick={() => setListening((v) => !v)}
                />
              )}
            </div>
          </div>
          </>
        )}
      </main>
    </div>
  )
}
