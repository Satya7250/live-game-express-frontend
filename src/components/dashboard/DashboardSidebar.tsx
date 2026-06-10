"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarItems } from "@/constants/sidebar";

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-sidebar">
      <div className="p-6">
        <h2 className="text-xl font-bold text-sidebar-foreground">
          Live Game
        </h2>
      </div>

      <nav className="px-4 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors
                ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
            >
              <item.icon size={20} className="text-current" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}