"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import HeroSection from "@/components/dashboard/HeroSection";
import RightPanel from "@/components/dashboard/RightPanel";

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <HeroSection />
      <RightPanel />
    </div>
  );
}
