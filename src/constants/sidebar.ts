import {
  LayoutDashboard,
  User,
  Lock,
  Users,
  Bell,
  MessageCircle,
  Gamepad2,
} from "lucide-react";

export const sidebarItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    label: "Change Password",
    href: "/dashboard/change-password",
    icon: Lock,
  },
  {
    label: "Friends",
    href: "/dashboard/friends",
    icon: Users,
  },
  {
    label: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
  },
  {
    label: "Chat",
    href: "/dashboard/chat",
    icon: MessageCircle,
  },
  {
    label: "Rooms",
    href: "/dashboard/rooms",
    icon: Gamepad2,
  },
];