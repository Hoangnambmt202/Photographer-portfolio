// src/stores/settingsStore.ts
import { create } from "zustand";
import { Setting, SettingUpdatePayload } from "@/types/setting.types";
import {
  getSettings,
  createSettings,
  updateSettings,
} from "@/lib/setting";

interface SettingsState {
  setting: Setting | null;  // SỬA: Setting[] -> Setting
  loading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  saveSettings: (payload: SettingUpdatePayload) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  setting: null,
  loading: false,
  error: null,

  // GET
  fetchSettings: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getSettings(); // API trả về BaseResponse
      
      if (response.status === "success") {
        set({ setting: response.data }); // Lấy data từ response
      } else {
        set({ setting: null, error: response.message });
      }
    } catch (err) {
      // Nếu là lỗi 404 (settings chưa có) thì không set error
      if ((err as Error).message.includes("404")) {
        set({ setting: null, error: null });
      } else {
        set({ setting: null, error: (err as Error).message });
      }
    } finally {
      set({ loading: false });
    }
  },

  // CREATE hoặc UPDATE tự động
  saveSettings: async (payload: SettingUpdatePayload) => {
    set({ loading: true, error: null });

    try {
      const current = get().setting;
      let result;

      if (current) {
        // UPDATE
        const response = await updateSettings(current.id, payload);
        result = response.data;
      } else {
        // CREATE
        const response = await createSettings(payload);
        result = response.data;
      }

      set({ setting: result });
    } catch (err) {
      set({ error: (err as Error).message });
      throw err; // Re-throw để component có thể catch
    } finally {
      set({ loading: false });
    }
  },
}));