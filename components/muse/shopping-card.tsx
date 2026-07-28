'use client'

import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

export interface ShopItem {
  name: string
  brand: string
  price: string
  image: string
  reason: string
}

export function ShoppingCard({ item }: { item: ShopItem }) {
  return (
    <div className="muse-card group flex w-56 shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-card hover:border-primary/25">
      <div className="relative aspect-square overflow-hidden bg-secondary/40">
        <Image
          src={item.image || '/placeholder.svg'}
          alt={item.name}
          fill
          sizes="224px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
      </div>
      <div className="flex flex-1 flex-col p-3.5">
        <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {item.brand}
        </span>
        <div className="mt-0.5 flex items-start justify-between gap-2">
          <h5 className="text-sm font-medium leading-tight text-card-foreground text-pretty">
            {item.name}
          </h5>
          <span className="shrink-0 text-sm font-semibold text-foreground">
            {item.price}
          </span>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {item.reason}
        </p>
        <button
          type="button"
          className="group/btn mt-3 flex items-center justify-center gap-1.5 rounded-full border border-border bg-background py-2 text-xs font-medium text-foreground/80 transition-colors hover:border-primary/30 hover:bg-accent/40 hover:text-foreground active:scale-[0.98]"
        >
          View
          <ArrowUpRight
            size={13}
            strokeWidth={2}
            className="transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
            aria-hidden
          />
        </button>
      </div>
    </div>
  )
}
