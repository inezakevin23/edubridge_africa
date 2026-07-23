import { Trophy } from "lucide-react";
import { useState, useEffect } from "react";
import NotificationMenu from "./NotificationMenu";
import { fetchInternDashboardStats } from "../../services/dashboardService";
import useAuth from "../../context/useAuth";

export default function Topbar({ scorePoints: propScorePoints }) {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Auto-fetch score points from the dashboard API when no prop is provided
    // so the topbar always shows the real score points from the backend.
    if (user?.role === "intern") {
      fetchInternDashboardStats()
        .then((resp) => {
          const s = resp?.data || resp;
          setStats(s);
        })
        .catch(() => {});
    }
  }, [user?.role]);

  const score = propScorePoints ?? stats?.total_score_points ?? "0";

  return (
    <header className="sticky top-0 z-20 border-b border-white/[0.07] bg-[#0B1020]/92 px-4 py-4 backdrop-blur-xl sm:px-8 xl:px-10">
      <div className="mx-auto flex max-w-[1500px] items-center justify-start gap-4">
        <div className="flex shrink-0 items-center gap-4">
          <div className="hidden sm:block">
            <NotificationMenu />
          </div>
          <div className="flex h-11 items-center gap-2 rounded-full bg-[#182237] px-5 text-[15px] font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <Trophy className="text-[#F59E0B]" size={18} />
            {score} Score Points
          </div>
        </div>
      </div>
    </header>
  );
}
