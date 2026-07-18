import {
  Building2,
  Globe,
  Mail,
  Sparkles,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import Topbar from "../layout/Topbar";
import {
  companyDashboardTalent,
  companyDashboardMetrics,
  companyDashboardNavItems,
} from "../../data/companyDashboard";
import { fetchChallenges } from "../../services/challengeService";
import { fetchCompanyDashboardStats } from "../../services/dashboardService";

function MetricCard({ metric }) {
  const Icon = metric.icon;

  return (
    <article className="relative min-h-[132px] overflow-hidden rounded-[18px] border border-white/[0.07] bg-[linear-gradient(145deg,#141D30_0%,#111827_100%)] p-4 shadow-[0_18px_46px_rgba(0,0,0,0.17)]">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl bg-[#0D1626] ${metric.color}`}
        >
          <Icon size={19} />
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-[11px] font-extrabold text-[#22C55E]">
          <TrendingUp size={12} />
          {metric.trend}
        </span>
      </div>
      <h3 className="mt-5 text-[30px] font-extrabold leading-none text-white">
        {metric.value}
      </h3>
      <p className="mt-2 text-[13px] text-[#9AA7BA]">{metric.label}</p>
    </article>
  );
}

function ActiveChallengesTable({ challenges }) {
  return (
    <section className="overflow-hidden rounded-[22px] border border-white/[0.07] bg-[#131C2E] shadow-[0_18px_46px_rgba(0,0,0,0.16)]">
      <div className="flex items-center justify-between border-b border-white/[0.06] p-7">
        <h2 className="text-[22px] font-extrabold text-white">
          Active Challenges
        </h2>
        <a className="text-[15px] font-bold text-[#8B5CF6]" href="#">
          View All
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left">
          <thead className="bg-[#0F1728] text-[14px] text-[#9AA7BA]">
            <tr>
              <th className="px-7 py-4 font-bold">Challenge Title</th>
              <th className="px-5 py-4 font-bold">Type</th>
              <th className="px-5 py-4 font-bold">Submissions</th>
              <th className="px-5 py-4 font-bold">Deadline</th>
              <th className="px-5 py-4 font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05] text-[15px]">
            {challenges.map((challenge) => (
              <tr key={challenge.id || challenge.title}>
                <td className="px-7 py-5 font-bold text-white">
                  {challenge.title}
                </td>
                <td className="px-5 py-5">
                  <span className="rounded-lg bg-white/[0.045] px-3 py-1.5 text-[#9AA7BA]">
                    {challenge.tags?.[0] || "Challenge"}
                  </span>
                </td>
                <td className="px-5 py-5 font-bold text-white">
                  {challenge.submissions || 0}
                </td>
                <td className="px-5 py-5 text-[#9AA7BA]">{challenge.time}</td>
                <td className="px-5 py-5">
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-[13px] font-extrabold text-[#22C55E]">
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ShortlistedSubmissions() {
  return (
    <section className="rounded-[22px] border border-violet-400/15 bg-[radial-gradient(circle_at_90%_0%,rgba(139,92,246,0.42)_0%,transparent_38%),linear-gradient(145deg,#171B3A_0%,#111827_100%)] p-7 shadow-[0_22px_62px_rgba(0,0,0,0.22)]">
      <h2 className="mb-7 flex items-center gap-3 text-[22px] font-extrabold text-white">
        <Sparkles className="text-[#9B6CFF]" size={25} />
        Shortlisted Submissions
      </h2>

      <div className="space-y-5">
        {companyDashboardTalent.map((person) => (
          <article
            className="rounded-[22px] border border-white/[0.05] bg-[#0D1626] p-5"
            key={person.name}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[17px] font-extrabold text-white">
                  {person.name}
                </h3>
                <p className="mt-1 text-[14px] font-semibold text-[#9B6CFF]">
                  {person.role}
                </p>
              </div>
              <span className="rounded-xl bg-white/[0.07] px-3 py-1.5 text-[13px] font-bold text-white">
                {person.level}
              </span>
            </div>

            <p className="mt-5 flex items-center gap-2 text-[14px] text-[#9AA7BA]">
              <Trophy className="text-[#F59E0B]" size={17} />
              {person.badges} Skill Badges
            </p>

            <div className="mt-5 flex items-center gap-3">
              <button
                className="h-11 flex-1 rounded-2xl bg-[#8B5CF6] text-[14px] font-bold text-white shadow-[0_12px_28px_rgba(139,92,246,0.28)] transition hover:bg-[#9568ff]"
                type="button"
              >
                View Profile
              </button>
              <button
                aria-label={`Message ${person.name}`}
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.07] text-white transition hover:bg-white/[0.11]"
                type="button"
              >
                <Mail size={18} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function CompanyDashboard() {
  const [challenges, setChallenges] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([fetchChallenges(), fetchCompanyDashboardStats()]).then(
      ([challengeData, statsData]) => {
        if (mounted) {
          setChallenges(challengeData);
          setStats(statsData);
        }
      },
    );
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <DashboardLayout
      navItems={companyDashboardNavItems}
      activeIndex={0}
      bottomPanel={null}
      topbar={<Topbar />}
      workspace="company"
    >
      <motion.main
        className="mx-auto max-w-[1500px] px-4 py-8 sm:px-8 lg:px-10 xl:py-10"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        <div className="mb-7 flex items-center gap-3 xl:hidden">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#F59E0B,#F97316)] shadow-[0_0_26px_rgba(245,158,11,0.32)]">
            <Building2 size={23} />
          </div>
          <h1 className="text-[24px] font-extrabold">EduBridge Biz</h1>
        </div>

        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <h2 className="text-[34px] font-extrabold leading-tight text-white lg:text-[40px]">
              Company Overview
            </h2>
            <p className="mt-3 max-w-[760px] text-[17px] leading-7 text-[#9AA7BA]">
              Manage your challenges, review submissions, and discover top
              African talent.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              className="flex h-12 items-center gap-2 rounded-2xl bg-[#8B5CF6] px-5 text-[15px] font-bold text-white shadow-[0_14px_30px_rgba(139,92,246,0.32)] transition hover:bg-[#9568ff]"
              to="/create-challenge"
            >
              <Globe size={18} />
              Post Open Challenge
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(stats
            ? [
                {
                  label: "Active challenges",
                  value: stats.active_challenges ?? 0,
                  trend: "+0",
                  icon: Building2,
                  color: "text-[#8B5CF6]",
                },
                {
                  label: "Total submissions",
                  value: stats.total_submissions ?? 0,
                  trend: "+0",
                  icon: Trophy,
                  color: "text-[#F59E0B]",
                },
                {
                  label: "Reviewed",
                  value: stats.reviewed_submissions ?? 0,
                  trend: "+0",
                  icon: TrendingUp,
                  color: "text-[#22C55E]",
                },
                {
                  label: "Shortlisted",
                  value: stats.shortlisted_submissions ?? 0,
                  trend: "+0",
                  icon: Sparkles,
                  color: "text-[#A78BFA]",
                },
              ]
            : companyDashboardMetrics
          ).map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </div>

        <div className="mt-9 grid gap-8 min-[1180px]:grid-cols-[minmax(0,1fr)_420px]">
          <div className="space-y-8">
            <ActiveChallengesTable challenges={challenges} />
          </div>
          <div className="space-y-8">
            <ShortlistedSubmissions />
          </div>
        </div>
      </motion.main>
    </DashboardLayout>
  );
}
