import { useState } from 'react'
import { Outlet, ScrollRestoration, type Location } from 'react-router'
import { Sidebar } from './Sidebar'
import { TopHeader } from './TopHeader'

/**
 * Every freshly loaded document starts on history key "default", so keying scroll positions
 * by location.key alone restores another page's offset. Key that entry by URL instead;
 * in-app navigations keep their unique key (new pages start at the top, Back restores).
 */
const scrollKey = (location: Location) =>
  location.key === 'default' ? `${location.pathname}${location.search}` : location.key

/** The single layout every screen renders inside. */
export function AppShell() {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <div className="flex min-h-dvh bg-canvas">
      <a
        href="#main"
        className="sr-only z-50 rounded-control bg-surface px-4 py-2 font-semibold text-ink shadow-popover focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopHeader onOpenNavigation={() => setNavOpen(true)} />
        <main id="main" className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-7">
          <div className="mx-auto w-full max-w-content">
            <Outlet />
          </div>
        </main>
      </div>
      <ScrollRestoration getKey={scrollKey} />
    </div>
  )
}
