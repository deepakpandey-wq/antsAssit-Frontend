import { CircleAlert } from 'lucide-react'

/** Step-level validation message shown when Next is blocked. */
export function StepError({ message }: { message: string }) {
  return (
    <p role="alert" className="mt-4 flex items-center gap-2 text-[13px] text-danger-500">
      <CircleAlert className="size-4 shrink-0" aria-hidden />
      {message}
    </p>
  )
}
