import { cn } from '@/lib/cn'

interface ProgressProps {
  value: number
  max?: number
  label: string
  size?: 'sm' | 'md'
  className?: string
}

export function Progress({ value, max = 100, label, size = 'md', className }: ProgressProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={Math.round(value)}
      className={cn(
        'w-full overflow-hidden rounded-full bg-surface-sunken',
        size === 'md' ? 'h-2' : 'h-1.5',
        className,
      )}
    >
      <div
        className="h-full rounded-full bg-linear-to-r from-primary-500 to-primary-600 transition-[width] duration-500 ease-out"
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}
