'use client'

import React, { useState } from 'react'
import { Sidebar } from './Sidebar'
import { MainContent } from './MainContent'
import { RightSidebar } from './RightSidebar'

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Left Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <MainContent />
      </div>
      
      {/* Right Sidebar */}
      <div className="w-80 overflow-y-auto border-l border-border">
        <RightSidebar />
      </div>
    </div>
  )
}
