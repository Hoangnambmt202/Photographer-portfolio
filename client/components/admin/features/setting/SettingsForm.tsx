/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Setting } from "@/types/setting.types"; // Import type

interface SettingsFormProps {
  data: Setting | null; // SỬA: any -> Setting | null
  mode: "view" | "edit";
  loading: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSubmit: (data: any) => Promise<void>; // Thêm Promise
}

export default function SettingsForm({
  data,
  mode,
  loading = false,
  onEdit,
  onCancel,
  onSubmit,
}: SettingsFormProps) {
  const [form, setForm] = useState<Partial<Setting>>({});
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        site_name: data.site_name || "",
        site_description: data.site_description || "",
        contact_email: data.contact_email || "",
        timezone: data.timezone || "Asia/Ho_Chi_Minh",
        is_maintenance: data.is_maintenance || false,
        // Thêm các field khác nếu cần
      });
    } else {
      // Default values khi chưa có data
      setForm({
        site_name: "",
        site_description: "",
        contact_email: "",
        timezone: "Asia/Ho_Chi_Minh",
        is_maintenance: false,
      });
    }
  }, [data]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!form.site_name?.trim()) {
      setFormError("Tiêu đề trang là bắt buộc");
      return;
    }
    
    setFormError(null);
    
    try {
      await onSubmit(form);
      onCancel?.(); // Quay về view mode sau khi save
    } catch (err) {
      setFormError((err as Error).message);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, type, value } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    // Clear error khi user bắt đầu nhập
    if (formError) setFormError(null);
  };

  if (!data && mode === "view") {
    return (
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Cài đặt chung</h2>
        <p className="text-gray-500 mb-4">Chưa có cài đặt nào được tạo</p>
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Tạo cài đặt mới
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Cài đặt chung</h2>

        {mode === "view" ? (
          <button 
            onClick={onEdit} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {data ? "Chỉnh sửa" : "Tạo mới"}
          </button>
        ) : (
          <div className="space-x-2">
            <button 
              onClick={onCancel} 
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              onClick={() => handleSubmit()}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        )}
      </div>

      {formError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {formError}
        </div>
      )}

      {/* Site name - REQUIRED */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Tiêu đề trang <span className="text-red-500">*</span>
        </label>
        {mode === "view" ? (
          <p className="text-gray-900 bg-gray-100 px-4 py-2 rounded-md">{data?.site_name || "—"}</p>
        ) : (
          <input
            type="text"
            name="site_name"
            value={form.site_name || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">Mô tả</label>
        {mode === "view" ? (
          <p className="text-gray-900 bg-gray-100 px-4 py-2 rounded-md whitespace-pre-line">
            {data?.site_description || "—"}
          </p>
        ) : (
          <textarea
            name="site_description"
            rows={4}
            value={form.site_description || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium mb-1">Email liên hệ</label>
        {mode === "view" ? (
          <p className="text-gray-900 bg-gray-100 px-4 py-2 rounded-md">{data?.contact_email || "—"}</p>
        ) : (
          <input
            type="email"
            name="contact_email"
            value={form.contact_email || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        )}
      </div>

      {/* Timezone */}
      <div>
        <label className="block text-sm font-medium mb-1">Timezone</label>
        {mode === "view" ? (
          <p className="text-gray-900 bg-gray-100 px-4 py-2 rounded-md">{data?.timezone || "Asia/Ho_Chi_Minh"}</p>
        ) : (
          <select
            name="timezone"
            value={form.timezone || "Asia/Ho_Chi_Minh"}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Asia/Ho_Chi_Minh">UTC+7 (Việt Nam)</option>
            <option value="UTC">UTC</option>
            <option value="America/New_York">New York (UTC-5)</option>
            <option value="Europe/London">London (UTC+0)</option>
          </select>
        )}
      </div>

      {/* Maintenance */}
      <div className="flex items-center justify-between border-t pt-4">
        <div>
          <p className="font-medium">Chế độ bảo trì</p>
          <p className="text-sm text-gray-500">Tạm thời vô hiệu hóa website</p>
        </div>
        {mode === "view" ? (
          <span className={`px-2 py-1 rounded text-sm ${data?.is_maintenance ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
            {data?.is_maintenance ? "Đang bật" : "Đang tắt"}
          </span>
        ) : (
          <input
            type="checkbox"
            name="is_maintenance"
            checked={!!form.is_maintenance}
            onChange={handleChange}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          />
        )}
      </div>

      {/* Action buttons bottom */}
      {mode === "edit" && (
        <div className="flex justify-end gap-2 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded hover:bg-gray-50"
            disabled={loading}
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      )}
    </div>
  );
}