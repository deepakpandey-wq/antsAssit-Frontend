import { useCallback, useEffect, useState, type RefObject } from 'react'

/** Calls `handler` on pointerdown outside every given element, or on Escape. */
export function useDismiss(
  refs: RefObject<HTMLElement | null>[],
  handler: () => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node
      if (refs.every((ref) => !ref.current?.contains(target))) handler()
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handler()
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [refs, handler, enabled])
}

/** Copies text to the clipboard; `copied` stays true for a moment for button feedback. */
export function useCopyToClipboard(resetMs = 1500) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), resetMs)
    return () => clearTimeout(timer)
  }, [copied, resetMs])

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      return true
    } catch {
      return false // clipboard unavailable (insecure context, denied permission)
    }
  }, [])

  return { copied, copy }
}
