import { LogOut, UserRound, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import EduBridgeLogo from "./Logo";
import useAuth from "../../context/useAuth";

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
  mobileOpen = false,
  onMobileClose,
}) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const studentRouteLabels = {
    "/dashboard": "Dashboard",
    "/student-dashboard": "Dashboard",
    "/student-feedback": "Feedback",
    "/challenges": "Challenges",
    "/profile": "Profile",
  };
  const activeLabel =
    workspace === "student" ? studentRouteLabels[pathname] : null;
  const resolvedActiveIndex = activeLabel
    ? navItems.findIndex(([label]) => label === activeLabel)
    : activeIndex;
  const role = workspace === "company" ? "company" : "student";
  // For company workspace, try to get the company/organization name from localStorage
  // (set during registration/company profile creation)
  let companyName = null;
  if (workspace === "company") {
    try {
      const stored = localStorage.getItem("edubridgeCompanyProfile");
      if (stored) {
        const profile = JSON.parse(stored);
        companyName = profile.company_name || null;
      }
    } catch {
      // ignore parse errors
    }
  }
  const displayName =
    companyName ||
    user?.first_name ||
    user?.username ||
    user?.email?.split("@")[0] ||
    (workspace === "company" ? "Company account" : "Student account");

  const sidebarContent = (
    <>
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
            onClick={(e) => {
              // On mobile, close the sidebar after clicking a link
              if (onMobileClose && e.target.closest("a")) {
                onMobileClose();
              }
            }}
          >
            <Icon size={20} />
            {label}
          </Link>
        ))}
      </nav>

      {bottomPanel ? <div className="mt-auto">{bottomPanel}</div> : null}
      <div className={bottomPanel ? "mt-4" : "mt-auto"}>
        <div className="flex items-center gap-3 border-t border-white/[0.06] pt-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] text-[#A78BFA]">
            <UserRound size={17} />
          </span>
          <p className="min-w-0 flex-1 truncate text-[13px] font-bold text-white">
            {displayName}
          </p>
          <button
            aria-label="Log out"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#9AA7BA] transition hover:bg-white/[0.06] hover:text-white"
            onClick={() => {
              logout();
              navigate("/login");
            }}
            type="button"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar - visible on xl and up */}
      <aside className="hidden min-h-screen w-[280px] shrink-0 border-r border-white/[0.07] bg-[#111A2A] px-7 py-8 xl:flex xl:flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay - visible on mobile/tablet when open */}
      {mobileOpen ? (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm xl:hidden"
            onClick={onMobileClose}
          />

          {/* Drawer */}
          <aside
            className="fixed top-0 left-0 z-50 flex h-screen w-[280px] flex-col overflow-y-auto border-r border-white/[0.07] bg-[#111A2A] px-7 py-8 shadow-[0_18px_46px_rgba(0,0,0,0.35)] xl:hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile close button */}
            <div className="mb-6 flex justify-end">
              <button
                aria-label="Close sidebar"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#9AA7BA] transition hover:bg-white/[0.06] hover:text-white"
                onClick={onMobileClose}
                type="button"
              >
                <X size={20} />
              </button>
            </div>

            {sidebarContent}
          </aside>
        </>
      ) : null}
    </>
  );
}
