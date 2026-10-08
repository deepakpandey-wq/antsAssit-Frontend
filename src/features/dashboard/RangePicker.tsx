import { CalendarDays, Check, ChevronDown } from 'lucide-react'
import { Button, Dropdown, DropdownItem } from '@/components/ui'
import type { StatRange } from '@/types'

const rangeLabel: Record<StatRange, string> = {
  '7d': 'Last 7 days',
  '30d': 'Last 30 days',
  '90d': 'Last 90 days',
}

interface RangePickerProps {
  value: StatRange
  onChange: (range: StatRange) => void
}

export function RangePicker({ value, onChange }: RangePickerProps) {
  return (
    <Dropdown
      trigger={(props, open) => (
        <Button
          {...props}
          variant="secondary"
          size="sm"
          aria-label={`Date range: ${rangeLabel[value]}`}
          leftIcon={<CalendarDays className="text-ink-muted" />}
          rightIcon={
            <ChevronDown
              className={`text-ink-muted transition-transform ${open ? 'rotate-180' : ''}`}
            />
          }
        >
          {rangeLabel[value]}
        </Button>
      )}
    >
      {(close) =>
        (Object.keys(rangeLabel) as StatRange[]).map((range) => (
          <DropdownItem
            key={range}
            icon={<Check className={range === value ? 'text-primary-600' : 'invisible'} />}
            onSelect={() => {
              onChange(range)
              close()
            }}
          >
            {rangeLabel[range]}
          </DropdownItem>
        ))
      }
    </Dropdown>
  )
}
