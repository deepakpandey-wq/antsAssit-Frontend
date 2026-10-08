import { useRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface InlineTextInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onSubmit' | 'defaultValue'
> {
  initialValue?: string
  /** Enter, or blur with a value. Return true to keep the input open (rapid entry). */
  onCommit: (value: string) => boolean | void
  /** Escape, or blur while empty. */
  onCancel: () => void
}

/**
 * Bare text input for in-place editing. Enter commits, Escape cancels, blur commits
 * when there is text. Rendered inside a row that already provides the field chrome.
 */
export function InlineTextInput({
  initialValue = '',
  onCommit,
  onCancel,
  className,
  ...props
}: InlineTextInputProps) {
  const settledRef = useRef(false)

  const commit = (input: HTMLInputElement) => {
    const value = input.value.trim()
    if (!value) {
      settledRef.current = true
      onCancel()
      return
    }
    const keepOpen = onCommit(value) === true
    if (keepOpen) input.value = ''
    else settledRef.current = true
  }

  return (
    <input
      // Focus follows an explicit user action (Add / Edit), so autofocus is expected here.
      autoFocus
      defaultValue={initialValue}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault()
          commit(event.currentTarget)
        } else if (event.key === 'Escape') {
          event.preventDefault()
          event.stopPropagation()
          settledRef.current = true
          onCancel()
        }
      }}
      onBlur={(event) => {
        // Unmounting after Enter/Escape can still fire blur in some browsers.
        if (!settledRef.current) commit(event.currentTarget)
      }}
      className={cn(
        'h-full min-w-0 flex-1 bg-transparent text-[13px] text-ink placeholder:text-ink-subtle focus:outline-none',
        className,
      )}
      {...props}
    />
  )
}
