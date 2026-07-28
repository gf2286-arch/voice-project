'use client'

import Image from 'next/image'
import { Heart, ArrowUpRight } from 'lucide-react'

export interface Outfit {
  title: string
  occasion: string
  image: string
  pieces: string[]
}

export function OutfitCard({ outfit }: { outfit: Outfit }) {
  return (
    <div className="muse-card group w-64 shrink-0 overflow-hidden rounded-3xl border border-border bg-card hover:border-primary/25">
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={outfit.image || '/placeholder.svg'}
          alt={outfit.title}
          fill
          sizes="256px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-background/75 px-3 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur-md">
          {outfit.occasion}
        </span>
        <button
          type="button"
          aria-label={`Save ${outfit.title}`}
          className="absolute right-3 top-3 flex h-8 w-8 translate-y-1 items-center justify-center rounded-full bg-background/80 text-foreground/70 opacity-0 shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-110 hover:text-primary active:scale-90 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <Heart size={15} strokeWidth={1.9} aria-hidden />
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-serif text-lg leading-tight text-card-foreground transition-colors group-hover:text-primary">
            {outfit.title}
          </h4>
          <ArrowUpRight
            size={18}
            className="mt-0.5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
            aria-hidden
          />
        </div>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {outfit.pieces.map((piece) => (
            <li
              key={piece}
              className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground"
            >
              {piece}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
