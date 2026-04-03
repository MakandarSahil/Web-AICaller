import {
  BarChart3,
  Bot,
  Book,
  Phone,
  History,
  LayoutDashboard,
  Settings2,
  Zap,
  type LucideIcon,
} from 'lucide-react'

export type DashboardNavItem = {
  href: string
  label: string
  icon: LucideIcon
}

export type DashboardNavGroup = {
  label: string
  items: DashboardNavItem[]
}

export const navigationGroups: DashboardNavGroup[] = [
  {
    label: 'GENERAL',
    items: [
      { href: '/', label: 'Overview', icon: LayoutDashboard },
    ],
  },
  {
    label: 'BUILD',
    items: [
      { href: '/agents', label: 'Agents', icon: Bot },
      { href: '/knowledge-bases', label: 'Knowledge Base', icon: Book },
      { href: '/api-keys', label: 'API Keys (Coming Soon)', icon: Zap },
    ],
  },
  {
    label: 'DEPLOY',
    items: [
      { href: '/phone-numbers', label: 'Phone Numbers (Coming Soon)', icon: Phone },
    ],
  },
  {
    label: 'MONITOR',
    items: [
      { href: '/conversations', label: 'Call History (Coming Soon)', icon: History },
      { href: '/analytics', label: 'Analytics (Coming Soon)', icon: BarChart3 },
    ],
  },
]

export function isNavItemActive(item: DashboardNavItem, pathname: string) {
  return item.href === '/'
    ? pathname === '/'
    : pathname === item.href || pathname.startsWith(`${item.href}/`)
}
