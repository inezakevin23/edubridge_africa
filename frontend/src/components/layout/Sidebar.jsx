import { Link } from "react-router-dom";
import EduBridgeLogo from "./Logo";

const routeForLabel = (label) => {
  switch (label) {
    case "Dashboard":
    case "My Passport":
    case "Leaderboard":
    case "Career Insights":
    case "Community":
      return "/dashboard";
    case "Feedback":
      return "/student-feedback";
    case "Challenges":
      return "/challenges";
    case "Manage Challenges":
      return "/create-challenge";
    case "Talent Discovery":
    case "Analytics":
      return "/company-dashboard";
    case "Submissions":
      return "/company-submissions";
    default:
      return "/dashboard";
  }
};

export default function DashboardSidebar({
  navItems,
  activeIndex = 0,
  bottomPanel,
}) {
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
            to={routeForLabel(label)}
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
