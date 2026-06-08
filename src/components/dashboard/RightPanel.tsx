'use client'

import { MoreVertical, Eye } from 'lucide-react'

export default function RightPanel() {
  return (
    <div className="w-72 bg-white rounded-3xl m-6 p-6 overflow-y-auto h-[calc(100vh-48px)] shadow-lg">
      {/* Language selector */}
      <div className="flex justify-end mb-6">
        <button className="flex items-center gap-1 text-gray-600 text-sm hover:bg-gray-100 px-3 py-2 rounded-lg">
          <span>🇬🇧</span>
          <span>--- Eng</span>
        </button>
      </div>

      {/* Stats Section */}
      <div className="mb-8">
        <div className="text-sm text-gray-500 mb-2">View</div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
          {/* Simple Chart */}
          <div className="flex items-end justify-around h-32 mb-4">
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-20 bg-blue-300 rounded-t"></div>
              <span className="text-xs text-gray-600">Day</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-16 bg-blue-300 rounded-t"></div>
              <span className="text-xs text-gray-600">2</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-24 bg-blue-400 rounded-t"></div>
              <span className="text-xs text-gray-600">3</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-20 bg-blue-300 rounded-t"></div>
              <span className="text-xs text-gray-600">4</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-14 bg-blue-300 rounded-t"></div>
              <span className="text-xs text-gray-600">5</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-28 bg-blue-400 rounded-t"></div>
              <span className="text-xs text-gray-600">6</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-16 bg-blue-300 rounded-t"></div>
              <span className="text-xs text-gray-600">7</span>
            </div>
          </div>

          {/* Buy button and promo */}
          <div className="flex items-center justify-between">
            <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800">
              Buy Now
            </button>
            <div>
              <div className="text-xs text-gray-600">PROMO</div>
              <div className="text-2xl font-bold text-gray-800">8500</div>
            </div>
          </div>
        </div>
      </div>

      {/* Promo Tags */}
      <div className="mb-8 flex flex-wrap gap-2">
        <span className="border border-gray-300 text-gray-700 text-xs px-3 py-1 rounded-full hover:bg-gray-50 cursor-pointer">without pool</span>
        <span className="border border-gray-300 text-gray-700 text-xs px-3 py-1 rounded-full hover:bg-gray-50 cursor-pointer">500 off</span>
        <span className="border border-gray-300 text-gray-700 text-xs px-3 py-1 rounded-full hover:bg-gray-50 cursor-pointer">200 off</span>
        <span className="border border-gray-300 text-gray-700 text-xs px-3 py-1 rounded-full hover:bg-gray-50 cursor-pointer">Free experts</span>
        <span className="border border-gray-300 text-gray-700 text-xs px-3 py-1 rounded-full hover:bg-gray-50 cursor-pointer">Lunch pool</span>
        <span className="border border-gray-300 text-gray-700 text-xs px-3 py-1 rounded-full hover:bg-gray-50 cursor-pointer">Special cash</span>
      </div>

      {/* Game Cards */}
      <div className="space-y-4">
        {/* Card 1 */}
        <div className="relative rounded-2xl overflow-hidden h-28 bg-gradient-to-br from-blue-400 to-blue-600 cursor-pointer group hover:shadow-lg transition">
          <img 
            src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop" 
            alt="Women's trophy" 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-300 opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent flex items-end p-4">
            <span className="text-white font-bold text-sm">Women's trophy</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="relative rounded-2xl overflow-hidden h-28 bg-gradient-to-br from-teal-400 to-teal-600 cursor-pointer group hover:shadow-lg transition">
          <div className="absolute top-3 right-3 bg-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            LIVE
          </div>
          <img 
            src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop" 
            alt="Men's Tennis" 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-300 opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent flex items-end p-4">
            <span className="text-white font-bold text-sm">Men's Tennis</span>
          </div>
        </div>

        {/* Card 3 - Bottom promotional */}
        <div className="relative rounded-2xl overflow-hidden h-28 bg-gradient-to-br from-pink-400 to-purple-600 cursor-pointer group hover:shadow-lg transition">
          <div className="absolute top-3 right-3 bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full">
            LIVE
          </div>
          <img 
            src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop" 
            alt="Promo" 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-300 opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent flex items-end p-4">
            <span className="text-white font-bold text-sm">Special Event</span>
          </div>
        </div>
      </div>
    </div>
  )
}
