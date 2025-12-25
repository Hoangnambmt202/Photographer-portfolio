// src/types/settings.ts

export interface DynamicSettings {
  ui?: {
    sidebar_collapsed?: boolean;
    dashboard_widgets?: string[];
  };
  seo?: {
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string[];
  };
  social?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
  booking?: {
    enabled?: boolean;
    deposit_percent?: number;
  };
  watermark?: {
    enabled?: boolean;
    opacity?: number;
    position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  };
}

export interface Setting {
  id: number;

  // Core - BỔ SUNG optional fields để phù hợp với Pydantic
  site_name: string;
  site_description?: string;
  logo_url?: string;

  theme?: string; // Thêm optional
  language?: string;
  currency?: string;
  timezone?: string;

  contact_email?: string;
  contact_phone?: string;
  address?: string;

  is_maintenance?: boolean; // Thêm optional
  settings?: DynamicSettings; // Thêm optional

  created_at?: string;
  updated_at?: string;
}

// Cập nhật payload type
export type SettingUpdatePayload = Partial<
  Omit<Setting, "id" | "created_at" | "updated_at">
>;

// Thêm response type để match với backend
export interface SettingResponse {
  status: string;
  message: string;
  data: Setting;
}
