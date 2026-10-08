import { useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router'
import { ClipboardList, FileCheck2, Search, UserRound } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useDismiss } from '@/lib/hooks'
import { searchService } from '@/services/searchService'
import type { SearchResult } from '@/types'

const kindIcon: Record<SearchResult['kind'], typeof Search> = {
  assessment: ClipboardList,
  project: FileCheck2,
  candidate: UserRound,
}

/** Global header search (combobox pattern). ⌘K / Ctrl+K focuses it from anywhere. */
export function SearchBar({ className }: { className?: string }) {
  const navigate = useNavigate()
  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const results = useMemo(() => searchService.search(query), [query])
  const showPanel = open && query.trim().length > 0
  const refs = useMemo(() => [rootRef], [])
  const close = useCallback(() => setOpen(false), [])
  useDismiss(refs, close, showPanel)

  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        inputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const select = (result: SearchResult) => {
    navigate(result.href)
    setQuery('')
    setOpen(false)
    inputRef.current?.blur()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (!results.length) return
      event.preventDefault()
      setOpen(true)
      const delta = event.key === 'ArrowDown' ? 1 : -1
      setActiveIndex((index) => (index + delta + results.length) % results.length)
    } else if (event.key === 'Enter' && showPanel && results[activeIndex]) {
      event.preventDefault()
      select(results[activeIndex])
    } else if (event.key === 'Escape') {
      setQuery('')
      setOpen(false)
    }
  }

  return (
    <div ref={rootRef} className={cn('relative w-full max-w-md', className)}>
      <Search
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-subtle"
      />
      <input
        ref={inputRef}
        type="search"
        role="combobox"
        aria-label="Search assessments, projects, candidates"
        aria-expanded={showPanel}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={
          showPanel && results[activeIndex] ? `${listId}-${activeIndex}` : undefined
        }
        placeholder="Search assessments, projects, candidates..."
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          setActiveIndex(0)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        className="h-10 w-full rounded-control border border-transparent bg-surface-sunken pr-14 pl-10 text-[13px] text-ink transition-[border-color,background-color,box-shadow] placeholder:text-ink-subtle hover:border-line-strong focus:border-primary-300 focus:bg-surface focus:ring-3 focus:ring-primary-100 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
      />
      <kbd className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 rounded-md border border-line-strong bg-surface px-1.5 py-0.5 font-sans text-[11px] font-medium text-ink-subtle sm:block">
        ⌘K
      </kbd>

      {showPanel && (
        <div className="absolute top-full right-0 left-0 z-40 mt-2 animate-pop-in overflow-hidden rounded-control border border-line bg-surface shadow-popover">
          <ul
            id={listId}
            role="listbox"
            aria-label="Search results"
            className="max-h-80 overflow-y-auto p-1.5"
          >
            {results.map((result, index) => {
              const Icon = kindIcon[result.kind]
              return (
                <li
                  key={`${result.kind}-${result.id}`}
                  id={`${listId}-${index}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  onPointerDown={(event) => event.preventDefault()}
                  onClick={() => select(result)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2',
                    index === activeIndex && 'bg-surface-sunken',
                  )}
                >
                  <span className="flex size-8 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-medium text-ink">
                      {result.title}
                    </span>
                    <span className="block truncate text-xs text-ink-muted">{result.subtitle}</span>
                  </span>
                </li>
              )
            })}
          </ul>
          {results.length === 0 && (
            <p className="px-4 py-6 text-center text-[13px] text-ink-muted">
              No results for “{query.trim()}”
            </p>
          )}
        </div>
      )}
    </div>
  )
}
