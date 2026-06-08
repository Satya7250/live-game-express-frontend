'use client'

import React from 'react'

interface EventCard {
  title: string
  type: 'performance' | 'promo' | 'event' | 'event-live' | 'trophy'
  background: string
  stats?: {
    label: string
    value: string
  }
  isLive?: boolean
}

export function RightSidebar() {
  const events: EventCard[] = [
    {
      title: 'Performance',
      type: 'performance',
      background: 'bg-gradient-to-b from-gray-300 to-gray-600',
      stats: {
        label: 'Performance',
        value: '85.2%',
      },
    },
    {
      title: 'PROMO',
      type: 'promo',
      background: 'bg-yellow-400',
      stats: {
        label: 'PROMO8500',
        value: 'All round pass · 50% off · Free session · Special pass',
      },
    },
    {
      title: 'Premium',
      type: 'event',
      background: 'bg-amber-500',
      stats: {
        label: 'Premium',
        value: '',
      },
    },
    {
      title: "Woman's trophy",
      type: 'trophy',
      background: 'bg-emerald-500',
      stats: {
        label: "Woman's trophy",
        value: '',
      },
    },
    {
      title: "Men's Tennis",
      type: 'event-live',
      background: 'bg-cyan-600',
      isLive: true,
      stats: {
        label: "Men's Tennis",
        value: '',
      },
    },
    {
      title: 'Championship',
      type: 'event-live',
      background: 'bg-pink-600',
      isLive: true,
      stats: {
        label: 'Championship',
        value: '',
      },
    },
  ]

  return (
    <aside className="bg-card overflow-y-auto">
      <div className="p-4 space-y-3">
        {/* Performance Chart Section */}
        <div className="space-y-2">
          <div className="text-sm font-semibold text-muted-foreground">Performance</div>
          <div className="text-3xl font-bold">85.2%</div>
          <div className="grid grid-cols-7 gap-1">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className="h-16 bg-gradient-to-b from-gray-300 to-gray-600 rounded"
              />
            ))}
          </div>
          <div className="text-xs text-muted-foreground flex justify-between">
            <span>Day</span>
            <span>2 3 4 5 6 7</span>
          </div>
        </div>

        {/* Buy Now Button */}
        <button className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-black/80 transition-colors">
          Buy Now
        </button>

        {/* Promo Card */}
        <div className="bg-yellow-400 text-black rounded-lg p-4 space-y-2">
          <div className="text-sm font-semibold">PROMO</div>
          <div className="text-2xl font-bold">8500</div>
          <div className="text-xs space-y-1">
            <div>All round pass</div>
            <div>50% off</div>
            <div>Free session</div>
            <div>Special pass</div>
          </div>
        </div>

        {/* Premium Card */}
        <div className="bg-amber-500 text-white rounded-lg p-6 font-semibold text-center hover:bg-amber-600 transition-colors cursor-pointer">
          Premium
        </div>

        {/* Woman's Trophy Card */}
        <div className="bg-emerald-500 text-white rounded-lg p-6 font-semibold hover:bg-emerald-600 transition-colors cursor-pointer">
          Woman&apos;s trophy
        </div>

        {/* Men's Tennis Card */}
        <div className="bg-cyan-600 text-white rounded-lg p-6 font-semibold relative hover:bg-cyan-700 transition-colors cursor-pointer">
          <div>Men&apos;s Tennis</div>
          {true && (
            <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
              LIVE
            </div>
          )}
        </div>

        {/* Championship Card */}
        <div className="bg-pink-600 text-white rounded-lg p-6 font-semibold relative hover:bg-pink-700 transition-colors cursor-pointer">
          <div>Championship</div>
          <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            LIVE
          </div>
        </div>
      </div>
    </aside>
  )
}
