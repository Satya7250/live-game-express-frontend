import { MessageSquare, UserPlus } from "lucide-react";

interface Friend {
  id: number;
  name: string;
  online: boolean;
  avatar: string;
}

interface FriendCardProps {
  friend: Friend;
}

export default function FriendCard({ friend }: FriendCardProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group">
      <div className="flex items-center gap-3 flex-1">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8f2c24] to-[#d64c42] flex items-center justify-center text-white font-semibold text-sm">
            {friend.avatar}
          </div>
          {friend.online && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">{friend.name}</p>
          <p className="text-xs text-slate-500">{friend.online ? "Online" : "Offline"}</p>
        </div>
      </div>
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-2 hover:bg-white rounded-lg transition-colors">
          <MessageSquare className="w-4 h-4 text-[#8f2c24]" />
        </button>
        <button className="p-2 hover:bg-white rounded-lg transition-colors">
          <UserPlus className="w-4 h-4 text-[#8f2c24]" />
        </button>
      </div>
    </div>
  );
}
