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
            const isActive = pathname === item.href
            return (
              <SidebarMenuItem key={item.href} className="relative px-1">
                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-1.5 rounded-r-md bg-primary shadow-[0_0_8px_rgba(220,38,38,0.6)]" />
                )}
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.label}
                  className={`transition-all duration-200 ${
                    isActive 
                      ? "bg-primary/8 text-primary font-bold border border-primary/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]" 
                      : "hover:bg-sidebar-accent/50 text-sidebar-foreground/80 hover:text-sidebar-foreground"
                  }`}
                >
                  <Link href={item.href} className="text-sidebar-foreground flex items-center w-full gap-3 px-3">
                    <Icon className={`size-4.5 shrink-0 transition-transform duration-200 ${
                      isActive ? "text-primary scale-110" : "text-muted-foreground"
                    }`} />
                    <span className="font-medium">{item.label}</span>
                    {item.label === "Notifications" && unreadCount > 0 && (
                      <span className="ml-auto flex size-5 shrink-0 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground ring-1 ring-background animate-pulse shadow-sm shadow-destructive/40">
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
