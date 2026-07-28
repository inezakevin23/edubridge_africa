import { useState, useEffect } from "react";
import { ArrowRight, Clock3, Banknote } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import Topbar from "../layout/Topbar";
import { fetchChallenges } from "../../services/challengeService";
import { fetchInternDashboardStats } from "../../services/dashboardService";
import { studentDashboardNavItems } from "../../data/studentDashboard";

function MetricCard({ metric }) {
  return (
    <article className="relative min-h-[132px] overflow-hidden rounded-[18px] border border-white/[0.07] bg-[linear-gradient(145deg,#141D30_0%,#111827_100%)] p-4 shadow-[0_18px_46px_rgba(0,0,0,0.17)]">
      <h2 className="mt-2 text-[30px] font-extrabold leading-none text-white">
        {metric.value}
      </h2>
      <p className="mt-2 text-[13px] text-[#9AA7BA]">{metric.label}</p>
    </article>
  );
}

function ChallengeCard({ challenge }) {
  return (
    <article className="group flex flex-col rounded-[22px] border border-white/[0.07] bg-[linear-gradient(135deg,#111A2C_0%,#171B38_100%)] shadow-[0_18px_45px_rgba(0,0,0,0.18)] transition hover:-translate-y-1 hover:border-violet-400/25 hover:shadow-[0_24px_65px_rgba(0,0,0,0.26)]">
      <div className="p-4 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-5">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl border border-white/[0.07] bg-[#0D1626] text-[11px] sm:text-[13px] font-extrabold text-[#A879FF]">
            {challenge.initials}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[15px] sm:text-[17px] font-extrabold text-white">
              {challenge.title}
            </h3>
            <p className="mt-1 text-[13px] sm:text-[15px] text-[#9AA7BA]">
              {challenge.company}
            </p>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 flex flex-wrap gap-2">
          {challenge.tags.map((tag) => (
            <span
              className="rounded-lg sm:rounded-xl border border-white/[0.05] bg-[#0F172A] px-2.5 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-[12px] font-semibold text-[#AAB4C3]"
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/[0.07] p-4 sm:px-6 sm:py-5">
        <div className="flex items-center gap-1.5 sm:gap-2 text-[13px] sm:text-[15px] font-extrabold text-[#F59E0B]">
          <Banknote size={16} className="sm:hidden" />
          <Banknote size={18} className="hidden sm:block" />
          <span className="truncate">
            {challenge.cash_prize
              ? `Cash prize: ${challenge.cash_prize}`
              : "No cash prize"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 text-[13px] sm:text-[14px] font-medium text-[#9AA7BA]">
          <Clock3 size={16} className="sm:hidden" />
          <Clock3 size={18} className="hidden sm:block" />
          <span className="truncate">{challenge.time}</span>
        </div>
      </div>
    </article>
  );
}

export default function StudentDashboard() {
  const [stats, setStats] = useState(null);
  const [challenges, setChallenges] = useState([]);
  useEffect(() => {
    let mounted = true;
    Promise.all([fetchInternDashboardStats(), fetchChallenges()])
      .then(([statsResp, challengesResp]) => {
        if (!mounted) return;
        const s = statsResp?.data || statsResp;
        setStats(s);
        const results = challengesResp?.results || challengesResp || [];
        setChallenges(Array.isArray(results) ? results : []);
      })
      .catch(() => {
        if (mounted) {
          setStats(null);
          setChallenges([]);
        }
      });
    return () => (mounted = false);
  }, []);

  const metrics = stats
    ? [
        {
          label: "My Submissions",
          value: stats.my_submissions ?? 0,
        },
        {
          label: "Score Points",
          value: stats.total_score_points ?? 0,
        },
        {
          label: "Active Challenges",
          value: stats.active_challenges ?? 0,
        },
        {
          label: "Shortlisted",
          value: stats.shortlisted_submissions ?? 0,
        },
      ]
    : [
        {
          label: "My Submissions",
          value: "—",
        },
        {
          label: "Score Points",
          value: "—",
        },
        {
          label: "Active Challenges",
          value: "—",
        },
        {
          label: "Shortlisted",
          value: "—",
        },
      ];

  return (
    <DashboardLayout
      navItems={studentDashboardNavItems}
      activeIndex={0}
      bottomPanel={null}
      topbar={<Topbar />}
      workspace="student"
    >
      <motion.main
        className="mx-auto max-w-[1500px] px-4 py-8 sm:px-8 lg:px-10 xl:py-10"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        <div className="mb-7 flex items-center gap-3 xl:hidden">
          <h1 className="text-[24px] font-extrabold">EduBridge</h1>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </div>

        <div className="mt-9 flex items-center justify-between gap-4">
          <h2 className="text-[24px] font-extrabold text-white">
            Latest Challenges
          </h2>
          <Link
            className="flex items-center gap-2 text-[15px] font-bold text-[#8B5CF6] transition hover:text-[#A879FF]"
            to="/challenges"
          >
            View all
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2 min-[1300px]:grid-cols-3">
          {challenges.map((challenge) => (
            <ChallengeCard
              challenge={challenge}
              key={challenge.id || challenge.title}
            />
          ))}
        </div>
      </motion.main>
    </DashboardLayout>
  );
}
