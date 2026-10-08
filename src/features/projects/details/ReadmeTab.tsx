import { FileText } from 'lucide-react'
import { Card, Markdown } from '@/components/ui'
import { CopyButton } from './CopyButton'

export function ReadmeTab({ readme }: { readme: string }) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-2 border-b border-line px-5 py-3">
        <FileText className="size-4 text-ink-muted" aria-hidden />
        <p className="flex-1 font-mono text-xs text-ink">README.md</p>
        <CopyButton text={readme} label="Copy README markdown" />
      </div>
      <article aria-label="README preview" className="max-w-3xl px-6 py-6">
        <Markdown source={readme} />
      </article>
    </Card>
  )
}
