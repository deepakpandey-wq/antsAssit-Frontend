import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { ListItem } from '@/types'
import { InlineTextInput } from './InlineTextInput'
import { rowFieldClasses } from './styles'

interface SortableItemRowProps {
  item: ListItem
  index: number
  numbered: boolean
  singular: string
  editing: boolean
  onStartEdit: () => void
  onSave: (text: string) => void
  onCancelEdit: () => void
  onDelete: () => void
}

export function IndexChip({ value }: { value: number | string }) {
  return (
    <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-surface-sunken text-xs font-semibold text-ink-muted tabular-nums">
      {value}
    </span>
  )
}

export function SortableItemRow({
  item,
  index,
  numbered,
  singular,
  editing,
  onStartEdit,
  onSave,
  onCancelEdit,
  onDelete,
}: SortableItemRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, disabled: editing })

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn('relative flex items-center gap-2', isDragging && 'z-10')}
    >
      <button
        ref={setActivatorNodeRef}
        type="button"
        aria-label={`Reorder ${singular} ${index + 1}: ${item.text}`}
        className={cn(
          'flex h-11 w-6 shrink-0 touch-none items-center justify-center rounded-md text-ink-subtle transition-colors hover:text-ink-muted',
          editing ? 'cursor-not-allowed opacity-40' : 'cursor-grab active:cursor-grabbing',
        )}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" aria-hidden />
      </button>

      <div
        className={cn(
          rowFieldClasses,
          editing
            ? 'border-primary-400 ring-3 ring-primary-100'
            : 'border-line hover:border-line-strong',
          isDragging && 'border-primary-300 shadow-raised',
        )}
      >
        {numbered && <IndexChip value={index + 1} />}
        {editing ? (
          <InlineTextInput
            initialValue={item.text}
            aria-label={`Edit ${singular} ${index + 1}`}
            onCommit={(value) => onSave(value)}
            onCancel={onCancelEdit}
          />
        ) : (
          <>
            <span
              title={item.text}
              onDoubleClick={onStartEdit}
              className="min-w-0 flex-1 truncate text-[13px] text-ink-body"
            >
              {item.text}
            </span>
            <button
              type="button"
              onClick={onStartEdit}
              aria-label={`Edit ${singular} ${index + 1}: ${item.text}`}
              className="-mr-1 flex size-8 shrink-0 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-surface-sunken hover:text-ink"
            >
              <Pencil className="size-4" aria-hidden />
            </button>
          </>
        )}
      </div>

      <button
        type="button"
        onClick={onDelete}
        aria-label={`Delete ${singular} ${index + 1}: ${item.text}`}
        className="flex size-11 shrink-0 items-center justify-center rounded-control border border-line bg-surface text-danger-500 transition-colors hover:border-danger-50 hover:bg-danger-50"
      >
        <Trash2 className="size-4" aria-hidden />
      </button>
    </li>
  )
}
