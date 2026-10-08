import { ArrowDown, ArrowUp, ChartLine, FileText, Package, UsersRound } from 'lucide-react'
import { Card, IconTile, type IconTone } from '@/components/ui'
import { cn } from '@/lib/cn'
import type { DashboardStat, StatKey } from '@/types'
import { Sparkline } from './Sparkline'

const statVisual: Record<StatKey, { icon: typeof FileText; tone: IconTone }> = {
  assessments: { icon: FileText, tone: 'info' },
  projects: { icon: Package, tone: 'success' },
  candidates: { icon: UsersRound, tone: 'warning' },
  evaluations: { icon: ChartLine, tone: 'teal' },
}

export function StatCard({ stat }: { stat: DashboardStat }) {
  const { icon: Icon, tone } = statVisual[stat.key]
  const positive = stat.change >= 0

  return (
    <Card className="relative overflow-hidden p-5">
      <div className="flex gap-4">
        <IconTile tone={tone} size="lg">
          <Icon strokeWidth={1.75} />
        </IconTile>
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-ink-muted">{stat.label}</p>
          <p className="mt-2.5 text-stat text-ink tabular-nums">{stat.value}</p>
          <p
            className={cn(
              'mt-1 flex items-center gap-0.5 text-xs font-semibold',
              positive ? 'text-success-500' : 'text-danger-500',
            )}
          >
            {positive ? (
              <ArrowUp className="size-3.5" aria-hidden />
            ) : (
              <ArrowDown className="size-3.5" aria-hidden />
            )}
            {Math.abs(stat.change)}%
            <span className="sr-only">{positive ? 'increase' : 'decrease'} vs previous period</span>
          </p>
        </div>
      </div>
      <Sparkline points={stat.trend} className="absolute right-5 bottom-5" />
    </Card>
  )
}
