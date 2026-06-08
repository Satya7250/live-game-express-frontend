'use client'

import { MoreVertical } from 'lucide-react'

export default function ChartsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Revenue Chart */}
      <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6 hover:border-primary/50 transition-all">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Revenue Trend</h3>
            <p className="text-sm text-muted-foreground">Last 12 months</p>
          </div>
          <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        
        <div className="h-64 flex items-end justify-around gap-2 pb-4">
          {[65, 78, 90, 70, 85, 95, 88, 92, 100, 87, 93, 98].map((height, i) => (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-primary to-primary/60 rounded-t-lg opacity-80 hover:opacity-100 transition-opacity"
              style={{ height: `${(height / 100) * 100}%` }}
            />
          ))}
        </div>
        
        <div className="flex justify-between text-xs text-muted-foreground mt-4">
          <span>Jan</span>
          <span>Feb</span>
          <span>Mar</span>
          <span>Apr</span>
          <span>May</span>
          <span>Jun</span>
          <span>Jul</span>
          <span>Aug</span>
          <span>Sep</span>
          <span>Oct</span>
          <span>Nov</span>
          <span>Dec</span>
        </div>
      </div>

      {/* Activity Summary */}
      <div className="bg-card rounded-xl border border-border p-6 hover:border-primary/50 transition-all">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Activity</h3>
          <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        
        <div className="space-y-4">
          {[
            { label: 'Completed', value: 1243, percentage: 75 },
            { label: 'Pending', value: 342, percentage: 25 },
          ].map((item, index) => (
            <div key={index}>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{item.label}</span>
                <span className="text-sm text-muted-foreground">{item.percentage}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary rounded-full h-2 transition-all"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-border space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Total Tasks</span>
            <span className="font-semibold text-foreground">1,585</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Completion Rate</span>
            <span className="font-semibold text-foreground">78.5%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
