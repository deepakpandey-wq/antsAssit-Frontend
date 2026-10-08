import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type IconTone =
  'primary' | 'solid' | 'info' | 'success' | 'warning' | 'teal' | 'purple' | 'danger' | 'neutral'

const tones: Record<IconTone, string> = {
  primary: 'bg-primary-50 text-primary-600',
  solid: 'bg-linear-to-br from-primary-500 to-primary-700 text-white shadow-primary',
  info: 'bg-info-50 text-info-500',
  success: 'bg-success-50 text-success-500',
  warning: 'bg-warning-50 text-warning-500',
  teal: 'bg-teal-50 text-teal-500',
  purple: 'bg-purple-50 text-purple-500',
  danger: 'bg-danger-50 text-danger-500',
  neutral: 'bg-neutral-50 text-neutral-500',
}

const sizes = {
  xs: 'size-7 rounded-md [&_svg]:size-4',
  sm: 'size-8 rounded-lg [&_svg]:size-4',
  md: 'size-10 rounded-tile [&_svg]:size-5',
  lg: 'size-12 rounded-tile [&_svg]:size-6',
  xl: 'size-14 rounded-2xl [&_svg]:size-7',
}

interface IconTileProps {
  tone?: IconTone
  size?: keyof typeof sizes
  className?: string
  children: ReactNode
}

/** Rounded square holding an icon — used by stat cards, quick actions, section headers. */
export function IconTile({ tone = 'primary', size = 'md', className, children }: IconTileProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex shrink-0 items-center justify-center',
        tones[tone],
        sizes[size],
        className,
      )}
    >
      {children}
    </span>
  )
}
