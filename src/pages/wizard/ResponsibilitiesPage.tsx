import { ListTodo } from 'lucide-react'
import { ListStep } from '@/features/wizard/components/ListStep'

export function ResponsibilitiesPage() {
  return (
    <ListStep
      list="responsibilities"
      icon={<ListTodo strokeWidth={1.75} />}
      title="Job Responsibilities"
      description="Add job responsibilities for this role (Supports multiple sections)"
      copy={{
        singular: 'responsibility',
        plural: 'responsibilities',
        addAnother: 'Add Another Responsibility',
        placeholder: 'Describe a responsibility, e.g. “Design RESTful APIs”',
      }}
    />
  )
}
