import { Menu } from 'lucide-react'
import { Button } from '@/components/ui'
import { NotificationsMenu } from './NotificationsMenu'
import { ProfileMenu } from './ProfileMenu'
import { SearchBar } from './SearchBar'

export function TopHeader({ onOpenNavigation }: { onOpenNavigation: () => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/90 backdrop-blur-md">
      <div className="flex h-header items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open navigation"
          onClick={onOpenNavigation}
          className="lg:hidden [&_svg]:size-5"
        >
          <Menu />
        </Button>
        <SearchBar />
        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          <NotificationsMenu />
          <ProfileMenu />
        </div>
      </div>
    </header>
  )
}
