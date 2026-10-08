import type { BasicInfo } from '@/types'
import { findOption, projectTypes, targetRoles } from '../options'
import { wizardSteps } from '../steps'
import { ReviewPanel } from './ReviewPanel'

export function AssessmentDetails({ info }: { info: BasicInfo }) {
  const rows: [string, string][] = [
    ['Title', info.title],
    ['Description', info.description],
    ['Target Role', findOption(targetRoles, info.targetRole)?.label ?? '—'],
    ['Project Type', findOption(projectTypes, info.projectType)?.label ?? '—'],
  ]
  return (
    <ReviewPanel
      title="Assessment Details"
      editTo={wizardSteps[0].path}
      editLabel="Edit assessment details"
    >
      <dl className="grid grid-cols-1 gap-x-6 gap-y-1 text-[13px] sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-y-3">
        {rows.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="text-ink-muted max-sm:mt-2">{label}</dt>
            <dd className="leading-relaxed text-ink-body">{value}</dd>
          </div>
        ))}
      </dl>
    </ReviewPanel>
  )
}
