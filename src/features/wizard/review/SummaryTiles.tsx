import { Link } from 'react-router'
import { Award, Building2, Cpu, ListTodo, Pencil, Target } from 'lucide-react'
import { Card, IconTile, type IconTone } from '@/components/ui'
import { candidateLevelLabel, companyLevelLabel } from '@/lib/labels'
import type { AssessmentDraft, ListSection, WizardStepId } from '@/types'
import { stepIndex, wizardSteps } from '../steps'

interface Tile {
  label: string
  value: string
  detail?: string
  step: WizardStepId
  icon: typeof ListTodo
  tone: IconTone
}

const countItems = (sections: ListSection[]) =>
  sections.reduce((sum, section) => sum + section.items.length, 0)
const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`

/** Summary of every wizard step; each tile is an Edit control for its step. */
export function SummaryTiles({ draft }: { draft: AssessmentDraft }) {
  const tiles: Tile[] = [
    {
      label: 'Job Responsibilities',
      value: plural(countItems(draft.responsibilities), 'item'),
      detail: plural(draft.responsibilities.length, 'section'),
      step: 'responsibilities',
      icon: ListTodo,
      tone: 'info',
    },
    {
      label: 'Competencies',
      value: plural(countItems(draft.competencies), 'item'),
      detail: plural(draft.competencies.length, 'section'),
      step: 'competencies',
      icon: Target,
      tone: 'purple',
    },
    {
      label: 'Technologies',
      value: plural(draft.technologies.length + draft.customSkills.length, 'item'),
      detail: `${draft.customSkills.length} custom`,
      step: 'technologies',
      icon: Cpu,
      tone: 'success',
    },
    {
      label: 'Company Level',
      value: draft.companyLevel ? companyLevelLabel[draft.companyLevel] : '—',
      step: 'company-level',
      icon: Building2,
      tone: 'danger',
    },
    {
      label: 'Candidate Level',
      value: draft.candidateLevel ? candidateLevelLabel[draft.candidateLevel] : '—',
      step: 'company-level',
      icon: Award,
      tone: 'info',
    },
  ]

  return (
    <Card className="p-5">
      <h3 className="mb-4 text-card-title text-ink">Summary</h3>
      <ul
        aria-label="Step summary"
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-3"
      >
        {tiles.map(({ label, value, detail, step, icon: Icon, tone }) => (
          <li key={label}>
            <Link
              to={wizardSteps[stepIndex(step)].path}
              className="group relative flex h-full items-center gap-3 rounded-tile border border-line p-3 pr-8 transition-colors hover:border-line-strong hover:bg-surface-muted"
            >
              <IconTile tone={tone} size="md">
                <Icon strokeWidth={1.75} />
              </IconTile>
              <span className="min-w-0">
                <span className="block truncate text-xs text-ink-muted">{label}</span>
                <span className="block text-sm font-semibold text-ink">{value}</span>
                {detail && <span className="block text-xs text-ink-subtle">{detail}</span>}
              </span>
              <span className="sr-only">, edit</span>
              <Pencil
                aria-hidden
                className="absolute top-3 right-3 size-3.5 text-ink-subtle opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
              />
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  )
}
