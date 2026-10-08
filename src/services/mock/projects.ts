import type { AssessmentDraft, GeneratedProject } from '@/types'
import { sampleDraft } from './draft'

const nestDraft: AssessmentDraft = {
  basicInfo: {
    title: 'Backend Developer Assessment',
    description:
      'Evaluates building a well-tested REST API with NestJS, PostgreSQL and Redis caching.',
    targetRole: 'node-backend',
    projectType: 'rest-api',
  },
  responsibilities: [
    {
      id: 'nest-resp-api',
      name: 'API Development',
      icon: 'code',
      items: [
        { id: 'nr-1', text: 'Design RESTful endpoints with validation' },
        { id: 'nr-2', text: 'Implement pagination and filtering' },
        { id: 'nr-3', text: 'Document the API with OpenAPI' },
      ],
    },
    {
      id: 'nest-resp-data',
      name: 'Data',
      icon: 'database',
      items: [
        { id: 'nr-4', text: 'Model entities with TypeORM' },
        { id: 'nr-5', text: 'Cache hot reads in Redis' },
      ],
    },
  ],
  competencies: [
    {
      id: 'nest-comp-core',
      name: 'NestJS',
      icon: 'code',
      items: [
        { id: 'nc-1', text: 'Modules & Providers' },
        { id: 'nc-2', text: 'Guards & Pipes' },
        { id: 'nc-3', text: 'Exception Filters' },
      ],
    },
    {
      id: 'nest-comp-testing',
      name: 'Testing',
      icon: 'flask',
      items: [
        { id: 'nc-4', text: 'Unit Testing' },
        { id: 'nc-5', text: 'E2E Testing' },
      ],
    },
  ],
  technologies: ['nestjs', 'typescript', 'postgresql', 'redis', 'docker'],
  customSkills: [],
  companyLevel: 'startup',
  candidateLevel: 'mid',
}
/** Projects that exist before the user generates anything (match the dashboard table). */
export const seedProjects: GeneratedProject[] = [
  {
    id: 'PROJ-1001',
    assessmentId: 'ASM-001',
    assessment: sampleDraft,
    generatedAt: '2025-03-12T12:15:00',
  },
  {
    id: 'PROJ-1002',
    assessmentId: 'ASM-003',
    assessment: nestDraft,
    generatedAt: '2025-03-08T10:40:00',
  },
]
