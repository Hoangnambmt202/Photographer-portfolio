/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/static-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

interface EmailSettingsProps {
  data: any;
  mode: "view" | "edit";
  loading: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export default function EmailSettings({ data, mode, loading, onEdit, onCancel, onSubmit }: EmailSettingsProps) {
  const [form, setForm] = useState({
    smtp_host: "",
    smtp_port: "",
    smtp_user: "",
    smtp_password: "",
    from_name: "",
    encryption: "tls",
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (data) {
      setForm({
        smtp_host: data.smtp_host || "",
        smtp_port: data.smtp_port || "",
        smtp_user: data.smtp_user || "",
        smtp_password: data.smtp_password || "",
        from_name: data.from_name || "",
        encryption: data.encryption || "tls",
      });
    }
  }, [data]);

  const handleSubmit = () => onSubmit(form);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const Field = ({ label, value, name, type = "text" }: any) => (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {mode === "view" ? (
        <div className="bg-gray-50 border border-gray-200 px-3 py-2 rounded-md text-gray-800 min-h-[42px] flex items-center">
            {type === "password" && value ? "••••••••" : (value || <span className="text-gray-400 italic">Trống</span>)}
        </div>
      ) : (
        <div className="relative">
             <input
                name={name}
                type={type === "password" && !showPassword ? "password" : "text"}
                value={value}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder={`Nhập ${label.toLowerCase()}`}
            />
            {type === "password" && (
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            )}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Email (SMTP)</h2>
          <p className="text-sm text-gray-500">Cấu hình máy chủ gửi mail thông báo</p>
        </div>
        {mode === "view" ? (
          <button onClick={onEdit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Chỉnh sửa
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={onCancel} className="px-4 py-2 border rounded hover:bg-gray-50" disabled={loading}>Hủy</button>
            <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50" disabled={loading}>
              {loading ? "Đang lưu..." : "Lưu cấu hình"}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="SMTP Host" name="smtp_host" value={form.smtp_host} />
        <Field label="SMTP Port" name="smtp_port" value={form.smtp_port} />
        <Field label="Email User" name="smtp_user" value={form.smtp_user} />
        <Field label="Mật khẩu ứng dụng" name="smtp_password" value={form.smtp_password} type="password" />
        <Field label="Tên người gửi" name="from_name" value={form.from_name} />
        
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Mã hóa</label>
          {mode === "view" ? (
             <div className="bg-gray-50 border border-gray-200 px-3 py-2 rounded-md text-gray-800 uppercase font-medium">
                {form.encryption}
             </div>
          ) : (
             <select
                name="encryption"
                value={form.encryption}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
             >
                <option value="tls">TLS</option>
                <option value="ssl">SSL</option>
                <option value="none">Không mã hóa</option>
             </select>
          )}
        </div>
      </div>
    </div>
  );
}