import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface FormFieldProps {
  label: string
  htmlFor: string
  required?: boolean
  hint?: ReactNode
  error?: string
  /** e.g. current/max character count, shown bottom-right like the reference. */
  counter?: { current: number; max: number }
  className?: string
  children: ReactNode
}

export function FormField({
  label,
  htmlFor,
  required,
  hint,
  error,
  counter,
  className,
  children,
}: FormFieldProps) {
  const showFooter = error || hint || counter
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={htmlFor} className="text-[13px] font-semibold text-ink">
        {label}
        {required && <span className="ml-0.5 text-primary-600">*</span>}
      </label>
      {children}
      {showFooter && (
        <div className="flex items-start justify-between gap-3 text-xs">
          <span
            id={`${htmlFor}-message`}
            className={error ? 'text-danger-500' : 'text-ink-muted'}
            role={error ? 'alert' : undefined}
          >
            {error ?? hint}
          </span>
          {counter && (
            <span
              className={cn(
                'ml-auto tabular-nums',
                counter.current > counter.max ? 'text-danger-500' : 'text-ink-subtle',
              )}
            >
              {counter.current}/{counter.max}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
