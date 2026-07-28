'use client'

import {
  Mic,
  Eye,
  Sparkles,
  Brain,
  CloudSun,
  ShoppingBag,
  LayoutGrid,
  Aperture,
  Store,
  Check,
  Plug,
  Clock,
  type LucideIcon,
} from 'lucide-react'
import {
  INTEGRATIONS,
  type IntegrationCategory,
  type IntegrationConfig,
  type IntegrationStatus,
} from '@/lib/services'
import { cn } from '@/lib/utils'

const ICONS: Record<string, LucideIcon> = {
  voice: Mic,
  vision: Eye,
  stylist: Sparkles,
  memory: Brain,
  weather: CloudSun,
  products: ShoppingBag,
  pinterest: LayoutGrid,
  instagram: Aperture,
  shopify: Store,
}

const SECTIONS: { id: IntegrationCategory; title: string; blurb: string }[] = [
  {
    id: 'intelligence',
    title: 'Intelligence',
    blurb: 'The models that let Muse see, listen, reason, and remember.',
  },
  {
    id: 'data',
    title: 'Live data',
    blurb: 'Real-world context that keeps recommendations grounded.',
  },
  {
    id: 'import',
    title: 'Imports',
    blurb: 'Bring your existing style world into Muse.',
  },
]

const STATUS_STYLES: Record<
  IntegrationStatus,
  { label: string; dot: string; pill: string; icon: LucideIcon }
> = {
  active: {
    label: 'Active',
    dot: 'bg-primary',
    pill: 'bg-primary/10 text-primary',
    icon: Check,
  },
  ready: {
    label: 'Ready to connect',
    dot: 'bg-foreground/40',
    pill: 'bg-secondary text-secondary-foreground',
    icon: Plug,
  },
  'coming-soon': {
    label: 'Coming soon',
    dot: 'bg-muted-foreground/40',
    pill: 'bg-muted text-muted-foreground',
    icon: Clock,
  },
}

function IntegrationCard({ integration }: { integration: IntegrationConfig }) {
  const Icon = ICONS[integration.id] ?? Sparkles
  const status = STATUS_STYLES[integration.status]
  const StatusIcon = status.icon
  const isComingSoon = integration.status === 'coming-soon'

  return (
    <div
      className={cn(
        'flex flex-col rounded-3xl border border-border bg-card p-5',
        isComingSoon
          ? 'muse-elev opacity-80'
          : 'muse-card hover:border-primary/25',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl',
            isComingSoon ? 'bg-muted text-muted-foreground' : 'bg-accent text-accent-foreground',
          )}
        >
          <Icon size={20} strokeWidth={1.9} aria-hidden />
        </span>
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
            status.pill,
          )}
        >
          <StatusIcon size={12} strokeWidth={2.4} aria-hidden />
          {status.label}
        </span>
      </div>

      <h3 className="mt-4 font-serif text-lg leading-tight text-card-foreground">
        {integration.name}
      </h3>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {integration.provider}
      </p>

      <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground/70">
        {integration.description}
      </p>

      {integration.envVars.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {integration.envVars.map((key) => (
            <code
              key={key}
              className="rounded-md bg-secondary/60 px-2 py-1 font-mono text-[11px] text-secondary-foreground/80"
            >
              {key}
            </code>
          ))}
        </div>
      )}

      <button
        type="button"
        disabled={isComingSoon}
        className={cn(
          'mt-4 w-full rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300 enabled:active:scale-[0.98]',
          integration.status === 'active' &&
            'border border-border bg-background text-foreground/80 hover:border-primary/30 hover:bg-accent/40',
          integration.status === 'ready' &&
            'bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/25',
          isComingSoon && 'cursor-not-allowed bg-muted text-muted-foreground',
        )}
      >
        {integration.status === 'active'
          ? 'Manage'
          : integration.status === 'ready'
            ? 'Connect'
            : 'Notify me'}
      </button>
    </div>
  )
}

export function Settings() {
  return (
    <div className="mx-auto max-w-5xl px-8 pb-16">
      <header className="mb-8">
        <h1 className="font-serif text-4xl text-foreground text-balance">
          Settings
        </h1>
        <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-muted-foreground text-pretty">
          Connect the services that power Muse. Everything runs in a graceful
          demo mode until you add credentials — so the experience always works.
        </p>
      </header>

      <div className="flex flex-col gap-10">
        {SECTIONS.map((section) => {
          const items = INTEGRATIONS.filter((i) => i.category === section.id)
          if (items.length === 0) return null
          return (
            <section key={section.id}>
              <div className="mb-4">
                <h2 className="font-serif text-2xl text-foreground">
                  {section.title}
                </h2>
                <p className="text-sm text-muted-foreground">{section.blurb}</p>
              </div>
              <div className="muse-stagger grid gap-4 md:grid-cols-2">
                {items.map((integration) => (
                  <IntegrationCard
                    key={integration.id}
                    integration={integration}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
