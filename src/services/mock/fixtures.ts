import type { AppNotification, AssessmentSummary, DashboardStat, StatRange, User } from '@/types'

export const currentUser: User = {
  id: 'usr-001',
  name: 'Admin User',
  firstName: 'Admin',
  email: 'admin@company.com',
}

export const recentAssessments: AssessmentSummary[] = [
  {
    id: 'ASM-001',
    title: 'Java Backend Developer',
    technology: 'Spring Boot',
    companyLevel: 'enterprise',
    status: 'generated',
    createdAt: '2025-03-12',
    projectId: 'PROJ-1001',
  },
  {
    id: 'ASM-002',
    title: 'Frontend Developer',
    technology: 'React',
    companyLevel: 'mid-size',
    status: 'in-progress',
    createdAt: '2025-03-10',
  },
  {
    id: 'ASM-003',
    title: 'Backend Developer',
    technology: 'NestJS',
    companyLevel: 'startup',
    status: 'generated',
    createdAt: '2025-03-08',
    projectId: 'PROJ-1002',
  },
  {
    id: 'ASM-004',
    title: 'Full Stack Developer',
    technology: 'Spring Boot + React',
    companyLevel: 'enterprise',
    status: 'draft',
    createdAt: '2025-03-05',
  },
]

const stat = (
  key: DashboardStat['key'],
  label: string,
  value: number,
  change: number,
  trend: number[],
): DashboardStat => ({ key, label, value, change, trend })

export const dashboardStats: Record<StatRange, DashboardStat[]> = {
  '7d': [
    stat('assessments', 'Total Assessments', 6, 4, [3, 4, 3, 5, 4, 6, 6]),
    stat('projects', 'Generated Projects', 5, 2, [2, 3, 3, 2, 4, 4, 5]),
    stat('candidates', 'Assigned Candidates', 4, 9, [1, 2, 2, 3, 2, 3, 4]),
    stat('evaluations', 'Completed Evaluations', 2, 5, [1, 1, 2, 1, 2, 1, 2]),
  ],
  '30d': [
    stat('assessments', 'Total Assessments', 24, 12, [8, 12, 10, 15, 13, 19, 17, 24]),
    stat('projects', 'Generated Projects', 18, 8, [9, 13, 11, 16, 14, 18, 15, 18]),
    stat('candidates', 'Assigned Candidates', 12, 25, [5, 9, 6, 11, 8, 12, 9, 12]),
    stat('evaluations', 'Completed Evaluations', 8, 14, [3, 6, 4, 7, 5, 8, 6, 8]),
  ],
  '90d': [
    stat('assessments', 'Total Assessments', 61, 18, [20, 28, 25, 34, 40, 38, 52, 61]),
    stat('projects', 'Generated Projects', 47, 15, [14, 20, 24, 22, 31, 36, 41, 47]),
    stat('candidates', 'Assigned Candidates', 33, 21, [9, 12, 15, 14, 20, 24, 29, 33]),
    stat('evaluations', 'Completed Evaluations', 21, 10, [6, 8, 7, 11, 13, 15, 18, 21]),
  ],
}

export const notifications: AppNotification[] = [
  {
    id: 'ntf-1',
    title: 'Project generated',
    body: 'Java Backend Developer Assessment is ready to download.',
    time: '2m ago',
    read: false,
  },
  {
    id: 'ntf-2',
    title: 'Candidate submitted',
    body: 'Priya Sharma submitted the Backend Developer project.',
    time: '1h ago',
    read: false,
  },
  {
    id: 'ntf-3',
    title: 'Boilerplate updated',
    body: 'Spring Boot 3.4 template is now available.',
    time: 'Yesterday',
    read: true,
  },
]
