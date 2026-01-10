"use client";

import { useState } from "react";
import { Save, ShieldCheck, Lock } from "lucide-react";
import { showToast } from "nextjs-toast-notify";

export default function SecuritySettings() {
  const [twoFactor, setTwoFactor] = useState(false);
  const [passwordPolicy, setPasswordPolicy] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast.success("Cài đặt bảo mật đã được cập nhật!", { duration: 1500 });
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Bảo mật hệ thống</h3>
        <p className="text-sm text-gray-500">Quản lý xác thực và an toàn dữ liệu.</p>
      </div>

      <div className="space-y-4">
        {/* 2FA Toggle */}
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Xác thực 2 lớp (2FA)</h4>
              <p className="text-sm text-gray-500 mt-1">Yêu cầu mã OTP qua email khi đăng nhập thiết bị lạ.</p>
            </div>
          </div>
          <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
            <input
              type="checkbox"
              id="toggle-2fa"
              className="peer sr-only"
              checked={twoFactor}
              onChange={() => setTwoFactor(!twoFactor)}
            />
            <label
              htmlFor="toggle-2fa"
              className="block w-full h-full bg-gray-200 rounded-full cursor-pointer peer-checked:bg-blue-600 transition-colors"
            ></label>
            <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-6 peer-checked:-left-3"></span>
          </div>
        </div>

        {/* Password Policy */}
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Chính sách mật khẩu mạnh</h4>
              <p className="text-sm text-gray-500 mt-1">Yêu cầu mật khẩu tối thiểu 8 ký tự, bao gồm chữ hoa và số.</p>
            </div>
          </div>
          <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
            <input
              type="checkbox"
              id="toggle-policy"
              className="peer sr-only"
              checked={passwordPolicy}
              onChange={() => setPasswordPolicy(!passwordPolicy)}
            />
            <label
              htmlFor="toggle-policy"
              className="block w-full h-full bg-gray-200 rounded-full cursor-pointer peer-checked:bg-blue-600 transition-colors"
            ></label>
            <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-6 peer-checked:-left-3"></span>
          </div>
        </div>

        {/* Login History (Static demo) */}
        <div className="mt-8">
            <h4 className="font-medium text-gray-900 mb-4">Phiên đăng nhập gần đây</h4>
            <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500">
                        <tr>
                            <th className="px-4 py-3 font-medium">Thiết bị</th>
                            <th className="px-4 py-3 font-medium">Địa điểm</th>
                            <th className="px-4 py-3 font-medium">Thời gian</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        <tr>
                            <td className="px-4 py-3">Chrome on Windows</td>
                            <td className="px-4 py-3">Hanoi, Vietnam</td>
                            <td className="px-4 py-3 text-green-600">Đang hoạt động</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3">Safari on iPhone</td>
                            <td className="px-4 py-3">Ho Chi Minh, Vietnam</td>
                            <td className="px-4 py-3 text-gray-500">2 giờ trước</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100 flex justify-end">
        <button
          type="submit"
          className="flex items-center px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          <Save className="w-4 h-4 mr-2" />
          Lưu cài đặt
        </button>
      </div>
    </form>
  );
}