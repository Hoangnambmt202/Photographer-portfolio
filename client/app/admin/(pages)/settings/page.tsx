/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useSettingsStore } from "@/stores/settingStore";
import SettingsForm from "@/components/admin/features/setting/SettingsForm";
import { showToast } from "nextjs-toast-notify"; // Hoặc sử dụng Toast library khác

export default function SettingsPage() {
  const { setting, fetchSettings, saveSettings, loading, error } =
    useSettingsStore();

  const [mode, setMode] = useState<"view" | "edit">("view");

  useEffect(() => {
    fetchSettings();
  }, []);

  // Hiển thị error nếu có
  useEffect(() => {
    if (error) {
      showToast.error(error);
    }
  }, [error]);

  const handleSave = async (data: any) => {
    try {
      await saveSettings(data);
      showToast.success("Cập nhật cài đặt thành công!");
      setMode("view");
    } catch (err) {
      showToast.error("Không thể lưu cài đặt");
      console.error("Save settings error:", err);
    }
  };

  const handleEdit = () => {
    setMode("edit");
  };

  const handleCancel = () => {
    setMode("view");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Cài đặt hệ thống</h1>
          <p className="text-gray-600 mt-2">
            Quản lý cấu hình website và thông tin liên hệ
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar menu */}
          <div className="lg:col-span-1">
            <div className="bg-white border rounded-lg p-4 space-y-1">
              <button className="w-full text-left px-4 py-3 bg-blue-50 text-blue-700 font-medium rounded-md">
                🏠 Cài đặt chung
              </button>
              <button className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-md">
                💼 Giao diện & Theme
              </button>
              <button className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-md">
                📧 Email & SMTP
              </button>
              <button className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-md">
                🔒 Bảo mật
              </button>
            </div>
          </div>

          {/* Main form */}
          <div className="lg:col-span-2">
            {loading && !setting ? (
              <div className="bg-white border rounded-lg p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Đang tải cài đặt...</p>
              </div>
            ) : (
              <SettingsForm
                data={setting}
                mode={mode}
                loading={loading}
                onEdit={handleEdit}
                onCancel={handleCancel}
                onSubmit={handleSave}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}