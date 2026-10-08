import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui'
import { useCopyToClipboard } from '@/lib/hooks'

export function CopyButton({ text, label }: { text: string; label: string }) {
  const { copied, copy } = useCopyToClipboard()
  return (
    <Button
      variant="secondary"
      size="sm"
      aria-label={label}
      leftIcon={copied ? <Check className="text-success-500" /> : <Copy />}
      onClick={() => copy(text)}
    >
      <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
    </Button>
  )
}
