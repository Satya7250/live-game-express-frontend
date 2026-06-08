"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import MainContent from "@/components/dashboard/MainContent";
import RightPanel from "@/components/dashboard/RightPanel";
import ChatModal from "@/components/dashboard/ChatModal";
import NotificationCenter from "@/components/dashboard/NotificationCenter";

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("home");
  const [showChat, setShowChat] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <MainContent activeSection={activeSection} onOpenChat={() => setShowChat(true)} />
      <RightPanel 
        onOpenChat={() => setShowChat(true)}
        onOpenNotifications={() => setShowNotifications(true)}
      />
      
      {showChat && <ChatModal onClose={() => setShowChat(false)} />}
      {showNotifications && <NotificationCenter onClose={() => setShowNotifications(false)} />}
    </div>
  );
}
