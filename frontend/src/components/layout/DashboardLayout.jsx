import { useState } from "react";
import { Menu } from "lucide-react";
import DashboardSidebar from "./Sidebar";

export default function DashboardLayout({
  navItems,
  activeIndex = 0,
  bottomPanel,
  topbar,
  workspace = "student",
  children,
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B1020] text-white xl:flex">
      <DashboardSidebar
        navItems={navItems}
        activeIndex={activeIndex}
        bottomPanel={bottomPanel}
        workspace={workspace}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <div className="min-w-0 flex-1">
        {/* Mobile header with hamburger menu - visible on mobile/tablet only */}
        <div className="flex items-center gap-3 border-b border-white/[0.07] bg-[#0B1020]/90 px-4 py-3 backdrop-blur-xl xl:hidden">
          <button
            aria-label="Open sidebar navigation"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-[#9AA7BA] transition hover:bg-white/[0.06] hover:text-white"
            onClick={() => setMobileSidebarOpen(true)}
            type="button"
          >
            <Menu size={22} />
          </button>
          <span className="text-[15px] font-bold text-white">
            {workspace === "company" ? "Company Dashboard" : "Dashboard"}
          </span>
        </div>

        {topbar}
        {children}
      </div>
    </div>
  );
}
