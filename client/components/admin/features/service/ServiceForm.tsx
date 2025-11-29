"use client";

import { FC, useEffect, useState } from "react";
import { X } from "lucide-react";
import { Service, ServiceFormData, ServiceModalMode } from "@/types/service";
import { Button } from "@/components/common/Button";
import { useCategoryStore } from "@/stores/categoryStore";

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

  // Hàm format số VNĐ
  const formatVND = (value: number | string) => {
    if (!value) return "";
    const numberValue =
      typeof value === "string" ? Number(value.replace(/\./g, "")) : value;
    return numberValue.toLocaleString("vi-VN");
  };

  // Xử lý khi user nhập
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ""); // chỉ giữ số
    setPriceDisplay(formatVND(rawValue));
    setFormData({ ...formData, price: rawValue });
  };
  useEffect(() => {
    if (service && (mode === "edit" || mode === "view")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
      setPriceDisplay(formatVND(service.price));
    } else {
      setPriceDisplay("");
    }
  }, [service, mode]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "view") return;
    onSubmit(formData);
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
            <h3 className="text-xl font-bold">{formData.name}</h3>
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {formData.category}
            </span>
            <p className="text-gray-700">{formData.description}</p>
            <ul className="list-disc ml-5 mt-2">
              {formData.includedItems.split(",").map((item, idx) => (
                <li key={idx}>{item.trim()}</li>
              ))}
            </ul>
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
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
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
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-5 h-5 text-blue-600 rounded focus:border-blue-500"
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
                  Thời gian (giờ) *
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
                  value={formData.maxPeople}
                  onChange={(e) =>
                    setFormData({ ...formData, maxPeople: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
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
                  setFormData({ ...formData, includedItems: e.target.value })
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
