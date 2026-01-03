"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import {
  Service,
  ServiceFormData,
  ServiceModalMode,
} from "@/types/service.types";
import { Button } from "@/components/common/Button";
import { useCategoryStore } from "@/stores/categoryStore";
import Image from "next/image";

interface ServiceFormModalProps {
  mode: ServiceModalMode;
  isOpen: boolean;
  service?: Service;
  onClose: () => void;
  onSubmit: (data: ServiceFormData) => void;
}

const ServiceFormModal: FC<ServiceFormModalProps> = ({
  mode,
  isOpen,
  service,
  onClose,
  onSubmit,
}) => {
  const { categories } = useCategoryStore();
  const [priceDisplay, setPriceDisplay] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const initialFormData = useMemo<ServiceFormData>(() => {
    if (service && (mode === "edit" || mode === "view")) {
      return {
        name: service.name,
        category_id: service.category?.id || categories[0]?.id || 0,
        description: service.description,
        price: service.price.toString(),
        duration: service.duration,
        max_people: service.max_people?.toString() || "",
        included_items: service.included_items || "",
        status: service.status,
        discount_percent: service.discount_percent || 0,
        is_featured: service.is_featured || false,
        display_order: service.display_order || 0,
        tag_ids: service.tags?.map((t) => t.id) || [],
        cover_image: service.cover_image,
      };
    }

    return {
      name: "",
      category_id: categories[0]?.id || 0,
      description: "",
      price: "",
      duration: "",
      max_people: "",
      included_items: "",
      status: "active",
      discount_percent: 0,
      is_featured: false,
      display_order: 0,
      tag_ids: [],
    };
  }, [service, mode, categories]);
  const [formData, setFormData] = useState<ServiceFormData>(initialFormData);

  // Hàm format số VNĐ
  const formatVND = (value: number | string) => {
    if (!value) return "";
    const numberValue =
      typeof value === "string" ? Number(value.replace(/\./g, "")) : value;
    return numberValue.toLocaleString("vi-VN");
  };

  // Xử lý khi user nhập giá
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    setPriceDisplay(formatVND(rawValue));
    setFormData({ ...formData, price: rawValue });
  };

  // Xử lý khi user nhập phần trăm giảm giá
  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
    setFormData({ ...formData, discount_percent: value });
  };

  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "view") return;

    // Thêm tag_ids vào formData trước khi submit
    const submitData = {
      ...formData,
      tag_ids: selectedTags,
    };

    onSubmit(submitData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto scrollbar-hide">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === "create"
              ? "Thêm dịch vụ mới"
              : mode === "edit"
              ? "Chỉnh sửa dịch vụ"
              : "Chi tiết dịch vụ"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        {mode === "view" ? (
          <div className="p-6 space-y-6">
            {service?.cover_image && (
              <div className="mb-4">
                <Image
                  width={100}
                  height={100}
                  src={service.cover_image}
                  alt={service.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
            <h3 className="text-xl font-bold">{service?.name}</h3>
            <div className="flex flex-wrap gap-2">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {service?.category?.name}
              </span>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  service?.status === "active"
                    ? "bg-green-100 text-green-700"
                    : service?.status === "inactive"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {service?.status === "active"
                  ? "Đang hoạt động"
                  : service?.status === "inactive"
                  ? "Tạm dừng"
                  : "Bản nháp"}
              </span>
              {service?.is_featured && (
                <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                  Nổi bật
                </span>
              )}
            </div>
            <p className="text-gray-700">{service?.description}</p>

            {(service?.discount_percent ?? 0) > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-lg font-semibold text-gray-500 line-through">
                  {formatVND(service?.price ?? 0)} VNĐ
                </span>
                <span className="text-2xl font-bold text-red-600">
                  {formatVND(service?.final_price ?? 0)} VNĐ
                </span>
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm font-medium">
                  -{service?.discount_percent ?? 0}%
                </span>
              </div>
            )}

            {service?.included_items && (
              <>
                <h4 className="font-semibold text-gray-900">Bao gồm:</h4>
                <ul className="list-disc ml-5 mt-2">
                  {(service.included_items?.split(",") ?? []).map(
                    (item, idx) => (
                      <li key={idx}>{item.trim()}</li>
                    )
                  )}
                </ul>
              </>
            )}

            {service?.tags && service.tags.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Tags:</h4>
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên dịch vụ *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="VD: Chụp ảnh cưới trọn gói"
              />
            </div>

            {/* Category & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Danh mục *
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category_id: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as "active" | "inactive" | "draft",
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="active">Đang hoạt động</option>
                  <option value="inactive">Tạm dừng</option>
                  <option value="draft">Bản nháp</option>
                </select>
              </div>
            </div>

            {/* Featured & Discount */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        is_featured: e.target.checked,
                      })
                    }
                    className="w-5 h-5 text-blue-600 rounded focus:border-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Dịch vụ nổi bật
                  </span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giảm giá (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount_percent}
                  onChange={handleDiscountChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                placeholder="Mô tả chi tiết về dịch vụ..."
              />
            </div>

            {/* Price, Duration, Max People */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá (VNĐ) *
                </label>
                <input
                  type="text"
                  required
                  value={priceDisplay}
                  onChange={handlePriceChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="5.000.000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thời lượng *
                </label>
                <input
                  type="text"
                  required
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="2 giờ"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số người tối đa
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.max_people}
                  onChange={(e) =>
                    setFormData({ ...formData, max_people: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Display Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thứ tự hiển thị
              </label>
              <input
                type="number"
                min="0"
                value={formData.display_order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    display_order: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="0"
              />
            </div>

            {/* Included Items */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bao gồm (phân cách bằng dấu phẩy)
              </label>
              <textarea
                rows={3}
                value={formData.included_items}
                onChange={(e) =>
                  setFormData({ ...formData, included_items: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                placeholder="100 ảnh đã chỉnh sửa, Album 30x40cm, USB ảnh gốc"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                onClick={onClose}
                className="text-gray-700 hover:bg-gray-100"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                {mode === "create" ? "Tạo dịch vụ" : "Cập nhật"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ServiceFormModal;
