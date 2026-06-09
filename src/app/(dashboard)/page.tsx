"use client";

import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/auth.store";

export default function DashboardPage() {
  const router = useRouter();

  const { logout } = useAuth();

  const user = useAuthStore(
    (state) => state.user
  );

  const handleLogout = async () => {
    try {
      await logout();

      router.replace("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Dashboard
      </h1>

      <p>Name: {user?.name}</p>

      <p>Email: {user?.email}</p>

      <p>Role: {user?.role}</p>

      <button
        onClick={handleLogout}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
}