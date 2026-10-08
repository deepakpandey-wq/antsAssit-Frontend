import { IconTile, SelectableCard } from '@/components/ui'
import type { Technology } from '@/types'
import { techIcons } from './techIcons'

interface TechnologyTileProps {
  tech: Technology
  selected: boolean
  onToggle: () => void
}

export function TechnologyTile({ tech, selected, onToggle }: TechnologyTileProps) {
  const Icon = techIcons[tech.icon]
  return (
    <SelectableCard
      type="checkbox"
      name="technologies"
      value={tech.id}
      checked={selected}
      onChange={onToggle}
      className="h-16 items-center gap-3 pr-9 pl-3.5"
    >
      <IconTile tone={tech.tone} size="md">
        <Icon strokeWidth={1.75} />
      </IconTile>
      <span className="truncate text-sm font-medium text-ink">{tech.name}</span>
    </SelectableCard>
  )
}
