"use client";

import { useEffect, useState } from "react";
import { useCategoryStore } from "@/stores/categoryStore";
import ServiceFilters from "@/components/admin/features/service/ServiceFilter";
import ServiceCard from "@/components/admin/features/service/ServiceCard";
import DeleteModal from "@/components/admin/DeleteModal";
import { Button } from "@/components/common/Button";
import { Plus } from "lucide-react";
import { Service } from "@/types/service";
import ServiceFormModal from "@/components/admin/features/service/ServiceForm";
import { log } from "console";

export default function ServicesPage() {
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  const [services, setServices] = useState<Service[]>([]); // dùng store nếu muốn
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit" | "view">(
    "create"
  );
  const [editingService, setEditingService] = useState<Service | undefined>(
    undefined
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<number | null>(null);

  const filteredServices = services.filter((s) => {
    if (searchTerm && !s.name.toLowerCase().includes(searchTerm.toLowerCase()))
      return false;
    if (filterCategory !== "all" && s.category !== filterCategory) return false;
    if (filterStatus === "active" && !s.isActive) return false;
    if (filterStatus === "inactive" && s.isActive) return false;
    return true;
  });

  const openCreateModal = () => {
    setFormMode("create");
    setEditingService(undefined);
    setIsFormOpen(true);
  };

  // Mở modal chỉnh sửa
  const openEditModal = (service: Service) => {
    setFormMode("edit");
    setEditingService(service);
    setIsFormOpen(true);
  };
  const handleDelete = (id: number) => {
    setServiceToDelete(id);
    setShowDeleteConfirm(true);
  };
  const confirmDelete = () => {
    if (serviceToDelete)
      setServices(services.filter((s) => s.id !== serviceToDelete));
    setShowDeleteConfirm(false);
    setServiceToDelete(null);
  };
  const toggleActive = (id: number) => {
    setServices(
      services.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
  };
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dịch vụ chụp ảnh</h1>
        <Button
          onClick={
            openCreateModal
          }
          className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Thêm dịch vụ
        </Button>
      </div>

      <ServiceFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categories={categories.map((c) => c.name)}
        filterCategory={filterCategory}
        onFilterCategoryChange={setFilterCategory}
        filterStatus={filterStatus}
        onFilterStatusChange={setFilterStatus}
        filteredCount={filteredServices.length}
        totalCount={services.length}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onView={() => {}}
            onEdit={() => {}}
            onDelete={handleDelete}
            onToggleActive={toggleActive}
            formatCurrency={formatCurrency}
          />
        ))}
      </div>
      <ServiceFormModal
        isOpen={isFormOpen}
        mode={formMode}
        service={editingService}
        onClose={() => setIsFormOpen(false)}
        onSubmit={()=> {
          console.log("submit");
          
        }}
      />
      <DeleteModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        item="dịch vụ"
        itemName="này"
      />
    </div>
  );
}
