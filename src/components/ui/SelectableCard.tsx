import type { ReactNode } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'

interface SelectableCardProps {
  /** checkbox = multi-select (technologies), radio = single choice (levels). */
  type: 'checkbox' | 'radio'
  name?: string
  value?: string
  checked: boolean
  onChange: () => void
  /** Small filled check in the top-right corner when selected. */
  showCheck?: boolean
  className?: string
  children: ReactNode
}

/**
 * A card that behaves like a native checkbox/radio (keyboard, forms and screen readers
 * work out of the box) with the product's shared selected state: peach tint, primary
 * border and a check badge.
 */
export function SelectableCard({
  type,
  name,
  value,
  checked,
  onChange,
  showCheck = true,
  className,
  children,
}: SelectableCardProps) {
  return (
    <label
      className={cn(
        'group relative flex cursor-pointer rounded-tile border transition-[border-color,background-color,box-shadow] duration-150 select-none',
        'has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-primary-200',
        checked
          ? 'border-primary-300 bg-linear-to-br from-primary-50 to-primary-100/70 shadow-[0_2px_10px_-4px_rgb(191_61_16/0.25)]'
          : 'border-line bg-surface hover:border-line-strong hover:shadow-card',
        className,
      )}
    >
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      {children}
      {showCheck && checked && (
        <span
          aria-hidden
          className="absolute top-2.5 right-2.5 flex size-5 animate-pop-in items-center justify-center rounded-full bg-primary-600 text-white shadow-primary"
        >
          <Check className="size-3" strokeWidth={3.5} />
        </span>
      )}
    </label>
  )
}
