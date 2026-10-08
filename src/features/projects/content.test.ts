import { projectService } from '@/services/projectService'
import { buildProjectContent } from './content'
import { buildGenerationPlan } from './generationPlan'

const [javaProject, nestProject] = projectService.getSeedProjects()
const java = buildProjectContent(javaProject)
const paths = (content: typeof java) => content.files.map((file) => file.path)

describe('buildProjectContent', () => {
  it('derives requirements and test cases from the assessment', () => {
    expect(java.requirements).toHaveLength(22)
    expect(java.requirements[0]).toEqual({
      id: 'REQ-001',
      text: 'Write clean and efficient Java code following best practices',
      section: 'Core Java',
      priority: 'High',
    })
    expect(java.requirements.slice(0, 6).map((r) => r.priority)).toEqual([
      'High',
      'High',
      'Medium',
      'Medium',
      'Low',
      'Low',
    ])
    expect(java.testCases).toHaveLength(21 * 2 + 4)
    expect(java.testCases.at(-1)).toMatchObject({ id: 'TC-046', type: 'E2E' })
  })

  it('agrees with the counts announced in the generation log', () => {
    const logs = buildGenerationPlan(javaProject.assessment, javaProject.id).flatMap((stage) =>
      stage.logs.map((log) => log.text),
    )
    expect(logs).toContain(`Generated ${java.requirements.length} requirements across 7 sections`)
    expect(logs).toContain(`Generated ${java.testCases.length} test cases across 21 competencies`)
  })

  it('lists the same project contents as the reference design', () => {
    expect(java.technology).toBe('Spring Boot')
    expect(java.slug).toBe('java-backend-developer-assessment')
    expect(java.contents.map((entry) => entry.label)).toEqual([
      'Source Code (Spring Boot)',
      'README.md',
      'Requirements.md',
      'Test Cases',
      'Docker Configuration',
      'Database Scripts',
      'Sample Data',
    ])
    expect(paths(java)).toEqual(
      expect.arrayContaining([
        'pom.xml',
        'src/main/java/com/assessment/Application.java',
        'database/schema.sql',
      ]),
    )
    expect(java.files.find((f) => f.path === 'docker-compose.yml')?.content).toContain(
      'postgres:16',
    )
    expect(java.readme).toMatch(/^# Java Backend Developer Assessment\n/)
    expect(java.readme).toContain('./mvnw spring-boot:run')
  })

  it('switches boilerplate, database and Docker with the stack', () => {
    const nest = buildProjectContent(nestProject)
    expect(nest.technology).toBe('NestJS')
    expect(paths(nest)).toEqual(expect.arrayContaining(['package.json', 'src/main.ts']))
    // A startup project still gets Docker when Docker is explicitly selected.
    expect(nest.files.find((f) => f.path === 'docker-compose.yml')?.content).toContain(
      'postgres:16',
    )
    expect(nest.readme).toContain('npm run start:dev')
  })

  it('omits Docker for a startup without Docker and uses init.js for MongoDB', () => {
    const project = structuredClone(nestProject)
    project.assessment.technologies = ['nodejs', 'mongodb']
    const content = buildProjectContent(project)
    expect(paths(content)).not.toContain('docker-compose.yml')
    expect(content.contents.map((c) => c.kind)).not.toContain('docker')
    expect(paths(content)).toContain('database/init.js')
  })
})
