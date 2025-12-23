export interface Service {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  final_price: number; // Giá sau giảm
  duration: string;
  max_people: number;
  included_items: string | string[]; // Lưu dạng string
  status: "active" | "inactive" | "draft";
  category_id: number;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  cover_image: string;
  discount_percent: number;
  is_featured: boolean;
  display_order: number;
  tags: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  created_at: string;
  updated_at: string;
  // Giữ các trường cũ để tương thích
  isActive?: boolean;
  rating?: number;
  totalBookings?: number;
}

export interface ServiceFormData {
  name: string;
  category_id: number; // Thay đổi từ category (string) thành category_id (number)
  description: string;
  price: string; // Vẫn giữ string để format
  duration: string;
  max_people: string;
  included_items: string | string[];
  status: "active" | "inactive" | "draft";
  cover_image?: string;
  discount_percent?: number;
  is_featured?: boolean;
  display_order?: number;
  tag_ids?: number[];
}

export type ServiceModalMode = "create" | "edit" | "view";

// Interface cho API response
export interface ServiceApiResponse {
  status: string;
  message: string;
  data: Service | Service[] | {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
    data: Service[];
  };
}

// Interface cho filter params
export interface ServiceFilterParams {
  search?: string;
  status?: string;
  category_id?: number;
  tag_id?: number;
  min_price?: number;
  max_price?: number;
  featured?: boolean;
  page?: number;
  limit?: number;
}