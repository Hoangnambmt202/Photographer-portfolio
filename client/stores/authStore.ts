// stores/authStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { loginAdmin, logoutAdmin, getProfile } from "@/lib/auth";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  accessToken : string | null;
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      loading: false,
      error: null,
      fetchProfile: async () => {
        set({ loading: true });
        try {
          const token = get().accessToken ?? undefined;
          const res = await getProfile(token);
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
              accessToken: res.data.access_token,
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
      partialize: (state) => ({ user: state.user, accessToken: state.accessToken }), // lưu thêm token để gửi Bearer
    }
  )
);
