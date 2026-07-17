import { useState } from "react";
import {
  ArrowRight,
  Clock3,
  Coins,
  Globe,
} from "lucide-react";
import { motion } from "framer-motion";
import DashboardLayout from "../layout/DashboardLayout";
import Topbar from "../layout/Topbar";
import {
  studentDashboardNavItems,
  studentDashboardFilters,
  studentDashboardChallenges,
  studentDashboardStats,
} from "../../data/studentDashboard";

function SidebarBottomPanel() {
  const [studentProfile] = useState(() => {
    const savedName = localStorage.getItem("edubridgeStudentName");
    const savedAvatar = localStorage.getItem("edubridgeStudentProfilePic");

    return {
      name: savedName || "Adebayo O.",
      avatar: savedAvatar || "https://i.pravatar.cc/100?img=12",
    };
  });

  return (
    <div className="mt-auto flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-[#0D1626] p-3">
      <img
        alt={studentProfile.name}
        className="h-12 w-12 rounded-full border border-white/10 object-cover"
        src={studentProfile.avatar}
      />
      <div>
        <h2 className="text-[15px] font-bold text-white">
          {studentProfile.name}
        </h2>
        <p className="mt-1 text-[13px] text-[#9AA7BA]">Level 12 Explorer</p>
      </div>
    </div>
  );
}

function MetricCard({ metric }) {
  const Icon = metric.icon;

  return (
    <article className="relative min-h-[132px] overflow-hidden rounded-[18px] border border-white/[0.07] bg-[linear-gradient(145deg,#141D30_0%,#111827_100%)] p-4 shadow-[0_18px_46px_rgba(0,0,0,0.17)]">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0D1626]">
        <Icon className={metric.color} size={19} />
      </div>
      <h2 className="mt-5 text-[30px] font-extrabold leading-none text-white">{metric.value}</h2>
      <p className="mt-2 text-[13px] text-[#9AA7BA]">{metric.label}</p>
    </article>
  );
}

function ChallengeCard({ challenge }) {
  return (
    <article className="group flex min-h-[235px] flex-col rounded-[22px] border border-white/[0.07] bg-[linear-gradient(135deg,#111A2C_0%,#171B38_100%)] p-6 shadow-[0_18px_45px_rgba(0,0,0,0.18)] transition hover:-translate-y-1 hover:border-violet-400/25 hover:shadow-[0_24px_65px_rgba(0,0,0,0.26)]">
      <div className="flex items-start gap-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/[0.07] bg-[#0D1626] text-[13px] font-extrabold text-[#A879FF]">
          {challenge.initials}
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-[17px] font-extrabold text-white">
            {challenge.title}
          </h3>
          <p className="mt-1 text-[15px] text-[#9AA7BA]">{challenge.company}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {challenge.tags.map((tag, index) => (
          <span
            className={`rounded-xl border px-3 py-1.5 text-[12px] font-semibold ${
              index === 2
                ? "border-violet-500/30 bg-violet-500/15 text-[#A879FF]"
                : "border-white/[0.05] bg-[#0F172A] text-[#AAB4C3]"
            }`}
            key={tag}
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-white/[0.07] pt-5">
        <div className="flex items-center gap-2 text-[15px] font-extrabold text-[#F59E0B]">
          <Coins size={18} />
          {challenge.xp}
        </div>
        <div className="flex items-center gap-2 text-[14px] font-medium text-[#9AA7BA]">
          <Clock3 size={18} />
          {challenge.time}
        </div>
      </div>
    </article>
  );
}

export default function StudentDashboard() {
  return (
    <DashboardLayout
      navItems={studentDashboardNavItems}
      activeIndex={0}
      bottomPanel={<SidebarBottomPanel />}
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
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#7C4DDE] shadow-[0_0_28px_rgba(139,92,246,0.5)]">
            <Globe size={23} />
          </div>
          <h1 className="text-[24px] font-extrabold">EduBridge</h1>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {studentDashboardStats.map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </div>

        <div className="mt-9 flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {studentDashboardFilters.map((filter, index) => (
            <button
              className={`h-11 shrink-0 rounded-full px-5 text-[14px] font-semibold transition ${
                index === 0
                  ? "bg-[#8B5CF6] text-white shadow-[0_12px_26px_rgba(76,29,149,0.3)]"
                  : "bg-[#182237] text-[#A6B1C4] hover:bg-[#202B43] hover:text-white"
              }`}
              key={filter}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="mt-9 flex items-center justify-between gap-4">
          <h2 className="text-[24px] font-extrabold text-white">
            Recommended for You
          </h2>
          <a
            className="flex items-center gap-2 text-[15px] font-bold text-[#8B5CF6] transition hover:text-[#A879FF]"
            href="#"
          >
            View all
            <ArrowRight size={18} />
          </a>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2 min-[1300px]:grid-cols-3">
          {studentDashboardChallenges.map((challenge) => (
            <ChallengeCard challenge={challenge} key={challenge.title} />
          ))}
        </div>
      </motion.main>
    </DashboardLayout>
  );
}
