import { useMemo, useState } from 'react'
import { ChevronRight, File, Folder, FolderOpen } from 'lucide-react'
import { Card } from '@/components/ui'
import { formatBytes } from '@/lib/download'
import { cn } from '@/lib/cn'
import type { ProjectFile } from '../content'
import { buildFileTree, type TreeNode } from '../fileTree'
import { CopyButton } from './CopyButton'

interface ProjectStructureProps {
  slug: string
  files: ProjectFile[]
  selectedPath: string
  onSelect: (path: string) => void
}

/** File tree (all folders open by default) + read-only preview of the selected file. */
export function ProjectStructure({ slug, files, selectedPath, onSelect }: ProjectStructureProps) {
  const tree = useMemo(() => buildFileTree(files.map((file) => file.path)), [files])
  const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set())
  const selected = files.find((file) => file.path === selectedPath) ?? files[0]
  const encoder = useMemo(() => new TextEncoder(), [])

  const toggle = (path: string) =>
    setCollapsed((current) => {
      const next = new Set(current)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return next
    })

  const renderNodes = (nodes: TreeNode[], depth: number) => (
    <ul className="space-y-0.5">
      {nodes.map((node) => {
        const indent = { paddingLeft: `${depth * 12 + 8}px` }
        if (node.children) {
          const open = !collapsed.has(node.path)
          return (
            <li key={node.path}>
              <button
                type="button"
                aria-expanded={open}
                onClick={() => toggle(node.path)}
                style={indent}
                className="flex h-8 w-full items-center gap-1.5 rounded-md pr-2 text-left text-[13px] font-medium text-ink-body hover:bg-surface-sunken"
              >
                <ChevronRight
                  aria-hidden
                  className={cn(
                    'size-3.5 shrink-0 text-ink-subtle transition-transform',
                    open && 'rotate-90',
                  )}
                />
                {open ? (
                  <FolderOpen className="size-4 shrink-0 text-warning-500" aria-hidden />
                ) : (
                  <Folder className="size-4 shrink-0 text-warning-500" aria-hidden />
                )}
                <span className="truncate">{node.name}</span>
              </button>
              {open && renderNodes(node.children, depth + 1)}
            </li>
          )
        }
        const active = node.path === selected.path
        return (
          <li key={node.path}>
            <button
              type="button"
              aria-current={active ? 'true' : undefined}
              onClick={() => onSelect(node.path)}
              style={{ paddingLeft: `${depth * 12 + 26}px` }}
              className={cn(
                'flex h-8 w-full items-center gap-1.5 rounded-md pr-2 text-left text-[13px] transition-colors',
                active
                  ? 'bg-primary-50 font-semibold text-primary-700'
                  : 'text-ink-body hover:bg-surface-sunken',
              )}
            >
              <File
                className={cn('size-4 shrink-0', active ? 'text-primary-600' : 'text-ink-subtle')}
                aria-hidden
              />
              <span className="truncate">{node.name}</span>
            </button>
          </li>
        )
      })}
    </ul>
  )

  const lines = selected.content.replace(/\n$/, '').split('\n')

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[17rem_minmax(0,1fr)]">
      <Card className="p-3">
        <p className="flex items-center gap-2 px-2 pt-1 pb-2 text-[13px] font-semibold text-ink">
          <FolderOpen className="size-4 text-warning-500" aria-hidden />
          {slug}
        </p>
        <nav aria-label="Project files" className="max-h-[30rem] overflow-y-auto">
          {renderNodes(tree, 0)}
        </nav>
      </Card>

      <Card className="flex min-w-0 flex-col overflow-hidden">
        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <p className="min-w-0 flex-1 truncate font-mono text-xs text-ink">{selected.path}</p>
          <span className="shrink-0 text-xs text-ink-muted">
            {formatBytes(encoder.encode(selected.content).length)}
          </span>
          <CopyButton text={selected.content} label={`Copy ${selected.path}`} />
        </div>
        <pre
          aria-label={`Contents of ${selected.path}`}
          tabIndex={0}
          className="max-h-[30rem] flex-1 overflow-auto bg-surface-muted py-3 font-mono text-[12px] leading-6"
        >
          {lines.map((line, index) => (
            <div key={index} className="flex">
              <span
                aria-hidden
                className="w-12 shrink-0 pr-4 text-right text-ink-subtle select-none"
              >
                {index + 1}
              </span>
              <code className="pr-4 whitespace-pre text-ink-body">{line || ' '}</code>
            </div>
          ))}
        </pre>
      </Card>
    </div>
  )
}
