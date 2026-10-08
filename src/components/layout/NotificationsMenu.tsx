import { useState } from 'react'
import { Bell } from 'lucide-react'
import { Button, Dropdown } from '@/components/ui'
import { cn } from '@/lib/cn'
import { userService } from '@/services/userService'

export function NotificationsMenu() {
  const [items, setItems] = useState(() => userService.getNotifications())
  const unread = items.filter((item) => !item.read).length

  return (
    <Dropdown
      kind="dialog"
      panelClassName="w-80 p-0"
      trigger={(props) => (
        <Button
          {...props}
          variant="ghost"
          size="icon"
          aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'}
          className="relative text-ink-body [&_svg]:size-5"
        >
          <Bell strokeWidth={1.75} />
          {unread > 0 && (
            <span className="absolute top-2 right-2.5 size-2 rounded-full bg-primary-500 ring-2 ring-canvas" />
          )}
        </Button>
      )}
    >
      {() => (
        <>
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="text-[13px] font-semibold text-ink">Notifications</p>
            <button
              type="button"
              disabled={!unread}
              onClick={() => setItems((list) => list.map((item) => ({ ...item, read: true })))}
              className="text-xs font-medium text-primary-600 hover:text-primary-700 disabled:text-ink-subtle"
            >
              Mark all as read
            </button>
          </div>
          <ul className="max-h-80 overflow-y-auto p-1.5">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() =>
                    setItems((list) =>
                      list.map((entry) =>
                        entry.id === item.id ? { ...entry, read: true } : entry,
                      ),
                    )
                  }
                  className="flex w-full gap-3 rounded-lg px-2.5 py-2.5 text-left hover:bg-surface-sunken"
                >
                  <span
                    aria-hidden
                    className={cn(
                      'mt-1.5 size-2 shrink-0 rounded-full',
                      item.read ? 'bg-transparent' : 'bg-primary-500',
                    )}
                  />
                  <span className="min-w-0">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="text-[13px] font-semibold text-ink">{item.title}</span>
                      <span className="shrink-0 text-[11px] text-ink-subtle">{item.time}</span>
                    </span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-ink-muted">
                      {item.body}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </Dropdown>
  )
}
