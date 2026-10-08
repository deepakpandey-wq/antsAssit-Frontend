import {
  ClipboardList,
  FileChartColumn,
  FileCheck2,
  FilePlus2,
  House,
  LayoutTemplate,
  Settings,
  Users,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
  /** Decides the active state — wizard steps and project pages map to their parent item. */
  isActive: (pathname: string) => boolean
}

const startsWith = (prefix: string) => (pathname: string) =>
  pathname === prefix || pathname.startsWith(`${prefix}/`)

export const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: House, isActive: startsWith('/dashboard') },
  {
    label: 'Create Assessment',
    to: '/assessments/create/basic-info',
    icon: FilePlus2,
    isActive: startsWith('/assessments/create'),
  },
  {
    label: 'Assessments',
    to: '/assessments',
    icon: ClipboardList,
    isActive: (pathname) =>
      startsWith('/assessments')(pathname) && !startsWith('/assessments/create')(pathname),
  },
  {
    label: 'Generated Projects',
    to: '/projects',
    icon: FileCheck2,
    isActive: startsWith('/projects'),
  },
  {
    label: 'Boilerplates',
    to: '/boilerplates',
    icon: LayoutTemplate,
    isActive: startsWith('/boilerplates'),
  },
  { label: 'Candidates', to: '/candidates', icon: Users, isActive: startsWith('/candidates') },
  { label: 'Reports', to: '/reports', icon: FileChartColumn, isActive: startsWith('/reports') },
  { label: 'Settings', to: '/settings', icon: Settings, isActive: startsWith('/settings') },
]
