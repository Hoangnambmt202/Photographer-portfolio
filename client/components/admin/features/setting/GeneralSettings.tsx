/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useSettingsStore } from "@/stores/settingStore";
import SettingsForm from "@/components/admin/features/setting/SettingsForm";
import { showToast } from "nextjs-toast-notify";
import LoaderBlock from "@/components/common/LoaderBlock";

export default function SettingsPage() {
  const { setting, fetchSettings, saveSettings, loading, error } =
    useSettingsStore();
  const [mode, setMode] = useState<"view" | "edit">("view");

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (error) showToast.error(error);
  }, [error]);

  const handleSave = async (data: any) => {
    try {
      await saveSettings(data);
      showToast.success("Cập nhật cài đặt thành công!", { duration: 1500 });
      setMode("view");
    } catch (err) {
      showToast.error("Không thể lưu cài đặt");
      console.error("Save settings error:", err);
    }
  };

  return (
    <div className="flex-1 min-w-0">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        {loading && !setting ? (
          <LoaderBlock/>
        ) : (
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Truyền thêm classNames vào Form để form tự responsive bên trong nếu cần */}
            <SettingsForm
              data={setting}
              mode={mode}
              loading={loading}
              onEdit={() => setMode("edit")}
              onCancel={() => setMode("view")}
              onSubmit={handleSave}
            />
          </div>
        )}
      </div>
    </div>
  );
}
