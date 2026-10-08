import { useState, type KeyboardEvent } from 'react'
import { cn } from '@/lib/cn'
import { controlClasses } from './styles'
import { Tag } from './Tag'

export interface TagAddResult {
  /** Clear the input after handling. */
  clear: boolean
  message?: string
  tone?: 'info' | 'error'
}

interface TagInputProps {
  id: string
  tags: string[]
  onAdd: (value: string) => TagAddResult
  onRemove: (tag: string) => void
  placeholder?: string
  maxLength?: number
  /** Accessible name for the tag list. */
  listLabel: string
}

/** Text input that turns Enter / comma into tags; Backspace on empty removes the last tag. */
export function TagInput({
  id,
  tags,
  onAdd,
  onRemove,
  placeholder,
  maxLength = 40,
  listLabel,
}: TagInputProps) {
  const [value, setValue] = useState('')
  const [feedback, setFeedback] = useState<{ message: string; tone: 'info' | 'error' } | null>(null)

  const submit = () => {
    if (!value.trim()) return
    const result = onAdd(value.trim())
    if (result.clear) setValue('')
    setFeedback(result.message ? { message: result.message, tone: result.tone ?? 'info' } : null)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      submit()
    } else if (event.key === 'Backspace' && !value && tags.length) {
      onRemove(tags[tags.length - 1])
    }
  }

  return (
    <div>
      <input
        id={id}
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        autoComplete="off"
        aria-describedby={feedback ? `${id}-feedback` : undefined}
        aria-invalid={feedback?.tone === 'error' ? true : undefined}
        onChange={(event) => {
          setValue(event.target.value)
          if (feedback) setFeedback(null)
        }}
        onKeyDown={onKeyDown}
        className={cn(controlClasses, 'h-10 px-3.5')}
      />
      <p
        id={`${id}-feedback`}
        aria-live="polite"
        className={cn(
          'mt-1.5 min-h-4 text-xs',
          feedback?.tone === 'error' ? 'text-danger-500' : 'text-ink-muted',
        )}
      >
        {feedback?.message}
      </p>
      {tags.length > 0 && (
        <ul aria-label={listLabel} className="mt-1 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li key={tag}>
              <Tag label={tag} onRemove={() => onRemove(tag)} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
