'use client'

import { MicOrb } from './mic-orb'

interface LandingProps {
  greeting: string
  listening: boolean
  statusLabel: string
  errorMessage?: string | null
  onToggleListening: () => void
}

export function Landing({
  greeting,
  listening,
  statusLabel,
  errorMessage,
  onToggleListening,
}: LandingProps) {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 py-16">
      {/* Ambient wash — soft, slow-drifting light */}
      <div
        aria-hidden
        className="muse-ambient-drift pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(50% 45% at 50% 32%, oklch(0.92 0.06 55 / 0.7) 0%, transparent 68%), radial-gradient(40% 40% at 82% 88%, oklch(0.85 0.09 20 / 0.22) 0%, transparent 70%), radial-gradient(38% 38% at 14% 84%, oklch(0.9 0.05 70 / 0.28) 0%, transparent 72%)',
        }}
      />

      <div className="flex flex-col items-center text-center">
        {/* Greeting */}
        <h1 className="muse-fade-up max-w-3xl text-balance font-serif text-5xl leading-[1.05] tracking-tight text-foreground md:text-7xl">
          {greeting}
        </h1>
        <p className="muse-fade-up mt-3 max-w-2xl text-pretty font-serif text-3xl italic leading-tight text-muted-foreground md:text-5xl [animation-delay:120ms]">
          What are we wearing today?
        </p>

        {/* Microphone */}
        <div className="muse-fade-up mt-16 flex flex-col items-center [animation-delay:260ms]">
          <MicOrb listening={listening} onClick={onToggleListening} />
          <p
            aria-live="polite"
            className="mt-8 h-5 text-sm font-medium tracking-wide text-muted-foreground/90"
          >
            {statusLabel}
          </p>
          {errorMessage ? (
            <p
              role="alert"
              className="mt-2 max-w-xs text-pretty text-xs text-destructive"
            >
              {errorMessage}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
