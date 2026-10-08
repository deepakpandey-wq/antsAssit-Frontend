import type { AssessmentDraft, ListSection, SectionIcon } from '@/types'

const section = (id: string, name: string, icon: SectionIcon, items: string[]): ListSection => ({
  id,
  name,
  icon,
  items: items.map((text, index) => ({ id: `${id}-${index + 1}`, text })),
})

/** The example assessment shown throughout the reference design. */
export const sampleDraft: AssessmentDraft = {
  basicInfo: {
    title: 'Java Backend Developer Assessment',
    description:
      "This assessment evaluates the candidate's ability to build scalable backend systems using Spring Boot, Kafka and PostgreSQL.",
    targetRole: 'java-backend',
    projectType: 'backend-service',
  },
  responsibilities: [
    section('resp-java', 'Core Java', 'code', [
      'Write clean and efficient Java code following best practices',
      'Work with Collections, Streams and Optional',
      'Implement multithreading and concurrency solutions',
      'Handle exceptions and error scenarios',
      'Design and implement object-oriented solutions',
      'Work with Java 8+ features (Lambdas, Streams, etc.)',
    ]),
    section('resp-spring', 'Spring Boot', 'leaf', [
      'Build RESTful APIs with Spring Web',
      'Configure application profiles and externalized properties',
      'Implement validation and global exception handling',
      'Secure endpoints with Spring Security',
    ]),
    section('resp-micro', 'Microservices', 'boxes', [
      'Design service boundaries and API contracts',
      'Implement inter-service communication',
      'Apply resilience patterns (retries, circuit breakers)',
    ]),
    section('resp-db', 'Database', 'database', [
      'Model relational schemas in PostgreSQL',
      'Write efficient queries and use indexes',
      'Manage schema migrations',
    ]),
    section('resp-kafka', 'Kafka', 'message', [
      'Produce and consume events with Kafka',
      'Handle message ordering and idempotency',
    ]),
    section('resp-testing', 'Testing', 'flask', [
      'Write unit tests with JUnit 5 and Mockito',
      'Write integration tests with Testcontainers',
    ]),
    section('resp-design', 'System Design', 'network', [
      'Design for scalability and fault tolerance',
      'Document architecture decisions',
    ]),
  ],
  competencies: [
    section('comp-java', 'Core Java', 'code', [
      'Java Fundamentals',
      'OOP Concepts',
      'Collections Framework',
      'Exception Handling',
      'Multithreading',
      'Java 8 Features',
    ]),
    section('comp-spring', 'Spring Boot', 'leaf', [
      'Dependency Injection',
      'Spring Data JPA',
      'REST Controllers',
      'Configuration & Profiles',
    ]),
    section('comp-kafka', 'Kafka', 'message', ['Producers & Consumers', 'Topics & Partitions']),
    section('comp-db', 'Database', 'database', ['SQL', 'Transactions', 'Indexing']),
    section('comp-testing', 'Testing', 'flask', ['Unit Testing', 'Integration Testing']),
    section('comp-micro', 'Microservices', 'boxes', ['Service Discovery', 'API Gateway']),
    section('comp-security', 'Security', 'shield', ['Authentication', 'Authorization']),
  ],
  technologies: ['java', 'spring-boot', 'kafka', 'postgresql'],
  customSkills: ['Elasticsearch', 'RabbitMQ'],
  companyLevel: 'enterprise',
  candidateLevel: 'senior',
}

export const blankDraft: AssessmentDraft = {
  basicInfo: { title: '', description: '', targetRole: '', projectType: '' },
  responsibilities: [],
  competencies: [],
  technologies: [],
  customSkills: [],
  companyLevel: null,
  candidateLevel: null,
}
