/**
 * Next id in a numbered series, e.g. nextSequentialId('PROJ-', ['PROJ-1001', 'PROJ-1004'])
 * → 'PROJ-1005'. Derived from existing ids, so it survives reloads without a counter.
 */
export function nextSequentialId(
  prefix: string,
  existing: (string | undefined)[],
  { start = 1, width = 0 }: { start?: number; width?: number } = {},
) {
  const numbers = existing
    .filter((id): id is string => typeof id === 'string' && id.startsWith(prefix))
    .map((id) => Number(id.slice(prefix.length)))
    .filter(Number.isFinite)
  const next = numbers.length ? Math.max(...numbers) + 1 : start
  return `${prefix}${String(next).padStart(width, '0')}`
}
