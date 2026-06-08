'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import StatsGrid from './StatsGrid'
import ChartsSection from './ChartsSection'
import ActivityFeed from './ActivityFeed'

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
        <main className="flex-1 overflow-auto">
          <div className="p-8 space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back! Here&apos;s your performance overview.</p>
            </div>
            
            <StatsGrid />
            <ChartsSection />
            <ActivityFeed />
          </div>
        </main>
      </div>
    </div>
  )
}
