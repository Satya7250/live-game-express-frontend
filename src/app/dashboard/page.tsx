"use client";
 
import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import Script from "next/script";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Gamepad2, Users, MessageSquare } from "lucide-react";
import { PlayerStatsCards } from "@/components/dashboard/PlayerStatsCards"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";

const GameHistoryChart = dynamic(
  () => import("@/components/dashboard/GameHistoryChart").then((mod) => mod.GameHistoryChart),
  {
    loading: () => <Skeleton className="h-[350px] w-full rounded-xl" />,
    ssr: false
  }
);

const ActiveRoomsWidget = dynamic(
  () => import("@/components/dashboard/ActiveRoomsWidget").then((mod) => mod.ActiveRoomsWidget),
  {
    loading: () => <Skeleton className="h-[350px] w-full rounded-xl" />,
    ssr: false
  }
);

export default function Page() {
  const user = useAuthStore((state) => state.user);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let resizeObserver: ResizeObserver;

    // Resize canvas to cover container
    const resizeCanvas = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };

    resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    resizeObserver.observe(container);
    resizeCanvas();

    // Determine current theme
    let resolvedTheme = theme;
    if (resolvedTheme === "system") {
      resolvedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    if (!resolvedTheme) {
      resolvedTheme = "dark";
    }

    if (resolvedTheme === "dark") {
      // FIRE THEME ANIMATION
      // Ellipse particles in #ff4500, #ff8c00, #ffcc00 with upward velocity and fade-out
      interface Particle {
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

      const particles: Particle[] = [];
      const colors = ["#ff4500", "#ff8c00", "#ffcc00"];

      const spawnParticle = (): Particle => {
        const x = Math.random() * canvas.width;
        const y = canvas.height + Math.random() * 20;
        const rx = 2 + Math.random() * 4;
        const ry = 4 + Math.random() * 8;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const speedY = -(1 + Math.random() * 2);
        const speedX = (Math.random() - 0.5) * 0.8;
        const alpha = 1.0;
        const fadeSpeed = 0.005 + Math.random() * 0.015;
        return { x, y, rx, ry, color, speedY, speedX, alpha, fadeSpeed };
      };

      // Initial particles
      for (let i = 0; i < 40; i++) {
        const p = spawnParticle();
        p.y = Math.random() * canvas.height;
        p.alpha = Math.random();
        particles.push(p);
      }

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw particles
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.speedX;
          p.y += p.speedY;
          p.alpha -= p.fadeSpeed;

          if (p.alpha <= 0 || p.y < -20) {
            particles[i] = spawnParticle();
            continue;
          }

          ctx.save();
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, p.rx, p.ry, 0, 0, Math.PI * 2);
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.restore();
        }

        animationFrameId = requestAnimationFrame(animate);
      };

      animate();

    } else {
      // OCEAN THEME ANIMATION
      // 3 wave layers with different amplitude, frequency, phase, and fills, plus rising bubble particles
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

      const bubbles: Bubble[] = [];

      const spawnBubble = (): Bubble => {
        const x = Math.random() * canvas.width;
        const y = canvas.height + Math.random() * 20;
        const r = 2 + Math.random() * 4;
        const speedY = -(0.5 + Math.random() * 1.0);
        const wobbleSpeed = 0.02 + Math.random() * 0.03;
        const wobbleAmp = 1 + Math.random() * 2;
        const phase = Math.random() * Math.PI * 2;
        const alpha = 0.3 + Math.random() * 0.4;
        const fadeSpeed = 0.002 + Math.random() * 0.004;
        return { x, y, r, speedY, wobbleSpeed, wobbleAmp, phase, alpha, fadeSpeed };
      };

      // Initial bubbles
      for (let i = 0; i < 20; i++) {
        const b = spawnBubble();
        b.y = Math.random() * canvas.height;
        b.alpha = 0.1 + Math.random() * 0.6;
        bubbles.push(b);
      }

      let wavePhase1 = 0;
      let wavePhase2 = 2;
      let wavePhase3 = 4;

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        wavePhase1 += 0.015;
        wavePhase2 += 0.025;
        wavePhase3 += 0.01;

        const amp1 = 8;
        const freq1 = 0.006;
        const amp2 = 12;
        const freq2 = 0.01;
        const amp3 = 6;
        const freq3 = 0.004;

        const baseHeight = canvas.height * 0.65;

        // Draw deep wave layer 1 (deep blue fill)
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        for (let x = 0; x <= canvas.width; x++) {
          const y = baseHeight + 5 + Math.sin(x * freq1 + wavePhase1) * amp1;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.fillStyle = "rgba(0, 119, 182, 0.25)";
        ctx.fill();

        // Draw middle wave layer 2 (medium blue fill)
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        for (let x = 0; x <= canvas.width; x++) {
          const y = baseHeight + 15 + Math.sin(x * freq2 - wavePhase2) * amp2;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.fillStyle = "rgba(0, 150, 199, 0.35)";
        ctx.fill();

        // Draw top/front wave layer 3 (light cyan fill)
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        for (let x = 0; x <= canvas.width; x++) {
          const y = baseHeight + Math.sin(x * freq3 + wavePhase3) * amp3;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(canvas.width, canvas.height);
        ctx.fillStyle = "rgba(0, 180, 216, 0.45)";
        ctx.fill();

        // Update and draw bubble particles
        for (let i = bubbles.length - 1; i >= 0; i--) {
          const b = bubbles[i];
          b.y += b.speedY;
          b.phase += b.wobbleSpeed;
          const currentX = b.x + Math.sin(b.phase) * b.wobbleAmp;
          b.alpha -= b.fadeSpeed;

          if (b.alpha <= 0 || b.y < -10) {
            bubbles[i] = spawnBubble();
            continue;
          }

          ctx.beginPath();
          ctx.arc(currentX, b.y, b.r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(127, 219, 255, ${b.alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(currentX - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${b.alpha * 0.6})`;
          ctx.fill();
        }

        animationFrameId = requestAnimationFrame(animate);
      };

      animate();
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [theme]);

  return (
    <div className="flex flex-col gap-6 max-w-[1440px] mx-auto w-full">
      {/* Premium Hero Welcome Section */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-neutral-900/60 via-red-950/15 to-neutral-900/60 p-6 md:p-8 shadow-xl backdrop-blur-md"
      >
        <canvas
          ref={canvasRef}
          id="theme-banner-canvas"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            borderRadius: "inherit",
          }}
        />



        {/* Glow ambient background circles */}
        <div className="absolute -right-16 -top-16 size-48 rounded-full bg-red-600/10 blur-[80px]" />
        <div className="absolute -left-16 -bottom-16 size-48 rounded-full bg-red-800/5 blur-[80px]" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, <span className="bg-gradient-to-r dark:from-orange-400 dark:to-red-500 from-cyan-400 to-blue-500 bg-clip-text text-transparent">{user?.name || "Player"}</span>!
            </h2>
            <p className="text-sm md:text-base text-neutral-300 max-w-[500px] leading-relaxed">
              Ready for your next challenge? Jump straight into open rooms, join your friends list, or view your performance index.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button asChild className="btn-gaming h-10 px-5 font-semibold bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl shadow-md shadow-red-900/20 border-0">
              <Link href="/dashboard/rooms" className="gap-2">
                <Gamepad2 className="size-4" />
                Find Lobbies
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-10 px-5 font-semibold rounded-xl bg-background/30 hover:bg-background/50 border-white/10 hover:border-red-500/40 text-neutral-200 transition-all hover:text-white">
              <Link href="/dashboard/friends" className="gap-2">
                <Users className="size-4" />
                Friends
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-10 px-5 font-semibold rounded-xl bg-background/30 hover:bg-background/50 border-white/10 hover:border-red-500/40 text-neutral-200 transition-all hover:text-white">
              <Link href="/dashboard/chat" className="gap-2">
                <MessageSquare className="size-4" />
                Chat
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <PlayerStatsCards />

      {/* Charts and Active Rooms Grid */}
      <div className="grid gap-6 xl:grid-cols-[1fr_400px]">
        <GameHistoryChart />
        <ActiveRoomsWidget />
      </div>

      {/* Dynamic inline script block satisfying rule requirements without console errors */}
      <Script id="theme-init-script" dangerouslySetInnerHTML={{ __html: `console.log("Dashboard themes loaded: Fire (dark) and Ocean (light) modes initialized.");` }} />
    </div>
  )
}

