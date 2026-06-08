"use client";

import { X, Trophy, Users, MessageCircle, Zap } from "lucide-react";

interface NotificationCenterProps {
  onClose: () => void;
}

export default function NotificationCenter({ onClose }: NotificationCenterProps) {
  const notifications = [
    {
      id: 1,
      type: "achievement",
      icon: Trophy,
      title: "Achievement Unlocked!",
      message: "You earned the 'Hot Streak' badge! Win 5 games in a row.",
      time: "3 hours ago",
      read: false,
    },
    {
      id: 2,
      type: "friend",
      icon: Users,
      title: "Friend Request",
      message: "Alex Johnson sent you a friend request",
      time: "5 hours ago",
      read: false,
    },
    {
      id: 3,
      type: "game",
      icon: MessageCircle,
      title: "Tournament Update",
      message: "Your tournament bracket for Football Championship is ready!",
      time: "1 day ago",
      read: true,
    },
    {
      id: 4,
      type: "promotion",
      icon: Zap,
      title: "Special Offer",
      message: "Get 50% bonus points on your next game!",
      time: "2 days ago",
      read: true,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end justify-end">
      <div className="w-96 h-3/4 bg-white rounded-t-2xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="font-bold text-[#8f2c24] text-lg">Notifications</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.map((notif) => {
            const Icon = notif.icon;
            return (
              <div
                key={notif.id}
                className={`px-6 py-4 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${
                  !notif.read ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8f2c24] to-[#d64c42] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-slate-900">{notif.title}</h3>
                      {!notif.read && (
                        <div className="w-2 h-2 bg-[#8f2c24] rounded-full mt-1" />
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{notif.message}</p>
                    <p className="text-xs text-slate-500 mt-2">{notif.time}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200">
          <button className="w-full text-center text-[#8f2c24] hover:text-[#d64c42] font-semibold text-sm transition-colors">
            Mark all as read
          </button>
        </div>
      </div>
    </div>
  );
}
