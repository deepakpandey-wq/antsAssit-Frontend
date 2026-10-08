import { Badge, Card, Table, TBody, TD, TH, THead, TR, type BadgeTone } from '@/components/ui'
import type { TestCase, TestType } from '../content'

const typeTone: Record<TestType, BadgeTone> = {
  Unit: 'info',
  Integration: 'warning',
  E2E: 'success',
}

export function TestCasesTab({ testCases }: { testCases: TestCase[] }) {
  const counts = testCases.reduce<Record<TestType, number>>(
    (acc, tc) => ({ ...acc, [tc.type]: acc[tc.type] + 1 }),
    { Unit: 0, Integration: 0, E2E: 0 },
  )
  return (
    <Card className="p-5">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-card-title text-ink">Test Cases</h2>
          <p className="mt-0.5 text-[13px] text-ink-muted">
            {testCases.length} test cases covering the required competencies.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(counts) as TestType[]).map((type) => (
            <Badge key={type} tone={typeTone[type]} shape="pill">
              {counts[type]} {type}
            </Badge>
          ))}
        </div>
      </div>
      <Table>
        <THead>
          <TR>
            <TH className="w-24">ID</TH>
            <TH>Test case</TH>
            <TH>Area</TH>
            <TH>Type</TH>
          </TR>
        </THead>
        <TBody>
          {testCases.map((tc) => (
            <TR key={tc.id}>
              <TD className="font-mono text-xs text-ink">{tc.id}</TD>
              <TD className="min-w-72 whitespace-normal text-ink-body">{tc.title}</TD>
              <TD>{tc.area}</TD>
              <TD>
                <Badge tone={typeTone[tc.type]}>{tc.type}</Badge>
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </Card>
  )
}
