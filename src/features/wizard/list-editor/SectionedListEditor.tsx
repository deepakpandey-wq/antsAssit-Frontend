import { useEffect, useState } from 'react'
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type Announcements,
  type DragEndEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Ellipsis, FolderPlus, Pencil, Plus, Trash2, Undo2 } from 'lucide-react'
import {
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  DropdownSeparator,
  EmptyState,
  Modal,
} from '@/components/ui'
import { cn } from '@/lib/cn'
import type { ListItem, ListKey } from '@/types'
import { StepError } from '../components/StepError'
import { useAssessmentDraft } from '../store'
import { InlineTextInput } from './InlineTextInput'
import { SectionNav } from './SectionNav'
import { sectionIcons } from './sectionIcons'
import { IndexChip, SortableItemRow } from './SortableItemRow'
import { rowFieldClasses } from './styles'
import { pluralize, type ListEditorCopy } from './types'

interface SectionedListEditorProps {
  list: ListKey
  copy: ListEditorCopy
  /** Show 1, 2, 3… chips before each item (competencies). */
  numbered?: boolean
  /** Step-level validation message (e.g. "add at least one …"). */
  error?: string
}

interface DeletedItem {
  sectionId: string
  item: ListItem
  index: number
}

/**
 * The shared "List Editor": sections on the left, the selected section's ordered
 * items on the right with add / inline edit / delete (with undo) / drag-to-reorder.
 */
