'use client'

import { TrendingUp, Users, Activity, Zap } from 'lucide-react'

const stats = [
  {
    label: 'Total Revenue',
    value: '$45,231.89',
    change: '+20.1%',
    isPositive: true,
    icon: TrendingUp,
  },
  {
    label: 'Active Users',
    value: '2,345',
    change: '+15%',
    isPositive: true,
    icon: Users,
  },
  {
    label: 'Engagement Rate',
    value: '68.2%',
    change: '+5.3%',
    isPositive: true,
    icon: Activity,
  },
  {
    label: 'Performance',
    value: '94.5%',
    change: '-2.4%',
    isPositive: false,
    icon: Zap,
  },
]

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div
            key={index}
            className="bg-card rounded-xl border border-border p-6 hover:border-primary/50 transition-all hover:shadow-lg"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <span
                className={`text-sm font-medium px-3 py-1 rounded-full ${
                  stat.isPositive
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}
              >
                {stat.change}
              </span>
            </div>
            <h3 className="text-muted-foreground text-sm font-medium mb-1">
              {stat.label}
            </h3>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          </div>
        )
      })}
    </div>
  )
}
