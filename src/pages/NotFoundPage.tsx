import { ArrowLeft, Compass } from 'lucide-react'
import { PageHeader } from '@/components/layout'
import { ButtonLink, Card, EmptyState } from '@/components/ui'

export function NotFoundPage() {
  return (
    <>
      <PageHeader title="Page not found" documentTitle="Not found" />
      <Card>
        <EmptyState
          icon={<Compass />}
          title="We couldn’t find that page"
          description="The link may be broken or the page may have moved."
          action={
            <ButtonLink to="/dashboard" leftIcon={<ArrowLeft />}>
              Go to dashboard
            </ButtonLink>
          }
        />
      </Card>
    </>
  )
}
