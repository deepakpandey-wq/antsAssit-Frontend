import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'dark' | 'soft' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon-sm' | 'icon'

const base =
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-control font-semibold whitespace-nowrap transition-[background-color,border-color,color,box-shadow] duration-150 select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary-600 text-white shadow-primary hover:bg-primary-700 active:bg-primary-800',
  secondary:
    'border border-line-strong bg-surface text-ink shadow-card hover:border-ink-subtle/50 hover:bg-surface-muted',
  dark: 'bg-night text-white shadow-raised hover:bg-night-hover',
  soft: 'bg-primary-50 text-primary-700 hover:bg-primary-100',
  ghost: 'text-ink-body hover:bg-surface-sunken hover:text-ink',
  danger: 'border border-danger-50 bg-danger-50/60 text-danger-500 hover:bg-danger-50',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-[13px]',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-sm',
  'icon-sm': 'size-8',
  icon: 'size-10',
}

export function buttonClasses({
  variant = 'primary',
  size = 'md',
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className)
}

/** Shared control chrome so Input, Textarea and Select stay pixel-identical. */
export const controlClasses =
  'w-full rounded-control border border-line-strong bg-surface text-sm text-ink placeholder:text-ink-subtle transition-[border-color,box-shadow] duration-150 hover:border-ink-subtle/60 focus:border-primary-400 focus:ring-3 focus:ring-primary-100 focus:outline-none disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-ink-muted aria-invalid:border-danger-500 aria-invalid:focus:ring-danger-50'
