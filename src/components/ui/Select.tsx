import { forwardRef, type ReactNode, type SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'
import { controlClasses } from './styles'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[]
  placeholder?: string
  /** Rendered inside the field on the left — the reference shows an icon tile here. */
  leadingIcon?: ReactNode
}

/** Native select (accessible, mobile friendly) dressed in the shared control chrome. */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { options, placeholder, leadingIcon, className, ...props },
  ref,
) {
  return (
    <div className="relative w-full">
      {leadingIcon && (
        <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center">
          {leadingIcon}
        </span>
      )}
      <select
        ref={ref}
        className={cn(
          controlClasses,
          'h-10 appearance-none pr-10',
          leadingIcon ? 'pl-12' : 'pl-3.5',
          className,
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-ink-muted"
      />
    </div>
  )
})
