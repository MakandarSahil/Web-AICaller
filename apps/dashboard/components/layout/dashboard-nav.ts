import {
  BarChart3,
  Bot,
  Book,
  MessageSquare,
  Phone,
  History,
  ShieldCheck,
  Bell,
  Zap,
  LayoutDashboard,
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
      { href: '/', label: 'Home', icon: LayoutDashboard },
    ],
  },
  {
    label: 'BUILD',
    items: [
      { href: '/agents', label: 'Agents', icon: Bot },
      { href: '/knowledge-bases', label: 'Knowledge Base', icon: Book },
    ],
  },
  {
    label: 'DEPLOY',
    items: [
      { href: '/phone-numbers', label: 'Phone Numbers', icon: Phone },
      { href: '/batch-call', label: 'Batch Call', icon: Zap },
    ],
  },
  {
    label: 'MONITOR',
    items: [
      { href: '/conversations', label: 'Call History', icon: History },
      { href: '/chat-history', label: 'Chat History', icon: MessageSquare },
      { href: '/analytics', label: 'Analytics', icon: BarChart3 },
      { href: '/quality-assurance', label: 'AI Quality Assurance', icon: ShieldCheck },
      { href: '/alerts', label: 'Alerting', icon: Bell },
    ],
  },
]

export function isNavItemActive(item: DashboardNavItem, pathname: string) {
  return item.href === '/'
    ? pathname === '/'
    : pathname === item.href || pathname.startsWith(`${item.href}/`)
}
