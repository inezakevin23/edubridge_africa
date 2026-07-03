import {
  Bell,
  BriefcaseBusiness,
  Building2,
  ChartPie,
  CheckSquare,
  ChevronDown,
  CircleAlert,
  Globe,
  Inbox,
  Mail,
  Plus,
  Search,
  Sparkles,
  Star,
  TrendingUp,
  Trophy,
  UsersRound,
} from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  ["Dashboard", ChartPie],
  ["Manage Challenges", BriefcaseBusiness],
  ["Talent Discovery", UsersRound],
  ["Analytics", ChartPie],
  ["Submissions", CheckSquare],
];

const metrics = [
  {
    label: "Active Challenges",
    value: "4",
    trend: "+1",
    icon: BriefcaseBusiness,
    color: "text-[#9B6CFF]",
  },
  {
    label: "Total Submissions",
    value: "142",
    trend: "+24%",
    icon: Inbox,
    color: "text-[#60A5FA]",
  },
  {
    label: "Avg. Submission Quality",
    value: "92%",
    trend: "+5%",
    icon: Star,
    color: "text-[#F59E0B]",
  },
  {
    label: "Talent Pipeline",
    value: "38",
    trend: "+12",
    icon: UsersRound,
    color: "text-[#22C55E]",
  },
];

const chartData = [
  ["Mon", 28, 12],
  ["Tue", 34, 28],
  ["Wed", 30, 16],
  ["Thu", 35, 48],
  ["Fri", 35, 31],
  ["Sat", 33, 61],
  ["Sun", 35, 42],
];

const reviewItems = [
  {
    name: "Amina B.",
    project: "Supply Chain Model",
    score: "98%",
    avatar: "https://i.pravatar.cc/100?img=47",
  },
  {
    name: "Kwame O.",
    project: "UX Audit",
    score: "95%",
    avatar: "https://i.pravatar.cc/100?img=12",
  },
  {
    name: "Sarah T.",
    project: "Growth Strategy",
    score: "91%",
    avatar: "https://i.pravatar.cc/100?img=32",
  },
];

const activeChallenges = [
  ["Supply Chain Optimization", "Open", "45", "Oct 24", "Active"],
  ["Q4 Growth Strategy", "Private", "12", "Oct 28", "Active"],
  ["UX Audit: Checkout Flow", "Open", "85", "Oct 15", "Reviewing"],
];

const talent = [
  {
    name: "Adebayo O.",
    role: "Product Designer",
    level: "Lvl 12",
    badges: "8",
  },
  {
    name: "Fatima S.",
    role: "Data Analyst",
    level: "Lvl 15",
    badges: "12",
  },
];

function CompanySidebar() {
  return (
    <aside className="hidden min-h-screen w-[302px] shrink-0 border-r border-white/[0.07] bg-[#111A2A] px-8 py-8 xl:flex xl:flex-col">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#F59E0B,#F97316)] shadow-[0_0_28px_rgba(245,158,11,0.32)]">
          <Building2 size={25} strokeWidth={2.4} />
        </div>
        <div className="flex items-end gap-2">
          <h1 className="text-[25px] font-extrabold leading-none text-white">
            EduBridge
          </h1>
          <span className="text-[14px] font-extrabold text-[#F59E0B]">Biz</span>
        </div>
      </div>

      <nav className="mt-16 space-y-3 border-b border-white/[0.06] pb-7">
        {navItems.map(([label, Icon], index) => (
          <a
            className={`flex h-11 items-center gap-4 rounded-2xl px-3 text-[15px] font-semibold transition ${
              index === 0
                ? "bg-white/[0.045] text-white"
                : "text-[#9AA7BA] hover:bg-white/[0.035] hover:text-white"
            }`}
            href="#"
            key={label}
          >
            <Icon size={20} />
            {label}
          </a>
        ))}
      </nav>

      <div className="mt-9 flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-[#0D1626] p-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[24px] font-extrabold text-[#8B5CF6]">
          J
        </div>
        <div>
          <h2 className="text-[16px] font-bold text-white">Jumia Inc.</h2>
          <p className="mt-1 text-[13px] text-[#9AA7BA]">Enterprise Plan</p>
        </div>
      </div>
    </aside>
  );
}

function CompanyTopbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/[0.07] bg-[#0B1020]/92 px-4 py-4 backdrop-blur-xl sm:px-8 xl:px-10">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4">
        <div className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-full border border-white/[0.06] bg-[#172136] px-5 text-[#9AA7BA] shadow-inner shadow-white/[0.02] sm:max-w-[500px]">
          <Search size={19} />
          <input
            className="min-w-0 flex-1 bg-transparent text-[14px] text-white placeholder:text-[#8E9AAF] outline-none"
            placeholder="Search students, submissions..."
            type="search"
          />
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <button
            aria-label="Notifications"
            className="relative hidden h-11 w-11 items-center justify-center rounded-full text-[#B5C0D2] transition hover:bg-white/[0.06] hover:text-white sm:flex"
            type="button"
          >
            <Bell size={21} />
            <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-[#8B5CF6]" />
          </button>
          <button
            className="flex h-11 items-center gap-2 rounded-full bg-[#182237] px-5 text-[15px] font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:bg-[#202B43]"
            type="button"
          >
            <Plus className="rounded-full bg-[#8B5CF6] p-0.5 text-white" size={20} />
            Post Challenge
          </button>
        </div>
      </div>
    </header>
  );
}

function MetricCard({ metric }) {
  const Icon = metric.icon;

  return (
    <article className="relative min-h-[132px] overflow-hidden rounded-[18px] border border-white/[0.07] bg-[linear-gradient(145deg,#141D30_0%,#111827_100%)] p-4 shadow-[0_18px_46px_rgba(0,0,0,0.17)]">
      <div className="flex items-start justify-between">
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-[#0D1626] ${metric.color}`}>
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

function TrendChart() {
  return (
    <section className="rounded-[22px] border border-white/[0.07] bg-[#131C2E] p-7 shadow-[0_18px_46px_rgba(0,0,0,0.16)]">
      <div className="mb-7 flex items-center justify-between gap-4">
        <h2 className="text-[22px] font-extrabold text-white">
          Engagement & Quality Trends
        </h2>
        <button
          className="flex h-10 items-center gap-2 rounded-2xl border border-white/[0.06] bg-[#0F1728] px-4 text-[14px] font-semibold text-[#9AA7BA]"
          type="button"
        >
          Last 30 Days
          <ChevronDown size={16} />
        </button>
      </div>

      <div className="grid grid-cols-[42px_1fr] gap-5">
        <div className="flex h-[270px] flex-col justify-between pb-8 text-[13px] text-[#9AA7BA]">
          <span>100</span>
          <span>75</span>
          <span>50</span>
          <span>25</span>
          <span>0</span>
        </div>
        <div className="flex h-[270px] items-end justify-between gap-4 border-b border-white/[0.04] pb-8">
          {chartData.map(([day, views, quality]) => (
            <div className="flex h-full flex-1 flex-col justify-end" key={day}>
              <div className="flex h-full items-end justify-center">
                <div className="relative h-full w-full max-w-[56px]">
                  <div
                    className="absolute bottom-0 left-0 right-0 rounded-t-md bg-[#332B68]"
                    style={{ height: `${views}%` }}
                  />
                  <div
                    className="absolute bottom-0 left-0 right-0 rounded-t-md bg-[#8B5CF6] shadow-[0_0_22px_rgba(139,92,246,0.2)]"
                    style={{ height: `${quality}%` }}
                  />
                </div>
              </div>
              <span className="mt-3 text-center text-[13px] text-[#9AA7BA]">
                {day}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-8 text-[14px] text-[#9AA7BA]">
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#332B68]" />
          Total Views
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#8B5CF6]" />
          Quality Submissions
        </span>
      </div>
    </section>
  );
}

function ReviewPanel() {
  return (
    <section className="rounded-[22px] border border-white/[0.07] bg-[#131C2E] p-7 shadow-[0_18px_46px_rgba(0,0,0,0.16)]">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-3 text-[22px] font-extrabold text-white">
          <CircleAlert className="text-[#F59E0B]" size={25} />
          Needs Review
        </h2>
        <span className="rounded-full bg-[#F59E0B]/15 px-2.5 py-1 text-[13px] font-extrabold text-[#F59E0B]">
          12
        </span>
      </div>

      <div className="space-y-4">
        {reviewItems.map((item) => (
          <article
            className="flex items-center gap-4 rounded-[20px] border border-white/[0.05] bg-[#0E1728] p-4"
            key={item.name}
          >
            <img
              alt={item.name}
              className="h-12 w-12 rounded-2xl object-cover"
              src={item.avatar}
            />
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-[16px] font-extrabold text-white">
                {item.name}
              </h3>
              <p className="truncate text-[13px] text-[#9AA7BA]">{item.project}</p>
            </div>
            <span className="rounded-xl bg-emerald-500/10 px-2.5 py-1 text-[13px] font-extrabold text-[#22C55E]">
              {item.score}
            </span>
          </article>
        ))}
      </div>

      <button
        className="mt-5 h-11 w-full rounded-2xl bg-[#1C273A] text-[14px] font-bold text-white transition hover:bg-[#24324A]"
        type="button"
      >
        Review All Submissions
      </button>
    </section>
  );
}

function ActiveChallengesTable() {
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
            {activeChallenges.map(([title, type, submissions, deadline, status]) => (
              <tr key={title}>
                <td className="px-7 py-5 font-bold text-white">{title}</td>
                <td className="px-5 py-5">
                  <span className="rounded-lg bg-white/[0.045] px-3 py-1.5 text-[#9AA7BA]">
                    {type}
                  </span>
                </td>
                <td className="px-5 py-5 font-bold text-white">{submissions}</td>
                <td className="px-5 py-5 text-[#9AA7BA]">{deadline}</td>
                <td className="px-5 py-5">
                  <span
                    className={`rounded-full px-3 py-1.5 text-[13px] font-extrabold ${
                      status === "Active"
                        ? "bg-emerald-500/10 text-[#22C55E]"
                        : "bg-amber-500/10 text-[#F59E0B]"
                    }`}
                  >
                    {status}
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

function TalentPipeline() {
  return (
    <section className="rounded-[22px] border border-violet-400/15 bg-[radial-gradient(circle_at_90%_0%,rgba(139,92,246,0.42)_0%,transparent_38%),linear-gradient(145deg,#171B3A_0%,#111827_100%)] p-7 shadow-[0_22px_62px_rgba(0,0,0,0.22)]">
      <h2 className="mb-7 flex items-center gap-3 text-[22px] font-extrabold text-white">
        <Sparkles className="text-[#9B6CFF]" size={25} />
        Top Talent Pipeline
      </h2>

      <div className="space-y-5">
        {talent.map((person) => (
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
  return (
    <div className="min-h-screen bg-[#0B1020] text-white xl:flex">
      <CompanySidebar />

      <div className="min-w-0 flex-1">
        <CompanyTopbar />

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
              <button
                className="flex h-12 items-center gap-2 rounded-2xl bg-[#8B5CF6] px-5 text-[15px] font-bold text-white shadow-[0_14px_30px_rgba(139,92,246,0.32)] transition hover:bg-[#9568ff]"
                type="button"
              >
                <Globe size={18} />
                Post Open Challenge
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
              <MetricCard key={metric.label} metric={metric} />
            ))}
          </div>

          <div className="mt-9 grid gap-8 min-[1180px]:grid-cols-[minmax(0,1fr)_420px]">
            <div className="space-y-8">
              <TrendChart />
              <ActiveChallengesTable />
            </div>
            <div className="space-y-8">
              <ReviewPanel />
              <TalentPipeline />
            </div>
          </div>
        </motion.main>
      </div>
    </div>
  );
}
