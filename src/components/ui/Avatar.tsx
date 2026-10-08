import { cn } from '@/lib/cn'

interface AvatarProps {
  name: string
  size?: 'sm' | 'md'
  className?: string
}

export function Avatar({ name, size = 'md', className }: AvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase() || '?'
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full bg-night font-semibold text-white',
        size === 'md' ? 'size-9 text-sm' : 'size-7 text-xs',
        className,
      )}
    >
      {initial}
    </span>
  )
}
