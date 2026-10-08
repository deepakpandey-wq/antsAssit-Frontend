const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

/** "2025-03-12" → "12 Mar 2025" (matches the reference tables). */
export function formatDate(iso: string) {
  return dateFormatter.format(new Date(iso))
}

export function greetingFor(date = new Date()) {
  const hour = date.getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

const clockFormatter = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
})

/** 24h "HH:MM:SS" — terminal log timestamps. */
export function formatClock(date: Date) {
  return clockFormatter.format(date)
}

/** 9400 → "about 10 seconds"; rounds up so it never says 0 while work remains. */
export function formatRemaining(ms: number) {
  const seconds = Math.max(1, Math.ceil(ms / 1000))
  if (seconds < 60) return `about ${seconds} second${seconds === 1 ? '' : 's'}`
  const minutes = Math.ceil(seconds / 60)
  return `about ${minutes} minute${minutes === 1 ? '' : 's'}`
}

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
})

/** "12 Mar 2025 12:15 PM" (matches the reference). */
export function formatDateTime(iso: string) {
  return `${formatDate(iso)} ${timeFormatter.format(new Date(iso))}`
}
