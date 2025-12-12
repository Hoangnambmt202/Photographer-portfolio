// stores/authStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { loginAdmin, logoutAdmin, getProfile } from "@/lib/auth";

interface User {
  id: number;
  email: string;
  full_name: string;
  avatar_url: string | null;
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: false,
      error: null,
      fetchProfile: async () => {
        set({ loading: true });
        try {
          const res = await getProfile();
          if (res.status === "success") {
            set({ user: res.data, loading: false });
          } else {
            set({ user: null, loading: false });
          }
        } catch {
          set({ user: null, loading: false });
        }
      },
      login: async (email, password) => {
        set({ loading: true, error: null });

        try {
          const res = await loginAdmin(email, password);

          if (res.status === "success") {
            set({
              user: res.data.user,
              loading: false,
            });

            return true;
          } else {
            set({
              error: res.message,
              loading: false,
            });
            return false;
          }
        } catch {
          set({
            error: "Đăng nhập thất bại",
            loading: false,
          });
          return false;
        }
      },
      logout: async () => {
        try {
          await logoutAdmin();
        } catch {
          /* ignore network error */
        }
        set({ user: null });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }), // chỉ lưu user
    }
  )
);
