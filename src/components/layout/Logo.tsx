import { Link } from 'react-router'

export function LogoMark({ className = 'size-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden className={className}>
      <path d="M16 4.5 3.5 27.5h5.4L16 14.3l7.1 13.2h5.4L16 4.5Z" fill="var(--color-ink)" />
      <path d="M16 4.5 3.5 27.5h5.4L16 14.3V4.5Z" fill="var(--color-primary-500)" />
      <path d="M12.2 27.5 16 20.4l3.8 7.1h-7.6Z" fill="var(--color-primary-400)" />
    </svg>
  )
}

export function Logo() {
  return (
    <Link
      to="/dashboard"
      className="flex items-center gap-2.5 rounded-control text-[15px] font-bold tracking-tight text-ink"
    >
      <LogoMark />
      Ants Assessment
    </Link>
  )
}
