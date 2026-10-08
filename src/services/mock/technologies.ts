import type { Technology } from '@/types'

const tech = (
  id: string,
  name: string,
  category: Technology['category'],
  icon: Technology['icon'],
  tone: Technology['tone'],
  popular = false,
): Technology => ({ id, name, category, icon, tone, popular })

/** Popular entries are ordered exactly as in the reference grid. */
export const technologyCatalog: Technology[] = [
  tech('java', 'Java', 'language', 'coffee', 'danger', true),
  tech('spring-boot', 'Spring Boot', 'framework', 'leaf', 'info', true),
  tech('kafka', 'Kafka', 'messaging', 'workflow', 'danger', true),
  tech('postgresql', 'PostgreSQL', 'data', 'database', 'info', true),
  tech('docker', 'Docker', 'devops', 'container', 'info', true),
  tech('junit', 'JUnit', 'testing', 'flask', 'purple', true),
  tech('maven', 'Maven', 'devops', 'package', 'info', true),
  tech('redis', 'Redis', 'data', 'layers', 'danger', true),
  tech('react', 'React', 'framework', 'atom', 'info', true),
  tech('nestjs', 'NestJS', 'framework', 'server', 'danger', true),
  tech('typescript', 'TypeScript', 'language', 'file-code', 'info', true),
  tech('microservices', 'Microservices', 'architecture', 'boxes', 'purple', true),
  tech('git', 'Git', 'devops', 'git-branch', 'warning', true),
  tech('ci-cd', 'CI/CD', 'devops', 'refresh', 'success', true),
  tech('linux', 'Linux', 'devops', 'terminal', 'neutral', true),
  tech('kubernetes', 'Kubernetes', 'devops', 'ship', 'info', true),
  // Searchable, not shown in the default grid
  tech('python', 'Python', 'language', 'braces', 'warning'),
  tech('go', 'Go', 'language', 'zap', 'teal'),
  tech('nodejs', 'Node.js', 'framework', 'hexagon', 'success'),
  tech('angular', 'Angular', 'framework', 'atom', 'danger'),
  tech('vue', 'Vue', 'framework', 'atom', 'success'),
  tech('nextjs', 'Next.js', 'framework', 'globe', 'neutral'),
  tech('graphql', 'GraphQL', 'framework', 'braces', 'purple'),
  tech('mysql', 'MySQL', 'data', 'database', 'teal'),
  tech('mongodb', 'MongoDB', 'data', 'database', 'success'),
  tech('aws', 'AWS', 'devops', 'cloud', 'warning'),
  tech('terraform', 'Terraform', 'devops', 'layers', 'purple'),
  tech('jenkins', 'Jenkins', 'devops', 'refresh', 'danger'),
  tech('gradle', 'Gradle', 'devops', 'package', 'teal'),
  tech('mockito', 'Mockito', 'testing', 'flask', 'success'),
  tech('selenium', 'Selenium', 'testing', 'flask', 'teal'),
]
