import { candidateLevelLabel, companyLevelLabel } from '@/lib/labels'
import type { GeneratedProject } from '@/types'
import { previewComplexity } from '../wizard/complexity'
import { findOption, projectTypes, targetRoles } from '../wizard/options'
import { describeStack, type SourceKind } from './stack'

export type Priority = 'High' | 'Medium' | 'Low'
export type TestType = 'Unit' | 'Integration' | 'E2E'

export interface Requirement {
  id: string
  text: string
  section: string
  priority: Priority
}

export interface TestCase {
  id: string
  title: string
  area: string
  type: TestType
}

export interface ProjectFile {
  /** Path inside the project root, e.g. "src/main.ts". */
  path: string
  content: string
}

export type ContentKind =
  'source' | 'readme' | 'requirements' | 'tests' | 'docker' | 'database' | 'data'

export interface ContentEntry {
  kind: ContentKind
  label: string
  /** File or folder the entry points at (opened in Project Structure). */
  path: string
}

export interface ProjectContent {
  title: string
  /** Folder name used as the ZIP root. */
  slug: string
  technology: string
  requirements: Requirement[]
  testCases: TestCase[]
  files: ProjectFile[]
  readme: string
  contents: ContentEntry[]
}

const pad = (value: number) => String(value).padStart(3, '0')
const priorityFor = (index: number): Priority => (index < 2 ? 'High' : index < 4 ? 'Medium' : 'Low')
const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'interview-project'

const SMOKE_TESTS = [
  'Application boots with the default configuration',
  'Health check reports the service as up',
  'Invalid input returns a structured error response',
  'Primary user journey completes end to end',
]

/** Source files per boilerplate kind (small, realistic stubs). */
function sourceFiles(kind: SourceKind, title: string): ProjectFile[] {
  switch (kind) {
    case 'java':
      return [
        {
          path: 'pom.xml',
          content: `<project>\n  <modelVersion>4.0.0</modelVersion>\n  <groupId>com.assessment</groupId>\n  <artifactId>interview-project</artifactId>\n  <version>1.0.0</version>\n  <parent>\n    <groupId>org.springframework.boot</groupId>\n    <artifactId>spring-boot-starter-parent</artifactId>\n    <version>3.4.0</version>\n  </parent>\n</project>\n`,
        },
        {
          path: 'src/main/java/com/assessment/Application.java',
          content: `package com.assessment;\n\nimport org.springframework.boot.SpringApplication;\nimport org.springframework.boot.autoconfigure.SpringBootApplication;\n\n@SpringBootApplication\npublic class Application {\n  public static void main(String[] args) {\n    SpringApplication.run(Application.class, args);\n  }\n}\n`,
        },
        {
          path: 'src/main/java/com/assessment/controller/ApiController.java',
          content: `package com.assessment.controller;\n\n// TODO(candidate): expose the endpoints described in REQUIREMENTS.md\npublic class ApiController {}\n`,
        },
        {
          path: 'src/main/java/com/assessment/service/DomainService.java',
          content: `package com.assessment.service;\n\n// TODO(candidate): implement the business rules\npublic class DomainService {}\n`,
        },
        {
          path: 'src/main/resources/application.yml',
          content: `spring:\n  application:\n    name: interview-project\nserver:\n  port: 8080\n`,
        },
        {
          path: 'src/test/java/com/assessment/ApplicationTests.java',
          content: `package com.assessment;\n\nimport org.junit.jupiter.api.Test;\nimport org.springframework.boot.test.context.SpringBootTest;\n\n@SpringBootTest\nclass ApplicationTests {\n  @Test\n  void contextLoads() {}\n}\n`,
        },
      ]
    case 'node':
      return [
        {
          path: 'package.json',
          content: `{\n  "name": "interview-project",\n  "scripts": {\n    "start:dev": "nest start --watch",\n    "test": "jest"\n  }\n}\n`,
        },
        {
          path: 'tsconfig.json',
          content: `{\n  "compilerOptions": { "strict": true, "target": "ES2022" }\n}\n`,
        },
        {
          path: 'src/main.ts',
          content: `import { NestFactory } from '@nestjs/core'\nimport { AppModule } from './app.module'\n\nasync function bootstrap() {\n  const app = await NestFactory.create(AppModule)\n  await app.listen(3000)\n}\nbootstrap()\n`,
        },
        {
          path: 'src/app.module.ts',
          content: `import { Module } from '@nestjs/common'\n\n// TODO(candidate): register the modules described in REQUIREMENTS.md\n@Module({})\nexport class AppModule {}\n`,
        },
        {
          path: 'test/app.e2e-spec.ts',
          content: `describe('App (e2e)', () => {\n  it.todo('covers the scenarios in TEST_CASES.md')\n})\n`,
        },
      ]
    case 'web':
      return [
        {
          path: 'package.json',
          content: `{\n  "name": "interview-project",\n  "scripts": { "dev": "vite", "test": "vitest" }\n}\n`,
        },
        {
          path: 'index.html',
          content: `<div id="root"></div>\n<script type="module" src="/src/main.tsx"></script>\n`,
        },
        {
          path: 'src/main.tsx',
          content: `import { createRoot } from 'react-dom/client'\nimport { App } from './App'\n\ncreateRoot(document.getElementById('root')!).render(<App />)\n`,
        },
        {
          path: 'src/App.tsx',
          content: `export function App() {\n  return <h1>${title}</h1>\n}\n`,
        },
        {
          path: 'src/App.test.tsx',
          content: `it.todo('covers the scenarios in TEST_CASES.md')\n`,
        },
      ]
    case 'python':
      return [
        { path: 'requirements.txt', content: `fastapi\npytest\n` },
        { path: 'app/main.py', content: `# TODO(candidate): implement REQUIREMENTS.md\n` },
        { path: 'tests/test_main.py', content: `def test_placeholder():\n    assert True\n` },
      ]
    case 'go':
      return [
        { path: 'go.mod', content: `module interview-project\n\ngo 1.23\n` },
        { path: 'main.go', content: `package main\n\nfunc main() {}\n` },
        {
          path: 'main_test.go',
          content: `package main\n\nimport "testing"\n\nfunc TestPlaceholder(t *testing.T) {}\n`,
        },
      ]
    default:
      return [{ path: 'src/.gitkeep', content: '' }]
  }
}

