export interface User {
  id: number;
  email: string;
  full_name: string;
  avatar_url: string | null;
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse<T = object> {
  status: "success" | "error";
  message?: string;
  data?: T;
}
