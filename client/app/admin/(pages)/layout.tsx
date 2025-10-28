"use client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import "@/styles/globals.css";
import { usePathname , useRouter} from "next/navigation";

import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
   const pathname = usePathname();
  const router = useRouter();
  const { user, fetchProfile, loading } = useAuthStore();
  const isAuthPage = pathname.startsWith("/admin/auth/login");

  useEffect(() => {
    if (!user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);
  useEffect(() => {
    if (!loading && !user && !isAuthPage) {
      router.replace("/admin/auth/login");
    }
  }, [user, isAuthPage, loading, router])
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />
      {/* Nội dung chính */}
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6 max-h-screen overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
