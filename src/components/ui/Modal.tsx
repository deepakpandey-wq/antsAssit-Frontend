import { useEffect, useId, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from './Button'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: ReactNode
  description?: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  children?: ReactNode
}

const widths = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' }

/**
 * Built on the native <dialog> element: focus trapping, Escape-to-close and
 * the top layer come for free.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  footer,
  size = 'md',
  children,
}: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose()
      }}
      className={cn(
        'm-auto w-[calc(100%-2rem)] rounded-card border border-line bg-surface p-0 text-ink-body shadow-popover backdrop:bg-ink/30 backdrop:backdrop-blur-[2px] open:animate-pop-in',
        widths[size],
      )}
    >
      <div className={cn('flex items-start gap-4 px-6 pt-5', !children && 'pb-5')}>
        <div className="min-w-0 flex-1">
          <h2 id={titleId} className="text-base font-semibold text-ink">
            {title}
          </h2>
          {description && (
            <p id={descriptionId} className="mt-1 text-[13px] text-ink-muted">
              {description}
            </p>
          )}
        </div>
        <Button variant="ghost" size="icon-sm" aria-label="Close dialog" onClick={onClose}>
          <X />
        </Button>
      </div>
      {children && <div className="px-6 py-4">{children}</div>}
      {footer && (
        <div className="flex justify-end gap-2 border-t border-line bg-surface-muted px-6 py-3.5">
          {footer}
        </div>
      )}
    </dialog>
  )
}
