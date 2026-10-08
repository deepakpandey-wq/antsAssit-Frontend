import {
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/cn'
import { useDismiss } from '@/lib/hooks'

interface TriggerProps {
  'aria-haspopup': 'menu' | 'dialog'
  'aria-expanded': boolean
  'aria-controls': string
  onClick: () => void
}

interface DropdownProps {
  /** Render the trigger; spread `props` onto a button. */
  trigger: (props: TriggerProps, open: boolean) => ReactNode
  /** Menu content. Receives `close` so items can dismiss the menu. */
  children: (close: () => void) => ReactNode
  align?: 'start' | 'end'
  /** 'menu' gives arrow-key navigation over menu items; 'dialog' is a free-form panel. */
  kind?: 'menu' | 'dialog'
  className?: string
  panelClassName?: string
}

export function Dropdown({
  trigger,
  children,
  align = 'end',
  kind = 'menu',
  className,
  panelClassName,
}: DropdownProps) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const refs = useMemo(() => [rootRef], [])
  const close = useCallback(() => setOpen(false), [])

  useDismiss(refs, close, open)

  const focusItem = (direction: 1 | -1 | 'first' | 'last') => {
    const items = Array.from(
      panelRef.current?.querySelectorAll<HTMLElement>(
        '[role="menuitem"]:not([aria-disabled="true"])',
      ) ?? [],
    )
    if (!items.length) return
    const current = items.indexOf(document.activeElement as HTMLElement)
    const next =
      direction === 'first'
        ? 0
        : direction === 'last'
          ? items.length - 1
          : (current + direction + items.length) % items.length
    items[next].focus()
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (kind !== 'menu' || !open) return
    const map: Record<string, 1 | -1 | 'first' | 'last'> = {
      ArrowDown: 1,
      ArrowUp: -1,
      Home: 'first',
      End: 'last',
    }
    const direction = map[event.key]
    if (direction !== undefined) {
      event.preventDefault()
      focusItem(direction)
    }
  }

  return (
    <div ref={rootRef} className={cn('relative', className)} onKeyDown={onKeyDown}>
      {trigger(
        {
          'aria-haspopup': kind,
          'aria-expanded': open,
          'aria-controls': id,
          onClick: () => setOpen((value) => !value),
        },
        open,
      )}
      {open && (
        <div
          ref={panelRef}
          id={id}
          role={kind}
          className={cn(
            'absolute top-full z-40 mt-2 min-w-48 animate-pop-in rounded-control border border-line bg-surface p-1.5 shadow-popover',
            align === 'end' ? 'right-0 origin-top-right' : 'left-0 origin-top-left',
            panelClassName,
          )}
        >
          {children(close)}
        </div>
      )}
    </div>
  )
}

interface DropdownItemProps {
  icon?: ReactNode
  onSelect: () => void
  tone?: 'default' | 'danger'
  children: ReactNode
}

export function DropdownItem({ icon, onSelect, tone = 'default', children }: DropdownItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onSelect}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] font-medium transition-colors focus:outline-none [&_svg]:size-4',
        tone === 'danger'
          ? 'text-danger-500 hover:bg-danger-50 focus-visible:bg-danger-50'
          : 'text-ink-body hover:bg-surface-sunken focus-visible:bg-surface-sunken',
      )}
    >
      {icon && <span className="text-ink-muted">{icon}</span>}
      {children}
    </button>
  )
}

export function DropdownSeparator() {
  return <div role="separator" className="my-1 h-px bg-line" />
}
