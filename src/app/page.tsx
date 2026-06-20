"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Flame, 
  Waves, 
  Swords, 
  User, 
  Mail, 
  Fingerprint, 
  Shield, 
  Phone, 
  MapPin, 
  BookOpen, 
  Calendar, 
  Clock, 
  Play, 
  ArrowRight, 
  Sparkles, 
  RefreshCw 
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  type: "fire" | "ocean";
}

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Interactive Tic-Tac-Toe Arena state
  const [board, setBoard] = useState<( "fire" | "ocean" | null)[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<"fire" | "ocean">("fire");
  const [winner, setWinner] = useState<"fire" | "ocean" | "draw" | null>(null);
  const [winningLine, setWinningLine] = useState<number[]>([]);

  // Winning lines mapping
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6]            // Diag
  ];

  const checkWinner = (newBoard: ("fire" | "ocean" | null)[]) => {
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
        setWinner(newBoard[a] as "fire" | "ocean");
        setWinningLine(lines[i]);
        return;
      }
    }
    if (newBoard.every(cell => cell !== null)) {
      setWinner("draw");
    }
  };

  const handleCellClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);
    
    checkWinner(newBoard);
    setTurn(turn === "fire" ? "ocean" : "fire");
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn("fire");
    setWinner(null);
    setWinningLine([]);
  };

  // Auto opponent if Ocean's turn
  useEffect(() => {
    if (turn === "ocean" && !winner) {
      const emptyCells = board
        .map((val, idx) => (val === null ? idx : null))
        .filter((val): val is number => val !== null);
      
      if (emptyCells.length > 0) {
        const timer = setTimeout(() => {
          const randomIdx = emptyCells[Math.floor(Math.random() * emptyCells.length)];
          handleCellClick(randomIdx);
        }, 600);
        return () => clearTimeout(timer);
      }
    }
  }, [turn, winner, board]);

  // Cursor move effects: Parallax blobs & Canvas particles
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // 1. Update CSS variables for parallax background blobs
      if (containerRef.current) {
        const { clientX, clientY } = e;
        const xPercent = (clientX / window.innerWidth) * 100;
        const yPercent = (clientY / window.innerHeight) * 100;
        
        containerRef.current.style.setProperty("--mouse-x", `${xPercent}%`);
        containerRef.current.style.setProperty("--mouse-y", `${yPercent}%`);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Canvas particle system (EMBERS & BUBBLES)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    // Fit canvas to window size
    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Track mouse position
    let lastMouseX = 0;
    let lastMouseY = 0;
    let isMouseMoving = false;
    let mouseTimeout: NodeJS.Timeout;

    const spawnParticles = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      isMouseMoving = true;
      clearTimeout(mouseTimeout);

      // Spawn rate based on movement speed
      const dist = Math.hypot(clientX - lastMouseX, clientY - lastMouseY);
      const count = Math.min(Math.floor(dist / 6) + 1, 4);

      for (let i = 0; i < count; i++) {
        const type = Math.random() > 0.5 ? "fire" : "ocean";
        
        // Spawn offset
        const offsetX = (Math.random() - 0.5) * 12;
        const offsetY = (Math.random() - 0.5) * 12;

        let color = "";
        let vx = (Math.random() - 0.5) * 1.5;
        let vy = 0;

        if (type === "fire") {
          // Fire embers: Red/Orange/Yellow sparks rising
          const colors = ["#ff4500", "#ff6a00", "#ffaa00", "#ff3300"];
          color = colors[Math.floor(Math.random() * colors.length)];
          vy = -Math.random() * 2 - 0.5; // Flow upwards
        } else {
          // Ocean bubbles: Cyan/Blue circles floating wavy
          const colors = ["#00b4d8", "#0077b6", "#7fdbff", "#00f0ff"];
          color = colors[Math.floor(Math.random() * colors.length)];
          vy = Math.random() * 1.2 - 0.2; // Flow floaty
          vx = (Math.random() - 0.5) * 2;
        }

        particles.push({
          x: clientX + offsetX,
          y: clientY + offsetY,
          vx,
          vy,
          size: Math.random() * 3.5 + 1.5,
          color,
          alpha: 1,
          decay: Math.random() * 0.02 + 0.015,
          type
        });
      }

      lastMouseX = clientX;
      lastMouseY = clientY;

      // Slow down spawning if mouse stops moving
      mouseTimeout = setTimeout(() => {
        isMouseMoving = false;
      }, 100);
    };

    window.addEventListener("mousemove", spawnParticles);

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render & update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.x < lastMouseX ? p.vx + 0.1 : p.vx - 0.1; // gentle magnetic pull to mouse path
        p.y += p.vy;
        p.alpha -= p.decay;
        p.size = Math.max(0.1, p.size - 0.02);

        if (p.alpha <= 0 || p.size <= 0.1) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;

        // Apply glow effect matching theme
        ctx.shadowBlur = p.type === "fire" ? 10 : 8;
        ctx.shadowColor = p.color;

        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", spawnParticles);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(mouseTimeout);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen w-full bg-[#020104] text-white overflow-x-hidden font-sans selection:bg-orange-500/30 selection:text-white"
    >
      
      {/* Styles for background and animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes floatParticles {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.15; }
          50% { transform: translateY(-30px) scale(1.1); opacity: 0.35; }
        }
        @keyframes drift {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(6%, 4%) scale(1.1); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes driftReverse {
          0% { transform: translate(0, 0) scale(1.1); }
          50% { transform: translate(-6%, -4%) scale(0.95); }
          100% { transform: translate(0, 0) scale(1.1); }
        }
        .fire-glow-blob {
          animation: drift 25s infinite ease-in-out;
        }
        .ocean-glow-blob {
          animation: driftReverse 20s infinite ease-in-out;
        }
        .interactive-glow-blob {
          left: var(--mouse-x, 50%);
          top: var(--mouse-y, 50%);
          transform: translate(-50%, -50%);
          transition: left 0.35s cubic-bezier(0.1, 0.8, 0.2, 1), top 0.35s cubic-bezier(0.1, 0.8, 0.2, 1);
        }
        .border-shifting {
          background: linear-gradient(90deg, #ff4500, #ff8c00, #00b4d8, #0077b6, #ff4500);
          background-size: 400% 100%;
          animation: borderMove 6s linear infinite;
        }
        @keyframes borderMove {
          0% { background-position: 0% 50%; }
          100% { background-position: 400% 50%; }
        }
      `}} />

      {/* Interactive canvas overlay for particles */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 pointer-events-none z-20"
      />

      {/* Background Gradients: Elemental Clash */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Static / Drift Blobs */}
        <div className="fire-glow-blob absolute -top-40 -left-40 size-[550px] rounded-full bg-gradient-to-br from-orange-600/20 to-red-900/0 blur-[130px]" />
        <div className="ocean-glow-blob absolute -bottom-60 -right-40 size-[650px] rounded-full bg-gradient-to-tl from-cyan-500/15 to-blue-900/0 blur-[150px]" />

        {/* Cursor interactive glow blob (Wow factor: centers a shifting color vortex on your mouse!) */}
        <div className="interactive-glow-blob absolute size-[380px] rounded-full bg-gradient-to-r from-orange-500/5 via-purple-600/5 to-cyan-500/5 blur-[100px] opacity-80" />

        {/* Diagonal Split Grid Mesh */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.05] bg-[#020104]/40 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
            <div className="relative flex items-center justify-center size-9 rounded-xl bg-gradient-to-br from-orange-500 to-cyan-500 p-[1.5px] shadow-lg shadow-orange-500/10 group-hover:shadow-cyan-500/15 transition-all duration-300">
              <div className="flex size-full items-center justify-center rounded-[10px] bg-[#020104] text-white">
                <Swords className="size-4.5 text-orange-500 group-hover:text-cyan-400 transition-colors duration-300" />
              </div>
            </div>
            <span className="text-md font-bold tracking-wider uppercase text-white font-heading group-hover:text-neutral-200 transition-colors duration-300">
              Ignis <span className="text-neutral-400 group-hover:text-neutral-500">&amp;</span> Aqua
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Button asChild size="sm" className="btn-gaming bg-primary hover:bg-primary/95 text-white font-semibold rounded-lg shadow-md shadow-red-900/10 gap-2">
                <Link href="/dashboard">
                  Enter Dashboard
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Link 
                  href="/login" 
                  className="text-sm font-semibold text-neutral-300 hover:text-white transition-colors px-3 py-1.5"
                >
                  Sign In
                </Link>
                <Button asChild size="sm" className="btn-gaming bg-primary hover:bg-primary/95 text-white font-semibold rounded-lg shadow-md shadow-red-900/10">
                  <Link href="/signup">
                    Get Started
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
        
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-xs font-semibold text-neutral-300">
              <Sparkles className="size-3.5 text-orange-400" />
              <span>Real-Time Arena &bull; Interactive Embers Enabled</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl font-heading leading-tight">
              Ignite Your Game.<br />
              <span className="bg-gradient-to-r from-orange-500 via-red-500 to-cyan-500 bg-clip-text text-transparent">
                Immerse Your Soul.
              </span>
            </h1>

            <p className="text-base text-neutral-400 max-w-xl leading-relaxed">
              Step into the ultimate multiplayer battleground where the fierce energy of **Fire** matchmaking clashes with the deep, fluid connections of our **Ocean** lobby systems. Play, coordinate, and conquer.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button asChild size="lg" className="btn-gaming bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold rounded-xl shadow-lg shadow-orange-950/30 gap-2">
                <Link href={isAuthenticated ? "/dashboard/rooms" : "/signup"}>
                  <Play className="size-4.5 fill-white" />
                  Launch Arena
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-11 font-semibold border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/5 text-neutral-300 hover:text-white rounded-xl transition-all gap-2">
                <Link href={isAuthenticated ? "/dashboard/chat" : "/login"}>
                  Explore Lobby
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

            {/* Stats list */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/[0.05] max-w-lg">
              <div className="space-y-1">
                <p className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">0ms</p>
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Latency Delay</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold bg-gradient-to-r from-red-500 to-cyan-500 bg-clip-text text-transparent">24/7</p>
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Socket Rooms</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">100%</p>
                <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Fair Matchplay</p>
              </div>
            </div>

          </div>

          {/* Hero Right Content: Interactive Game Showcase */}
          <div className="lg:col-span-5 flex justify-center">
            
            <div className="relative w-full max-w-[380px] p-6 rounded-3xl bg-neutral-900/40 backdrop-blur-lg border border-white/5 shadow-2xl shadow-black/85">
              
              {/* Corner lights */}
              <div className="absolute top-0 left-0 size-2 bg-orange-500 blur-sm rounded-full" />
              <div className="absolute bottom-0 right-0 size-2 bg-cyan-500 blur-sm rounded-full" />

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5">
                  <div className="size-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">TTT Demo Arena</span>
                </div>
                
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={resetGame} 
                  className="size-7 text-neutral-400 hover:text-white hover:bg-white/5 rounded-md"
                  title="Reset Game"
                >
                  <RefreshCw className="size-3.5" />
                </Button>
              </div>

              {/* Game status */}
              <div className="p-3 mb-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`flex items-center justify-center size-6 rounded-md ${turn === "fire" ? "bg-orange-500/10 text-orange-500" : "bg-cyan-500/10 text-cyan-400"}`}>
                    {turn === "fire" ? <Flame className="size-3.5 fill-orange-500/20" /> : <Waves className="size-3.5" />}
                  </div>
                  <span className="font-semibold text-neutral-300">
                    {winner ? (winner === "draw" ? "Arena Tied" : `${winner === "fire" ? "Fire" : "Ocean"} Wins!`) : `${turn === "fire" ? "Fire" : "Ocean"}'s turn`}
                  </span>
                </div>

                <div className="text-xs font-bold text-neutral-500">
                  {winner ? "Game Over" : turn === "ocean" ? "AI Thinking..." : "Your Play"}
                </div>
              </div>

              {/* Grid board */}
              <div className="grid grid-cols-3 gap-2">
                {board.map((cell, index) => {
                  const isWinningCell = winningLine.includes(index);
                  return (
                    <button
                      key={index}
                      onClick={() => handleCellClick(index)}
                      disabled={turn === "ocean" || winner !== null}
                      className={`relative flex items-center justify-center aspect-square rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden
                        ${cell === null 
                          ? "bg-white/[0.01] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/10" 
                          : cell === "fire" 
                            ? "bg-orange-600/10 border-orange-500/30 text-orange-500 shadow-inner shadow-orange-500/5" 
                            : "bg-cyan-600/10 border-cyan-500/30 text-cyan-400 shadow-inner shadow-cyan-500/5"
                        }
                        ${isWinningCell ? "border-shifting scale-95 border-opacity-100 ring-2 ring-white/10" : ""}
                      `}
                    >
                      {cell === "fire" && (
                        <Flame className={`size-8 fill-orange-500/10 ${isWinningCell ? "animate-pulse text-white fill-white/10" : ""}`} />
                      )}
                      {cell === "ocean" && (
                        <Waves className={`size-8 ${isWinningCell ? "animate-pulse text-white" : ""}`} />
                      )}
                      
                      {/* Hover runes */}
                      {cell === null && (
                        <span className="absolute inset-0 opacity-0 hover:opacity-100 flex items-center justify-center text-white/5 transition-opacity text-xs font-bold font-mono">
                          {turn === "fire" ? "🔥" : "💧"}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <p className="text-[10px] text-center text-neutral-500 mt-4 leading-relaxed">
                Click any cell above to battle as **Fire** runes against the automated **Ocean** AI.
              </p>

            </div>

          </div>

        </div>

      </main>

      {/* CLASH OF ELEMENTALS SECTION */}
      <section className="relative z-30 py-20 border-t border-white/[0.05] bg-[#040307]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-xs font-bold tracking-widest text-primary uppercase">Two Worlds, One Platform</h2>
            <h3 className="text-3xl font-bold sm:text-4xl font-heading">The Clash of Fire and Water</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              We divide the gaming stack into two unique elemental interfaces, blending intense match competition with relaxing, immersive social experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Fire Card - Competitive */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-orange-600/5 to-transparent border border-orange-500/10 hover:border-orange-500/20 hover:shadow-[0_0_30px_rgba(255,69,0,0.08)] transition-all duration-300 group">
              <div className="flex items-center gap-4 mb-4 sm:mb-6">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500 border border-orange-500/20 shadow-lg shadow-orange-500/5 group-hover:scale-105 transition-all">
                  <Flame className="size-6 fill-orange-500/10" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">The Fire Realm</h4>
                  <p className="text-xs text-orange-400/80 font-medium tracking-wider">COMPETITIVE MATCHES</p>
                </div>
              </div>

              <p className="text-sm text-neutral-400 leading-relaxed mb-4 sm:mb-6">
                High-energy game room setup, instant socket matchmaking, and live room lobby management. Build custom parameters, limit players, and invite challengers into your room instantly.
              </p>

              <ul className="space-y-2.5 sm:space-y-3.5 text-sm text-neutral-300">
                <li className="flex items-center gap-2.5">
                  <div className="size-1.5 rounded-full bg-orange-500 shrink-0" />
                  <span>Real-time Room Creation &amp; Joining</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="size-1.5 rounded-full bg-orange-500 shrink-0" />
                  <span>Socket-based Tic-Tac-Toe matchmaking</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="size-1.5 rounded-full bg-orange-500 shrink-0" />
                  <span>Interactive local player challenge modes</span>
                </li>
              </ul>
            </div>

            {/* Ocean Card - Social */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-cyan-600/5 to-transparent border border-cyan-500/10 hover:border-cyan-500/20 hover:shadow-[0_0_30px_rgba(0,180,216,0.08)] transition-all duration-300 group">
              <div className="flex items-center gap-4 mb-4 sm:mb-6">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-lg shadow-cyan-500/5 group-hover:scale-105 transition-all">
                  <Waves className="size-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">The Ocean Depths</h4>
                  <p className="text-xs text-cyan-400/80 font-medium tracking-wider">SOCIAL LOBBY HUBS</p>
                </div>
              </div>

              <p className="text-sm text-neutral-400 leading-relaxed mb-4 sm:mb-6">
                Deeply integrated real-time chats, globally-sync'd friends directories, and notification streams. Stay synchronized with your squad and check active statuses with fluid ease.
              </p>

              <ul className="space-y-2.5 sm:space-y-3.5 text-sm text-neutral-300">
                <li className="flex items-center gap-2.5">
                  <div className="size-1.5 rounded-full bg-cyan-500 shrink-0" />
                  <span>Global Sync Friends directories &amp; Requests</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="size-1.5 rounded-full bg-cyan-500 shrink-0" />
                  <span>Real-time Socket Chat Hub &amp; Typing states</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="size-1.5 rounded-full bg-cyan-500 shrink-0" />
                  <span>Instant alerts with clean notification panels</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-30 border-t border-white/[0.05] py-8 bg-[#020104] text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
            <Swords className="size-4 text-orange-500" />
            <span>Ignis &amp; Aqua &bull; Arena &bull; {new Date().getFullYear()}</span>
          </div>
          <p className="text-xs">&copy; {new Date().getFullYear()} Ignis &amp; Aqua. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
