import { Link } from 'react-router'
import { ChevronRight, CirclePlay, FileCheck2, LayoutTemplate, UsersRound } from 'lucide-react'
import { Card, CardHeader, IconTile, type IconTone } from '@/components/ui'

const actions: { label: string; to: string; icon: typeof LayoutTemplate; tone: IconTone }[] = [
  { label: 'Manage Boilerplates', to: '/boilerplates', icon: LayoutTemplate, tone: 'info' },
  { label: 'View Generated Projects', to: '/projects', icon: FileCheck2, tone: 'purple' },
  { label: 'Manage Candidates', to: '/candidates', icon: UsersRound, tone: 'danger' },
  { label: 'View Reports', to: '/reports', icon: CirclePlay, tone: 'warning' },
]

export function QuickActions() {
  return (
    <Card className="flex flex-col">
      <CardHeader title="Quick Actions" />
      <ul className="flex flex-1 flex-col justify-center gap-1 p-3">
        {actions.map(({ label, to, icon: Icon, tone }) => (
          <li key={label}>
            <Link
              to={to}
              className="group flex items-center gap-3 rounded-control px-2 py-2 text-[13px] font-medium text-ink-body transition-colors hover:bg-surface-sunken hover:text-ink"
            >
              <IconTile tone={tone} size="sm">
                <Icon strokeWidth={1.75} />
              </IconTile>
              <span className="flex-1">{label}</span>
              <ChevronRight
                aria-hidden
                className="size-4 -translate-x-1 text-ink-subtle opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:opacity-100"
              />
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  )
}
