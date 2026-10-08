import { CircleCheck, Clock, Gauge, Sparkles } from 'lucide-react'
import { Badge, IconTile } from '@/components/ui'
import type { ComplexityPreview } from '../complexity'

/** "Project Complexity Preview" — what the generated project will include. */
export function ComplexityPreviewPanel({ preview }: { preview: ComplexityPreview | null }) {
  return (
    <section
      aria-labelledby="complexity-title"
      aria-live="polite"
      className="rounded-card border border-line bg-surface-muted p-5"
    >
      <div className="flex flex-wrap items-start gap-4">
        <IconTile tone="primary" size="lg">
          <Sparkles strokeWidth={1.75} />
        </IconTile>
        <div className="min-w-0 flex-1">
          <h3 id="complexity-title" className="text-sm font-semibold text-ink">
            Project Complexity Preview
          </h3>
          <p className="mt-0.5 text-[13px] text-ink-muted">
            {preview
              ? 'Based on your selection, the generated project will include:'
              : 'Select a company level and a candidate level to preview the project scope.'}
          </p>
        </div>
        {preview && (
          <div className="flex flex-wrap gap-2">
            <Badge tone="primary" shape="pill">
              <Gauge className="size-3.5" aria-hidden />
              {preview.tier} complexity
            </Badge>
            <Badge tone="neutral" shape="pill">
              <Clock className="size-3.5" aria-hidden />
              {preview.estimate}
            </Badge>
          </div>
        )}
      </div>

      {preview && (
        <ul className="mt-4 gap-x-8 sm:columns-2 sm:pl-16">
          {preview.features.map((feature) => (
            <li
              key={feature}
              className="flex break-inside-avoid items-center gap-2.5 py-1.5 text-[13px] text-ink-body"
            >
              <CircleCheck
                className="size-4 shrink-0 fill-primary-600 text-white"
                strokeWidth={2.5}
                aria-hidden
              />
              {feature}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
