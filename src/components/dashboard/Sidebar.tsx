'use client'

import Link from 'next/link'
import { 
  LayoutDashboard, 
  BarChart3, 
  Users, 
  Settings,
  FileText,
  Bell,
  HelpCircle
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '#' },
    { label: 'Analytics', icon: BarChart3, href: '#' },
    { label: 'Users', icon: Users, href: '#' },
    { label: 'Reports', icon: FileText, href: '#' },
  ]

  const bottomItems = [
    { label: 'Notifications', icon: Bell, href: '#' },
    { label: 'Settings', icon: Settings, href: '#' },
    { label: 'Help', icon: HelpCircle, href: '#' },
  ]

  return (
    <aside 
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col h-screen`}
    >
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <span className="text-sidebar-primary-foreground font-bold text-lg">D</span>
          </div>
          {isOpen && <span className="font-bold text-lg text-sidebar-foreground">Dashboard</span>}
        </div>
      </div>

      {/* Main Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Link 
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors group"
            >
              <Icon className="w-5 h-5 text-sidebar-primary group-hover:text-sidebar-primary flex-shrink-0" />
              {isOpen && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Menu */}
      <nav className="p-4 space-y-2 border-t border-sidebar-border">
        {bottomItems.map((item) => {
          const Icon = item.icon
          return (
            <Link 
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors group"
            >
              <Icon className="w-5 h-5 text-sidebar-primary group-hover:text-sidebar-primary flex-shrink-0" />
              {isOpen && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
