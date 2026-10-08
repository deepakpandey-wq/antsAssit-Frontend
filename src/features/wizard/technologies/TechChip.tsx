import { IconTile } from '@/components/ui'
import type { Technology } from '@/types'
import { techIcons } from './techIcons'

/** Read-only technology pill with its icon (Review step, project details). */
export function TechChip({ tech }: { tech: Technology }) {
  const Icon = techIcons[tech.icon]
  return (
    <span className="inline-flex h-8 items-center gap-2 rounded-control border border-line bg-surface pr-3 pl-1.5 text-[13px] font-medium text-ink-body">
      <IconTile tone={tech.tone} size="xs" className="size-5 rounded [&_svg]:size-3.5">
        <Icon strokeWidth={2} />
      </IconTile>
      {tech.name}
    </span>
  )
}
