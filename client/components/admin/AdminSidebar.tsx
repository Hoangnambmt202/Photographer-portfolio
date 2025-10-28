"use client";
import {
  Camera,
  LayoutDashboard,
  FolderOpen,
  Filter,
  Image,
  Users,
  Settings,
  ArrowLeftCircleIcon,
  Package,
  Calendar,
  Inbox,
  ChevronDown,
} from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminSidebar() {
  const { sidebarOpen, setSidebar } = useUIStore();
  const router = useRouter();
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  // Danh sách menu với submenu
  const menuItems = [
    { id: "dashboard", name: "Trang chủ", icon: LayoutDashboard, path: "/admin" },
    { 
      id: "albums", 
      name: "Albums", 
      icon: FolderOpen, 
      path: "/admin/albums",
    },
    { 
      id: "photos", 
      name: "Ảnh", 
      icon: Image, 
      path: "/admin/photos",
      
    },
    { id: "inbox", name: "Inbox", icon: Inbox, path: "/admin/inbox" },
    { id: "users", name: "Khách hàng", icon: Users, path: "/admin/contacts",
       submenu: [
        { id: "contacts", name: "Khách hàng", path: "/admin/contacts" },
        { id: "users", name: "Users", path: "/admin/users" },
      ]
     },
    { id: "categories", name: "Danh mục", icon: Filter, path: "/admin/categories" },
    { id: "services", name: "Dịch vụ", icon: Package, path: "/admin/service" },
    { id: "calendar", name: "Lịch", icon: Calendar, path: "/admin/calendar" },
    { 
      id: "settings", 
      name: "Cài đặt", 
      icon: Settings, 
      path: "/admin/settings",
      submenu: [
        { id: "general", name: "Cài đặt chung", path: "/admin/settings/general" },
        { id: "profile", name: "Hồ sơ", path: "/admin/settings/profile" },
        { id: "security", name: "Bảo mật", path: "/admin/settings/security" },
      ]
    },
  ];

  // Xác định trang hiện tại theo pathname
  const currentPage =
    [...menuItems]
      .sort((a, b) => b.path.length - a.path.length)
      .find((item) =>
        pathname === item.path || pathname.startsWith(item.path + "/")
      )?.id || "dashboard";

  // Toggle submenu
  const toggleSubmenu = (itemId: string) => {
    setOpenSubmenu(openSubmenu === itemId ? null : itemId);
  };

  // Check if submenu item is active
  const isSubmenuActive = (submenuPath: string) => {
    return pathname === submenuPath || pathname.startsWith(submenuPath + "/");
  };

  return (
    <>
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } fixed inset-y-0 left-0 z-50 bg-gray-900 text-white transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static max-h-screen flex flex-col`}
      >
        {/* Nút thu nhỏ/mở rộng */}
        <button
          onClick={() => setSidebar(!sidebarOpen)}
          className="absolute -right-3 top-2 bg-gray-900 rounded-full"
        >
          <ArrowLeftCircleIcon
            className={`w-8 h-8 text-white transform transition-transform duration-300 ${
              sidebarOpen ? "rotate-0" : "rotate-180"
            }`}
          />
        </button>

        {/* Logo */}
        <div className="flex items-center justify-center p-4 border-b border-gray-800">
          <Camera className="w-8 h-8 text-blue-500" />
          {sidebarOpen && (
            <span className="ml-2 text-xl font-bold whitespace-nowrap">
              PhotoAdmin
            </span>
          )}
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto scrollbar-hide">
          {menuItems.map((item) => {
            const isActive = currentPage === item.id;
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isSubmenuOpen = openSubmenu === item.id;

            return (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => {
                    if (hasSubmenu && sidebarOpen) {
                      toggleSubmenu(item.id);
                    } else {
                      router.push(item.path);
                      if (window.innerWidth < 1024) setSidebar(false);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    {sidebarOpen && <span>{item.name}</span>}
                  </div>
                  {sidebarOpen && hasSubmenu && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isSubmenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {/* Submenu */}
                {hasSubmenu && sidebarOpen && isSubmenuOpen && (
                  <div className="mt-1 ml-4 space-y-1">
                    {item.submenu.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={() => {
                          router.push(subItem.path);
                          if (window.innerWidth < 1024) setSidebar(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors text-sm ${
                          isSubmenuActive(subItem.path)
                            ? "bg-blue-500 text-white"
                            : "text-gray-400 hover:bg-gray-800 hover:text-white"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        <span>{subItem.name}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Tooltip khi sidebar đóng */}
                {!sidebarOpen && (
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50">
                    <div className="bg-gray-800 text-white text-sm px-3 py-2 rounded shadow-lg whitespace-nowrap">
                      <div className="font-medium">{item.name}</div>
                      {hasSubmenu && (
                        <div className="mt-2 space-y-1 border-t border-gray-700 pt-2">
                          {item.submenu.map((subItem) => (
                            <button
                              key={subItem.id}
                              onClick={() => {
                                router.push(subItem.path);
                                if (window.innerWidth < 1024) setSidebar(false);
                              }}
                              className="block w-full text-left px-2 py-1 hover:bg-gray-700 rounded text-xs text-gray-300 hover:text-white"
                            >
                              {subItem.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Overlay cho mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebar(false)}
        />
      )}
    </>
  );
}