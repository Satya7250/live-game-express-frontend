import { Search, Bell, MessageSquare, Users } from "lucide-react";
import FriendCard from "./FriendCard";

interface RightPanelProps {
  onOpenChat: () => void;
  onOpenNotifications: () => void;
}

export default function RightPanel({ onOpenChat, onOpenNotifications }: RightPanelProps) {
  const friends = [
    { id: 1, name: "Alex Johnson", online: true, avatar: "AJ" },
    { id: 2, name: "Sarah Williams", online: true, avatar: "SW" },
    { id: 3, name: "Mike Davis", online: false, avatar: "MD" },
    { id: 4, name: "Emma Wilson", online: true, avatar: "EW" },
  ];

  const notifications = [
    { id: 1, type: "friend", message: "Alex Johnson sent you a friend request", time: "2 min ago" },
    { id: 2, type: "game", message: "Your tournament bracket is ready!", time: "1 hour ago" },
    { id: 3, type: "achievement", message: "You earned the 'Hot Streak' badge!", time: "3 hours ago" },
  ];

  return (
    <aside className="w-80 bg-white/80 backdrop-blur-sm border-l border-slate-200 shadow-lg p-6 overflow-y-auto sticky top-0 h-screen">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search games, friends..."
            className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8f2c24]"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={onOpenChat}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#8f2c24] to-[#d64c42] text-white py-2 rounded-lg hover:shadow-lg transition-all font-semibold"
        >
          <MessageSquare className="w-4 h-4" />
          Chat
        </button>
        <button
          onClick={onOpenNotifications}
          className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-[#8f2c24] py-2 rounded-lg hover:bg-slate-200 transition-colors font-semibold"
        >
          <Bell className="w-4 h-4" />
          Notifications
        </button>
      </div>

      {/* Online Friends */}
      <div className="mb-8">
        <h3 className="font-bold text-[#8f2c24] mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Online Friends
        </h3>
        <div className="space-y-3">
          {friends.map((friend) => (
            <FriendCard key={friend.id} friend={friend} />
          ))}
        </div>
      </div>

      {/* Recent Notifications */}
      <div>
        <h3 className="font-bold text-[#8f2c24] mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className="p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-[#8f2c24] transition-colors cursor-pointer"
            >
              <p className="text-sm text-slate-700 font-medium">{notif.message}</p>
              <p className="text-xs text-slate-500 mt-1">{notif.time}</p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
