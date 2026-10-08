import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export type BadgeTone = 'success' | 'info' | 'neutral' | 'warning' | 'primary' | 'danger'

const tones: Record<BadgeTone, string> = {
  success: 'bg-success-50 text-success-700',
  info: 'bg-info-50 text-info-700',
  neutral: 'bg-neutral-50 text-neutral-500',
  warning: 'bg-warning-50 text-warning-700',
  primary: 'bg-primary-50 text-primary-600',
  danger: 'bg-danger-50 text-danger-700',
}

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone
  shape?: 'rounded' | 'pill'
}

export function Badge({ tone = 'neutral', shape = 'rounded', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex h-6 items-center gap-1 px-2 text-xs font-medium whitespace-nowrap',
        shape === 'pill' ? 'rounded-full' : 'rounded-md',
        tones[tone],
        className,
      )}
      {...props}
    />
  )
}
