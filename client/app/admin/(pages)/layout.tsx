import "@/styles/globals.css";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
