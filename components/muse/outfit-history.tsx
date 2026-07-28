'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Sparkles, Star, RotateCcw, Scissors, Wand2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Verdict = 'repeat' | 'refresh' | 'retire'

interface HistoryLook {
  id: string
  title: string
  occasion: string
  date: string
  image: string
  pieces: string[]
  timesWorn: number
  rating: number
  verdict: Verdict
  replies: {
    repeat: string
    change: string
    restyle: string
  }
}

const LOOKS: HistoryLook[] = [
  {
    id: 'gallery',
    title: 'The Gallery Evening',
    occasion: 'Dinner reservation downtown',
    date: 'Nov 4',
    image: '/history/look-gallery.png',
    pieces: ['Rose silk blouse', 'Beige wide-leg trousers', 'Nude strappy heels'],
    timesWorn: 3,
    rating: 5,
    verdict: 'repeat',
    replies: {
      repeat:
        "Absolutely repeat this one — it's one of your strongest looks. The rose against the beige is soft but confident, and the heel gives it just enough polish for dinner. When something works this well, I say lean in. Maybe change the earrings so it doesn't feel like a uniform.",
      change:
        "Honestly? Very little. If I'm being picky, I'd half-tuck the blouse instead of a full tuck to loosen it up, and add a thin gold chain to draw the eye up. That's it — you nailed the rest.",
      restyle:
        "Let's keep the blouse and trousers but trade the heels for your white sneakers and throw the trench over the top. Suddenly it's a daytime gallery-and-coffee look instead of dinner. Same pieces, completely different energy.",
    },
  },
  {
    id: 'rooftop',
    title: 'Rooftop Birthday',
    occasion: 'Rooftop birthday dinner',
    date: 'Sep 30',
    image: '/history/look-rooftop.png',
    pieces: ['Rose slip dress', 'Camel coat', 'Nude strappy heels'],
    timesWorn: 2,
    rating: 5,
    verdict: 'repeat',
    replies: {
      repeat:
        "This is a golden-hour dream and you should absolutely wear it again — just not to the same crowd too soon. Save it for the next celebration where you want to feel a little romantic. It's too good to retire.",
      change:
        "I wouldn't touch the dress or coat. The only thing I'd reconsider is the bag if you carried the structured clutch — a softer pouch would echo the slip's fluidity better. Small detail, but it's the kind of thing that makes a look feel considered.",
      restyle:
        "For a cooler night, layer the cashmere underneath the slip like a little top and add the ankle boots. It takes the dress somewhere more autumnal and unexpected, and it means you get more wear out of a summer piece.",
    },
  },
  {
    id: 'brunch',
    title: 'Sunday Brunch',
    occasion: 'Sunday brunch with friends',
    date: 'Nov 12',
    image: '/history/look-brunch.png',
    pieces: ['Cream cashmere', 'Beige wide-leg trousers', 'White sneakers'],
    timesWorn: 6,
    rating: 4,
    verdict: 'refresh',
    replies: {
      repeat:
        "You can repeat it — it's comfortable and it suits you — but you've worn this exact combination six times now. It's becoming a default rather than a choice. Let's freshen it before it starts to feel like a uniform.",
      change:
        "Two easy tweaks: tuck the front of the sweater into the trousers so we see the waist, and add a pop of warmth with gold hoops or the silk scarf at the neck. Little changes, but they turn 'comfortable' into 'considered.'",
      restyle:
        "Keep the cashmere and trousers, but swap the sneakers for the ankle boots and add the camel coat. It elevates the exact same base into something you could wear to a nicer lunch. That's the beauty of tonal dressing — small swaps go a long way.",
    },
  },
  {
    id: 'garden',
    title: 'Garden Lunch',
    occasion: 'Garden lunch',
    date: 'Aug 18',
    image: '/history/look-garden.png',
    pieces: ['Peach floral midi', 'Tan espadrilles', 'Straw tote'],
    timesWorn: 4,
    rating: 4,
    verdict: 'repeat',
    replies: {
      repeat:
        "Yes — this is your easy summer win and it always looks lovely on you. Repeat it freely on warm days. The only reason I'd pause is if the event calls for something a touch more elevated; then we'd rework it.",
      change:
        "It's charming as is. If you want a little more shape, add a slim belt at the waist of the midi — it defines the silhouette without losing the breeze. And I'd swap the straw tote for something smaller if it's more of a dinner than a daytime lunch.",
      restyle:
        "Come autumn, don't pack this away. Layer the white linen shirt under the dress, add the trench and ankle boots, and it becomes a completely different season's outfit. I love making summer pieces work in the cold.",
    },
  },
  {
    id: 'commute',
    title: 'Rainy Commute',
    occasion: 'Rainy commute & errands',
    date: 'Oct 15',
    image: '/history/look-commute.png',
    pieces: ['Beige trench', 'White linen shirt', 'Beige trousers'],
    timesWorn: 5,
    rating: 3,
    verdict: 'refresh',
    replies: {
      repeat:
        "It's practical and it does the job, but truthfully it reads a little flat — all one tone with nothing to break it up. I'd repeat the trench, absolutely, but rethink what's underneath before you reach for this again.",
      change:
        "It needs one moment of contrast. Add the rose silk scarf at the neck or knotted to the bag, and switch to the ankle boots for a bit of grounding. Right now it's safe; those two touches make it look deliberate instead of default.",
      restyle:
        "Belt the trench properly to shape the waist, layer the cashmere over the shirt for texture, and finish with the boots. Same weatherproof idea, but now it looks like you chose it rather than grabbed it on the way out.",
    },
  },
]

