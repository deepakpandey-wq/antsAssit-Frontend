import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * Renders a small, safe Markdown subset as React elements (no HTML injection):
 * headings (#, ##, ###), "- " lists, fenced code blocks, paragraphs, **bold**, `code`.
 * Headings are shifted down one level so a document never competes with the page <h1>.
 */
export function Markdown({ source, className }: { source: string; className?: string }) {
  return (
    <div className={cn('space-y-3 text-[13px] leading-relaxed text-ink-body', className)}>
      {parse(source)}
    </div>
  )
}

function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4)
      return (
        <strong key={index} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      )
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2)
      return (
        <code
          key={index}
          className="rounded bg-surface-sunken px-1 py-0.5 font-mono text-[12px] text-ink"
        >
          {part.slice(1, -1)}
        </code>
      )
    return part
  })
}

function parse(source: string): ReactNode[] {
  const lines = source.replace(/\r\n/g, '\n').split('\n')
  const blocks: ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('```')) {
      const code: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) code.push(lines[i++])
      i++ // closing fence
      blocks.push(
        <pre
          key={blocks.length}
          className="overflow-x-auto rounded-control bg-terminal px-4 py-3 font-mono text-[12px] leading-6 text-terminal-text"
        >
          <code>{code.join('\n')}</code>
        </pre>,
      )
      continue
    }

    const heading = /^(#{1,3}) (.*)$/.exec(line)
    if (heading) {
      const level = heading[1].length
      const text = inline(heading[2])
      blocks.push(
        level === 1 ? (
          <h2 key={blocks.length} className="text-xl font-bold tracking-tight text-ink">
            {text}
          </h2>
        ) : level === 2 ? (
          <h3
            key={blocks.length}
            className="border-b border-line pt-3 pb-1.5 text-[15px] font-semibold text-ink"
          >
            {text}
          </h3>
        ) : (
          <h4 key={blocks.length} className="pt-1 text-[13px] font-semibold text-ink">
            {text}
          </h4>
        ),
      )
      i++
      continue
    }

    if (line.startsWith('- ')) {
      const items: string[] = []
      while (i < lines.length && lines[i].startsWith('- ')) items.push(lines[i++].slice(2))
      blocks.push(
        <ul key={blocks.length} className="list-disc space-y-1 pl-5 marker:text-ink-subtle">
          {items.map((item, index) => (
            <li key={index}>{inline(item)}</li>
          ))}
        </ul>,
      )
      continue
    }

    if (!line.trim()) {
      i++
      continue
    }

    const paragraph: string[] = []
    while (i < lines.length && lines[i].trim() && !/^(#{1,3} |- |```)/.test(lines[i])) {
      paragraph.push(lines[i++])
    }
    blocks.push(<p key={blocks.length}>{inline(paragraph.join(' '))}</p>)
  }

  return blocks
}
