/** Saves bytes as a file via a temporary object URL. */
export function downloadBytes(bytes: Uint8Array, filename: string, type = 'application/zip') {
  const url = URL.createObjectURL(new Blob([bytes as BlobPart], { type }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.append(link)
  link.click()
  link.remove()
  // Revoke after the click has been handled so the download can start.
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

const UNITS = ['B', 'KB', 'MB', 'GB']

/** 12345 → "12.1 KB" */
export function formatBytes(bytes: number) {
  let value = bytes
  let unit = 0
  while (value >= 1024 && unit < UNITS.length - 1) {
    value /= 1024
    unit++
  }
  return `${unit === 0 ? value : value.toFixed(1)} ${UNITS[unit]}`
}
