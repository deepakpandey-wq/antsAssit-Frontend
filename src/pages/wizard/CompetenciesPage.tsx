import { Target } from 'lucide-react'
import { ListStep } from '@/features/wizard/components/ListStep'

export function CompetenciesPage() {
  return (
    <ListStep
      list="competencies"
      numbered
      icon={<Target strokeWidth={1.75} />}
      title="Required Competencies"
      description="Group competencies by section and order them by importance"
      copy={{
        singular: 'competency',
        plural: 'competencies',
        addAnother: 'Add Another Competency',
        placeholder: 'Competency name, e.g. “Exception Handling”',
      }}
    />
  )
}
