import DashboardSidebar from "./Sidebar";

export default function DashboardLayout({
  navItems,
  activeIndex = 0,
  bottomPanel,
  topbar,
  workspace = "student",
  children,
}) {
  return (
    <div className="min-h-screen bg-[#0B1020] text-white xl:flex">
      <DashboardSidebar
        navItems={navItems}
        activeIndex={activeIndex}
        bottomPanel={bottomPanel}
        workspace={workspace}
      />

      <div className="min-w-0 flex-1">
        {topbar}
        {children}
      </div>
    </div>
  );
}
