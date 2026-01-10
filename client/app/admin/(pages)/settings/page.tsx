/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useSettingsStore } from "@/stores/settingStore";
import { showToast } from "nextjs-toast-notify";
import LoaderBlock from "@/components/common/LoaderBlock";
import { Home, Palette, Mail, Shield } from "lucide-react";

// Import các form con
import GeneralSettings from "@/components/admin/features/setting/SettingsForm"; // Form cũ của bạn
import ThemeSettings from "@/components/admin/features/setting/ThemeSettings";
import EmailSettings from "@/components/admin/features/setting/EmailSettings";
import SecuritySettings from "@/components/admin/features/setting/SecuritySettings";

export default function SettingsPage() {
  const { setting, fetchSettings, saveSettings, loading, error } = useSettingsStore();
  
  const [activeTab, setActiveTab] = useState("general");
  const [mode, setMode] = useState<"view" | "edit">("view");

  // 1. Fetch data khi mount
  useEffect(() => {
    fetchSettings();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 2. Show error từ store nếu có
  useEffect(() => {
    if (error) showToast.error(error);
  }, [error]);

  // 3. Reset về chế độ View khi người dùng chuyển Tab
  useEffect(() => {
    setMode("view");
  }, [activeTab]);

  // 4. Hàm Save dùng chung cho tất cả các Tab
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSave = async (data: any) => {
    try {
      await saveSettings(data);
      showToast.success("Cập nhật thành công!", { duration: 1500 });
      setMode("view"); // Quay về view sau khi lưu xong
    } catch (err) {
      showToast.error("Lỗi khi lưu cài đặt");
      console.error(err);
    }
  };

  const menuItems = [
    { id: "general", label: "Cài đặt chung", icon: Home },
    { id: "theme", label: "Giao diện", icon: Palette },
    { id: "email", label: "Email & SMTP", icon: Mail },
    { id: "security", label: "Bảo mật", icon: Shield },
  ];

  // Render nội dung tương ứng với Tab đang chọn
  const renderContent = () => {
    const commonProps = {
      data: setting,
      mode: mode,
      loading: loading,
      onEdit: () => setMode("edit"),
      onCancel: () => setMode("view"),
      onSubmit: handleSave,
    };

    switch (activeTab) {
      case "general":
        return <GeneralSettings {...commonProps} />;
      case "theme":
        return <ThemeSettings {...commonProps} />;
      case "email":
        return <EmailSettings {...commonProps} />;
      case "security":
        return <SecuritySettings  />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[500px]">
      {/* Sidebar Navigation */}
      <nav className="w-full lg:w-64 flex-shrink-0">
        <div className="bg-white border border-gray-200 rounded-xl p-2 shadow-sm sticky top-4">
          <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-1 pb-2 lg:pb-0">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                    flex-shrink-0 w-auto lg:w-full text-left
                    ${isActive 
                      ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          {loading && !setting ? (
             <LoaderBlock label="Đang tải dữ liệu..." />
          ) : (
            <div className="p-4 sm:p-6 lg:p-8">
              {renderContent()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}