# Muse — a voice-first personal stylist

**Live demo:** (https://muse-six-eta.vercel.app/)

Muse is a conversational AI stylist you talk to the way you'd talk to a
friend who happens to have impeccable taste. Say "I have a rooftop dinner
in SoHo tonight" and Muse asks one sharp follow-up question, then pulls
outfit recommendations from your actual closet — reasoning through them
out loud, in a voice with real opinions.

## Why voice, and why this project

Most AI stylist apps are forms wearing a chatbot costume: pick an occasion
from a dropdown, get three outfit cards back. That's not how a real
stylist works — a real stylist asks a question, listens, pushes back a
little, and explains *why* a piece works before it recommends it. That
back-and-forth only feels natural spoken aloud. Typing "casual or upscale?"
back and forth kills the illusion; saying it doesn't.

I built Muse to explore that gap: what does a genuinely voice-native
product feel like, end to end, when the voice isn't a bolt-on feature but
the primary interface? That meant designing a real persona (not a
generic assistant voice), building the turn-taking and interruption
handling that makes spoken conversation feel alive rather than
walkie-talkie, and making sure every other feature in the app — the
closet, the shopping assistant, the outfit history — feels like it belongs
to the same character talking to you.

Muse's voice runs on **ElevenLabs' Conversational AI platform**, which
handles the real-time speech-to-text, turn-taking, and text-to-speech
loop, and lets me design a fully custom voice (British, warm, a little
sardonic — think a stylist who's seen it all and still cares) rather than
picking off a shelf. It was the right tool for this specific problem:
building a natural spoken conversation from scratch — echo cancellation,
interruption handling, latency — is a deep, separate problem, and using a
platform built for it let me spend my time on the product itself: the
personality, the wardrobe reasoning, the shopping intelligence, the UI.
That said, the architecture underneath is provider-agnostic by design so 
the same product shell could run on a different voice stack with a few file changes.

## What Muse actually does

- **Talks, listens, and remembers your closet.** Muse's system prompt is
  injected with your wardrobe at the start of every conversation, so
  recommendations reference pieces you actually own — not generic advice.
- **Has a real personality, not a generic assistant tone.** A custom
  voice design (accent, cadence, warmth-with-edge) paired with a system
  prompt that enforces one sharp follow-up question before recommending,
  honest pushback instead of reflexive agreement, and spoken-language
  formatting (no bullet points, no markdown — this has to sound like a
  person, not a document).
- **Evaluates real product links.** Paste a link from any store and Muse
  scrapes the page server-side (Open Graph metadata — title, image,
  price), matches it against a styling-and-versatility model, and gives
  an honest buy / think-it-over / skip verdict scored against your
  existing wardrobe — with reasoning, not just a thumbs up.
- **Tracks a visual closet and outfit history**, with a vision-based
  intake pipeline (photo in, category/color/season/tags out) so adding a
  new piece is as easy as a photo.

## Architecture

Muse is a Next.js (App Router) application with a deliberately thin,
swappable service boundary — every external integration (voice, vision,
product search, weather, styling reasoning) sits behind a single
`lib/services` module with a typed interface and a mock implementation.
Nothing in the UI knows or cares whether it's talking to a live API or a
bundled demo response; that's a config flag away.

```
app/
  api/                    Server routes — the only place secrets live
  page.tsx                Main conversation surface
components/muse/          Presentation layer (voice orb, chat, closet,
                           shopping assistant, outfit history)
lib/
  services/                Swappable integration boundary
    voice.ts               ElevenLabs Conversational AI
    vision.ts               Garment recognition from photos
    products.ts              Link unfurling + live product search
    stylist.ts               Reasoning layer (wardrobe + weather + request)
    weather.ts
  use-muse-voice.ts        Voice session hook (permissions, connection,
                           status)
```

This mattered to me as much as any individual feature: a product built on
one AI provider today should be able to move to another tomorrow without
a rewrite. The wardrobe-matching and styling logic, the product-search
integration, the vision pipeline, and the UI itself are all independent of
which voice platform sits behind the mic — the same shell could plug into
a different conversational AI provider by rewriting one file.

## What I'd build next

- **Voice-triggered actions.** Right now the shopping search and closet
  updates are typed/clicked; the natural next step is letting Muse *do*
  things mid-conversation — "find me a furry white coat" spoken aloud
  triggering the same search live, no typing required.
- **Wardrobe memory that compounds.** Embedding-based style profiling so
  Muse's recommendations sharpen over time based on what you actually
  wear and re-wear, not just what's in the closet.
- **A second, distinct persona** to prove the character layer is truly
  swappable — different accent, different point of view, same
  underlying system.

## Built with

Next.js · React · TypeScript · Tailwind · ElevenLabs Conversational AI ·
Vercel · SerpAPI · Open Graph scraping for link intake

---

Built by Gabriella Farzam.
https://www.linkedin.com/in/gabriella-farzam-5b8b29258/ · (https://muse-six-eta.vercel.app/)
