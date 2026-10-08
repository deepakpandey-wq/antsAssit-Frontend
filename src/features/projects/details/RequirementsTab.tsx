import { Badge, Card, Table, TBody, TD, TH, THead, TR, type BadgeTone } from '@/components/ui'
import type { Priority, Requirement } from '../content'

const priorityTone: Record<Priority, BadgeTone> = {
  High: 'primary',
  Medium: 'warning',
  Low: 'neutral',
}

export function RequirementsTab({ requirements }: { requirements: Requirement[] }) {
  const sections = new Set(requirements.map((req) => req.section)).size
  return (
    <Card className="p-5">
      <div className="mb-4">
        <h2 className="text-card-title text-ink">Requirements</h2>
        <p className="mt-0.5 text-[13px] text-ink-muted">
          {requirements.length} requirements across {sections} sections, derived from the job
          responsibilities.
        </p>
      </div>
      <Table>
        <THead>
          <TR>
            <TH className="w-24">ID</TH>
            <TH>Requirement</TH>
            <TH>Section</TH>
            <TH>Priority</TH>
          </TR>
        </THead>
        <TBody>
          {requirements.map((req) => (
            <TR key={req.id}>
              <TD className="font-mono text-xs text-ink">{req.id}</TD>
              <TD className="min-w-72 whitespace-normal text-ink-body">{req.text}</TD>
              <TD>{req.section}</TD>
              <TD>
                <Badge tone={priorityTone[req.priority]}>{req.priority}</Badge>
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </Card>
  )
}
