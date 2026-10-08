import { useMemo, useState } from 'react'
import { PageHeader } from '@/components/layout'
import { CreateAssessmentCta } from '@/features/dashboard/CreateAssessmentCta'
import { QuickActions } from '@/features/dashboard/QuickActions'
import { RangePicker } from '@/features/dashboard/RangePicker'
import { RecentAssessmentsTable } from '@/features/dashboard/RecentAssessmentsTable'
import { StatCard } from '@/features/dashboard/StatCard'
import { useProjects } from '@/features/projects/projectsStore'
import { generatedSummaries } from '@/features/projects/selectors'
import { greetingFor } from '@/lib/format'
import { dashboardService } from '@/services/dashboardService'
import { userService } from '@/services/userService'
import type { AssessmentSummary, StatRange } from '@/types'

export function DashboardPage() {
  const user = userService.getCurrentUser()
  const [range, setRange] = useState<StatRange>('30d')
  // Mock history + anything generated in this session (newest first).
  const [assessments, setAssessments] = useState(() => {
    const recent = dashboardService.getRecentAssessments()
    const projects = Object.values(useProjects.getState().projects)
    return [...generatedSummaries(projects, recent), ...recent]
  })
  const stats = useMemo(() => dashboardService.getStats(range), [range])

  const duplicate = (source: AssessmentSummary) => {
    const copy: AssessmentSummary = {
      ...source,
      id: `${source.id}-copy-${Date.now()}`,
      title: `${source.title} (Copy)`,
      status: 'draft',
      projectId: undefined,
      createdAt: new Date().toISOString().slice(0, 10),
    }
    setAssessments((list) => [copy, ...list])
  }

  return (
    <>
      <PageHeader
        documentTitle="Dashboard"
        title={
          <>
            {greetingFor()}, {user.firstName}!{' '}
            <span role="img" aria-label="waving hand">
              👋
            </span>
          </>
        }
        description="Create and manage technical interview assessments with AI-powered project generation."
        actions={<RangePicker value={range} onChange={setRange} />}
      />

      <div className="space-y-5">
        <section aria-label="Statistics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.key} stat={stat} />
          ))}
        </section>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <CreateAssessmentCta />
          </div>
          <QuickActions />
        </div>

        <RecentAssessmentsTable
          assessments={assessments}
          onDuplicate={duplicate}
          onDelete={(id) => setAssessments((list) => list.filter((item) => item.id !== id))}
        />
      </div>
    </>
  )
}
