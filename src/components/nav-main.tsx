"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useNotificationStore } from "@/store/notification.store"

export function NavMain({
  items,
}: {
  items: {
    label: string
    href: string
    icon: React.ElementType
  }[]
}) {
  const pathname = usePathname()
  const unreadCount = useNotificationStore((state) => state.unreadCount)
  
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const Icon = item.icon
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                  className="text-sidebar-foreground"
                >
                  <Link href={item.href} className="text-sidebar-foreground flex items-center w-full">
                    <Icon className="text-sidebar-foreground shrink-0" />
                    <span className="text-sidebar-foreground">{item.label}</span>
                    {item.label === "Notifications" && unreadCount > 0 && (
                      <span className="ml-auto flex size-5 shrink-0 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground ring-1 ring-background animate-pulse">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
