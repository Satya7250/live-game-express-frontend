"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Command } from "lucide-react"
import { sidebarItems } from "@/constants/sidebar"
import { useAuthStore } from "@/store/auth.store"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useAuthStore((state) => state.user)
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
  const { theme } = useTheme()

  const userData = user ? {
    name: user.name,
    email: user.email,
    avatar: user.avatar || "",
  } : null

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const parent = canvas.parentElement
    if (!parent) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let resizeObserver: ResizeObserver

    const resizeCanvas = () => {
      canvas.width = parent.offsetWidth
      canvas.height = parent.offsetHeight
    }

    resizeObserver = new ResizeObserver(() => {
      resizeCanvas()
    })
    resizeObserver.observe(parent)
    resizeCanvas()

    let resolvedTheme = theme
    if (resolvedTheme === "system") {
      resolvedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    }
    if (!resolvedTheme) {
      resolvedTheme = "dark"
    }

    if (resolvedTheme === "dark") {
      // FIRE THEME SIDEBAR ANIMATION - Rising embers
      interface Ember {
        x: number;
        y: number;
        rx: number;
        ry: number;
        color: string;
        speedY: number;
        speedX: number;
        alpha: number;
        fadeSpeed: number;
      }

      const embers: Ember[] = []
      const colors = ["#ff4500", "#ff8c00", "#ffcc00"]

      const spawnEmber = (initial = false): Ember => {
        const x = Math.random() * canvas.width
        const y = initial ? Math.random() * canvas.height : canvas.height + Math.random() * 20
        const rx = 1 + Math.random() * 2
        const ry = 2 + Math.random() * 4
        const color = colors[Math.floor(Math.random() * colors.length)]
        const speedY = -(0.5 + Math.random() * 1.0)
        const speedX = (Math.random() - 0.5) * 0.3
        const alpha = initial ? Math.random() : 1.0
        const fadeSpeed = 0.002 + Math.random() * 0.004
        return { x, y, rx, ry, color, speedY, speedX, alpha, fadeSpeed }
      }

      for (let i = 0; i < 35; i++) {
        embers.push(spawnEmber(true))
      }

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        for (let i = embers.length - 1; i >= 0; i--) {
          const e = embers[i]
          e.x += e.speedX
          e.y += e.speedY
          e.alpha -= e.fadeSpeed

          if (e.alpha <= 0 || e.y < -10) {
            embers[i] = spawnEmber(false)
            continue
          }

          ctx.save()
          ctx.beginPath()
          ctx.ellipse(e.x, e.y, e.rx, e.ry, 0, 0, Math.PI * 2)
          ctx.globalAlpha = e.alpha
          ctx.fillStyle = e.color
          ctx.shadowBlur = 6
          ctx.shadowColor = e.color
          ctx.fill()
          ctx.restore()
        }

        animationFrameId = requestAnimationFrame(animate)
      }

      animate()
    } else {
      // OCEAN THEME SIDEBAR ANIMATION - Waves at the bottom + rising bubbles
      interface Bubble {
        x: number;
        y: number;
        r: number;
        speedY: number;
        wobbleSpeed: number;
        wobbleAmp: number;
        phase: number;
        alpha: number;
        fadeSpeed: number;
      }

      const bubbles: Bubble[] = []

      const spawnBubble = (initial = false): Bubble => {
        const x = Math.random() * canvas.width
        const y = initial ? Math.random() * canvas.height : canvas.height + Math.random() * 20
        const r = 1.5 + Math.random() * 2.5
        const speedY = -(0.3 + Math.random() * 0.6)
        const wobbleSpeed = 0.01 + Math.random() * 0.02
        const wobbleAmp = 0.5 + Math.random() * 1.0
        const phase = Math.random() * Math.PI * 2
        const alpha = initial ? 0.1 + Math.random() * 0.4 : 0.3 + Math.random() * 0.3
        const fadeSpeed = 0.001 + Math.random() * 0.002
        return { x, y, r, speedY, wobbleSpeed, wobbleAmp, phase, alpha, fadeSpeed }
      }

      for (let i = 0; i < 20; i++) {
        bubbles.push(spawnBubble(true))
      }

      let wavePhase1 = 0
      let wavePhase2 = 1.5
      let wavePhase3 = 3.0

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        wavePhase1 += 0.01
        wavePhase2 += 0.018
        wavePhase3 += 0.007

        const baseHeight = canvas.height - 40
        const amp1 = 5
        const freq1 = 0.02
        const amp2 = 7
        const freq2 = 0.035
        const amp3 = 4
        const freq3 = 0.015

        ctx.beginPath()
        ctx.moveTo(0, canvas.height)
        for (let x = 0; x <= canvas.width; x++) {
          const y = baseHeight + 5 + Math.sin(x * freq1 + wavePhase1) * amp1
          ctx.lineTo(x, y)
        }
        ctx.lineTo(canvas.width, canvas.height)
        ctx.fillStyle = "rgba(0, 119, 182, 0.15)"
        ctx.fill()

        ctx.beginPath()
        ctx.moveTo(0, canvas.height)
        for (let x = 0; x <= canvas.width; x++) {
          const y = baseHeight + 10 + Math.sin(x * freq2 - wavePhase2) * amp2
          ctx.lineTo(x, y)
        }
        ctx.lineTo(canvas.width, canvas.height)
        ctx.fillStyle = "rgba(0, 150, 199, 0.2)"
        ctx.fill()

        ctx.beginPath()
        ctx.moveTo(0, canvas.height)
        for (let x = 0; x <= canvas.width; x++) {
          const y = baseHeight + Math.sin(x * freq3 + wavePhase3) * amp3
          ctx.lineTo(x, y)
        }
        ctx.lineTo(canvas.width, canvas.height)
        ctx.fillStyle = "rgba(0, 180, 216, 0.25)"
        ctx.fill()

        for (let i = bubbles.length - 1; i >= 0; i--) {
          const b = bubbles[i]
          b.y += b.speedY
          b.phase += b.wobbleSpeed
          const currentX = b.x + Math.sin(b.phase) * b.wobbleAmp
          b.alpha -= b.fadeSpeed

          if (b.alpha <= 0 || b.y < -10) {
            bubbles[i] = spawnBubble(false)
            continue
          }

          ctx.beginPath()
          ctx.arc(currentX, b.y, b.r, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(127, 219, 255, ${b.alpha})`
          ctx.lineWidth = 0.8
          ctx.stroke()
        }

        animationFrameId = requestAnimationFrame(animate)
      }

      animate()
    }

    return () => {
      cancelAnimationFrame(animationFrameId)
      resizeObserver.disconnect()
    }
  }, [theme])

  return (
    <Sidebar collapsible="offcanvas" {...props} className="border-r border-border/40 bg-sidebar backdrop-blur-xl">
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <SidebarHeader className="relative z-10 border-b border-border/40 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5! hover:bg-transparent"
              asChild
            >
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-red-800 text-white shadow-md shadow-red-950/20">
                  <Command className="size-4.5" />
                </div>
                <span className="text-base font-bold bg-gradient-to-r from-neutral-50 via-neutral-200 to-neutral-400 bg-clip-text text-transparent tracking-wide">
                  Live Game
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="relative z-10">
        <NavMain items={sidebarItems} />
      </SidebarContent>
      <SidebarFooter className="relative z-10">
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
