'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { CalendarClock, Sparkles, Tag, X } from 'lucide-react'
import type { ClosetItem } from '@/components/muse/closet-item-card'

export function ClosetItemDetail({
  item,
  onClose,
}: {
  item: ClosetItem | null
  onClose: () => void
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (item) {
      document.addEventListener('keydown', onKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [item, onClose])

  if (!item) return null

  return (
    <div
      className="muse-fade-in fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={`Details for ${item.name}`}
    >
      {/* Scrim */}
      <button
        type="button"
        aria-label="Close details"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-foreground/40 backdrop-blur-md"
      />

      {/* Panel */}
      <div className="muse-scale-in muse-elev-xl relative flex max-h-full w-full max-w-4xl flex-col overflow-hidden rounded-[2rem] border border-border/70 bg-card">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 text-foreground/70 shadow-sm backdrop-blur-md transition-all duration-200 hover:rotate-90 hover:bg-background hover:text-foreground active:scale-90"
        >
          <X size={17} strokeWidth={2} aria-hidden />
        </button>

        <div className="grid grid-cols-1 gap-0 overflow-y-auto md:grid-cols-[minmax(0,44%)_minmax(0,56%)]">
          {/* Left: hero image + gallery */}
          <div className="flex flex-col gap-3 bg-secondary/30 p-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border/60 bg-secondary/40">
              <Image
                src={item.image || '/placeholder.svg'}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 90vw, 400px"
                className="object-cover"
              />
            </div>

            {item.wornPhotos.length > 0 ? (
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  You in this piece
                </p>
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {item.wornPhotos.map((photo, i) => (
                    <div
                      key={photo}
                      className="relative aspect-[3/4] w-28 shrink-0 overflow-hidden rounded-2xl border border-border/60 bg-secondary/40"
                    >
                      <Image
                        src={photo || '/placeholder.svg'}
                        alt={`Wearing ${item.name}, look ${i + 1}`}
                        fill
                        sizes="112px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="rounded-2xl border border-dashed border-border/70 bg-background/40 px-4 py-3 text-xs text-muted-foreground">
                No worn photos yet — snap one the next time you style this piece
                and Muse will start tracking how you wear it.
              </p>
            )}
          </div>

          {/* Right: details */}
          <div className="flex flex-col gap-6 p-6 sm:p-8">
            <header>
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <span>{item.category}</span>
                <span aria-hidden>·</span>
                <span className="flex items-center gap-1.5">
                  <span
                    className="h-3 w-3 rounded-full border border-black/5"
                    style={{ backgroundColor: item.colorSwatch }}
                    aria-hidden
                  />
                  {item.color}
                </span>
                <span aria-hidden>·</span>
                <span>{item.season}</span>
              </div>
              <h2 className="mt-2 font-serif text-3xl leading-tight text-foreground text-balance">
                {item.name}
              </h2>
            </header>

            {/* Last worn */}
            <section className="rounded-2xl border border-border/60 bg-background/50 p-5">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <CalendarClock size={16} className="text-primary" aria-hidden />
                Last worn
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                <span className="text-foreground">{item.lastWorn.date}</span>
                {' — '}
                {item.lastWorn.occasion}
              </p>
              <div className="mt-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Paired with
                </p>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {item.lastWorn.pairedWith.map((piece) => (
                    <li
                      key={piece}
                      className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground"
                    >
                      {piece}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Muse advice */}
            <section className="rounded-2xl border border-primary/25 bg-primary/10 p-5">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Sparkles size={16} className="text-primary" aria-hidden />
                Muse recommends
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground/80 text-pretty">
                {item.museAdvice}
              </p>
            </section>

            {/* Tags */}
            <section>
              <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <Tag size={13} aria-hidden />
                Tags
              </div>
              <ul className="flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
