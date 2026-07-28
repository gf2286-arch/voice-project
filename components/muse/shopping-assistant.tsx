'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  Sparkles,
  Link2,
  Check,
  AlertTriangle,
  X,
  Shirt,
  Lightbulb,
  ArrowUp,
  Store,
  Loader2,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ShoppingCard, type ShopItem } from '@/components/muse/shopping-card'
import { ComingSoonChip } from '@/components/muse/coming-soon-chip'
import { MicOrb } from '@/components/muse/mic-orb'
import type { MuseVoiceControl } from '@/lib/use-muse-voice'

type Verdict = 'buy' | 'maybe' | 'skip'

interface Evaluation {
  id: string
  name: string
  brand: string
  price: string
  image: string
  verdict: Verdict
  versatility: number
  spoken: string
  pairsWith: string[]
  styling: string[]
  watchOut?: string
  /** Live product link when the piece came from a real Google Shopping match. */
  buyLink?: string
}

const EVALUATIONS: Record<string, Evaluation> = {
  cardigan: {
    id: 'cardigan',
    name: 'Relaxed Camel Knit Cardigan',
    brand: '& Other Stories',
    price: '$129',
    image: '/shop/eval-cardigan.png',
    verdict: 'buy',
    versatility: 92,
    spoken:
      "Oh, this is a yes. Camel is the connective thread running through half your closet, and a soft cardigan is exactly the in-between layer you reach for when a coat is too much. It'll earn its price within a week — buy it.",
    pairsWith: [
      'Cream cashmere sweater',
      'Beige wide-leg trousers',
      'Peach floral midi',
      'White linen shirt',
      'Rose silk blouse',
    ],
    styling: [
      'Throw it open over the floral midi with espadrilles for a cooler garden afternoon.',
      'Belt it at the waist over the wide-leg trousers to turn it into a soft top.',
      'Layer it under the trench for tonal warmth on grey mornings.',
    ],
  },
  moto: {
    id: 'moto',
    name: 'Black Leather Moto Jacket',
    brand: 'AllSaints',
    price: '$430',
    image: '/shop/eval-moto-jacket.png',
    verdict: 'maybe',
    versatility: 54,
    spoken:
      "I love a moto jacket — but let's be honest about your wardrobe. It's warm, soft and tonal, and this is cool and hard-edged. It could bring a great tension to one or two looks, but at $430 I'd want it to work harder. Only if you're genuinely craving an edge.",
    pairsWith: ['Rose slip dress', 'Peach floral midi', 'White linen shirt'],
    styling: [
      'Over the rose slip dress with ankle boots is where it actually sings — soft plus tough.',
      'Keep everything else tonal so the black reads intentional, not random.',
    ],
    watchOut:
      "It fights your cream-and-peach palette more than it flatters it. Beautiful jacket, just not an obvious fit for you yet.",
  },
  sequin: {
    id: 'sequin',
    name: 'Emerald Sequin Mini Dress',
    brand: 'Rotate',
    price: '$310',
    image: '/shop/eval-sequin-dress.png',
    verdict: 'skip',
    versatility: 18,
    spoken:
      "I'm going to be the honest friend here: skip it. It's a gorgeous dress, but the emerald and the sequins live in a completely different world from everything you own, and you'd be buying shoes and a bag just to make it work. One wear, then it hangs. Not worth $310.",
    pairsWith: ['Nude strappy heels'],
    styling: [
      'If you adore it, rent it for the one event rather than buying — that instinct is usually right with pieces this loud.',
    ],
    watchOut:
      'Single-occasion, off-palette, and needs new accessories to function. Everything I try to avoid for you.',
  },
  dress: {
    id: 'dress',
    name: 'Floral Midi Dress',
    brand: 'Réalisation Par',
    price: '$180',
    image: '/closet/floral-dress.png',
    verdict: 'buy',
    versatility: 84,
    spoken:
      "This is very you. A soft floral midi slots straight into the world you already dress in, and it's a one-and-done piece — throw it on and you're finished. With sandals now, boots and a coat later, you'll wear it for three seasons. Buy it.",
    pairsWith: [
      'Tan woven espadrilles',
      'Camel coat',
      'Denim jacket',
      'Straw tote',
      'Nude strappy heels',
    ],
    styling: [
      'Espadrilles and the straw tote for daytime, exactly as it is.',
      'Add the camel coat and nude heels to carry it into an evening.',
      'Layer a fine knit over the top and belt it once it turns cold.',
    ],
  },
  jeans: {
    id: 'jeans',
    name: 'Vintage Straight-Leg Jeans',
    brand: 'Agolde',
    price: '$198',
    image: '/closet/vintage-jeans.png',
    verdict: 'buy',
    versatility: 95,
    spoken:
      "A good straight-leg jean is the hardest-working thing you can own, and you clearly wear yours. This wash is classic and it'll pin to almost everything in your closet. If the fit is right at the waist, don't overthink it — buy it.",
    pairsWith: [
      'White linen shirt',
      'Breton striped tee',
      'Cream cashmere sweater',
      'Ivory silk cami',
      'Black leather moto jacket',
    ],
    styling: [
      'Breton tee and ballet flats for the easiest French-girl uniform.',
      'Tuck in the silk cami and add heels to take denim out at night.',
      'Loafers and the navy blazer make them read polished, not casual.',
    ],
  },
  sneakers: {
    id: 'sneakers',
    name: 'Minimal Leather Sneakers',
    brand: 'Veja',
    price: '$150',
    image: '/closet/white-sneakers.png',
    verdict: 'buy',
    versatility: 90,
    spoken:
      "Yes — a clean white sneaker is a wardrobe staple and yours do a lot of quiet work. This pair is low-key enough to sit under tailoring without shouting. An easy, sensible buy you'll reach for constantly.",
    pairsWith: [
      'Beige wide-leg trousers',
      'Vintage straight-leg jeans',
      'Peach floral midi',
      'Ecru trousers',
    ],
    styling: [
      'Under the wide-leg trousers with the cashmere for an elevated-casual day.',
      'With the floral midi for that high-low contrast I love on you.',
    ],
  },
  bag: {
    id: 'bag',
    name: 'Structured Leather Tote',
    brand: 'Polène',
    price: '$390',
    image: '/shop/straw-tote.png',
    verdict: 'maybe',
    versatility: 68,
    spoken:
      "A structured tote is genuinely useful and this shape is timeless. The only reason I'm not an instant yes is that you already carry a crossbody and a straw tote — make sure this covers a gap they don't, like work days. If it does, it's a lovely buy.",
    pairsWith: ['Navy blazer', 'Ecru trousers', 'Camel coat', 'White linen shirt'],
    styling: [
      'With the blazer and trousers it becomes a proper work bag.',
      'Keep the hardware minimal so it stays in your quiet, tonal lane.',
    ],
    watchOut:
      'Check it earns its place next to the bags you already own before you commit at this price.',
  },
  blazer: {
    id: 'blazer',
    name: 'Tailored Wool Blazer',
    brand: 'Toteme',
    price: '$420',
    image: '/shop/cream-blazer.png',
    verdict: 'buy',
    versatility: 88,
    spoken:
      "A well-cut blazer is an investment that pays off endlessly, and this is a shape that flatters. It sharpens your softest pieces in a single move — over the silk cami, the floral midi, even the jeans. Provided the shoulders fit, this is money well spent.",
    pairsWith: [
      'Ivory silk cami',
      'Vintage straight-leg jeans',
      'Ecru trousers',
      'Peach floral midi',
      'Black leather loafers',
    ],
    styling: [
      'Over the silk cami with trousers and loafers for a polished day.',
      'Thrown over the floral midi to make it feel considered for evening.',
      'Sleeves pushed up with jeans when you want relaxed-but-together.',
    ],
  },
  coat: {
    id: 'coat',
    name: 'Wool Overcoat',
    brand: 'Max Mara',
    price: '$690',
    image: '/closet/camel-coat.png',
    verdict: 'buy',
    versatility: 86,
    spoken:
      "A great coat is the thing people actually see all winter, so it's worth spending on. Camel especially — it's the tonal anchor for everything you own. If the length and shoulders are right, this is the kind of buy you'll still love in ten years.",
    pairsWith: [
      'Cream cashmere sweater',
      'Chocolate turtleneck',
      'Ecru trousers',
      'Black column midi',
      'Tall leather boots',
    ],
    styling: [
      'Over head-to-toe tonal knits and trousers for that quiet-luxury look.',
      'Draped over the black midi and heels for an elegant evening.',
    ],
  },
  skirt: {
    id: 'skirt',
    name: 'Leather Midi Skirt',
    brand: 'Nanushka',
    price: '$295',
    image: '/closet/leather-skirt.png',
    verdict: 'maybe',
    versatility: 62,
    spoken:
      "I like the idea here — a leather midi adds a little edge you could use. It leans dressier and cooler than most of your closet, so it'll shine at night but sit unused on quiet days. Worth it if you have the evenings to wear it out.",
    pairsWith: ['Ivory silk cami', 'Cream cashmere sweater', 'Black leather moto jacket'],
    styling: [
      'Tuck the silk cami in and add heels for a downtown dinner look.',
      'Soften it with the cream cashmere and boots so it feels like you.',
    ],
    watchOut:
      'Skews more evening than everyday — make sure you have places to wear it before buying.',
  },
  knit: {
    id: 'knit',
    name: 'Merino Wool Sweater',
    brand: 'COS',
    price: '$135',
    image: '/closet/cashmere-sweater.png',
    verdict: 'buy',
    versatility: 91,
    spoken:
      "A fine merino knit in a neutral is exactly the kind of quiet staple I want you buying. It layers under everything and stands alone beautifully. As long as it's a colour that plays with your creams and camels, this is an easy yes.",
    pairsWith: [
      'Beige wide-leg trousers',
      'Vintage straight-leg jeans',
      'Pleated midi skirt',
      'Camel coat',
    ],
    styling: [
      'With the wide-leg trousers and loafers for effortless polish.',
      'Layered under the trench or camel coat for tonal warmth.',
    ],
  },
  generic: {
    id: 'generic',
    name: 'Saved Piece',
    brand: 'From your link',
    price: 'View price',
    image: '/shop/cream-blazer.png',
    verdict: 'maybe',
    versatility: 70,
    spoken:
      "I've pulled this up from your link. To give you my honest read, tell me a little more — is it a top, a dress, shoes, a bag? Once I know the category I can score how hard it'll work against everything you already own.",
    pairsWith: ['Cream cashmere sweater', 'Beige wide-leg trousers', 'Vintage straight-leg jeans'],
    styling: [
      'Tell me the type of piece and the colour and I\u2019ll style it into three looks from your closet.',
    ],
    watchOut:
      "I couldn't tell exactly what this is from the link alone — add a word or two (like \u201cfloral dress\u201d or \u201cwhite sneakers\u201d) and I\u2019ll give you a precise verdict.",
  },
}

