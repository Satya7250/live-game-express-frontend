'use client'

import React from 'react'
import Link from 'next/link'
import {
  LayoutDashboard,
  BookOpen,
  Table2,
  Clock,
  Headphones,
  BarChart3,
  CreditCard,
  Settings,
  LogOut,
  Menu,
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '#' },
    { icon: BookOpen, label: 'Bookings', href: '#' },
    { icon: Table2, label: 'Point table', href: '#' },
    { icon: Clock, label: 'Schedule', href: '#' },
    { icon: Headphones, label: 'Support', href: '#' },
    { icon: BarChart3, label: 'Analytics', href: '#' },
    { icon: CreditCard, label: 'My payment', href: '#' },
    { icon: Settings, label: 'Settings', href: '#' },
  ]

  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-card border-r border-border transition-all duration-300 flex flex-col`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className={`flex items-center gap-2 ${!isOpen && 'hidden'}`}>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">C</span>
          </div>
          <span className="font-bold text-lg">Cubfoot</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 hover:bg-accent rounded transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 hover:bg-accent hover:text-accent-foreground transition-colors group"
            >
              <Icon size={24} className="flex-shrink-0" />
              <span className={`${!isOpen && 'hidden'} group-hover:text-primary transition-colors`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <button className="flex items-center gap-3 px-4 py-3 w-full hover:bg-accent hover:text-accent-foreground rounded transition-colors text-destructive">
          <LogOut size={24} />
          <span className={!isOpen ? 'hidden' : ''}>Log out</span>
        </button>
      </div>
    </aside>
  )
}
