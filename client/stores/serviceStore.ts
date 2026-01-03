import { create } from "zustand";
import { Service, ServiceFormData, ServiceFilterParams } from "@/types/service.types";
import { 
  getServices, 
  createService, 
  updateService, 
  deleteService, 
  updateServiceStatus 
} from "@/lib/service";

interface ServiceState {
  services: Service[];
  loading: boolean;
  total: number;
  page: number;
  totalPages: number;

  fetchServices: (page:number, limit:number, filters?: ServiceFilterParams) => Promise<void>;
  createService: (data: ServiceFormData) => Promise<Service>;
  updateService: (id: number, data: ServiceFormData) => Promise<Service>;
  deleteService: (id: number) => Promise<void>;
  toggleServiceStatus: (id: number, currentStatus: string) => Promise<void>;
}

export const useServiceStore = create<ServiceState>((set, get) => ({
  services: [],
  loading: false,
  total: 0,
  page: 1,
  totalPages: 1,

  fetchServices: async (page, limit, filters?: ServiceFilterParams) => {
    set({ loading: true });
    try {
      const response = await getServices({
        page:page,
        limit:limit,
        filters:filters

      });
      
      // Xử lý response từ API
      if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        // Response có phân trang
        set({ 
          services: response.data.data as Service[],
          total: response.total,
          page: response.page,
          totalPages: response.total_pages,
          loading: false 
        });
      } else {
        // Response là array trực tiếp
        set({ 
          services: response.data as Service[],
          total: (response.data as Service[]).length,
          page: 1,
          totalPages: 1,
          loading: false 
        });
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      set({ loading: false });
      throw error;
    }
  },

  createService: async (data) => {
    try {
      const service = await createService(data);
      set({ services: [service, ...get().services] });
      return service;
    } catch (error) {
      console.error("Error creating service:", error);
      throw error;
    }
  },

  updateService: async (id, data) => {
    try {
      const updatedService = await updateService(id, data);
      set({
        services: get().services.map((s) =>
          s.id === id ? { ...s, ...updatedService } : s
        ),
      });
      return updatedService;
    } catch (error) {
      console.error("Error updating service:", error);
      throw error;
    }
  },

  deleteService: async (id) => {
    try {
      await deleteService(id);
      set({
        services: get().services.filter((s) => s.id !== id),
      });
    } catch (error) {
      console.error("Error deleting service:", error);
      throw error;
    }
  },

  toggleServiceStatus: async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      await updateServiceStatus(id, newStatus as "active" | "inactive" | "draft");
      
      set({
        services: get().services.map((s) =>
          s.id === id ? { 
            ...s, 
            status: newStatus,
            isActive: newStatus === "active"
          } : s
        ),
      });
    } catch (error) {
      console.error("Error toggling service status:", error);
      throw error;
    }
  },
}));