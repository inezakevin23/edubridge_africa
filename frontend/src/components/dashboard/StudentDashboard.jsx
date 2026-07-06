import {
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  Clock3,
  Coins,
  GraduationCap,
  Flame,
  Globe,
  Grid2X2,
  Medal,
  MessageSquare,
  Search,
  TrendingUp,
  UserRound,
} from "lucide-react";
import { motion } from "framer-motion";
import DashboardLayout from "../layout/DashboardLayout";
import Topbar from "../layout/Topbar";

const navItems = [
  ["Dashboard", Grid2X2],
  ["Challenges", BriefcaseBusiness],
  ["My Passport", UserRound],
  ["Leaderboard", Medal],
  ["Career Insights", TrendingUp],
  ["Community", MessageSquare],
];

const filters = [
  "All Challenges",
  "Technology",
  "Design & UX",
  "Business Strategy",
  "Social Impact",
];

const challenges = [
  {
    title: "Supply Chain Optimization",
    company: "Jumia",
    tags: ["Logistics", "Data", "Advanced"],
    xp: "1200 XP",
    time: "2 days left",
    initials: "SC",
  },
  {
    title: "Fintech App Onboarding UX",
    company: "Flutterwave",
    tags: ["UI/UX", "Research", "Intermediate"],
    xp: "800 XP",
    time: "5 days left",
    initials: "UX",
  },
  {
    title: "Sustainable Agri-Tech Model",
    company: "Nourish Africa",
    tags: ["Strategy", "Impact", "Beginner"],
    xp: "450 XP",
    time: "1 week left",
    initials: "AG",
  },
];

function SidebarBottomPanel() {
  return (
    <div className="mt-auto flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-[#0D1626] p-3">
      <img
        alt="Adebayo O."
        className="h-12 w-12 rounded-full border border-white/10 object-cover"
        src="https://i.pravatar.cc/100?img=12"
      />
      <div>
        <h2 className="text-[15px] font-bold text-white">Adebayo O.</h2>
        <p className="mt-1 text-[13px] text-[#9AA7BA]">Level 12 Explorer</p>
      </div>
    </div>
  );
}

function ReputationCard() {
  return (
    <section className="relative flex min-h-[260px] flex-col overflow-hidden rounded-[22px] border border-white/[0.08] bg-[linear-gradient(145deg,#131D31_0%,#101827_100%)] p-7 shadow-[0_22px_60px_rgba(0,0,0,0.22)]">
      <div className="absolute -right-14 -top-20 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[14px] font-medium text-[#9AA7BA]">
            Reputation Score
          </p>
          <h2 className="mt-2 text-[54px] font-extrabold leading-none text-white">
            842
          </h2>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/15 text-[#A879FF]">
          <Medal size={23} />
        </div>
      </div>

      <div className="mt-auto">
        <div className="mb-3 flex items-center justify-between text-[13px]">
          <span className="font-bold text-[#A879FF]">Level 12</span>
          <span className="text-[#9AA7BA]">
            158 to <strong className="text-white">Level 13</strong>
          </span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-[#1B263A]">
          <div className="h-full w-[84%] rounded-full bg-[linear-gradient(90deg,#8B5CF6_0%,#CA8EE8_48%,#F59E0B_100%)]" />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl bg-white/[0.035] p-3">
            <p className="text-[#9AA7BA]">Rank</p>
            <p className="mt-1 font-bold text-white">Top 8%</p>
          </div>
          <div className="rounded-2xl bg-white/[0.035] p-3">
            <p className="text-[#9AA7BA]">Streak</p>
            <p className="mt-1 font-bold text-white">14 days</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function WelcomeCard() {
  return (
    <section className="relative min-h-[260px] overflow-hidden rounded-[22px] border border-violet-200/10 bg-[radial-gradient(circle_at_84%_22%,rgba(139,92,246,0.48)_0%,rgba(75,55,145,0.34)_28%,transparent_56%),linear-gradient(135deg,#312B68_0%,#202A4A_52%,#172136_100%)] p-7 shadow-[0_22px_60px_rgba(0,0,0,0.22)] sm:p-8">
      <div className="absolute bottom-0 right-0 h-32 w-80 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.05))]" />
      <div className="relative flex h-full flex-col">
        <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[13px] font-bold text-[#D8D0FF]">
          <GraduationCap size={16} />
          Student Workspace
        </span>
        <h2 className="max-w-[760px] text-[34px] font-extrabold leading-tight text-white lg:text-[40px]">
          Welcome back, Adebayo!
        </h2>
        <p className="mt-3 max-w-[700px] text-[17px] leading-7 text-[#C2CAD8]">
          You have 2 challenges closing soon. Keep your momentum up and push
          toward Gold tier this month.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-4">
          <button
            className="h-12 rounded-2xl bg-[#8B5CF6] px-6 text-[15px] font-bold text-white shadow-[0_14px_30px_rgba(76,29,149,0.42)] transition hover:bg-[#9568ff]"
            type="button"
          >
            View Pending Tasks
          </button>
          <div className="flex items-center gap-6 text-sm text-[#C2CAD8]">
            <span>
              <strong className="text-white">6</strong> active submissions
            </span>
            <span>
              <strong className="text-white">3</strong> mentor reviews
            </span>
          </div>
        </div>
      </div>
    </section>
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
      navItems={navItems}
      activeIndex={0}
      bottomPanel={<SidebarBottomPanel />}
      topbar={<Topbar />}
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

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,390px)]">
          <WelcomeCard />
          <ReputationCard />
        </div>

        <div className="mt-9 flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {filters.map((filter, index) => (
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
          {challenges.map((challenge) => (
            <ChallengeCard challenge={challenge} key={challenge.title} />
          ))}
        </div>
      </motion.main>
    </DashboardLayout>
  );
}
