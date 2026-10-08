import { X } from 'lucide-react'
import { cn } from '@/lib/cn'

interface TagProps {
  label: string
  onRemove?: () => void
  className?: string
}

/** Removable chip (custom skills, selected technologies). */
export function Tag({ label, onRemove, className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex h-7 animate-pop-in items-center gap-1 rounded-md bg-info-50 text-[13px] font-medium text-info-700',
        onRemove ? 'pr-1 pl-2.5' : 'px-2.5',
        className,
      )}
    >
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${label}`}
          className="flex size-5 items-center justify-center rounded transition-colors hover:bg-info-500/15"
        >
          <X className="size-3.5" aria-hidden />
        </button>
      )}
    </span>
  )
}
