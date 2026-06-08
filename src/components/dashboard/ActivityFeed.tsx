'use client'

import { MoreVertical, CheckCircle, AlertCircle, Info } from 'lucide-react'

const activities = [
  {
    id: 1,
    title: 'New user registration',
    description: 'Sarah Johnson signed up for a new account',
    timestamp: '2 hours ago',
    type: 'success',
    icon: CheckCircle,
  },
  {
    id: 2,
    title: 'System update completed',
    description: 'Backend services updated to version 2.5.1',
    timestamp: '4 hours ago',
    type: 'info',
    icon: Info,
  },
  {
    id: 3,
    title: 'High memory usage alert',
    description: 'Server memory utilization exceeded 85%',
    timestamp: '6 hours ago',
    type: 'alert',
    icon: AlertCircle,
  },
  {
    id: 4,
    title: 'Payment processed',
    description: 'Invoice #INV-2024-001 payment confirmed',
    timestamp: '8 hours ago',
    type: 'success',
    icon: CheckCircle,
  },
]

const getIconColor = (type: string) => {
  switch (type) {
    case 'success':
      return 'text-green-500'
    case 'alert':
      return 'text-red-500'
    case 'info':
      return 'text-blue-500'
    default:
      return 'text-primary'
  }
}

const getBackgroundColor = (type: string) => {
  switch (type) {
    case 'success':
      return 'bg-green-100 dark:bg-green-900/20'
    case 'alert':
      return 'bg-red-100 dark:bg-red-900/20'
    case 'info':
      return 'bg-blue-100 dark:bg-blue-900/20'
    default:
      return 'bg-primary/10'
  }
}

export default function ActivityFeed() {
  return (
    <div className="bg-card rounded-xl border border-border p-6 hover:border-primary/50 transition-all">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">Your latest updates and alerts</p>
        </div>
        <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
          <MoreVertical className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon
          return (
            <div
              key={activity.id}
              className="flex gap-4 p-4 rounded-lg hover:bg-secondary transition-colors group"
            >
              <div className={`${getBackgroundColor(activity.type)} p-2 rounded-lg flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${getIconColor(activity.type)}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {activity.title}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {activity.description}
                </p>
              </div>

              <div className="text-xs text-muted-foreground flex-shrink-0 whitespace-nowrap">
                {activity.timestamp}
              </div>
            </div>
          )
        })}
      </div>

      <button className="w-full mt-4 py-2 px-4 rounded-lg border border-border text-foreground hover:bg-secondary transition-colors font-medium text-sm">
        View all activity
      </button>
    </div>
  )
}
