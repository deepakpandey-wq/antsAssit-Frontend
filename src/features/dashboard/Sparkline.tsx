import { useId } from 'react'

interface SparklineProps {
  points: number[]
  width?: number
  height?: number
  className?: string
}

/** Tiny decorative trend line with a soft area fill (success green, per the reference). */
export function Sparkline({ points, width = 84, height = 36, className }: SparklineProps) {
  const gradientId = useId()
  if (points.length < 2) return null

  const min = Math.min(...points)
  const max = Math.max(...points)
  const span = max - min || 1
  const pad = 3
  const coords = points.map((value, index) => {
    const x = (index / (points.length - 1)) * width
    const y = pad + (1 - (value - min) / span) * (height - pad * 2)
    return [x, y] as const
  })
  const line = coords
    .map(([x, y], index) => `${index ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(' ')
  const area = `${line} L${width},${height} L0,${height} Z`

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      aria-hidden
      className={className}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-success-500)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--color-success-500)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradientId})`} />
      <path
        d={line}
        fill="none"
        stroke="var(--color-success-500)"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
