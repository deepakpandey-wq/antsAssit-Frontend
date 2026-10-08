import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { ArrowRight, ClipboardList, Copy, Ellipsis, Eye, Pencil, Trash2 } from 'lucide-react'
import {
  Badge,
  Button,
  Card,
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownSeparator,
  EmptyState,
  Modal,
  Table,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from '@/components/ui'
import { formatDate } from '@/lib/format'
import { companyLevelLabel, statusMeta } from '@/lib/labels'
import type { AssessmentSummary } from '@/types'

interface RecentAssessmentsTableProps {
  assessments: AssessmentSummary[]
  onDuplicate: (assessment: AssessmentSummary) => void
  onDelete: (id: string) => void
}

export function RecentAssessmentsTable({
  assessments,
  onDuplicate,
  onDelete,
}: RecentAssessmentsTableProps) {
  const navigate = useNavigate()
  const [pendingDelete, setPendingDelete] = useState<AssessmentSummary | null>(null)

  const viewHref = (assessment: AssessmentSummary) =>
    assessment.projectId ? `/projects/${assessment.projectId}` : '/assessments/create/review'

  return (
    <Card>
      <CardHeader
        title="Recent Assessments"
        action={
          <Link
            to="/assessments"
            className="inline-flex items-center gap-1 rounded-md text-[13px] font-semibold text-primary-600 hover:text-primary-700"
          >
            View All <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        }
      />
      <div className="p-5 pt-4">
        {assessments.length === 0 ? (
          <EmptyState
            icon={<ClipboardList />}
            title="No assessments yet"
            description="Create your first assessment to generate a tailored interview project."
            className="py-10"
          />
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Title</TH>
                <TH>Technology</TH>
                <TH>Company Level</TH>
                <TH>Status</TH>
                <TH>Created At</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {assessments.map((assessment) => {
                const status = statusMeta[assessment.status]
                return (
                  <TR key={assessment.id}>
                    <TD className="font-medium text-ink">
                      <Link to={viewHref(assessment)} className="rounded-sm hover:text-primary-600">
                        {assessment.title}
                      </Link>
                    </TD>
                    <TD>{assessment.technology}</TD>
                    <TD>{companyLevelLabel[assessment.companyLevel]}</TD>
                    <TD>
                      <Badge tone={status.tone}>{status.label}</Badge>
                    </TD>
                    <TD className="tabular-nums">{formatDate(assessment.createdAt)}</TD>
                    <TD className="text-right">
                      <Dropdown
                        className="inline-block"
                        trigger={(props) => (
                          <Button
                            {...props}
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Actions for ${assessment.title}`}
                          >
                            <Ellipsis />
                          </Button>
                        )}
                      >
                        {(close) => (
                          <>
                            <DropdownItem
                              icon={<Eye />}
                              onSelect={() => {
                                close()
                                navigate(viewHref(assessment))
                              }}
                            >
                              {assessment.projectId ? 'View project' : 'Continue setup'}
                            </DropdownItem>
                            <DropdownItem
                              icon={<Pencil />}
                              onSelect={() => {
                                close()
                                navigate('/assessments/create/basic-info')
                              }}
                            >
                              Edit
                            </DropdownItem>
                            <DropdownItem
                              icon={<Copy />}
                              onSelect={() => {
                                close()
                                onDuplicate(assessment)
                              }}
                            >
                              Duplicate
                            </DropdownItem>
                            <DropdownSeparator />
                            <DropdownItem
                              icon={<Trash2 />}
                              tone="danger"
                              onSelect={() => {
                                close()
                                setPendingDelete(assessment)
                              }}
                            >
                              Delete
                            </DropdownItem>
                          </>
                        )}
                      </Dropdown>
                    </TD>
                  </TR>
                )
              })}
            </TBody>
          </Table>
        )}
      </div>

      <Modal
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        size="sm"
        title="Delete assessment?"
        description={
          pendingDelete && (
            <>“{pendingDelete.title}” will be removed. Generated projects are not affected.</>
          )
        }
        footer={
          <>
            <Button variant="secondary" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (pendingDelete) onDelete(pendingDelete.id)
                setPendingDelete(null)
              }}
            >
              Delete
            </Button>
          </>
        }
      />
    </Card>
  )
}
