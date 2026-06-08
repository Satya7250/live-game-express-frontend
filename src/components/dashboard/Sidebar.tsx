import {
  Home,
  MessageSquare,
  Gamepad2,
  Bell,
  Users,
  BarChart3,
  Wallet,
  Settings,
  LogOut,
  Trophy,
} from "lucide-react";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const menuItems = [
  { id: "home", icon: Home, label: "Dashboard" },
  { id: "games", icon: Gamepad2, label: "Games" },
  { id: "leaderboard", icon: Trophy, label: "Leaderboard" },
  { id: "chat", icon: MessageSquare, label: "Messages" },
  { id: "friends", icon: Users, label: "Friends" },
  { id: "notifications", icon: Bell, label: "Notifications" },
  { id: "analytics", icon: BarChart3, label: "Analytics" },
  { id: "wallet", icon: Wallet, label: "My Wallet" },
  { id: "settings", icon: Settings, label: "Settings" },
];

export default function Sidebar({ activeSection, setActiveSection }: SidebarProps) {
  return (
    <aside className="w-64 bg-white/80 backdrop-blur-sm border-r border-slate-200 shadow-lg flex flex-col p-6 sticky top-0 h-screen overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8f2c24] to-[#d64c42] flex items-center justify-center">
          <Gamepad2 className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-[#8f2c24]">GameHub</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-[#8f2c24] to-[#d64c42] text-white shadow-lg"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-red-50 transition-colors">
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Log out</span>
      </button>
    </aside>
  );
}
