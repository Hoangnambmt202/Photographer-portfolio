"use client";

import { useEffect, useState, useCallback } from "react";
import { useCategoryStore } from "@/stores/categoryStore";
import ServiceFilters from "@/components/admin/features/service/ServiceFilter";
import ServiceCard from "@/components/admin/features/service/ServiceCard";
import DeleteModal from "@/components/admin/DeleteModal";
import { Button } from "@/components/common/Button";
import { Plus } from "lucide-react";
import { Service, ServiceFormData } from "@/types/service.types";
import ServiceFormModal from "@/components/admin/features/service/ServiceForm";
import { useServiceStore } from "@/stores/serviceStore";
import { showToast } from "nextjs-toast-notify";
import LoaderBlock from "@/components/common/LoaderBlock";

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive" | "draft"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 12;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit" | "view">(
    "create"
  );
  const [editingService, setEditingService] = useState<Service | undefined>(
    undefined
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<number | null>(null);

  const { categories, fetchCategories } = useCategoryStore();
  const {
    services,
    loading,
    total,
    page,
    totalPages,
    fetchServices,
    createService,
    updateService,
    deleteService,
    toggleServiceStatus,
  } = useServiceStore();
  const loadServices = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: any = {
      page: currentPage,
      limit,
    };

    if (debouncedSearchTerm) params.search = debouncedSearchTerm;
    if (filterStatus !== "all") params.status = filterStatus;
    if (filterCategory !== "all") {
      const category = categories.find((c) => c.name === filterCategory);
      if (category) params.category_id = category.id;
    }

    fetchServices(params);
  }, [
    debouncedSearchTerm,
    filterStatus,
    filterCategory,
    currentPage,
    categories,
    limit,
    fetchServices,
  ]);
  useEffect(() => {
    fetchCategories();
  }, []);

  // Effect để load services khi các dependency thay đổi
  useEffect(() => {
    loadServices();
  }, [loadServices]);

  // Hàm xử lý search với debounce
  const handleSearch = (value: string) => {
    setDebouncedSearchTerm(value);
  };

  const openCreateModal = () => {
    setFormMode("create");
    setEditingService(undefined);
    setIsFormOpen(true);
  };

  const handleSubmit = async (data: ServiceFormData) => {
    try {
      if (formMode === "create") {
        await createService(data);
        showToast.success("Tạo dịch vụ thành công", { duration: 1500 });
      } else if (editingService) {
        await updateService(editingService.id, data);
        showToast.success("Cập nhật dịch vụ thành công", { duration: 1500 });
      }
      setIsFormOpen(false);
      loadServices(); // Reload danh sách
    } catch (error) {
      console.error("Error submitting service:", error);
      showToast.error("Có lỗi xảy ra, vui lòng thử lại", { duration: 1500 });
    }
  };

  const openEditModal = (service: Service) => {
    setFormMode("edit");
    setEditingService(service);
    setIsFormOpen(true);
  };

  const openViewModal = (service: Service) => {
    setFormMode("view");
    setEditingService(service);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setServiceToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!serviceToDelete) return;

    try {
      await deleteService(serviceToDelete);
      showToast.success("Xóa dịch vụ thành công", {duration:1500});
      setShowDeleteConfirm(false);
      setServiceToDelete(null);
      loadServices();
    } catch (error) {
      console.error("Error deleting service:", error);
      showToast.error("Có lỗi xảy ra, vui lòng thử lại", { duration: 1500 });
    }
  };

  const handleToggleActive = async (id: number) => {
    const service = services.find((s) => s.id === id);
    if (service) {
      try {
        await toggleServiceStatus(id, service.status);
        showToast.success("Cập nhật trạng thái thành công", {duration: 1500});
        loadServices();
      } catch (error) {
        console.error("Error toggling service status:", error);
        showToast.error("Có lỗi xảy ra, vui lòng thử lại", { duration: 1500 });
      }
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  // Pagination
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dịch vụ chụp ảnh</h1>
        <Button
          onClick={openCreateModal}
          className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Thêm dịch vụ
        </Button>
      </div>

      <ServiceFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearch={handleSearch}
        categories={categories.map((c) => c.name)}
        filterCategory={filterCategory}
        onFilterCategoryChange={setFilterCategory}
        filterStatus={filterStatus}
        onFilterStatusChange={setFilterStatus}
        filteredCount={services.length}
        totalCount={total}
        loading={loading}
      />

      {loading && services.length === 0 ? (
        <div className="text-center py-8">
          <LoaderBlock />
          <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Chưa có dịch vụ nào</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onView={openViewModal}
                onEdit={openEditModal}
                onDelete={handleDeleteClick}
                onToggleActive={handleToggleActive}
                formatCurrency={formatCurrency}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-3 py-1 disabled:opacity-50"
              >
                Trước
              </Button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 ${
                      page === pageNum
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {pageNum}
                  </Button>
                );
              })}

              <Button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="px-3 py-1 disabled:opacity-50"
              >
                Sau
              </Button>
            </div>
          )}
        </>
      )}

      <ServiceFormModal
        isOpen={isFormOpen}
        mode={formMode}
        service={editingService}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <DeleteModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        item="dịch vụ"
        itemName={services.find((s) => s.id === serviceToDelete)?.name || "này"}
      />
    </div>
  );
}
