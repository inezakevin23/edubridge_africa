import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { studentDashboardNavItems } from "../../data/studentDashboard";
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
    case "Dashboard":
      // When rendering the Student sidebar, always go to student dashboard.
      return role === "company" ? "/company-dashboard" : "/dashboard";
    default:
      return role === "company" ? "/company-dashboard" : "/dashboard";
  }
};

function StudentSidebar() {
  const [studentProfile] = useState(() => {
    const savedName = localStorage.getItem("edubridgeStudentName");
    const savedAvatar = localStorage.getItem("edubridgeStudentProfilePic");

    return {
      name: savedName || "Adebayo O.",
      avatar: savedAvatar || "https://i.pravatar.cc/100?img=12",
    };
  });

  const location = useLocation();
  const pathname = location.pathname;

  const getActiveIndexByPath = () => {
    // Student nav order is driven by studentDashboardNavItems.
    // Highlight based on actual route to avoid activeIndex mismatches.
    const map = {
      "/student-feedback": "Feedback",
      "/challenges": "Challenges",
      "/create-challenge": "Manage Challenges",
      "/company-submissions": "Submissions",
      "/challenges/:slug/submit": "Feedback",
      "/challenges/:slug/submit/": "Feedback",
    };

    const activeLabel = map[pathname] || null;
    if (!activeLabel) return -1;

    return studentDashboardNavItems.findIndex(
      ([label]) => label === activeLabel,
    );
  };

  const resolvedActiveIndex = getActiveIndexByPath();

  return (
    <aside className="sticky top-5 hidden h-[calc(100vh-40px)] w-[300px] shrink-0 overflow-y-auto rounded-[30px] border border-white/[0.08] bg-[#0C1627] px-6 py-6 text-white shadow-[0_20px_60px_rgba(0,0,0,0.25)] xl:flex xl:flex-col">
      <div className="mb-7 flex items-center gap-3 rounded-3xl border border-white/[0.06] bg-[#111A2D] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <EduBridgeLogo />
      </div>

      <div className="mb-8 rounded-[28px] bg-[#0F1A33] p-5 text-center shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
        <img
          alt={studentProfile.name}
          className="mx-auto mb-4 h-20 w-20 rounded-full border-2 border-[#8B5CF6]/30 object-cover shadow-[0_0_30px_rgba(139,92,246,0.25)]"
          src={studentProfile.avatar}
        />
        <p className="text-[13px] uppercase tracking-[0.24em] text-[#8E9AAF]">
          Student
        </p>
        <h2 className="mt-3 text-[18px] font-extrabold text-white">
          {studentProfile.name}
        </h2>
      </div>

      <nav className="space-y-3 border-b border-white/[0.06] pb-7">
        {studentDashboardNavItems.map(([label, Icon], index) => {
          const isActive = index === resolvedActiveIndex;
          return (
            <Link
              className={`flex h-12 items-center gap-4 rounded-2xl px-4 text-[15px] font-semibold transition ${
                isActive
                  ? "bg-white/[0.08] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
                  : "text-[#A8B3D1] hover:bg-white/[0.04] hover:text-white"
              }`}
              aria-current={isActive ? "page" : undefined}
              to={routeForLabel(label, "student")}
              key={label}
            >
              <Icon size={20} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default function DashboardSidebar({
  navItems,
  activeIndex = 0,
  bottomPanel,
}) {
  const { user } = useAuth();

  // Defensive role handling: if auth state is stale/wrong, avoid leaking the student sidebar.
  const role = user?.role;
  const isStudent = role === "student";
  const isCompany = role === "company";

  // If role is missing/unknown, fall back to rendering the provided (non-student) sidebar.
  if (!isStudent && !isCompany) {
    return (
      <aside className="hidden min-h-screen w-[280px] shrink-0 border-r border-white/[0.07] bg-[#111A2A] px-7 py-8 xl:flex xl:flex-col">
        <div className="mb-10">
          <EduBridgeLogo />
        </div>

        <nav className="space-y-3 border-b border-white/[0.06] pb-7">
          {navItems.map(([label, Icon], index) => (
            <Link
              className={`flex h-11 items-center gap-4 rounded-2xl px-3 text-[15px] font-semibold transition ${
                index === activeIndex
                  ? "bg-white/[0.045] text-white"
                  : "text-[#9AA7BA] hover:bg-white/[0.035] hover:text-white"
              }`}
              data-sidebar-label={label}
              to={routeForLabel(label, "company")}
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

  if (isStudent) {
    return <StudentSidebar />;
  }

  return (
    <aside className="hidden min-h-screen w-[280px] shrink-0 border-r border-white/[0.07] bg-[#111A2A] px-7 py-8 xl:flex xl:flex-col">
      <div className="mb-10">
        <EduBridgeLogo />
      </div>

      <nav className="space-y-3 border-b border-white/[0.06] pb-7">
        {navItems.map(([label, Icon], index) => (
          <Link
            className={`flex h-11 items-center gap-4 rounded-2xl px-3 text-[15px] font-semibold transition ${
              index === activeIndex
                ? "bg-white/[0.045] text-white"
                : "text-[#9AA7BA] hover:bg-white/[0.035] hover:text-white"
            }`}
            data-sidebar-label={label}
            to={routeForLabel(label, "company")}
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
