'use client'

import { useEffect, useRef, useState } from 'react'
import { Sparkles, ChevronDown, Lightbulb, ShoppingBag } from 'lucide-react'
import { OutfitCard, type Outfit } from './outfit-card'
import { ShoppingCard, type ShopItem } from './shopping-card'
import { cn } from '@/lib/utils'

export interface Message {
  id: string
  role: 'user' | 'muse'
  /** The spoken response — what Muse says aloud, or the user's transcribed words. */
  text: string
  /** Optional longer transcript revealed on demand. */
  transcript?: string
  /** Muse's stylist rationale for the recommendation. */
  reasoning?: string
  outfits?: Outfit[]
  shopping?: ShopItem[]
}

interface ConversationProps {
  messages: Message[]
  thinking: boolean
}

function VoiceWave({ playing }: { playing: boolean }) {
  return (
    <span className="flex items-end gap-[3px]" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="w-[3px] rounded-full bg-primary/70"
          style={{
            height: playing ? 14 : 5,
            animation: playing
              ? 'muse-breathe 1s ease-in-out infinite'
              : undefined,
            animationDelay: `${i * 0.12}s`,
          }}
        />
      ))}
    </span>
  )
}

function MuseMessage({ message }: { message: Message }) {
  const [showTranscript, setShowTranscript] = useState(false)

  return (
    <div className="muse-fade-up flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <span
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground"
          aria-hidden
        >
          <Sparkles size={16} strokeWidth={2} />
        </span>

        <div className="max-w-[85%] space-y-2">
          <div className="muse-glass muse-elev rounded-3xl rounded-tl-lg border border-border/60 px-5 py-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <VoiceWave playing />
              <span className="text-foreground/70">Muse</span>
              <span aria-hidden>·</span>
              <span>speaking</span>
            </div>
            <p className="text-[15px] leading-relaxed text-foreground text-pretty">
              {message.text}
            </p>

            {message.transcript && (
              <div className="mt-3 border-t border-border/50 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTranscript((v) => !v)}
                  aria-expanded={showTranscript}
                  className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ChevronDown
                    size={13}
                    strokeWidth={2}
                    className={cn(
                      'transition-transform duration-200',
                      showTranscript && 'rotate-180',
                    )}
                    aria-hidden
                  />
                  {showTranscript ? 'Hide transcript' : 'View full transcript'}
                </button>
                {showTranscript && (
                  <p className="muse-fade-in mt-2 text-[13px] leading-relaxed text-muted-foreground text-pretty">
                    {message.transcript}
                  </p>
                )}
              </div>
            )}
          </div>

          {message.reasoning && (
            <div className="flex items-start gap-2.5 rounded-2xl border border-border/50 bg-secondary/40 px-4 py-3">
              <Lightbulb
                size={15}
                strokeWidth={2}
                className="mt-0.5 shrink-0 text-primary"
                aria-hidden
              />
              <div>
                <p className="text-xs font-medium text-foreground/80">
                  Here&apos;s my thinking
                </p>
                <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground text-pretty">
                  {message.reasoning}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {message.outfits && message.outfits.length > 0 && (
        <div className="flex gap-4 overflow-x-auto pb-2 pl-12">
          {message.outfits.map((o) => (
            <OutfitCard key={o.title} outfit={o} />
          ))}
        </div>
      )}

      {message.shopping && message.shopping.length > 0 && (
        <div className="pl-12">
          <div className="mb-2.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <ShoppingBag size={13} strokeWidth={2} aria-hidden />
            To complete the look
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {message.shopping.map((s) => (
              <ShoppingCard key={s.name} item={s} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function Conversation({ messages, thinking }: ConversationProps) {
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, thinking])

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-10">
      {messages.map((m) =>
        m.role === 'user' ? (
          <div key={m.id} className="muse-fade-up flex justify-end">
            <div className="max-w-[80%] rounded-3xl rounded-br-lg bg-primary px-5 py-3.5 text-primary-foreground shadow-md shadow-primary/20">
              <div className="mb-1 flex items-center justify-end gap-1.5 text-[11px] text-primary-foreground/70">
                <VoiceWave playing={false} />
                You
              </div>
              <p className="text-[15px] leading-relaxed">{m.text}</p>
            </div>
          </div>
        ) : (
          <MuseMessage key={m.id} message={m} />
        ),
      )}

      {thinking && (
        <div className="muse-fade-up flex items-start gap-3">
          <span
            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground"
            aria-hidden
          >
            <Sparkles size={16} strokeWidth={2} />
          </span>
          <div className="muse-glass muse-elev flex items-center gap-1.5 rounded-3xl rounded-tl-lg border border-border/60 px-5 py-4">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={cn('h-2 w-2 rounded-full bg-muted-foreground/60')}
                style={{
                  animation: 'muse-breathe 1.2s ease-in-out infinite',
                  animationDelay: `${i * 0.18}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div ref={endRef} />
    </div>
  )
}
