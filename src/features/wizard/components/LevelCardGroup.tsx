import { SelectableCard } from '@/components/ui'
import { cn } from '@/lib/cn'
import type { LevelOption } from '../levels'

interface LevelCardGroupProps<T extends string> {
  legend: string
  name: string
  options: LevelOption<T>[]
  value: T | null
  onChange: (value: T) => void
  className?: string
}

/** A radio group rendered as selectable cards (Company Level, Candidate Level). */
export function LevelCardGroup<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
  className,
}: LevelCardGroupProps<T>) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-semibold text-ink">{legend}</legend>
      <div className={cn('grid grid-cols-1 gap-3', className)}>
        {options.map((option) => {
          const checked = option.value === value
          const Icon = option.icon
          return (
            <SelectableCard
              key={option.value}
              type="radio"
              name={name}
              value={option.value}
              checked={checked}
              onChange={() => onChange(option.value)}
              className="items-start gap-3 p-4 pr-9 sm:min-h-24"
            >
              <span
                aria-hidden
                className={cn(
                  'flex size-9 shrink-0 items-center justify-center rounded-full transition-colors',
                  checked
                    ? 'bg-primary-600 text-white shadow-primary'
                    : 'bg-surface-sunken text-ink-muted group-hover:text-ink-body',
                )}
              >
                <Icon className="size-[18px]" strokeWidth={1.75} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-ink">{option.label}</span>
                <span className="mt-1 block text-xs leading-relaxed text-ink-muted">
                  {option.description}
                </span>
              </span>
            </SelectableCard>
          )
        })}
      </div>
    </fieldset>
  )
}
