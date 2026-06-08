'use client'

import React from 'react'
import { Search, Settings, Eye } from 'lucide-react'

export function MainContent() {
  return (
    <main className="flex flex-col h-full overflow-hidden">
      {/* Top Header */}
      <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full px-4 py-2 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Search size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <Settings size={20} />
          </button>
          <button className="flex items-center gap-2 px-3 py-2 hover:bg-secondary rounded-lg transition-colors text-sm font-medium">
            <Eye size={18} />
            Eng View
          </button>
          <span className="text-sm font-medium">Today</span>
        </div>
      </header>

      {/* Main Hero Section */}
      <section className="flex-1 relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-500" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center h-full px-12">
          <div className="max-w-xl">
            <h1 className="text-6xl font-bold text-white mb-4 text-balance">
              Score Goals with
            </h1>
            <p className="text-5xl font-light italic text-white mb-8 text-balance">
              Seamless UI
            </p>
            <button className="px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity">
              Book now
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