const EXAMPLE_LINKS: { label: string; key: string; url: string }[] = [
  { label: 'A camel knit cardigan', key: 'cardigan', url: 'stories.com/…/camel-knit-cardigan' },
  { label: 'A leather moto jacket', key: 'moto', url: 'allsaints.com/…/leather-moto' },
  { label: 'A sequin party dress', key: 'sequin', url: 'rotatebirger.com/…/emerald-sequin' },
]

function resolveEvaluation(input: string): Evaluation {
  const lower = input.toLowerCase()
  const has = (re: RegExp) => re.test(lower)

  // Loud / occasion pieces first so they aren't caught by broader rules.
  if (has(/sequin|glitter|sparkl|metallic|party dress|emerald/)) return EVALUATIONS.sequin
  if (has(/moto|biker/) || (has(/leather/) && has(/jacket/))) return EVALUATIONS.moto

  // Outerwear
  if (has(/blazer|suit-?jacket|tailored jacket/)) return EVALUATIONS.blazer
  if (has(/trench|overcoat|top-?coat|wool coat|puffer|parka|\bcoat\b/)) return EVALUATIONS.coat

  // Bottoms (check skirt before denim so a "denim skirt" resolves to skirt)
  if (has(/skirt/)) return EVALUATIONS.skirt
  if (has(/jean|denim/)) return EVALUATIONS.jeans

  // Footwear
  if (has(/sneaker|trainer|\bveja\b|running shoe|plimsoll/)) return EVALUATIONS.sneakers

  // Bags
  if (has(/\bbag\b|tote|purse|handbag|clutch|crossbody|shoulder bag|hobo|satchel/))
    return EVALUATIONS.bag

  // Knitwear vs. dresses
  if (has(/cardigan/)) return EVALUATIONS.cardigan
  if (has(/sweater|jumper|knit|turtleneck|merino|cashmere|pullover/)) return EVALUATIONS.knit
  if (has(/dress|frock|gown|midi|maxi|sundress/)) return EVALUATIONS.dress

  // Nothing recognizable — ask for a hint instead of guessing.
  return EVALUATIONS.generic
}

