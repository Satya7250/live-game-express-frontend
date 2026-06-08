'use client'

import { Search, Settings2 } from 'lucide-react'

export default function HeroSection() {
  return (
    <div className="flex-1 rounded-3xl mx-3 my-6 overflow-hidden relative h-[calc(100vh-48px)]">
      {/* Hero Background with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400">
        {/* Decorative elements */}
        <div className="absolute top-10 left-20 w-32 h-32 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 right-32 w-40 h-40 bg-teal-300 rounded-full opacity-20 blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col p-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-12">
          {/* Booking widget */}
          <div className="bg-white rounded-2xl px-4 py-2 shadow-lg flex items-center gap-2">
            <span className="text-gray-600 text-sm">📅</span>
            <input type="text" placeholder="Team details" className="bg-transparent text-sm text-gray-600 outline-none w-20" />
            <span className="text-gray-600">⚡</span>
            <span className="text-gray-600">🎯</span>
          </div>

          {/* Search and menu */}
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-full px-6 py-3 flex items-center gap-2 shadow-lg">
              <Search className="w-5 h-5 text-blue-600" />
              <span className="text-gray-600">Search</span>
              <Settings2 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-white text-sm">--- Eng</div>
          </div>
        </div>

        {/* Hero Image Placeholder */}
        <div className="flex-1 flex items-center justify-center mb-8">
          <div className="text-center">
            <div className="w-64 h-64 bg-gradient-to-br from-blue-400 to-teal-300 rounded-3xl opacity-30 mx-auto mb-8"></div>
          </div>
        </div>

        {/* Hero Text and CTA */}
        <div className="flex items-end justify-between">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold text-white mb-4 leading-tight">Score Goals with Seamless UI!</h1>
            
            {/* Match Widget */}
            <div className="bg-white rounded-2xl p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800">Green</span>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">😊</span>
                </div>
                <span className="text-gray-600 font-semibold">vs</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800">Red</span>
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">😊</span>
                </div>
              </div>
              <span className="text-gray-600 text-sm">05/22 - 04:30pm</span>
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-red-600">
                Join
              </button>
            </div>

            <button className="bg-teal-400 text-white px-8 py-3 rounded-full font-bold hover:bg-teal-500 transition">
              Book now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
