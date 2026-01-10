"use client";

import { useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { useAuthStore } from "@/stores/authStore";
import { useUIStore } from "@/stores/uiStore";
import "@/styles/globals.css";

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { fetchProfile } = useAuthStore();
  const { sidebarOpen } = useUIStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      
      {/* Logic Layout:
         - Mobile (lg:hidden): pl-0 (Sidebar đè lên)
         - Desktop Open: pl-64
         - Desktop Closed: pl-20
      */}
      <div 
        className={`flex-1 flex flex-col min-w-0 transition-[padding] duration-300 ease-in-out
            ${sidebarOpen ? "lg:pl-64" : "lg:pl-20"}
        `}
      >
        <AdminHeader />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}