const VERDICT_META: Record<
  Verdict,
  { label: string; icon: typeof Check; ring: string; chip: string }
> = {
  buy: {
    label: 'Worth buying',
    icon: Check,
    ring: 'text-primary',
    chip: 'bg-primary/15 text-primary',
  },
  maybe: {
    label: 'Think it over',
    icon: AlertTriangle,
    ring: 'text-accent-foreground',
    chip: 'bg-accent/60 text-accent-foreground',
  },
  skip: {
    label: 'Skip it',
    icon: X,
    ring: 'text-muted-foreground',
    chip: 'bg-muted text-muted-foreground',
  },
}

function VersatilityRing({ score, verdict }: { score: number; verdict: Verdict }) {
  const radius = 34
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const meta = VERDICT_META[verdict]
  return (
    <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
      <svg className="h-24 w-24 -rotate-90" viewBox="0 0 80 80" aria-hidden>
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          strokeWidth="6"
          className="stroke-border"
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn('transition-all duration-1000 ease-out', meta.ring)}
          stroke="currentColor"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-serif text-2xl leading-none text-foreground">
          {score}
        </span>
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
          / 100
        </span>
      </div>
    </div>
  )
}

function EvaluationView({ evaluation }: { evaluation: Evaluation }) {
  const meta = VERDICT_META[evaluation.verdict]
  const VerdictIcon = meta.icon
  return (
    <div className="muse-fade-up muse-elev-lg overflow-hidden rounded-3xl border border-border bg-card">
      <div className="grid gap-0 md:grid-cols-[minmax(0,240px)_1fr]">
        {/* Product */}
        <div className="relative aspect-square w-full overflow-hidden bg-secondary/40 md:aspect-auto">
          <Image
            src={evaluation.image || '/placeholder.svg'}
            alt={evaluation.name}
            fill
            sizes="240px"
            className="object-cover"
          />
        </div>

        {/* Verdict body */}
        <div className="flex flex-col gap-5 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {evaluation.brand}
              </span>
              <h3 className="mt-0.5 font-serif text-xl text-card-foreground text-pretty">
                {evaluation.name}
              </h3>
              <span className="mt-1 inline-block text-sm font-semibold text-foreground">
                {evaluation.price}
              </span>
              {evaluation.buyLink ? (
                <a
                  href={evaluation.buyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex w-fit items-center gap-1.5 text-xs font-medium text-primary transition-colors hover:text-primary/80"
                >
                  View product
                  <ExternalLink size={12} strokeWidth={2.2} aria-hidden />
                </a>
              ) : null}
            </div>
            <span
              className={cn(
                'flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium',
                meta.chip,
              )}
            >
              <VerdictIcon size={13} strokeWidth={2.2} aria-hidden />
              {evaluation.verdict === 'skip' ? "I'd skip it" : meta.label}
            </span>
          </div>

          {/* Muse's spoken take */}
          <div className="flex items-start gap-3">
            <span
              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground"
              aria-hidden
            >
              <Sparkles size={15} strokeWidth={2} />
            </span>
            <p className="text-[15px] leading-relaxed text-foreground text-pretty">
              {evaluation.spoken}
            </p>
          </div>

          {/* Scores row */}
          <div className="flex flex-wrap items-center gap-6 rounded-2xl border border-border/70 bg-secondary/30 p-4">
            <div className="flex items-center gap-4">
              <VersatilityRing
                score={evaluation.versatility}
                verdict={evaluation.verdict}
              />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Versatility
                </p>
                <p className="max-w-[12rem] text-xs leading-relaxed text-muted-foreground">
                  How hard it works across your existing wardrobe.
                </p>
              </div>
            </div>
            <div className="h-12 w-px bg-border" />
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Shirt size={18} strokeWidth={2} aria-hidden />
              </span>
              <div>
                <p className="font-serif text-2xl leading-none text-foreground">
                  {evaluation.pairsWith.length}
                </p>
                <p className="text-xs text-muted-foreground">
                  pieces it pairs with
                </p>
              </div>
            </div>
          </div>

          {/* Compatibility */}
          <div>
            <h4 className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Outfit compatibility
            </h4>
            <ul className="flex flex-wrap gap-1.5">
              {evaluation.pairsWith.map((piece) => (
                <li
                  key={piece}
                  className="flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground"
                >
                  <Check size={11} strokeWidth={2.5} className="text-primary" aria-hidden />
                  {piece}
                </li>
              ))}
            </ul>
          </div>

          {/* Styling recommendations */}
          <div>
            <h4 className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <Lightbulb size={13} strokeWidth={2} className="text-primary" aria-hidden />
              How Muse would style it
            </h4>
            <ul className="flex flex-col gap-2">
              {evaluation.styling.map((tip) => (
                <li
                  key={tip}
                  className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/80"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {evaluation.watchOut && (
            <div className="flex items-start gap-2.5 rounded-2xl border border-dashed border-border bg-muted/40 px-4 py-3">
              <AlertTriangle size={15} strokeWidth={2} className="mt-0.5 shrink-0 text-muted-foreground" aria-hidden />
              <p className="text-sm leading-relaxed text-muted-foreground">
                {evaluation.watchOut}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ---- Muse's own picks ---- */

interface PickSet {
  intro: string
  items: ShopItem[]
}

const PICKS: { key: string; label: string; set: PickSet }[] = [
  {
    key: 'dinner',
    label: 'A dinner party',
    set: {
      intro:
        "For dinner, I'd invest in pieces that make your evening looks feel finished rather than found. These three do exactly that — and they all lean into your rose-and-gold palette.",
      items: [
        {
          name: 'Fine Gold Hoop Earrings',
          brand: 'Mejuri',
          price: '$120',
          image: '/shop/gold-hoops.png',
          reason: 'Warms up the rose silk blouse and slip dress instantly.',
        },
        {
          name: 'Rose & Peach Silk Scarf',
          brand: 'Sézane',
          price: '$95',
          image: '/shop/silk-scarf.png',
          reason: 'Ties your evening colours together, worn at the neck or bag.',
        },
        {
          name: 'Nude Strappy Heels',
          brand: 'Aeyde',
          price: '$280',
          image: '/closet/nude-heels.png',
          reason: 'Elongates the leg with everything from trousers to dresses.',
        },
      ],
    },
  },
  {
    key: 'work',
    label: 'The work week',
    set: {
      intro:
        "For the week ahead, structure is your friend. I'd add pieces that pull your soft basics into something that reads polished the moment you walk in.",
      items: [
        {
          name: 'Structured Cream Blazer',
          brand: 'Toteme',
          price: '$390',
          image: '/shop/cream-blazer.png',
          reason: 'Sharpens the cashmere and trousers into a real work look.',
        },
        {
          name: 'Tan Leather Ankle Boots',
          brand: 'Everlane',
          price: '$225',
          image: '/shop/ankle-boots.png',
          reason: 'The in-between shoe you keep missing on cooler mornings.',
        },
        {
          name: 'Camel Knit Cardigan',
          brand: '& Other Stories',
          price: '$129',
          image: '/shop/eval-cardigan.png',
          reason: 'A softer alternative to the blazer on quieter days.',
        },
      ],
    },
  },
  {
    key: 'getaway',
    label: 'A weekend getaway',
    set: {
      intro:
        "Packing light? These earn their place in the bag by working three ways each. Everything mixes with the linen and floral pieces you already travel with.",
      items: [
        {
          name: 'Natural Straw Tote',
          brand: 'Loewe',
          price: '$210',
          image: '/shop/straw-tote.png',
          reason: 'Carries the beach and dinner alike with the floral midi.',
        },
        {
          name: 'Rose & Peach Silk Scarf',
          brand: 'Sézane',
          price: '$95',
          image: '/shop/silk-scarf.png',
          reason: 'Hair, neck or bag — the hardest-working thing you can pack.',
        },
        {
          name: 'Fine Gold Hoop Earrings',
          brand: 'Mejuri',
          price: '$120',
          image: '/shop/gold-hoops.png',
          reason: 'Dresses up linen for dinner without taking up space.',
        },
      ],
    },
  },
]

export function ShoppingAssistant({ voice }: { voice: MuseVoiceControl }) {
  const [tab, setTab] = useState<'evaluate' | 'discover'>('evaluate')
  const [url, setUrl] = useState('')
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null)
  const [pickKey, setPickKey] = useState<string>(PICKS[0].key)
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  const activePick = PICKS.find((p) => p.key === pickKey) ?? PICKS[0]

  // Pull real product data from Google Shopping (via SerpAPI) for whatever the
  // user pasted, then layer Muse's curated verdict on top of the live details.
  async function evaluate(input: string) {
    const trimmed = input.trim()
    if (!trimmed) return
    setLoading(true)
    setNotice(null)
    try {
      const res = await fetch(
        `/api/shopping/search?q=${encodeURIComponent(trimmed)}`,
        { cache: 'no-store' },
      )
      const data = (await res.json()) as {
        product: {
          name: string
          brand: string
          price: string
          image: string
          link: string
          query: string
        } | null
        error?: string
      }

      // Muse's verdict is derived from the resolved product name (or the link
      // text), so her spoken read stays rich even when the catalog is live.
      const base = resolveEvaluation(data.product?.name || trimmed)

      if (data.product) {
        setEvaluation({
          ...base,
          name: data.product.name,
          brand: data.product.brand,
          price: data.product.price,
          image: data.product.image || base.image,
          buyLink: data.product.link,
        })
      } else {
        setEvaluation(base)
        if (data.error === 'invalid_key' || data.error === 'missing_key') {
          setNotice(
            'Add a valid SerpAPI key (API_KEY) to pull live product details. Showing Muse’s read from the link text for now.',
          )
        } else if (data.error === 'no_results') {
          setNotice(
            'Couldn’t find that exact piece on Google Shopping — here’s Muse’s read from the link itself.',
          )
        }
      }
    } catch {
      setEvaluation(resolveEvaluation(trimmed))
      setNotice('Could not reach the shopping service just now.')
    } finally {
      setLoading(false)
    }
  }

  // Voice-first: let the user talk through a purchase with Muse. We hand the
  // agent the shopping context so its spoken guidance matches this screen.
  function askMuse() {
    voice.speakAbout(
      'I’m deciding whether to buy something. Ask me what I’m looking at and help me decide if it fits my wardrobe.',
      'The user is on the Shopping Assistant. They evaluate potential purchases against their existing wardrobe of soft, tonal, cream-and-camel pieces. Help them judge versatility and whether a piece is worth buying.',
    )
  }

  const micStatus =
    voice.status === 'connecting'
      ? 'Connecting…'
      : voice.isSpeaking
        ? 'Muse is speaking…'
        : voice.status === 'active'
          ? 'Listening…'
          : 'Ask Muse out loud'

  return (
    <div className="mx-auto w-full max-w-5xl px-8 pb-16">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1 className="font-serif text-4xl text-foreground text-balance">
            Shopping Assistant
          </h1>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted-foreground text-pretty">
            Found something online? Paste the link and Muse will pull the live
            product details and tell you whether it earns a place in your
            closet. Or ask her out loud.
          </p>
          <div className="mt-4">
            <ComingSoonChip icon={Store} label="Sync Shopify wishlist" />
          </div>
        </div>

        {/* Voice — talk a purchase through with Muse */}
        <div className="flex shrink-0 flex-col items-center gap-2">
          <MicOrb
            size="sm"
            listening={voice.status === 'active'}
            onClick={askMuse}
          />
          <span
            aria-live="polite"
            className="text-xs font-medium tracking-wide text-muted-foreground"
          >
            {micStatus}
          </span>
        </div>
      </header>

      {/* Tabs */}
      <div className="mb-6 inline-flex rounded-full border border-border bg-card p-1 shadow-sm">
        {[
          { id: 'evaluate' as const, label: 'Evaluate a link' },
          { id: 'discover' as const, label: "Muse's picks" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              'rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 active:scale-95',
              tab === t.id
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                : 'text-foreground/70 hover:text-foreground',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'evaluate' ? (
        <div className="flex flex-col gap-6">
          {/* Link input */}
          <div className="muse-elev-lg flex items-center gap-3 rounded-full border border-border bg-card/80 p-2 pl-5 backdrop-blur-md transition-all duration-300 focus-within:border-primary/35">
            <Link2 size={18} className="shrink-0 text-primary" aria-hidden />
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (
                  e.key === 'Enter' &&
                  !e.nativeEvent.isComposing &&
                  e.keyCode !== 229
                ) {
                  e.preventDefault()
                  evaluate(url)
                }
              }}
              placeholder="Paste a product link from any store…"
              aria-label="Product link to evaluate"
              className="flex-1 bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => evaluate(url)}
              disabled={loading}
              aria-label="Evaluate link"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform hover:scale-105 active:scale-95 disabled:opacity-60"
            >
              {loading ? (
                <Loader2 size={18} strokeWidth={2.2} className="animate-spin" aria-hidden />
              ) : (
                <ArrowUp size={18} strokeWidth={2.2} aria-hidden />
              )}
            </button>
          </div>

          {notice ? (
            <p className="flex items-start gap-2 rounded-2xl border border-dashed border-border bg-muted/40 px-4 py-2.5 text-xs leading-relaxed text-muted-foreground">
              <AlertTriangle size={13} strokeWidth={2} className="mt-0.5 shrink-0" aria-hidden />
              {notice}
            </p>
          ) : null}

          {/* Example chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Try one:</span>
            {EXAMPLE_LINKS.map((ex) => (
              <button
                key={ex.key}
                type="button"
                onClick={() => {
                  setUrl(ex.url)
                  setEvaluation(EVALUATIONS[ex.key])
                }}
                className="rounded-full border border-border bg-card px-3.5 py-1.5 text-[13px] text-foreground/75 shadow-sm transition-all hover:border-primary/40 hover:bg-accent/40 hover:text-foreground"
              >
                {ex.label}
              </button>
            ))}
          </div>

          {evaluation ? (
            <EvaluationView evaluation={evaluation} />
          ) : (
            <div className="muse-fade-up flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-border bg-secondary/20 px-6 py-20 text-center">
              <span className="muse-float muse-elev flex h-14 w-14 items-center justify-center rounded-2xl bg-card text-primary">
                <Link2 size={22} strokeWidth={2} aria-hidden />
              </span>
              <p className="max-w-sm text-[15px] leading-relaxed text-muted-foreground text-pretty">
                Paste a link above and Muse will score its versatility, check it
                against your closet, and tell you honestly whether to buy it.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div>
            <p className="mb-3 text-sm text-muted-foreground">
              What are you shopping for?
            </p>
            <div className="flex flex-wrap gap-2">
              {PICKS.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setPickKey(p.key)}
                  className={cn(
                    'rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 active:scale-95',
                    pickKey === p.key
                      ? 'border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20'
                      : 'border-border bg-card text-foreground/80 hover:border-primary/30 hover:bg-accent/40',
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="muse-fade-up flex flex-col gap-5">
            <div className="flex items-start gap-3">
              <span
                className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground"
                aria-hidden
              >
                <Sparkles size={15} strokeWidth={2} />
              </span>
              <p className="max-w-2xl text-[15px] leading-relaxed text-foreground text-pretty">
                {activePick.set.intro}
              </p>
            </div>
            <div className="muse-stagger flex flex-wrap gap-4">
              {activePick.set.items.map((item) => (
                <ShoppingCard key={item.name} item={item} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
