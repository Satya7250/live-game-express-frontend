'use client'

import { LayoutDashboard, Calendar, BarChart3, HelpCircle, DollarSign, Settings, LogOut, BookOpen } from 'lucide-react'

export default function Sidebar() {
  return (
    <div className="w-64 bg-gradient-to-b from-blue-100 to-blue-50 rounded-3xl m-6 p-8 flex flex-col justify-between h-[calc(100vh-48px)] shadow-lg">
      {/* Logo */}
      <div>
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">⚽</span>
          </div>
          <span className="text-xl font-bold text-gray-800">Cubfoot</span>
        </div>

        {/* Menu Items */}
        <nav className="space-y-3">
          <div className="bg-white rounded-xl px-4 py-3 flex items-center gap-3 cursor-pointer hover:shadow-md transition">
            <LayoutDashboard className="w-5 h-5 text-gray-700" />
            <span className="text-gray-700 font-medium">Dashboard</span>
          </div>

          <div className="px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-blue-100 rounded-xl transition text-gray-600">
            <BookOpen className="w-5 h-5" />
            <span className="font-medium">Bookings</span>
          </div>

          <div className="px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-blue-100 rounded-xl transition text-gray-600">
            <BarChart3 className="w-5 h-5" />
            <span className="font-medium">Point table</span>
          </div>

          <div className="px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-blue-100 rounded-xl transition text-gray-600">
            <Calendar className="w-5 h-5" />
            <span className="font-medium">Schedule</span>
          </div>

          <div className="px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-blue-100 rounded-xl transition text-gray-600">
            <HelpCircle className="w-5 h-5" />
            <span className="font-medium">Support</span>
          </div>

          <div className="px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-blue-100 rounded-xl transition text-gray-600">
            <BarChart3 className="w-5 h-5" />
            <span className="font-medium">Analytics</span>
          </div>

          <div className="px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-blue-100 rounded-xl transition text-gray-600">
            <DollarSign className="w-5 h-5" />
            <span className="font-medium">My payment</span>
          </div>

          <div className="px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-blue-100 rounded-xl transition text-gray-600">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </div>
        </nav>
      </div>

      {/* Log out Button */}
      <button className="w-full border-2 border-gray-400 text-gray-700 py-3 rounded-xl font-medium hover:bg-blue-100 transition flex items-center justify-center gap-2">
        <LogOut className="w-5 h-5" />
        Log out
      </button>
    </div>
  )
}