const SOURCE_ROOT: Record<SourceKind, string> = {
  java: 'src',
  node: 'src',
  web: 'src',
  python: 'app',
  go: 'main.go',
  generic: 'src',
}

/** Docker image and schema file per database. */
const DATABASE_SETUP: Record<string, { image: string; file: string; comment: string }> = {
  PostgreSQL: { image: 'postgres:16', file: 'database/schema.sql', comment: '--' },
  MySQL: { image: 'mysql:8', file: 'database/schema.sql', comment: '--' },
  MongoDB: { image: 'mongo:7', file: 'database/init.js', comment: '//' },
}

const RUN_COMMANDS: Record<SourceKind, string[]> = {
  java: ['./mvnw spring-boot:run', './mvnw test'],
  node: ['npm install', 'npm run start:dev', 'npm test'],
  web: ['npm install', 'npm run dev', 'npm test'],
  python: ['pip install -r requirements.txt', 'pytest'],
  go: ['go run .', 'go test ./...'],
  generic: ['# see the source folder for setup notes'],
}

/** Everything shown on the project screen and packed into the ZIP. */
export function buildProjectContent(project: GeneratedProject): ProjectContent {
  const { assessment } = project
  const { basicInfo } = assessment
  const stack = describeStack(assessment)
  const preview = previewComplexity(
    assessment.companyLevel,
    assessment.candidateLevel,
    assessment.technologies,
  )
  const docker = preview?.features.includes('Docker configuration') ?? false
  const slug = slugify(basicInfo.title)
  const db = stack.database ? DATABASE_SETUP[stack.database] : undefined

  let reqNumber = 0
  const requirements: Requirement[] = assessment.responsibilities.flatMap((section) =>
    section.items.map((item, index) => ({
      id: `REQ-${pad(++reqNumber)}`,
      text: item.text,
      section: section.name,
      priority: priorityFor(index),
    })),
  )

  let tcNumber = 0
  const testCases: TestCase[] = [
    ...assessment.competencies.flatMap((section) =>
      section.items.flatMap((item): TestCase[] => [
        {
          id: `TC-${pad(++tcNumber)}`,
          title: `${item.text}: core behaviour`,
          area: section.name,
          type: 'Unit',
        },
        {
          id: `TC-${pad(++tcNumber)}`,
          title: `${item.text}: edge cases and failures`,
          area: section.name,
          type: 'Integration',
        },
      ]),
    ),
    ...SMOKE_TESTS.map((title) => ({
      id: `TC-${pad(++tcNumber)}`,
      title,
      area: 'Smoke',
      type: 'E2E' as const,
    })),
  ]

  const meta = [
    `- **Target role:** ${findOption(targetRoles, basicInfo.targetRole)?.label ?? '—'}`,
    `- **Project type:** ${findOption(projectTypes, basicInfo.projectType)?.label ?? '—'}`,
    `- **Company level:** ${assessment.companyLevel ? companyLevelLabel[assessment.companyLevel] : '—'}`,
    `- **Candidate level:** ${assessment.candidateLevel ? candidateLevelLabel[assessment.candidateLevel] : '—'}`,
  ]
  const commands = [...RUN_COMMANDS[stack.kind], ...(docker ? ['docker compose up --build'] : [])]

  const readme = [
    `# ${basicInfo.title}`,
    '',
    basicInfo.description,
    '',
    '## Overview',
    ...meta,
    '',
    '## Tech stack',
    ...stack.names.map((name) => `- ${name}`),
    '',
    ...(preview ? ['## What you will build', ...preview.features.map((f) => `- ${f}`), ''] : []),
    '## Your tasks',
    ...assessment.responsibilities.flatMap((section) => [
      `### ${section.name}`,
      ...section.items.map((item) => `- ${item.text}`),
      '',
    ]),
    '## Evaluation criteria',
    ...assessment.competencies.map(
      (section) => `- **${section.name}:** ${section.items.map((item) => item.text).join(', ')}`,
    ),
    '',
    '## Getting started',
    '```bash',
    ...commands,
    '```',
    '',
    '## Submission',
    '- Commit your work in small, well-described steps.',
    '- Make sure all tests in `TEST_CASES.md` pass before submitting.',
    '',
  ].join('\n')

  const requirementsDoc = [
    `# Requirements — ${basicInfo.title}`,
    '',
    ...requirements.map((req) => `- **${req.id}** (${req.priority}, ${req.section}): ${req.text}`),
    '',
  ].join('\n')

  const testsDoc = [
    `# Test cases — ${basicInfo.title}`,
    '',
    ...testCases.map((tc) => `- **${tc.id}** [${tc.type}] ${tc.area} — ${tc.title}`),
    '',
  ].join('\n')

  const files: ProjectFile[] = [
    { path: 'README.md', content: readme },
    { path: 'REQUIREMENTS.md', content: requirementsDoc },
    { path: 'TEST_CASES.md', content: testsDoc },
    { path: '.gitignore', content: 'node_modules\ntarget\ndist\n.env\n' },
    ...sourceFiles(stack.kind, basicInfo.title),
    ...(docker
      ? [
          { path: 'Dockerfile', content: `# Container image for ${stack.boilerplate}\n` },
          {
            path: 'docker-compose.yml',
            content: `services:\n  app:\n    build: .\n${db ? `  db:\n    image: ${db.image}\n` : ''}`,
          },
        ]
      : []),
    ...(db
      ? [
          {
            path: db.file,
            content: `${db.comment} ${stack.database} setup\n${db.comment} TODO(candidate): model the domain entities\n`,
          },
        ]
      : []),
    {
      path: 'sample-data/seed.json',
      content: `${JSON.stringify({ project: project.id, records: [] }, null, 2)}\n`,
    },
  ]

  const sourceRoot = SOURCE_ROOT[stack.kind]
  const contents: ContentEntry[] = [
    { kind: 'source', label: `Source Code (${stack.boilerplate})`, path: sourceRoot },
    { kind: 'readme', label: 'README.md', path: 'README.md' },
    { kind: 'requirements', label: 'Requirements.md', path: 'REQUIREMENTS.md' },
    { kind: 'tests', label: 'Test Cases', path: 'TEST_CASES.md' },
    ...(docker
      ? [{ kind: 'docker' as const, label: 'Docker Configuration', path: 'docker-compose.yml' }]
      : []),
    ...(db ? [{ kind: 'database' as const, label: 'Database Scripts', path: db.file }] : []),
    { kind: 'data', label: 'Sample Data', path: 'sample-data/seed.json' },
  ]

  return {
    title: basicInfo.title,
    slug,
    technology: stack.boilerplate,
    requirements,
    testCases,
    files,
    readme,
    contents,
  }
}
