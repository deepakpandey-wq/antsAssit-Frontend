import { useEffect, useRef } from 'react'
import { formatClock } from '@/lib/format'
import type { GenerationSnapshot } from '../generationPlan'

interface TerminalLogProps {
  logs: GenerationSnapshot['logs']
  startedAt: string
  running: boolean
}

/** Terminal-style generation log; follows the newest line. */
export function TerminalLog({ logs, startedAt, running }: TerminalLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const start = Date.parse(startedAt)

  useEffect(() => {
    const element = scrollRef.current
    if (element) element.scrollTop = element.scrollHeight
  }, [logs.length])

  return (
    <div
      ref={scrollRef}
      role="log"
      aria-label="Generation log"
      aria-live="polite"
      tabIndex={0}
      className="h-72 overflow-y-auto rounded-card bg-terminal p-5 font-mono text-[12.5px] leading-6 text-terminal-text shadow-raised focus-visible:outline-offset-2"
    >
      {logs.map((log) => (
        <p key={`${log.offset}-${log.text}`} className="animate-fade-in whitespace-pre-wrap">
          <span className="text-terminal-muted select-none">
            [{formatClock(new Date(start + log.offset))}]
          </span>{' '}
          {log.text}
          {log.success && (
            <span className="ml-1.5 text-terminal-success" aria-label="done">
              ✓
            </span>
          )}
        </p>
      ))}
      {running && (
        <span
          aria-hidden
          className="mt-0.5 inline-block h-4 w-2 animate-pulse bg-terminal-text/80 align-middle"
        />
      )}
    </div>
  )
}
