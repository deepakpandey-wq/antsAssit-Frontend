import { ClipboardCheck, Plus } from 'lucide-react'
import { ButtonLink, CtaPanel } from '@/components/ui'

/** Decorative low-poly shapes, drawn in primary tints (no raster assets needed). */
function CtaArtwork() {
  return (
    <svg
      viewBox="0 0 260 180"
      aria-hidden
      className="pointer-events-none absolute right-2 bottom-0 hidden h-[88%] w-auto opacity-80 xl:block"
    >
      <defs>
        <linearGradient id="cta-face-light" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-primary-100)" />
          <stop offset="100%" stopColor="var(--color-primary-50)" />
        </linearGradient>
        <linearGradient id="cta-face-dark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-primary-200)" />
          <stop offset="100%" stopColor="var(--color-primary-100)" />
        </linearGradient>
      </defs>
      {/* large pyramid */}
      <polygon points="150,22 92,180 150,180" fill="url(#cta-face-light)" />
      <polygon points="150,22 150,180 222,180" fill="url(#cta-face-dark)" />
      {/* small pyramid */}
      <polygon points="222,96 192,180 222,180" fill="url(#cta-face-light)" opacity="0.9" />
      <polygon points="222,96 222,180 256,180" fill="url(#cta-face-dark)" opacity="0.9" />
      {/* floating cube */}
      <polygon points="214,30 232,20 250,30 232,40" fill="var(--color-primary-100)" />
      <polygon points="214,30 232,40 232,60 214,50" fill="var(--color-primary-200)" />
      <polygon points="232,40 250,30 250,50 232,60" fill="var(--color-primary-200)" opacity="0.8" />
      {/* soft orb */}
      <circle cx="78" cy="150" r="12" fill="var(--color-primary-100)" opacity="0.9" />
    </svg>
  )
}

export function CreateAssessmentCta() {
  return (
    <CtaPanel
      artwork={<CtaArtwork />}
      icon={<ClipboardCheck strokeWidth={1.75} />}
      title="Create a New Assessment"
      description="Define job requirements, select technologies and generate a customized interview project with test cases."
      action={
        <ButtonLink
          to="/assessments/create/basic-info"
          variant="dark"
          size="lg"
          leftIcon={<Plus />}
        >
          Create Assessment
        </ButtonLink>
      }
    />
  )
}