const VERDICT_STYLE: Record<Verdict, { label: string; className: string }> = {
  repeat: {
    label: 'Worth repeating',
    className: 'bg-primary/15 text-primary',
  },
  refresh: {
    label: 'Time to refresh',
    className: 'bg-accent/60 text-accent-foreground',
  },
  retire: {
    label: 'Consider retiring',
    className: 'bg-muted text-muted-foreground',
  },
}

type QuestionKey = 'repeat' | 'change' | 'restyle'

const QUESTIONS: { key: QuestionKey; label: string; icon: typeof RotateCcw }[] = [
  { key: 'repeat', label: 'Should I repeat this?', icon: RotateCcw },
  { key: 'change', label: 'What would you change?', icon: Scissors },
  { key: 'restyle', label: 'Style it fresh for me', icon: Wand2 },
]

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={13}
          strokeWidth={2}
          className={cn(
            i <= rating ? 'fill-primary text-primary' : 'text-border',
          )}
          aria-hidden
        />
      ))}
    </span>
  )
}

function Critique({ look }: { look: HistoryLook }) {
  const [asked, setAsked] = useState<QuestionKey | null>(null)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {QUESTIONS.map((q) => {
          const Icon = q.icon
          const active = asked === q.key
          return (
            <button
              key={q.key}
              type="button"
              onClick={() => setAsked(q.key)}
              className={cn(
                'flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 active:scale-95',
                active
                  ? 'border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20'
                  : 'border-border bg-card text-foreground/80 hover:border-primary/30 hover:bg-accent/40',
              )}
            >
              <Icon size={14} strokeWidth={2} aria-hidden />
              {q.label}
            </button>
          )
        })}
      </div>

      {asked ? (
        <div className="muse-fade-up flex items-start gap-3">
          <span
            className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground"
            aria-hidden
          >
            <Sparkles size={16} strokeWidth={2} />
          </span>
          <div className="muse-glass muse-elev rounded-3xl rounded-tl-lg border border-border/60 px-5 py-4">
            <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Sparkles size={12} strokeWidth={2} className="text-primary" aria-hidden />
              Muse
            </div>
            <p className="text-[15px] leading-relaxed text-foreground text-pretty">
              {look.replies[asked]}
            </p>
          </div>
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-border bg-secondary/30 px-4 py-3 text-sm text-muted-foreground">
          Ask Muse what she thinks — she remembers every time you&apos;ve worn this.
        </p>
      )}
    </div>
  )
}

export function OutfitHistory() {
  const [selectedId, setSelectedId] = useState<string>(LOOKS[0].id)
  const selected = LOOKS.find((l) => l.id === selectedId) ?? LOOKS[0]
  const verdict = VERDICT_STYLE[selected.verdict]

  return (
    <div className="mx-auto w-full max-w-6xl px-8 pb-16">
      <header className="mb-8">
        <h1 className="font-serif text-4xl text-foreground text-balance">
          Outfit History
        </h1>
        <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-muted-foreground text-pretty">
          Every look you&apos;ve worn, remembered. Choose one and ask Muse
          whether to wear it again, what to change, or how to make it feel new.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr]">
        {/* Timeline of looks */}
        <div className="muse-stagger flex flex-col gap-3">
          {LOOKS.map((look) => {
            const active = look.id === selectedId
            return (
              <button
                key={look.id}
                type="button"
                onClick={() => setSelectedId(look.id)}
                className={cn(
                  'group flex items-center gap-4 rounded-2xl border p-3 text-left transition-all duration-300',
                  active
                    ? 'border-primary/50 bg-card shadow-md shadow-primary/10'
                    : 'border-border bg-card/60 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-card hover:shadow-md',
                )}
              >
                <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-secondary/40">
                  <Image
                    src={look.image || '/placeholder.svg'}
                    alt={look.title}
                    fill
                    sizes="64px"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      {look.date}
                    </span>
                    <Stars rating={look.rating} />
                  </div>
                  <h3 className="mt-0.5 truncate font-serif text-lg text-card-foreground">
                    {look.title}
                  </h3>
                  <p className="truncate text-xs text-muted-foreground">
                    {look.occasion}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Detail + critique */}
        <div className="muse-elev-lg flex flex-col overflow-hidden rounded-3xl border border-border bg-card">
          <div className="relative aspect-[16/10] w-full overflow-hidden">
            <Image
              src={selected.image || '/placeholder.svg'}
              alt={selected.title}
              fill
              sizes="(max-width: 1024px) 100vw, 640px"
              className="object-cover"
            />
            <span
              className={cn(
                'absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-medium backdrop-blur-md',
                verdict.className,
              )}
            >
              {verdict.label}
            </span>
          </div>

          <div className="flex flex-col gap-5 p-6">
            <div>
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-serif text-2xl text-card-foreground text-balance">
                  {selected.title}
                </h2>
                <span className="shrink-0 text-xs text-muted-foreground">
                  Worn {selected.timesWorn}×
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {selected.date} · {selected.occasion}
              </p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {selected.pieces.map((piece) => (
                  <li
                    key={piece}
                    className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground"
                  >
                    {piece}
                  </li>
                ))}
              </ul>
            </div>

            <div className="h-px bg-border" />

            <Critique key={selected.id} look={selected} />
          </div>
        </div>
      </div>
    </div>
  )
}
