import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OTP {
  phoneWithDial: string;
  code: string;
  expiresAt: number;
}

interface AuthState {
  user: { phone?: string; name?: string; email?: string } | null;
  otp: OTP | null;
  setUser: (user: AuthState["user"]) => void;
  clearUser: () => void;
  sendOtp: (phoneWithDial: string, code: string, ttlMs?: number) => void;
  clearOtp: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      otp: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      sendOtp: (phoneWithDial, code, ttlMs = 2 * 60 * 1000) => {
        const expiresAt = Date.now() + ttlMs;
        set({ otp: { phoneWithDial, code, expiresAt } });
        setTimeout(() => {
          const cur = get().otp;
          if (cur && cur.expiresAt <= Date.now()) set({ otp: null });
        }, ttlMs + 1000);
      },
      clearOtp: () => set({ otp: null }),
    }),
    { name: "auth-storage" }
  )
);
