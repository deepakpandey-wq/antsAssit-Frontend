import { Link } from 'react-router'
import { FolderOpen, Plus } from 'lucide-react'
import { PageHeader } from '@/components/layout'
import {
  Badge,
  ButtonLink,
  Card,
  EmptyState,
  Table,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from '@/components/ui'
import { useProjects } from '@/features/projects/projectsStore'
import { describeStack } from '@/features/projects/stack'
import { formatDateTime } from '@/lib/format'
import { candidateLevelLabel, companyLevelLabel } from '@/lib/labels'

/** All generated projects (seeded + generated in this session), newest first. */
export function GeneratedProjectsPage() {
  const projects = useProjects((state) => state.projects)
  const list = Object.values(projects).sort((a, b) => b.generatedAt.localeCompare(a.generatedAt))

  return (
    <>
      <PageHeader
        title="Generated Projects"
        description="Interview projects generated from your assessments."
        documentTitle="Generated Projects"
        actions={
          <ButtonLink to="/assessments/create/basic-info" leftIcon={<Plus />}>
            Create Assessment
          </ButtonLink>
        }
      />
      <Card className="p-5">
        {list.length === 0 ? (
          <EmptyState
            icon={<FolderOpen />}
            title="No generated projects yet"
            description="Generate a project from the review step of an assessment."
          />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Project</TH>
                <TH>Title</TH>
                <TH>Technology</TH>
                <TH>Company Level</TH>
                <TH>Candidate Level</TH>
                <TH>Generated At</TH>
                <TH>Status</TH>
              </TR>
            </THead>
            <TBody>
              {list.map((project) => {
                const { companyLevel, candidateLevel, basicInfo } = project.assessment
                return (
                  <TR key={project.id}>
                    <TD className="font-mono text-xs">
                      <Link
                        to={`/projects/${project.id}`}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        {project.id}
                      </Link>
                    </TD>
                    <TD className="font-medium text-ink">{basicInfo.title}</TD>
                    <TD>{describeStack(project.assessment).boilerplate}</TD>
                    <TD>{companyLevel ? companyLevelLabel[companyLevel] : '—'}</TD>
                    <TD>{candidateLevel ? candidateLevelLabel[candidateLevel] : '—'}</TD>
                    <TD className="tabular-nums">{formatDateTime(project.generatedAt)}</TD>
                    <TD>
                      <Badge tone="success">Completed</Badge>
                    </TD>
                  </TR>
                )
              })}
            </TBody>
          </Table>
        )}
      </Card>
    </>
  )
}
