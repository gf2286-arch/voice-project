'use client'

import Image from 'next/image'
import { Heart } from 'lucide-react'

export interface WornRecord {
  date: string
  occasion: string
  pairedWith: string[]
}

export interface ClosetItem {
  id: string
  name: string
  image: string
  category: string
  color: string
  colorSwatch: string
  season: string
  tags: string[]
  wornPhotos: string[]
  lastWorn: WornRecord
  museAdvice: string
}

export function ClosetItemCard({
  item,
  onSelect,
}: {
  item: ClosetItem
  onSelect?: (item: ClosetItem) => void
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect?.(item)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect?.(item)
        }
      }}
      className="muse-card group flex w-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-border bg-card text-left hover:border-primary/25"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary/40">
        <Image
          src={item.image || '/placeholder.svg'}
          alt={item.name}
          fill
          sizes="(max-width: 1024px) 45vw, 260px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-background/75 px-3 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur-md">
          {item.season}
        </span>
        <button
          type="button"
          aria-label={`Save ${item.name}`}
          onClick={(e) => e.stopPropagation()}
          className="absolute right-3 top-3 flex h-8 w-8 translate-y-1 items-center justify-center rounded-full bg-background/80 text-foreground/60 opacity-0 shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-110 hover:text-primary active:scale-90 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <Heart size={15} strokeWidth={1.9} aria-hidden />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {item.category}
          </p>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              className="h-3 w-3 rounded-full border border-black/5"
              style={{ backgroundColor: item.colorSwatch }}
              aria-hidden
            />
            {item.color}
          </span>
        </div>

        <h4 className="mt-1 font-serif text-lg leading-tight text-card-foreground text-pretty">
          {item.name}
        </h4>
      </div>
    </div>
  )
}
