import { useState } from 'react'
import { FolderPlus } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { ListSection } from '@/types'
import { InlineTextInput } from './InlineTextInput'
import { sectionIcons } from './sectionIcons'

interface SectionNavProps {
  sections: ListSection[]
  selectedId: string | undefined
  onSelect: (id: string) => void
  onAddSection: (name: string) => void
}

function CountChip({ value, active }: { value: number; active?: boolean }) {
  return (
    <span
      className={cn(
        'ml-auto inline-flex h-6 min-w-8 shrink-0 items-center justify-center rounded-md px-1.5 text-xs font-semibold tabular-nums',
        active ? 'bg-surface text-ink-body shadow-card' : 'bg-surface-sunken text-ink-muted',
      )}
    >
      {value}
    </span>
  )
}

/** Left-hand section list ("All Sections" total + one entry per section). */
export function SectionNav({ sections, selectedId, onSelect, onAddSection }: SectionNavProps) {
  const [adding, setAdding] = useState(false)
  const total = sections.reduce((sum, section) => sum + section.items.length, 0)

  return (
    <div className="min-w-0 rounded-card border border-line bg-surface p-3 shadow-card">
      <div className="flex items-center gap-2 px-2 pt-1 pb-3">
        <h3 className="text-[13px] font-semibold text-ink">All Sections</h3>
        <CountChip value={total} />
      </div>

      <ul
        aria-label="Sections"
        className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 xl:mx-0 xl:flex-col xl:overflow-visible xl:px-0 xl:pb-0"
      >
        {sections.map((section) => {
          const active = section.id === selectedId
          const { icon: Icon, className: iconClass } = sectionIcons[section.icon]
          return (
            <li key={section.id} className="shrink-0">
              <button
                type="button"
                aria-current={active ? 'true' : undefined}
                onClick={() => onSelect(section.id)}
                className={cn(
                  'relative flex h-10 w-full items-center gap-3 rounded-control px-3 text-left text-[13px] whitespace-nowrap transition-colors',
                  active
                    ? 'bg-linear-to-r from-primary-50 to-primary-50/40 font-semibold text-ink before:absolute before:inset-y-1.5 before:left-0 before:w-[3px] before:rounded-full before:bg-primary-600'
                    : 'font-medium text-ink-body hover:bg-surface-sunken hover:text-ink',
                )}
              >
                <Icon className={cn('size-[18px] shrink-0', iconClass)} aria-hidden />
                <span className="truncate">{section.name}</span>
                <CountChip value={section.items.length} active={active} />
              </button>
            </li>
          )
        })}

        <li className="shrink-0 xl:mt-1">
          {adding ? (
            <div className="flex h-10 items-center gap-3 rounded-control border border-primary-400 px-3 ring-3 ring-primary-100">
              <FolderPlus className="size-[18px] shrink-0 text-ink-muted" aria-hidden />
              <InlineTextInput
                aria-label="New section name"
                placeholder="Section name"
                maxLength={40}
                onCommit={(name) => {
                  onAddSection(name)
                  setAdding(false)
                }}
                onCancel={() => setAdding(false)}
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="flex h-10 w-full items-center gap-3 rounded-control px-3 text-[13px] font-medium whitespace-nowrap text-ink-muted transition-colors hover:bg-surface-sunken hover:text-ink"
            >
              <FolderPlus className="size-[18px] shrink-0" aria-hidden />
              New section
            </button>
          )}
        </li>
      </ul>
    </div>
  )
}
