"use client";

import { Home, Palette, Mail, Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { href: "/admin/settings/general", label: "Cài đặt chung", icon: Home },
  { href: "/admin/settings/theme", label: "Giao diện", icon: Palette },
  { href: "/admin/settings/email", label: "Email & SMTP", icon: Mail },
  { href: "/admin/settings/security", label: "Bảo mật", icon: Shield },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[500px]">
      
      {/* SIDEBAR */}
      <aside className="w-full lg:w-64 flex-shrink-0">
        <div className="bg-white border rounded-xl p-2 shadow-sm sticky top-4">
          <div className="flex lg:flex-col gap-1 overflow-x-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition
                    ${isActive
                      ? "bg-blue-50 text-blue-700 ring-1 ring-blue-100"
                      : "text-gray-600 hover:bg-gray-50"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 min-w-0">
        <div className="bg-white border rounded-xl shadow-sm">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </div>
      </main>
    </div>
  );
}
