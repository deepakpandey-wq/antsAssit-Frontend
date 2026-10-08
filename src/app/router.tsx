import { createBrowserRouter, Navigate, type RouteObject } from 'react-router'
import { AppShell } from '@/components/layout'
import { WizardLayout } from '@/features/wizard/components/WizardLayout'
import { ComingSoonPage } from '@/pages/ComingSoonPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { GeneratedProjectsPage } from '@/pages/GeneratedProjectsPage'
import { GeneratingPage } from '@/pages/GeneratingPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ProjectDetailsPage } from '@/pages/ProjectDetailsPage'
import { BasicInfoPage } from '@/pages/wizard/BasicInfoPage'
import { CompanyLevelPage } from '@/pages/wizard/CompanyLevelPage'
import { CompetenciesPage } from '@/pages/wizard/CompetenciesPage'
import { ResponsibilitiesPage } from '@/pages/wizard/ResponsibilitiesPage'
import { ReviewPage } from '@/pages/wizard/ReviewPage'
import { TechnologiesPage } from '@/pages/wizard/TechnologiesPage'

/** Secondary nav areas outside the Phase 1 scope render ComingSoonPage. */
const pending = (title: string, description: string) => (
  <ComingSoonPage title={title} description={description} />
)

export const routes: RouteObject[] = [
  {
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      {
        path: 'assessments/create',
        element: <WizardLayout />,
        children: [
          { index: true, element: <Navigate to="basic-info" replace /> },
          { path: 'basic-info', element: <BasicInfoPage /> },
          { path: 'responsibilities', element: <ResponsibilitiesPage /> },
          { path: 'competencies', element: <CompetenciesPage /> },
          { path: 'technologies', element: <TechnologiesPage /> },
          { path: 'company-level', element: <CompanyLevelPage /> },
          { path: 'review', element: <ReviewPage /> },
        ],
      },
      {
        path: 'assessments',
        element: pending('Assessments', 'Browse and manage all assessments.'),
      },
      {
        path: 'projects',
        children: [
          { index: true, element: <GeneratedProjectsPage /> },
          { path: 'generating', element: <GeneratingPage /> },
          { path: ':id', element: <ProjectDetailsPage /> },
        ],
      },
      {
        path: 'boilerplates',
        element: pending('Boilerplates', 'Manage project boilerplate templates.'),
      },
      {
        path: 'candidates',
        element: pending('Candidates', 'Manage candidates and their assignments.'),
      },
      { path: 'reports', element: pending('Reports', 'Evaluation reports and analytics.') },
      { path: 'settings', element: pending('Settings', 'Workspace and account settings.') },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]

export const router = createBrowserRouter(routes)
