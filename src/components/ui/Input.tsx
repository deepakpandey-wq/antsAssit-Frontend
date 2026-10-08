import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { controlClasses } from './styles'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leadingIcon?: ReactNode
  trailing?: ReactNode
  inputSize?: 'md' | 'lg'
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { leadingIcon, trailing, inputSize = 'md', className, ...props },
  ref,
) {
  return (
    <div className="relative w-full">
      {leadingIcon && (
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-ink-subtle [&_svg]:size-4">
          {leadingIcon}
        </span>
      )}
      <input
        ref={ref}
        className={cn(
          controlClasses,
          inputSize === 'md' ? 'h-10' : 'h-11',
          leadingIcon ? 'pl-9' : 'pl-3.5',
          trailing ? 'pr-10' : 'pr-3.5',
          className,
        )}
        {...props}
      />
      {trailing && <span className="absolute inset-y-0 right-2 flex items-center">{trailing}</span>}
    </div>
  )
})
