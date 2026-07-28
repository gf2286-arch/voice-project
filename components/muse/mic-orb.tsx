'use client'

import { Mic } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MicOrbProps {
  listening?: boolean
  size?: 'lg' | 'sm'
  onClick?: () => void
  className?: string
}

export function MicOrb({
  listening = false,
  size = 'lg',
  onClick,
  className,
}: MicOrbProps) {
  const dimension = size === 'lg' ? 'h-40 w-40' : 'h-14 w-14'
  const iconSize = size === 'lg' ? 34 : 20

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={listening}
      aria-label={listening ? 'Stop listening' : 'Start talking to Muse'}
      className={cn(
        'group relative flex items-center justify-center rounded-full outline-none',
        size === 'lg' && 'muse-float',
        className,
      )}
    >
      {/* Outer breathing halos */}
      <span
        aria-hidden
        className={cn(
          'absolute inset-0 rounded-full bg-primary/30 muse-breathe-slow',
          size === 'lg' ? 'scale-150' : 'scale-125',
        )}
      />
      <span
        aria-hidden
        className={cn(
          'absolute inset-0 rounded-full bg-accent/50 muse-breathe',
          size === 'lg' ? 'scale-125' : 'scale-110',
        )}
      />

      {/* Core orb */}
      <span
        className={cn(
          'relative flex items-center justify-center rounded-full text-primary-foreground shadow-xl shadow-primary/25 transition-transform duration-500 ease-out group-hover:scale-105 group-active:scale-95',
          dimension,
        )}
        style={{
          background:
            'radial-gradient(120% 120% at 30% 25%, oklch(0.82 0.09 45) 0%, oklch(0.74 0.11 20) 48%, oklch(0.66 0.12 15) 100%)',
        }}
      >
        {/* Glass sheen */}
        <span
          aria-hidden
          className="absolute inset-[3px] rounded-full bg-gradient-to-b from-white/40 to-transparent opacity-70"
        />

        {listening ? (
          <span className="relative flex items-end gap-[3px]" aria-hidden>
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="w-[3px] rounded-full bg-primary-foreground"
                style={{
                  height: size === 'lg' ? 30 : 16,
                  animation: 'muse-equalize 1s ease-in-out infinite',
                  animationDelay: `${i * 0.12}s`,
                }}
              />
            ))}
          </span>
        ) : (
          <Mic
            className="relative"
            size={iconSize}
            strokeWidth={1.75}
            aria-hidden
          />
        )}
      </span>
    </button>
  )
}
