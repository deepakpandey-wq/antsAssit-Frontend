import { useState } from 'react'
import { Tag } from '@/components/ui'
import { technologyService } from '@/services/technologyService'
import { wizardSteps, stepIndex } from '../steps'
import { TechChip } from '../technologies/TechChip'
import { ReviewPanel } from './ReviewPanel'

const COLLAPSED_COUNT = 7

export function SelectedTechnologies({
  technologyIds,
  customSkills,
}: {
  technologyIds: string[]
  customSkills: string[]
}) {
  const [expanded, setExpanded] = useState(false)
  const chips = [
    ...technologyService.getByIds(technologyIds).map((tech) => ({
      key: tech.id,
      node: <TechChip tech={tech} />,
    })),
    ...customSkills.map((skill) => ({
      key: `custom-${skill}`,
      node: <Tag label={skill} className="h-8" />,
    })),
  ]
  const hidden = chips.length - COLLAPSED_COUNT
  const visible = expanded || hidden <= 0 ? chips : chips.slice(0, COLLAPSED_COUNT)

  return (
    <ReviewPanel
      title="Selected Technologies"
      editTo={wizardSteps[stepIndex('technologies')].path}
      editLabel="Edit technologies"
    >
      <ul aria-label="Selected technologies" className="flex flex-wrap gap-2">
        {visible.map((chip) => (
          <li key={chip.key}>{chip.node}</li>
        ))}
        {hidden > 0 && (
          <li>
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => setExpanded((value) => !value)}
              className="inline-flex h-8 items-center rounded-control bg-surface-sunken px-3 text-[13px] font-medium text-ink-muted transition-colors hover:text-ink"
            >
              {expanded ? 'Show less' : `+ ${hidden} more`}
            </button>
          </li>
        )}
      </ul>
    </ReviewPanel>
  )
}
