import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface TabItem<T extends string = string> {
  id: T
  label: ReactNode
}

interface TabsProps<T extends string> {
  tabs: TabItem<T>[]
  value: T
  onChange: (id: T) => void
  className?: string
  /** Accessible name for the tab list. */
  label: string
}

/** Underline tabs (orange active indicator) with roving keyboard focus. */
export function Tabs<T extends string>({ tabs, value, onChange, className, label }: TabsProps<T>) {
  const baseId = useId()
  const listRef = useRef<HTMLDivElement>(null)

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = tabs.findIndex((tab) => tab.id === value)
    const delta = { ArrowRight: 1, ArrowLeft: -1 }[event.key]
    let next: number | undefined
    if (delta) next = (index + delta + tabs.length) % tabs.length
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = tabs.length - 1
    if (next === undefined) return
    event.preventDefault()
    onChange(tabs[next].id)
    listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus()
  }

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn('flex gap-1 overflow-x-auto border-b border-line', className)}
    >
      {tabs.map((tab) => {
        const selected = tab.id === value
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`${baseId}-tab-${tab.id}`}
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={cn(
              '-mb-px border-b-2 px-3.5 pt-1 pb-3 text-[13px] font-medium whitespace-nowrap transition-colors',
              selected
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-ink-muted hover:text-ink',
            )}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

/** Content region shown beneath <Tabs>. */
export function TabPanel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div role="tabpanel" className={cn('animate-fade-in', className)}>
      {children}
    </div>
  )
}
