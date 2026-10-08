import { ArrowLeft, Hammer } from 'lucide-react'
import { PageHeader } from '@/components/layout'
import { ButtonLink, Card, EmptyState } from '@/components/ui'

interface ComingSoonPageProps {
  title: string
  description: string
}

/** Placeholder for routes that are reachable from navigation but not yet built. */
export function ComingSoonPage({ title, description }: ComingSoonPageProps) {
  return (
    <>
      <PageHeader title={title} description={description} documentTitle={title} />
      <Card>
        <EmptyState
          icon={<Hammer />}
          title={`${title} is on the way`}
          description="This area is not part of the current release. Everything you need to create assessments and generate projects is available from the dashboard."
          action={
            <ButtonLink to="/dashboard" variant="secondary" leftIcon={<ArrowLeft />}>
              Back to dashboard
            </ButtonLink>
          }
        />
      </Card>
    </>
  )
}
