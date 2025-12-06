  "use client";

  import { useAuthStore } from "@/stores/authStore";
  import { useUIStore } from "@/stores/uiStore";
  import { Bell, ChevronDown, Mail, Menu, Moon, Search, User, Settings, LogOut } from "lucide-react";
  import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
  export default function AdminHeader() {
    const { user, logout } = useAuthStore();
    const {  toggleSidebar } = useUIStore();
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Đóng dropdown khi click bên ngoài
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setProfileDropdownOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

  const handleLogout = () => {
    logout();
    router.replace("/admin/auth/login");
  };

    return (
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-gray-700"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button title="Chế độ tối" className="p-3 hover:bg-gray-100 rounded-full border border-gray-300 hover:cursor-pointer">
              <Moon className="w-5 h-5 text-gray-600" />
            </button>

            <button title="Mail" className="p-3 hover:bg-gray-100 rounded-full border border-gray-300 hover:cursor-pointer">
              <Mail className="w-5 h-5 text-gray-600" />
            </button>
            <button title="Thông báo" className="p-3 hover:bg-gray-100 rounded-full border border-gray-300 hover:cursor-pointer">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            
            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                className="flex items-center gap-1 hover:bg-gray-50 rounded-lg p-1 transition-colors"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  A
                </div>
                <span>
                  <span className="ml-2 text-gray-700 font-medium">{user?.full_name}</span>
                  <ChevronDown className={`w-4 h-4 inline-block ml-1 text-gray-600 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </span>
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                    <User className="w-4 h-4" />
                    Hồ sơ của tôi
                  </button>
                  
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                    <Settings className="w-4 h-4" />
                    Cài đặt
                  </button>
                  
                  <div className="border-t border-gray-200 mt-1 pt-1">
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors" onClick={handleLogout}>
                      <LogOut className="w-4 h-4" />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  }