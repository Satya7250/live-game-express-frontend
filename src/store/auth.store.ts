import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/auth";

// Extend Window interface for TypeScript safety
declare global {
  interface Window {
    __ZUSTAND_STORES__?: {
      auth?: typeof useAuthStore;
    };
  }
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;

  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) => {
        console.log("[auth.store] setUser called with user:", user);
        const newState = {
          user,
          isAuthenticated: !!user,
        };
        console.log("[auth.store] New state:", newState);
        set(newState);
      },

      updateUser: (updates) => {
        console.log("[auth.store] updateUser called with updates:", updates);
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        }));
      },

      logout: () => {
        console.log("[auth.store] logout called");
        set({
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage",
      // Only persist the auth flag — never PII (email, phone, address, bio)
      // User data is re-fetched from the API on every cold start via AuthProvider
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        console.log("[auth.store] Rehydrated state:", state);
      }
    }
  )
);

// Expose store to window for debugging
if (typeof window !== "undefined") {
  window.__ZUSTAND_STORES__ = window.__ZUSTAND_STORES__ || {};
  window.__ZUSTAND_STORES__.auth = useAuthStore;
}
