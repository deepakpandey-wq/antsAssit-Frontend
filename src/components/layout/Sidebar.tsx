import { Link, useLocation } from 'react-router'
import { X } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/lib/cn'
import { Logo } from './Logo'
import { navItems } from './navigation'
import { DraftCard } from './DraftCard'

interface SidebarProps {
  /** Mobile drawer state; ignored at lg+ where the sidebar is always visible. */
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { pathname } = useLocation()

  return (
    <>
      {open && (
        <div
          aria-hidden
          onClick={onClose}
          className="fixed inset-0 z-40 animate-fade-in bg-ink/25 backdrop-blur-[1px] lg:hidden"
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 shrink-0 border-r border-line bg-sidebar',
          'lg:static lg:z-auto lg:w-sidebar lg:translate-x-0',
          open
            ? 'translate-x-0 animate-slide-in shadow-popover'
            : '-translate-x-full lg:shadow-none',
        )}
      >
        {/* The aside stretches with the page (full-height background); this column stays pinned. */}
        <div className="flex h-full flex-col lg:sticky lg:top-0 lg:h-dvh">
          <div className="flex h-header shrink-0 items-center justify-between px-6">
            <Logo />
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Close navigation"
              onClick={onClose}
              className="lg:hidden"
            >
              <X />
            </Button>
          </div>

          <nav aria-label="Main" className="flex-1 overflow-y-auto px-4 pt-2">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const active = item.isActive(pathname)
                const Icon = item.icon
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={onClose}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'flex h-10 items-center gap-3 rounded-control px-3 text-[13px] font-medium transition-colors',
                        active
                          ? 'bg-nav-active text-ink'
                          : 'text-ink-body hover:bg-surface-sunken hover:text-ink',
                      )}
                    >
                      <Icon
                        aria-hidden
                        strokeWidth={1.75}
                        className={cn(
                          'size-[18px]',
                          active ? 'text-primary-600' : 'text-ink-muted',
                        )}
                      />
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="p-4">
            <DraftCard onNavigate={onClose} />
          </div>
        </div>
      </aside>
    </>
  )
}
