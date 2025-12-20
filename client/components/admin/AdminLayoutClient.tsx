"use client";

import { useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { useAuthStore } from "@/stores/authStore";
import "@/styles/globals.css";
import { useRouter } from "next/navigation";

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { fetchProfile, user } = useAuthStore();

  useEffect(() => {
    fetchProfile();
    
  }, [fetchProfile]);
 

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6 max-h-screen overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
