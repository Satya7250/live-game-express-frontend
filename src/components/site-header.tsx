"use client"

import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function SiteHeader() {
  const { setTheme, theme } = useTheme()
  const pathname = usePathname()

  const getPageTitle = () => {
    if (pathname.startsWith("/dashboard/rooms")) {
      if (pathname.includes("/game")) return "Game Arena";
      return "Game Rooms Lobby";
    }
    if (pathname.startsWith("/dashboard/chat")) return "Chat Hub";
    if (pathname.startsWith("/dashboard/notifications")) return "Notifications";
    if (pathname.startsWith("/dashboard/friends")) return "Friends";
    if (pathname.startsWith("/dashboard/profile")) return "Profile Settings";
    if (pathname.startsWith("/dashboard/change-password")) return "Security";
    if (pathname.startsWith("/dashboard/games")) return "Game Arena";
    return "Lobby Overview";
  };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center border-b border-border/30 bg-background/30 backdrop-blur-xl transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) sticky top-0 z-50">
      <div className="flex w-full items-center justify-between gap-4 px-4 lg:px-6">
        <div className="flex items-center gap-1.5">
          <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors rounded-lg" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4 border-border/40"
          />
          <h1 className="text-sm font-semibold tracking-wide text-foreground uppercase bg-gradient-to-r from-neutral-50 to-neutral-300 bg-clip-text text-transparent">
            {getPageTitle()}
          </h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="size-9 rounded-xl hover:bg-muted/40 transition-colors"
        >
          <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-muted-foreground hover:text-foreground" />
          <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-muted-foreground hover:text-foreground" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  )
}
