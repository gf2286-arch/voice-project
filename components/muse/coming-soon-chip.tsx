'use client'

import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ComingSoonChipProps {
  icon: LucideIcon
  label: string
  className?: string
}

/**
 * A disabled pill that advertises an upcoming import source. Kept generic so
 * the Closet, Shopping, and Settings surfaces stay consistent as new
 * integrations move from "coming soon" to live.
 */
export function ComingSoonChip({
  icon: Icon,
  label,
  className,
}: ComingSoonChipProps) {
  return (
    <button
      type="button"
      disabled
      title={`${label} import — coming soon`}
      className={cn(
        'inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-dashed border-border bg-secondary/40 px-3.5 py-2 text-sm font-medium text-muted-foreground',
        className,
      )}
    >
      <Icon size={16} strokeWidth={1.9} aria-hidden />
      {label}
      <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        Soon
      </span>
    </button>
  )
}
