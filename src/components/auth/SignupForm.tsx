"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { 
  Eye, 
  EyeOff, 
  Loader2, 
  Swords, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  MapPin, 
  BookOpen, 
  Sparkles,
  Flame,
  Waves
} from "lucide-react";

import { signupSchema, type SignupFormData } from "@/schemas/signup.schema";
import { useAuth } from "@/hooks/useAuth";
import AvatarUpload from "./avatar-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const LEAVES = [
  "/leaf_01.png",
  "/leaf_02.png",
  "/leaf_03.png",
  "/leaf_04.png",
  "/leaf_01.png",
  "/leaf_02.png",
  "/leaf_03.png",
  "/leaf_04.png",
];

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

export default function SignupForm() {
  const router = useRouter();
  const { signup, loading: authLoading, error } = useAuth();

  const [imageUploading, setImageUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "player",
      avatar: "",
      phone: "",
      address: "",
      bio: "",
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      const { confirmPassword, ...signupData } = data;
      const response = await signup(signupData);

      toast.success(
        response.message ||
          "Account created! Check your email to verify your account before logging in."
      );

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: unknown) {
      toast.error(
        isAxiosError(err)
          ? (err.response?.data as { message?: string })?.message ||
              "Registration failed. Please try again."
          : "Registration failed. Please try again."
      );
    }
  };

  const buttonText = imageUploading
    ? "Uploading Image..."
    : authLoading
    ? "Creating Account..."
    : "Sign Up";

  const isSubmitting = imageUploading || authLoading;

  // Cursor move effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
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

  // Canvas particles (EMBERS & BUBBLES)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let lastMouseX = 0;
    let lastMouseY = 0;

    const spawnParticles = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const dist = Math.hypot(clientX - lastMouseX, clientY - lastMouseY);
      const count = Math.min(Math.floor(dist / 8) + 1, 3);

      for (let i = 0; i < count; i++) {
        const type = Math.random() > 0.5 ? "fire" : "ocean";
        const offsetX = (Math.random() - 0.5) * 10;
        const offsetY = (Math.random() - 0.5) * 10;

        let color = "";
        let vx = (Math.random() - 0.5) * 1.2;
        let vy = 0;

        if (type === "fire") {
          const colors = ["#ff4500", "#ff6a00", "#ffaa00", "#ff3300"];
          color = colors[Math.floor(Math.random() * colors.length)];
          vy = -Math.random() * 1.8 - 0.4;
        } else {
          const colors = ["#00b4d8", "#0077b6", "#7fdbff", "#00f0ff"];
          color = colors[Math.floor(Math.random() * colors.length)];
          vy = Math.random() * 1.0 - 0.1;
          vx = (Math.random() - 0.5) * 1.5;
        }

        particles.push({
          x: clientX + offsetX,
          y: clientY + offsetY,
          vx,
          vy,
          size: Math.random() * 3 + 1,
          color,
          alpha: 1,
          decay: Math.random() * 0.02 + 0.015,
          type
        });
      }

      lastMouseX = clientX;
      lastMouseY = clientY;
    };

    window.addEventListener("mousemove", spawnParticles);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
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
        ctx.shadowBlur = p.type === "fire" ? 8 : 6;
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
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen w-full bg-[#020104] text-white flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto py-10 font-sans selection:bg-orange-500/30 selection:text-white"
    >
      
      {/* Styles for parallax blur animation */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes drift {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(5%, 5%) scale(1.05); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes driftReverse {
          0% { transform: translate(0, 0) scale(1.05); }
          50% { transform: translate(-5%, -5%) scale(0.95); }
          100% { transform: translate(0, 0) scale(1.05); }
        }
        .fire-glow-blob {
          animation: drift 20s infinite ease-in-out;
        }
        .ocean-glow-blob {
          animation: driftReverse 18s infinite ease-in-out;
        }
        .interactive-glow-blob {
          left: var(--mouse-x, 50%);
          top: var(--mouse-y, 50%);
          transform: translate(-50%, -50%);
          transition: left 0.4s cubic-bezier(0.1, 0.8, 0.2, 1), top 0.4s cubic-bezier(0.1, 0.8, 0.2, 1);
        }
      `}} />

      {/* Particle canvas overlay */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 pointer-events-none z-20"
      />

      {/* Background Gradients: Elemental Clash */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Fire Blur Blob */}
        <div className="fire-glow-blob absolute -top-20 -left-20 size-[450px] rounded-full bg-gradient-to-br from-orange-600/15 to-red-900/0 blur-[110px]" />
        
        {/* Ocean Blur Blob */}
        <div className="ocean-glow-blob absolute -bottom-40 -right-20 size-[550px] rounded-full bg-gradient-to-tl from-cyan-500/10 to-blue-900/0 blur-[130px]" />

        {/* Cursor interactive glow blob */}
        <div className="interactive-glow-blob absolute size-[300px] rounded-full bg-gradient-to-r from-orange-500/5 via-purple-600/5 to-cyan-500/5 blur-[90px] opacity-75" />

        {/* Diagonal Split Grid Mesh */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Falling Leaves Background */}
      <div className="leaves absolute inset-0 pointer-events-none z-10 overflow-hidden">
        <div className="set relative w-full h-full">
          {LEAVES.map((leaf, index) => (
            <div key={`${leaf}-${index}`}>
              <Image
                src={leaf}
                alt=""
                aria-hidden="true"
                width={80}
                height={80}
                priority
                style={{
                  width: "auto",
                  height: "auto",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Subtle Bottom Footer */}
      <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none z-10 select-none">
        <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-600 font-semibold">
          Ignis &amp; Aqua Arena Matchmaking Lobby • v1.0.0
        </p>
      </div>

      {/* SIGNUP CARD CONTAINER */}
      <div className="relative z-30 w-full max-w-2xl p-[1px] rounded-3xl bg-gradient-to-br from-orange-500/20 via-purple-500/10 to-cyan-500/20 shadow-2xl shadow-black/80">
        <div className="w-full p-8 rounded-[23px] bg-neutral-950/80 backdrop-blur-2xl flex flex-col gap-6">
          
          {/* Logo / Header Branding */}
          <div className="flex flex-col items-center gap-3 text-center">
            <Link href="/" className="flex items-center gap-2 group cursor-pointer">
              <div className="relative flex items-center justify-center size-9 rounded-xl bg-gradient-to-br from-orange-500 to-cyan-500 p-[1.5px] shadow-lg shadow-orange-500/10 transition-all duration-300">
                <div className="flex size-full items-center justify-center rounded-[10px] bg-[#020104] text-white">
                  <Swords className="size-4.5 text-orange-500 group-hover:text-cyan-400 transition-colors duration-300" />
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Flame className="size-4 text-orange-500 animate-pulse" />
                <span className="text-md font-bold tracking-wider uppercase text-white font-heading">
                  Ignis <span className="text-neutral-400">&amp;</span> Aqua
                </span>
                <Waves className="size-4 text-cyan-400 animate-pulse" />
              </div>
            </Link>
            <div className="mt-1 space-y-1">
              <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-orange-400 via-white to-cyan-400 bg-clip-text text-transparent font-heading">Create Account</h2>
              <p className="text-xs text-neutral-400">Join the Ignis & Aqua matchmaking arena lobby</p>
            </div>
          </div>

          {/* Form Elements */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            
            {/* Avatar Upload */}
            <div className="flex flex-col items-center justify-center">
              <Controller
                name="avatar"
                control={control}
                render={({ field }) => (
                  <AvatarUpload
                    value={field.value}
                    onChange={field.onChange}
                    onUploading={setImageUploading}
                  />
                )}
              />
              {errors.avatar && (
                <p className="mt-2 text-sm text-red-500">{errors.avatar.message}</p>
              )}
            </div>

            {/* Form Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-neutral-300 font-semibold text-xs uppercase tracking-wider">Full Name</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                    <User className="size-4" />
                  </span>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    disabled={isSubmitting}
                    className="pl-10 h-10 bg-white/[0.03] border-white/10 text-white placeholder:text-neutral-600 focus-visible:border-cyan-500/50 focus-visible:ring-cyan-500/20 focus-visible:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all duration-200"
                    {...register("name")}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-neutral-300 font-semibold text-xs uppercase tracking-wider">Email Address</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                    <Mail className="size-4" />
                  </span>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    disabled={isSubmitting}
                    className="pl-10 h-10 bg-white/[0.03] border-white/10 text-white placeholder:text-neutral-600 focus-visible:border-cyan-500/50 focus-visible:ring-cyan-500/20 focus-visible:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all duration-200"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-neutral-300 font-semibold text-xs uppercase tracking-wider">Phone Number (optional)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                    <Phone className="size-4" />
                  </span>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter phone number"
                    disabled={isSubmitting}
                    className="pl-10 h-10 bg-white/[0.03] border-white/10 text-white placeholder:text-neutral-600 focus-visible:border-purple-500/50 focus-visible:ring-purple-500/20 focus-visible:shadow-[0_0_15px_rgba(168,85,247,0.15)] transition-all duration-200"
                    {...register("phone")}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                )}
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-neutral-300 font-semibold text-xs uppercase tracking-wider">Address (optional)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                    <MapPin className="size-4" />
                  </span>
                  <Input
                    id="address"
                    placeholder="Enter your address"
                    disabled={isSubmitting}
                    className="pl-10 h-10 bg-white/[0.03] border-white/10 text-white placeholder:text-neutral-600 focus-visible:border-purple-500/50 focus-visible:ring-purple-500/20 focus-visible:shadow-[0_0_15px_rgba(168,85,247,0.15)] transition-all duration-200"
                    {...register("address")}
                  />
                </div>
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-neutral-300 font-semibold text-xs uppercase tracking-wider">Password</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                    <Lock className="size-4" />
                  </span>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create password"
                    disabled={isSubmitting}
                    className="pl-10 pr-10 h-10 bg-white/[0.03] border-white/10 text-white placeholder:text-neutral-600 focus-visible:border-orange-500/50 focus-visible:ring-orange-500/20 focus-visible:shadow-[0_0_15px_rgba(249,115,22,0.15)] transition-all duration-200"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-neutral-300 font-semibold text-xs uppercase tracking-wider">Confirm Password</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                    <Lock className="size-4" />
                  </span>
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    disabled={isSubmitting}
                    className="pl-10 pr-10 h-10 bg-white/[0.03] border-white/10 text-white placeholder:text-neutral-600 focus-visible:border-orange-500/50 focus-visible:ring-orange-500/20 focus-visible:shadow-[0_0_15px_rgba(249,115,22,0.15)] transition-all duration-200"
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Bio - Spans full width on grid */}
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="bio" className="text-neutral-300 font-semibold text-xs uppercase tracking-wider">Bio (optional)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-neutral-500">
                    <BookOpen className="size-4" />
                  </span>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about your gaming stats, favorite classes, or bio details"
                    disabled={isSubmitting}
                    rows={2}
                    className="pl-10 bg-white/[0.03] border-white/10 text-white placeholder:text-neutral-600 focus-visible:border-orange-500/50 focus-visible:ring-orange-500/20 focus-visible:shadow-[0_0_15px_rgba(249,115,22,0.15)] transition-all duration-200 min-h-[70px] resize-none"
                    {...register("bio")}
                  />
                </div>
                {errors.bio && (
                  <p className="text-red-500 text-xs mt-1">{errors.bio.message}</p>
                )}
              </div>

            </div>

            {/* Form error block */}
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-2">
                <Sparkles className="size-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full h-10 btn-gaming bg-gradient-to-r from-orange-600 via-purple-600 to-cyan-600 hover:from-orange-500 hover:via-purple-500 hover:to-cyan-500 text-white font-bold rounded-lg shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 gap-2 mt-2 cursor-pointer border-none"
            >
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              {buttonText}
            </Button>

          </form>

          {/* Card Footer redirect link */}
          <p className="text-center text-xs text-neutral-400">
            Already have an account?{" "}
            <Link href="/login" className="text-cyan-400 hover:text-orange-400 font-semibold transition-all duration-300">
              Login
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
}