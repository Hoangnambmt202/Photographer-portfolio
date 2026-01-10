/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

interface ThemeSettingsProps {
  data: any;
  mode: "view" | "edit";
  loading: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export default function ThemeSettings({ data, mode, loading, onEdit, onCancel, onSubmit }: ThemeSettingsProps) {
  const [form, setForm] = useState({
    theme_mode: "system",
    primary_color: "#2563eb",
  });

  // Sync data từ props vào local state khi data thay đổi hoặc mở edit
  useEffect(() => {
    if (data) {
      setForm({
        theme_mode: data.theme_mode || "system",
        primary_color: data.primary_color || "#2563eb",
      });
    }
  }, [data]);

  const handleSubmit = () => {
    onSubmit(form);
  };

  const colors = ["#2563eb", "#dc2626", "#16a34a", "#9333ea", "#ea580c", "#000000"];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Actions */}
      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Giao diện</h2>
          <p className="text-sm text-gray-500">Tùy chỉnh màu sắc và chế độ hiển thị</p>
        </div>
        {mode === "view" ? (
          <button onClick={onEdit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Chỉnh sửa
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={onCancel} className="px-4 py-2 border rounded hover:bg-gray-50" disabled={loading}>Hủy</button>
            <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50" disabled={loading}>
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        )}
      </div>

      <div className="space-y-8">
        {/* Theme Mode */}
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-3">Chế độ hiển thị</label>
          <div className="grid grid-cols-3 gap-4 max-w-md">
            {[
              { id: "light", icon: Sun, label: "Sáng" },
              { id: "dark", icon: Moon, label: "Tối" },
              { id: "system", icon: Monitor, label: "Hệ thống" },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                disabled={mode === "view"}
                onClick={() => setForm({ ...form, theme_mode: m.id })}
                className={`flex flex-col items-center justify-center p-4 border rounded-xl transition-all ${
                  form.theme_mode === m.id
                    ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600"
                    : "border-gray-200 text-gray-600"
                } ${mode === "view" ? "opacity-75 cursor-default" : "hover:bg-gray-50 cursor-pointer"}`}
              >
                <m.icon className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Primary Color */}
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-3">Màu chủ đạo</label>
          <div className="flex flex-wrap gap-4 items-center">
            {mode === "view" ? (
               <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full border shadow-sm" style={{ backgroundColor: form.primary_color }} />
                  <span className="text-gray-600 uppercase font-mono bg-gray-100 px-2 py-1 rounded text-sm">{form.primary_color}</span>
               </div>
            ) : (
               <>
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setForm({ ...form, primary_color: color })}
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-transform hover:scale-110 ${
                      form.primary_color === color ? "border-gray-400 scale-110" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                  >
                    {form.primary_color === color && <div className="w-2 h-2 bg-white rounded-full" />}
                  </button>
                ))}
                <input
                  type="color"
                  value={form.primary_color}
                  onChange={(e) => setForm({ ...form, primary_color: e.target.value })}
                  className="w-10 h-10 p-0 border-0 rounded-full overflow-hidden cursor-pointer shadow-sm"
                />
               </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}