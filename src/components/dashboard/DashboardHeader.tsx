"use client";

import { useAuthStore } from "@/store/auth.store";

export default function DashboardHeader() {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <h1 className="text-lg font-semibold">
        Dashboard
      </h1>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="font-medium">{user?.name}</p>

          <p className="text-sm text-gray-500">
            {user?.email}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}