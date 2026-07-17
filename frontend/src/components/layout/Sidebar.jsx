import { Link, useLocation } from "react-router-dom";

import EduBridgeLogo from "./Logo";

const routeForLabel = (label, role) => {
  // Role-aware route mapping.
  // Student: /dashboard
  // Company: /company-dashboard
  switch (label) {
    case "Feedback":
      return "/student-feedback";
    case "Challenges":
      return "/challenges";
    case "Manage Challenges":
      return "/create-challenge";
    case "Submissions":
      return "/company-submissions";
    case "Profile":
      return role === "company" ? "/company-profile" : "/profile";
    case "Dashboard":
      // When rendering the Student sidebar, always go to student dashboard.
      return role === "company" ? "/company-dashboard" : "/dashboard";
    default:
      return role === "company" ? "/company-dashboard" : "/dashboard";
  }
};

export default function DashboardSidebar({
  navItems,
  activeIndex = 0,
  bottomPanel,
  workspace = "student",
}) {
  const { pathname } = useLocation();
  const studentRouteLabels = {
    "/dashboard": "Dashboard",
    "/student-dashboard": "Dashboard",
    "/student-feedback": "Feedback",
    "/challenges": "Challenges",
    "/profile": "Profile",
  };
  const activeLabel = workspace === "student" ? studentRouteLabels[pathname] : null;
  const resolvedActiveIndex = activeLabel
    ? navItems.findIndex(([label]) => label === activeLabel)
    : activeIndex;
  const role = workspace === "company" ? "company" : "student";

  return (
    <aside className="hidden min-h-screen w-[280px] shrink-0 border-r border-white/[0.07] bg-[#111A2A] px-7 py-8 xl:flex xl:flex-col">
      <div className="mb-10">
        <EduBridgeLogo />
      </div>

      <nav className="space-y-3 border-b border-white/[0.06] pb-7">
        {navItems.map(([label, Icon], index) => (
          <Link
            className={`flex h-11 items-center gap-4 rounded-2xl px-3 text-[15px] font-semibold transition ${
              index === resolvedActiveIndex
                ? "bg-white/[0.045] text-white"
                : "text-[#9AA7BA] hover:bg-white/[0.035] hover:text-white"
            }`}
            data-sidebar-label={label}
            to={routeForLabel(label, role)}
            key={label}
          >
            <Icon size={20} />
            {label}
          </Link>
        ))}
      </nav>

      {bottomPanel ? <div className="mt-auto">{bottomPanel}</div> : null}
    </aside>
  );
}
