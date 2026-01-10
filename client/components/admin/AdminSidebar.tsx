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
  Tag,
  X,
} from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function AdminSidebar() {
  const { sidebarOpen, setSidebar } = useUIStore();
  const router = useRouter();
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const menuItems = [
    { id: "dashboard", name: "Trang chủ", icon: LayoutDashboard, path: "/admin" },
    { id: "albums", name: "Albums", icon: FolderOpen, path: "/admin/albums" },
    { id: "photos", name: "Ảnh", icon: Image, path: "/admin/photos" },
    { id: "inbox", name: "Inbox", icon: Inbox, path: "/admin/inbox" },
    {
      id: "users",
      name: "Khách hàng",
      icon: Users,
      path: "/admin/contacts",
      submenu: [
        { id: "contacts", name: "DS Khách hàng", path: "/admin/contacts" },
        { id: "users", name: "Tài khoản", path: "/admin/users" },
      ],
    },
    { id: "categories", name: "Danh mục", icon: Filter, path: "/admin/categories" },
    { id: "services", name: "Dịch vụ", icon: Package, path: "/admin/service" },
    { id: "tags", name: "Quản lý tag", icon: Tag, path: "/admin/tags" },
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
      ],
    },
  ];

  const currentPage =
    [...menuItems]
      .sort((a, b) => b.path.length - a.path.length)
      .find((item) => pathname === item.path || pathname.startsWith(item.path + "/"))?.id || "dashboard";

  const toggleSubmenu = (itemId: string) => {
    setOpenSubmenu(openSubmenu === itemId ? null : itemId);
  };

  const isSubmenuActive = (submenuPath: string) =>
    pathname === submenuPath || pathname.startsWith(submenuPath + "/");

  // CSS classes logic
  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 bg-gray-900 text-white flex flex-col transition-all duration-300 ease-in-out shadow-2xl
    ${isMobile 
        ? (sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-64") 
        : (sidebarOpen ? "translate-x-0 w-64" : "translate-x-0 w-20")
    }
  `;

  return (
    <>
      {/* Backdrop for Mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setSidebar(false)}
        />
      )}

      <aside className={sidebarClasses}>
        {/* Toggle Button (Desktop Only) */}
        {!isMobile && (
          <button
            onClick={() => setSidebar(!sidebarOpen)}
            className="absolute -right-3 top-6 bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-full shadow-lg transition-transform hover:scale-110"
          >
            <ArrowLeftCircleIcon
              className={`w-5 h-5 transition-transform duration-300 ${!sidebarOpen ? "rotate-180" : ""}`}
            />
          </button>
        )}

        {/* Close Button (Mobile Only) */}
        {isMobile && (
           <button
           onClick={() => setSidebar(false)}
           className="absolute right-4 top-4 text-gray-400 hover:text-white"
         >
           <X className="w-6 h-6" />
         </button>
        )}

        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-gray-800 shrink-0">
          <Camera className="w-8 h-8 text-blue-500" />
          {(sidebarOpen || isMobile) && (
            <span className="ml-3 text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              PhotoAdmin
            </span>
          )}
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin scrollbar-thumb-gray-700">
          <TooltipProvider delayDuration={0}>
            {menuItems.map((item) => {
              const isActive = currentPage === item.id;
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              const isSubmenuOpen = openSubmenu === item.id;
              const showText = sidebarOpen || isMobile;

              const MenuButton = (
                <button
                  onClick={() => {
                    if (hasSubmenu && showText) toggleSubmenu(item.id);
                    else {
                      router.push(item.path);
                      if (isMobile) setSidebar(false);
                    }
                  }}
                  className={`
                    w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group
                    ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" : "text-gray-400 hover:bg-gray-800 hover:text-white"}
                    ${!showText ? "justify-center" : ""}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : "group-hover:text-blue-400"}`} />
                    {showText && <span className="text-sm font-medium">{item.name}</span>}
                  </div>
                  {showText && hasSubmenu && (
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isSubmenuOpen ? "rotate-180" : ""}`} />
                  )}
                </button>
              );

              return (
                <div key={item.id}>
                  {showText ? (
                    <div>
                      {MenuButton}
                      {hasSubmenu && isSubmenuOpen && (
                        <div className="mt-1 ml-4 pl-4 border-l border-gray-700 space-y-1">
                          {item.submenu?.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={() => {
                                router.push(sub.path);
                                if (isMobile) setSidebar(false);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                isSubmenuActive(sub.path) ? "text-white bg-gray-800" : "text-gray-500 hover:text-gray-300"
                              }`}
                            >
                              {sub.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>{MenuButton}</TooltipTrigger>
                      <TooltipContent side="right" className="bg-gray-800 text-white border-gray-700">
                        {item.name}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              );
            })}
          </TooltipProvider>
        </nav>

        {/* Footer Info */}
        {(sidebarOpen || isMobile) && (
            <div className="p-4 border-t border-gray-800 text-xs text-gray-500 text-center">
                v2.4.0 © 2025
            </div>
        )}
      </aside>
    </>
  );
}