'use client'

import {
  Home,
  Shirt,
  History,
  ShoppingBag,
  Settings,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'closet', label: 'Closet', icon: Shirt },
  { id: 'history', label: 'Outfit History', icon: History },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag },
  { id: 'settings', label: 'Settings', icon: Settings },
] as const

interface SidebarProps {
  active: string
  onNavigate: (id: string) => void
  onHome: () => void
}

export function Sidebar({ active, onNavigate, onHome }: SidebarProps) {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col gap-2 border-r border-sidebar-border bg-sidebar px-4 py-6">
      {/* Brand — returns to the voice-first opening screen */}
      <button
        type="button"
        onClick={onHome}
        aria-label="Return to Muse home"
        className="group mb-2 flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-all duration-300 hover:bg-sidebar-accent/40 active:scale-[0.98]"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/25 transition-transform duration-300 group-hover:scale-105">
          <Sparkles size={18} strokeWidth={2} aria-hidden />
        </span>
        <span className="font-serif text-2xl leading-none text-sidebar-foreground">
          Muse
        </span>
      </button>

      {/* Nav */}
      <nav className="flex flex-col gap-1" aria-label="Primary">
        {NAV.map(({ id, label, icon: Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm'
                  : 'text-sidebar-foreground/70 hover:translate-x-0.5 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground',
              )}
            >
              <span
                aria-hidden
                className={cn(
                  'absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-primary transition-all duration-300',
                  isActive ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0',
                )}
              />
              <Icon
                size={18}
                strokeWidth={isActive ? 2.1 : 1.8}
                className={cn(
                  'transition-all duration-300',
                  isActive
                    ? 'text-primary'
                    : 'text-sidebar-foreground/60 group-hover:text-sidebar-foreground/80',
                )}
                aria-hidden
              />
              {label}
            </button>
          )
        })}
      </nav>

      {/* Footer card */}
      <div className="mt-auto">
        <div className="muse-glass rounded-2xl border border-sidebar-border/60 p-4">
          <p className="font-serif text-lg leading-tight text-sidebar-foreground">
            Style, refreshed
          </p>
          <p className="mt-1 text-xs leading-relaxed text-sidebar-foreground/60">
            Muse learns your wardrobe to suggest looks that feel unmistakably
            you.
          </p>
        </div>
        <div className="mt-4 flex items-center gap-3 px-2">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-medium text-accent-foreground shadow-sm ring-1 ring-border/60"
            aria-hidden
          >
            GA
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              Gabi Laurent
            </p>
            <p className="truncate text-xs text-sidebar-foreground/55">
              Premium member
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