export function SectionedListEditor({
  list,
  copy,
  numbered = false,
  error,
}: SectionedListEditorProps) {
  const sections = useAssessmentDraft((state) => state.draft[list])
  const actions = useAssessmentDraft.getState()

  const [selectedId, setSelectedId] = useState(sections[0]?.id)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [newRowKey, setNewRowKey] = useState(0)
  const [renaming, setRenaming] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [lastDeleted, setLastDeleted] = useState<DeletedItem | null>(null)

  // Fall back to the first section if the selected one was removed.
  const section = sections.find((entry) => entry.id === selectedId) ?? sections[0]
  const items = section?.items ?? []

  useEffect(() => {
    if (!lastDeleted) return
    const timer = setTimeout(() => setLastDeleted(null), 6000)
    return () => clearTimeout(timer)
  }, [lastDeleted])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const selectSection = (id: string) => {
    setSelectedId(id)
    setEditingId(null)
    setAdding(false)
    setRenaming(false)
  }

  const startAdding = () => {
    setEditingId(null)
    setAdding(true)
    setNewRowKey((key) => key + 1)
  }

  const deleteItem = (item: ListItem, index: number) => {
    if (!section) return
    actions.removeItem(list, section.id, item.id)
    setLastDeleted({ sectionId: section.id, item, index })
    if (editingId === item.id) setEditingId(null)
  }

  const undoDelete = () => {
    if (!lastDeleted) return
    actions.insertItem(list, lastDeleted.sectionId, lastDeleted.item, lastDeleted.index)
    setSelectedId(lastDeleted.sectionId)
    setLastDeleted(null)
  }

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!section || !over || active.id === over.id) return
    const from = items.findIndex((item) => item.id === active.id)
    const to = items.findIndex((item) => item.id === over.id)
    if (from !== -1 && to !== -1) actions.moveItem(list, section.id, from, to)
  }

  /** Screen-reader label for an item: its quoted text. */
  const label = (id: UniqueIdentifier) => {
    const item = items.find((entry) => entry.id === id)
    return item ? `“${item.text}”` : `The ${copy.singular}`
  }
  const position = (id: UniqueIdentifier) => items.findIndex((item) => item.id === id) + 1
  const announcements: Announcements = {
    onDragStart: ({ active }) => `Picked up ${copy.singular} ${label(active.id)}.`,
    onDragOver: ({ active, over }) =>
      over
        ? `${label(active.id)} moved to position ${position(over.id)} of ${items.length}.`
        : undefined,
    onDragEnd: ({ active, over }) =>
      over
        ? `${label(active.id)} dropped at position ${position(over.id)} of ${items.length}.`
        : undefined,
    onDragCancel: ({ active }) => `Reordering cancelled. ${label(active.id)} was not moved.`,
  }

  const SectionIcon = section ? sectionIcons[section.icon].icon : null

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[16.5rem_minmax(0,1fr)]">
      <SectionNav
        sections={sections}
        selectedId={section?.id}
        onSelect={selectSection}
        onAddSection={(name) => selectSection(actions.addSection(list, name))}
      />

      <div className="min-w-0 rounded-card border border-line bg-surface p-4 shadow-card sm:p-5">
        {!section ? (
          <EmptyState
            icon={<FolderPlus />}
            title="No sections yet"
            description={`Create a section (e.g. “Core Java”) to start adding ${copy.plural}.`}
            className="py-10"
            action={
              <Button
                leftIcon={<Plus />}
                onClick={() => selectSection(actions.addSection(list, 'General'))}
              >
                Create “General” section
              </Button>
            }
          />
        ) : (
          <>
            <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2">
              {SectionIcon && (
                <SectionIcon className="size-5 shrink-0 text-ink" strokeWidth={2} aria-hidden />
              )}
              {renaming ? (
                <div className="flex h-9 min-w-48 flex-1 items-center rounded-control border border-primary-400 px-3 ring-3 ring-primary-100">
                  <InlineTextInput
                    initialValue={section.name}
                    aria-label="Section name"
                    maxLength={40}
                    className="text-base font-semibold"
                    onCommit={(name) => {
                      actions.renameSection(list, section.id, name)
                      setRenaming(false)
                    }}
                    onCancel={() => setRenaming(false)}
                  />
                </div>
              ) : (
                <h3 className="truncate text-base font-semibold text-ink">{section.name}</h3>
              )}
              <Badge tone="primary" shape="pill">
                {pluralize(items.length, copy)}
              </Badge>

              <div className="ml-auto flex items-center gap-1.5">
                <Dropdown
                  trigger={(props) => (
                    <Button
                      {...props}
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Section options for ${section.name}`}
                    >
                      <Ellipsis />
                    </Button>
                  )}
                >
                  {(close) => (
                    <>
                      <DropdownItem
                        icon={<Pencil />}
                        onSelect={() => {
                          close()
                          setRenaming(true)
                        }}
                      >
                        Rename section
                      </DropdownItem>
                      <DropdownSeparator />
                      <DropdownItem
                        icon={<Trash2 />}
                        tone="danger"
                        onSelect={() => {
                          close()
                          if (items.length) setConfirmDelete(true)
                          else actions.removeSection(list, section.id)
                        }}
                      >
                        Delete section
                      </DropdownItem>
                    </>
                  )}
                </Dropdown>
                <Button size="sm" leftIcon={<Plus />} onClick={startAdding}>
                  Add
                </Button>
              </div>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={onDragEnd}
              accessibility={{ announcements }}
            >
              <SortableContext items={items} strategy={verticalListSortingStrategy}>
                <ol aria-label={`${section.name} ${copy.plural}`} className="space-y-2">
                  {items.map((item, index) => (
                    <SortableItemRow
                      key={item.id}
                      item={item}
                      index={index}
                      numbered={numbered}
                      singular={copy.singular}
                      editing={editingId === item.id}
                      onStartEdit={() => {
                        setAdding(false)
                        setEditingId(item.id)
                      }}
                      onSave={(text) => {
                        actions.updateItem(list, section.id, item.id, text)
                        setEditingId(null)
                      }}
                      onCancelEdit={() => setEditingId(null)}
                      onDelete={() => deleteItem(item, index)}
                    />
                  ))}

                  {adding && (
                    <li className="flex items-center gap-2">
                      <span className="w-6 shrink-0" aria-hidden />
                      <div
                        className={cn(
                          rowFieldClasses,
                          'border-primary-400 ring-3 ring-primary-100',
                        )}
                      >
                        {numbered && <IndexChip value={items.length + 1} />}
                        <InlineTextInput
                          key={newRowKey}
                          aria-label={`New ${copy.singular}`}
                          placeholder={copy.placeholder}
                          maxLength={200}
                          onCommit={(text) => {
                            actions.addItem(list, section.id, text)
                            return true // stay open for rapid entry
                          }}
                          onCancel={() => setAdding(false)}
                        />
                      </div>
                      <span className="size-11 shrink-0" aria-hidden />
                    </li>
                  )}
                </ol>
              </SortableContext>
            </DndContext>

            {items.length === 0 && !adding && (
              <p className="rounded-control border border-dashed border-line-strong px-4 py-6 text-center text-[13px] text-ink-muted">
                No {copy.plural} in this section yet.
              </p>
            )}

            {adding ? (
              <p className="mt-3 pl-8 text-xs text-ink-muted">
                Press <kbd className="font-sans font-semibold">Enter</kbd> to add,{' '}
                <kbd className="font-sans font-semibold">Esc</kbd> to finish.
              </p>
            ) : (
              <button
                type="button"
                onClick={startAdding}
                className="mt-3 inline-flex items-center gap-2 rounded-md py-1 pl-8 text-[13px] font-semibold text-primary-600 transition-colors hover:text-primary-700"
              >
                <Plus className="size-4" aria-hidden />
                {copy.addAnother}
              </button>
            )}
          </>
        )}

        <div aria-live="polite" className="empty:hidden">
          {lastDeleted && (
            <div className="mt-4 flex animate-pop-in items-center gap-3 rounded-control bg-night px-4 py-2.5 text-[13px] text-white shadow-raised">
              <span className="min-w-0 flex-1 truncate">Deleted “{lastDeleted.item.text}”</span>
              <button
                type="button"
                onClick={undoDelete}
                className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-primary-300 hover:text-primary-200"
              >
                <Undo2 className="size-4" aria-hidden />
                Undo
              </button>
            </div>
          )}
        </div>

        {error && <StepError message={error} />}
      </div>

      {section && (
        <Modal
          open={confirmDelete}
          onClose={() => setConfirmDelete(false)}
          size="sm"
          title={`Delete “${section.name}”?`}
          description={`This removes the section and its ${pluralize(items.length, copy)}.`}
          footer={
            <>
              <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  actions.removeSection(list, section.id)
                  setConfirmDelete(false)
                }}
              >
                Delete section
              </Button>
            </>
          }
        />
      )}
    </div>
  )
}
