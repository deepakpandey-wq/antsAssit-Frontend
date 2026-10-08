import { useNavigate } from 'react-router'
import { ChevronDown, CreditCard, LogOut, Settings, UserRound } from 'lucide-react'
import { Avatar, Dropdown, DropdownItem, DropdownSeparator } from '@/components/ui'
import { cn } from '@/lib/cn'
import { userService } from '@/services/userService'

export function ProfileMenu() {
  const navigate = useNavigate()
  const user = userService.getCurrentUser()

  return (
    <Dropdown
      trigger={(props, open) => (
        <button
          {...props}
          type="button"
          aria-label={`Account menu for ${user.name}`}
          className="flex items-center gap-3 rounded-control py-1 pr-1 pl-1 transition-colors hover:bg-surface-sunken sm:pr-2"
        >
          <Avatar name={user.name} />
          <span className="hidden text-left leading-tight sm:block">
            <span className="block text-[13px] font-semibold text-ink">{user.name}</span>
            <span className="block text-xs text-ink-muted">{user.email}</span>
          </span>
          <ChevronDown
            aria-hidden
            className={cn(
              'ml-3 hidden size-4 text-ink-muted transition-transform sm:block',
              open && 'rotate-180',
            )}
          />
        </button>
      )}
    >
      {(close) => {
        const go = (to: string) => () => {
          close()
          navigate(to)
        }
        return (
          <>
            <div className="px-2.5 pt-1.5 pb-2 sm:hidden">
              <p className="text-[13px] font-semibold text-ink">{user.name}</p>
              <p className="text-xs text-ink-muted">{user.email}</p>
            </div>
            <DropdownItem icon={<UserRound />} onSelect={go('/settings')}>
              My profile
            </DropdownItem>
            <DropdownItem icon={<Settings />} onSelect={go('/settings')}>
              Settings
            </DropdownItem>
            <DropdownItem icon={<CreditCard />} onSelect={go('/settings')}>
              Billing
            </DropdownItem>
            <DropdownSeparator />
            <DropdownItem icon={<LogOut />} tone="danger" onSelect={go('/dashboard')}>
              Sign out
            </DropdownItem>
          </>
        )
      }}
    </Dropdown>
  )
}
