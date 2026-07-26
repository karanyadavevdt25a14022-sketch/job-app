import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: "https://api.iconify.design/lucide/layout-dashboard.svg",
  },
  {
    href: "/dashboard/profile",
    label: "Profile",
    icon: "https://api.iconify.design/lucide/user-round.svg",
  },
  {
    href: "/dashboard/notifications",
    label: "Notifications",
    icon: "https://api.iconify.design/lucide/bell.svg",
  },
  {
    href: "/dashboard/analytics",
    label: "Analytics",
    icon: "https://api.iconify.design/lucide/chart-column.svg",
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: "https://api.iconify.design/lucide/settings.svg",
  },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/signin");

  return (
    <div className="flex min-h-screen bg-[#FAF6EF]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#F5DEB3]/40 border-r border-[#E8D5A8] flex flex-col p-4">
        <div className="text-xl font-bold text-[#5C4B2A] mb-8 px-2">
          CareerPortal
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#5C4B2A] hover:bg-[#F5DEB3] hover:shadow-sm transition-all duration-200"
            >
              <img
                src={item.icon}
                alt={item.label}
                className="w-5 h-5"
              />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white/70 backdrop-blur-md border-b border-[#E8D5A8] flex items-center justify-between px-6">
          <div className="text-sm font-medium text-[#8A7754]">
            Dashboard / Overview
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/profile?upload=1"
              className="bg-[#D4AF6A] hover:bg-[#C19A52] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Upload Resume
            </Link>

            <img
              src={
                session.user.image ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                  session.user.name ?? "User"
                )}`
              }
              alt="Avatar"
              className="w-9 h-9 rounded-full border-2 border-[#E8D5A8]"
            />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}