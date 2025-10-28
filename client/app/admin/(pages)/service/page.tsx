"use client";

import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Search,
  X,
  DollarSign,
  Clock,
  Users,
  Package,
  Check,
  Calendar,
  Star,
} from "lucide-react";
import { useState } from "react";

// Types
interface Service {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  duration: string;
  maxPeople: number;
  includedItems: string[];
  isActive: boolean;
  image?: string;
  rating: number;
  totalBookings: number;
  createdAt: string;
}

interface ServiceFormData {
  name: string;
  category: string;
  description: string;
  price: string;
  duration: string;
  maxPeople: string;
  includedItems: string;
  isActive: boolean;
  image?: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([
    {
      id: 1,
      name: "Chụp ảnh cưới trọn gói",
      category: "Wedding",
      description:
        "Gói chụp ảnh cưới hoàn chỉnh bao gồm pre-wedding, lễ cưới và tiệc cưới",
      price: 15000000,
      duration: "1 ngày",
      maxPeople: 2,
      includedItems: [
        "300 ảnh đã chỉnh sửa",
        "Album 30x40cm",
        "Phóng ảnh canvas",
        "USB ảnh gốc",
      ],
      isActive: true,
      rating: 4.8,
      totalBookings: 45,
      createdAt: "2025-01-15",
    },
    {
      id: 2,
      name: "Chụp ảnh portrait cá nhân",
      category: "Portrait",
      description: "Chụp ảnh chân dung chuyên nghiệp cho hồ sơ, profile",
      price: 2000000,
      duration: "2 giờ",
      maxPeople: 1,
      includedItems: ["50 ảnh đã chỉnh sửa", "File digital", "1 ảnh in A3"],
      isActive: true,
      rating: 4.9,
      totalBookings: 123,
      createdAt: "2025-02-01",
    },
    {
      id: 3,
      name: "Chụp ảnh sản phẩm",
      category: "Product",
      description: "Chụp ảnh sản phẩm cho kinh doanh online, catalog",
      price: 500000,
      duration: "1 giờ",
      maxPeople: 0,
      includedItems: ["30 ảnh/sản phẩm", "Chỉnh màu chuẩn", "Background trắng"],
      isActive: true,
      rating: 4.7,
      totalBookings: 89,
      createdAt: "2025-01-20",
    },
    {
      id: 4,
      name: "Chụp ảnh gia đình",
      category: "Family",
      description: "Ghi lại những khoảnh khắc đáng nhớ bên gia đình",
      price: 3000000,
      duration: "3 giờ",
      maxPeople: 10,
      includedItems: ["100 ảnh chỉnh sửa", "Album 25x30cm", "USB"],
      isActive: false,
      rating: 4.6,
      totalBookings: 67,
      createdAt: "2025-02-10",
    },
  ]);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
    "create"
  );
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState<ServiceFormData>({
    name: "",
    category: "Wedding",
    description: "",
    price: "",
    duration: "",
    maxPeople: "",
    includedItems: "",
    isActive: true,
  });

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");

  const categories = [
    "all",
    "Wedding",
    "Portrait",
    "Product",
    "Family",
    "Event",
    "Commercial",
  ];

  // Open modal for create
  const handleCreate = () => {
    setModalMode("create");
    setFormData({
      name: "",
      category: "Wedding",
      description: "",
      price: "",
      duration: "",
      maxPeople: "",
      includedItems: "",
      isActive: true,
    });
    setShowModal(true);
  };

  // Open modal for edit
  const handleEdit = (service: Service) => {
    setModalMode("edit");
    setSelectedService(service);
    setFormData({
      name: service.name,
      category: service.category,
      description: service.description,
      price: service.price.toString(),
      duration: service.duration,
      maxPeople: service.maxPeople.toString(),
      includedItems: service.includedItems.join(", "),
      isActive: service.isActive,
    });
    setShowModal(true);
  };

  // Open modal for view
  const handleView = (service: Service) => {
    setModalMode("view");
    setSelectedService(service);
    setShowModal(true);
  };

  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const includedItemsArray = formData.includedItems
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    if (modalMode === "create") {
      const newService: Service = {
        id: services.length + 1,
        name: formData.name,
        category: formData.category,
        description: formData.description,
        price: parseFloat(formData.price),
        duration: formData.duration,
        maxPeople: parseInt(formData.maxPeople),
        includedItems: includedItemsArray,
        isActive: formData.isActive,
        rating: 0,
        totalBookings: 0,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setServices([...services, newService]);
    } else if (modalMode === "edit" && selectedService) {
      setServices(
        services.map((service) =>
          service.id === selectedService.id
            ? {
                ...service,
                name: formData.name,
                category: formData.category,
                description: formData.description,
                price: parseFloat(formData.price),
                duration: formData.duration,
                maxPeople: parseInt(formData.maxPeople),
                includedItems: includedItemsArray,
                isActive: formData.isActive,
              }
            : service
        )
      );
    }

    setShowModal(false);
  };

  // Delete service
  const handleDelete = (id: number) => {
    setServiceToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (serviceToDelete) {
      setServices(services.filter((service) => service.id !== serviceToDelete));
      setShowDeleteConfirm(false);
      setServiceToDelete(null);
    }
  };

  // Toggle active status
  const toggleActive = (id: number) => {
    setServices(
      services.map((service) =>
        service.id === id
          ? { ...service, isActive: !service.isActive }
          : service
      )
    );
  };

  // Filter services
  const filteredServices = services.filter((service) => {
    if (
      searchTerm &&
      !service.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    if (filterCategory !== "all" && service.category !== filterCategory) {
      return false;
    }
    if (filterStatus === "active" && !service.isActive) {
      return false;
    }
    if (filterStatus === "inactive" && service.isActive) {
      return false;
    }
    return true;
  });

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dịch vụ chụp ảnh</h1>
          <p className="text-gray-600 mt-1">
            Quản lý các gói dịch vụ photography
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
        >
          <Plus className="w-5 h-5" />
          Thêm dịch vụ
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[250px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm dịch vụ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all" ? "Tất cả danh mục" : cat}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <div className="flex gap-2 border border-gray-300 rounded-lg p-1">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                filterStatus === "all"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilterStatus("active")}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                filterStatus === "active"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Đang hoạt động
            </button>
            <button
              onClick={() => setFilterStatus("inactive")}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                filterStatus === "inactive"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Tạm dừng
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 text-sm text-gray-600">
          <span>
            Hiển thị <strong>{filteredServices.length}</strong> /{" "}
            {services.length} dịch vụ
          </span>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Image */}
            <div className="h-48 bg-linear-to-br from-blue-100 via-purple-100 to-pink-100 relative">
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={() => toggleActive(service.id)}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    service.isActive
                      ? "bg-green-500 text-white"
                      : "bg-gray-500 text-white"
                  }`}
                >
                  {service.isActive ? "Hoạt động" : "Tạm dừng"}
                </button>
              </div>
              <div className="absolute bottom-3 left-3">
                <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
                  {service.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-900 flex-1">
                  {service.name}
                </h3>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {service.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-green-600">
                    {formatCurrency(service.price)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{service.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>
                    {service.maxPeople === 0
                      ? "N/A"
                      : `${service.maxPeople} người`}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{service.totalBookings} bookings</span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold">
                    {service.rating}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  ({service.totalBookings} đánh giá)
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleView(service)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  <Eye className="w-4 h-4" />
                  Xem
                </button>
                <button
                  onClick={() => handleEdit(service)}
                  className="flex items-center justify-center p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="flex items-center justify-center p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Không tìm thấy dịch vụ
          </h3>
          <p className="text-gray-500 mb-4">
            Thử thay đổi bộ lọc hoặc tạo dịch vụ mới
          </p>
          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Thêm dịch vụ đầu tiên
          </button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {modalMode === "create"
                  ? "Thêm dịch vụ mới"
                  : modalMode === "edit"
                  ? "Chỉnh sửa dịch vụ"
                  : "Chi tiết dịch vụ"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Modal Content */}
            {modalMode === "view" && selectedService ? (
              <div className="p-6 space-y-6">
                <div className="h-64 bg-linear-to-br from-blue-100 via-purple-100 to-pink-100 rounded-lg"></div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedService.name}
                  </h3>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {selectedService.category}
                  </span>
                </div>

                <p className="text-gray-700">{selectedService.description}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <DollarSign className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Giá</p>
                      <p className="text-lg font-bold text-green-600">
                        {formatCurrency(selectedService.price)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Clock className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Thời gian</p>
                      <p className="text-lg font-bold">
                        {selectedService.duration}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Users className="w-8 h-8 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Số người</p>
                      <p className="text-lg font-bold">
                        {selectedService.maxPeople === 0
                          ? "N/A"
                          : `${selectedService.maxPeople} người`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Star className="w-8 h-8 text-yellow-500" />
                    <div>
                      <p className="text-sm text-gray-600">Đánh giá</p>
                      <p className="text-lg font-bold">
                        {selectedService.rating}/5
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Bao gồm:</h4>
                  <ul className="space-y-2">
                    {selectedService.includedItems.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên dịch vụ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: Chụp ảnh cưới trọn gói"
                  />
                </div>

                {/* Category & Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Danh mục <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categories
                        .filter((cat) => cat !== "all")
                        .map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trạng thái
                    </label>
                    <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isActive: e.target.checked,
                          })
                        }
                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Đang hoạt động
                      </span>
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Mô tả chi tiết về dịch vụ..."
                  />
                </div>

                {/* Price, Duration, Max People */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giá (VNĐ) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="5000000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thời gian <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="2 giờ"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số người tối đa
                    </label>
                    <input
                      type="number"
                      value={formData.maxPeople}
                      onChange={(e) =>
                        setFormData({ ...formData, maxPeople: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Included Items */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bao gồm (phân cách bằng dấu phẩy)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.includedItems}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        includedItems: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="100 ảnh đã chỉnh sửa, Album 30x40cm, USB ảnh gốc"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Nhập các mục bao gồm trong dịch vụ, phân cách bằng dấu phẩy
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {modalMode === "create" ? "Tạo dịch vụ" : "Cập nhật"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                Xóa dịch vụ?
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Bạn có chắc chắn muốn xóa dịch vụ này? Hành động này không thể
                hoàn tác.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
