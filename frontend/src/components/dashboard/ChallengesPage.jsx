import {
  ArrowRight,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Coins,
  Flame,
  Globe,
  Grid2X2,
  LayoutGrid,
  List,
  MapPin,
  Medal,
  MessageSquare,
  MoreHorizontal,
  Search,
  SlidersHorizontal,
  TrendingUp,
  UserRound,
  Users,
  X,
  Zap,
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

const categories = [
  ["All", "9"],
  ["Business"],
  ["Technology"],
  ["Design"],
  ["Social Impact"],
  ["Finance"],
  ["Healthcare"],
];

const challenges = [
  {
    title: "Supply Chain Optimization",
    company: "Jumia",
    initials: "J",
    color: "bg-violet-500/20 text-[#A879FF]",
    status: "Open",
    tags: ["Logistics", "Data Analysis", "Strategy"],
    level: "Advanced",
    xp: "1200 XP",
    applicants: "142",
    time: "2 days left",
  },
  {
    title: "Fintech App Onboarding UX",
    company: "Flutterwave",
    initials: "F",
    color: "bg-amber-500/20 text-[#F59E0B]",
    status: "Open",
    tags: ["UI/UX", "Research", "Design"],
    level: "Intermediate",
    xp: "800 XP",
    applicants: "89",
    time: "5 days left",
  },
  {
    title: "Sustainable Agri-Tech Model",
    company: "Nourish Africa",
    initials: "N",
    color: "bg-emerald-500/20 text-[#22C55E]",
    status: "Open",
    tags: ["Strategy", "Impact", "Agriculture"],
    level: "Beginner",
    xp: "450 XP",
    applicants: "56",
    time: "1 week left",
  },
  {
    title: "AI-Powered Credit Scoring",
    company: "Kuda Bank",
    initials: "K",
    color: "bg-pink-500/20 text-[#F472B6]",
    status: "Private",
    tags: ["Machine Learning", "Finance", "Python"],
    level: "Advanced",
    xp: "1500 XP",
    applicants: "34",
    time: "3 days left",
  },
  {
    title: "Rural Healthcare Access Study",
    company: "HealthTide NGO",
    initials: "H",
    color: "bg-orange-500/20 text-[#FB923C]",
    status: "Open",
    tags: ["Research", "Healthcare", "Impact"],
    level: "Intermediate",
    xp: "700 XP",
    applicants: "71",
    time: "10 days left",
  },
  {
    title: "E-Commerce Growth Playbook",
    company: "Paystack",
    initials: "P",
    color: "bg-violet-500/20 text-[#A879FF]",
    status: "Open",
    tags: ["Growth", "Marketing", "Analytics"],
    level: "Intermediate",
    xp: "950 XP",
    applicants: "103",
    time: "4 days left",
  },
  {
    title: "Mobile-First Education Platform",
    company: "Andela",
    initials: "A",
    color: "bg-yellow-500/20 text-[#EAB308]",
    status: "Open",
    tags: ["EdTech", "Product", "UX"],
    level: "Advanced",
    xp: "1100 XP",
    applicants: "67",
    time: "6 days left",
  },
  {
    title: "Waste Collection Route Optimizer",
    company: "Ecoclean Lagos",
    initials: "E",
    color: "bg-emerald-500/20 text-[#22C55E]",
    status: "Open",
    tags: ["Environment", "Mapping", "Impact"],
    level: "Beginner",
    xp: "400 XP",
    applicants: "29",
    time: "2 weeks left",
  },
  {
    title: "Pan-African Logistics Dashboard",
    company: "DHL Africa",
    initials: "D",
    color: "bg-fuchsia-500/20 text-[#E879F9]",
    status: "Private",
    tags: ["Data Viz", "Logistics", "Design"],
    level: "Advanced",
    xp: "1800 XP",
    applicants: "18",
    time: "1 day left",
  },
];

function FilterSelect({ icon: Icon, label }) {
  return (
    <button
      className="flex h-11 shrink-0 items-center gap-2 rounded-full border border-white/[0.06] bg-[#0F1728] px-4 text-[14px] font-semibold text-[#AAB4C3] transition hover:bg-[#182237] hover:text-white"
      type="button"
    >
      <Icon size={17} />
      {label}
      <ChevronDown size={15} />
    </button>
  );
}

function SearchFilters() {
  return (
    <section className="rounded-[22px] border border-white/[0.07] bg-[#131C2E] p-5 shadow-[0_18px_46px_rgba(0,0,0,0.15)]">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex h-11 min-w-0 flex-1 items-center gap-3 rounded-full border border-white/[0.06] bg-[#0F1728] px-4 text-[#9AA7BA]">
          <Search size={18} />
          <input
            className="min-w-0 flex-1 bg-transparent text-[14px] text-white placeholder:text-[#8E9AAF] outline-none"
            placeholder="Search by title, company, skill..."
            type="search"
          />
        </div>
        <div className="flex gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <FilterSelect icon={MapPin} label="All Countries" />
          <FilterSelect icon={BarChart3} label="Any Level" />
          <FilterSelect icon={Coins} label="Any Reward" />
          <button
            className="flex h-11 shrink-0 items-center gap-2 rounded-full bg-[#8B5CF6] px-6 text-[14px] font-extrabold text-white shadow-[0_12px_28px_rgba(139,92,246,0.3)] transition hover:bg-[#9568ff]"
            type="button"
          >
            <SlidersHorizontal size={17} />
            Filter
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-[12px] text-[#9AA7BA]">
        <span>Active filters:</span>
        {["Open Challenges", "Deadline: This Week"].map((filter) => (
          <span
            className="inline-flex items-center gap-1 rounded-full bg-violet-500/15 px-3 py-1.5 font-bold text-[#A879FF]"
            key={filter}
          >
            {filter}
            <X size={13} />
          </span>
        ))}
        <button
          className="font-semibold text-[#9AA7BA] hover:text-white"
          type="button"
        >
          Clear all
        </button>
      </div>
    </section>
  );
}

function ChallengeCard({ challenge }) {
  const isAdvanced = challenge.level === "Advanced";
  const isBeginner = challenge.level === "Beginner";

  return (
    <article className="group flex min-h-[292px] flex-col rounded-[20px] border border-white/[0.07] bg-[linear-gradient(135deg,#111A2C_0%,#171B38_100%)] p-6 shadow-[0_18px_45px_rgba(0,0,0,0.18)] transition hover:-translate-y-1 hover:border-violet-400/25 hover:shadow-[0_24px_65px_rgba(0,0,0,0.26)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[17px] font-extrabold ${challenge.color}`}
          >
            {challenge.initials}
          </div>
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-[16px] font-extrabold leading-snug text-white">
              {challenge.title}
            </h3>
            <p className="mt-1 truncate text-[13px] text-[#9AA7BA]">
              {challenge.company}
            </p>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-extrabold ${
            challenge.status === "Open"
              ? "bg-emerald-500/10 text-[#22C55E]"
              : "bg-emerald-500/10 text-[#22C55E]"
          }`}
        >
          {challenge.status}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {challenge.tags.map((tag) => (
          <span
            className="rounded-xl border border-white/[0.05] bg-[#0F172A] px-3 py-1.5 text-[12px] font-semibold text-[#AAB4C3]"
            key={tag}
          >
            {tag}
          </span>
        ))}
        <span
          className={`rounded-xl border px-3 py-1.5 text-[12px] font-extrabold ${
            isAdvanced
              ? "border-amber-500/25 bg-amber-500/12 text-[#F59E0B]"
              : isBeginner
                ? "border-amber-500/25 bg-amber-500/12 text-[#F59E0B]"
                : "border-amber-500/25 bg-amber-500/12 text-[#F59E0B]"
          }`}
        >
          {challenge.level}
        </span>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-white/[0.07] pt-5">
        <div className="flex items-center gap-2 text-[15px] font-extrabold text-[#F59E0B]">
          <Coins size={18} />
          {challenge.xp}
        </div>
        <div className="flex items-center gap-3 text-[12px] font-semibold text-[#9AA7BA]">
          <span className="flex items-center gap-1">
            <Users size={15} />
            {challenge.applicants}
          </span>
          <span className="flex items-center gap-1">
            <Clock3 size={15} />
            {challenge.time}
          </span>
        </div>
      </div>

      <button
        className="mt-5 flex h-10 items-center justify-center gap-2 rounded-2xl border border-violet-400/10 bg-violet-500/12 text-[13px] font-extrabold text-[#A879FF] transition group-hover:bg-violet-500/18"
        type="button"
      >
        View Challenge
        <ArrowRight size={16} />
      </button>
    </article>
  );
}

function FeaturedChallenge() {
  return (
    <section className="relative overflow-hidden rounded-[22px] border border-violet-300/12 bg-[radial-gradient(circle_at_92%_24%,rgba(139,92,246,0.42)_0%,transparent_35%),linear-gradient(100deg,#27245A_0%,#182236_48%,#191D3C_100%)] p-7 shadow-[0_22px_62px_rgba(0,0,0,0.22)] md:p-8">
      <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
        <div className="max-w-[760px]">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-amber-500/18 px-3 py-1.5 text-[12px] font-extrabold text-[#F59E0B]">
              FEATURED
            </span>
            <span className="text-[13px] text-[#9AA7BA]">
              Sponsored by Safaricom
            </span>
          </div>
          <h2 className="text-[24px] font-extrabold leading-tight text-white md:text-[28px]">
            Pan-African Connectivity Innovation Challenge
          </h2>
          <p className="mt-4 max-w-[620px] text-[15px] leading-7 text-[#AAB4C3]">
            Design a data-efficient solution to bring reliable internet access
            to underserved communities across East Africa.
          </p>
          <div className="mt-5 flex flex-wrap gap-5 text-[14px] font-semibold text-[#9AA7BA]">
            <span className="flex items-center gap-2 font-extrabold text-[#F59E0B]">
              <Coins size={18} />
              5,000 XP + Cash Prize
            </span>
            <span className="flex items-center gap-2">
              <CalendarDays size={17} />
              12 days left
            </span>
            <span className="flex items-center gap-2">
              <Users size={17} />
              280 applicants
            </span>
          </div>
        </div>
        <button
          className="flex h-14 shrink-0 items-center justify-center gap-2 rounded-[22px] bg-[#8B5CF6] px-8 text-[15px] font-extrabold text-white shadow-[0_18px_40px_rgba(139,92,246,0.35)] transition hover:bg-[#9568ff]"
          type="button"
        >
          Apply Now
          <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}

function Pagination() {
  return (
    <div className="flex flex-col gap-5 pt-2 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[14px] text-[#9AA7BA]">Page 1 of 16</p>
      <div className="flex items-center gap-2">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#182237] text-[#9AA7BA]"
          type="button"
        >
          <ChevronLeft size={18} />
        </button>
        {["1", "2", "3"].map((page, index) => (
          <button
            className={`flex h-10 w-10 items-center justify-center rounded-2xl text-[14px] font-bold ${
              index === 0
                ? "bg-[#8B5CF6] text-white"
                : "bg-[#182237] text-[#9AA7BA]"
            }`}
            key={page}
            type="button"
          >
            {page}
          </button>
        ))}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#182237] text-[#9AA7BA]"
          type="button"
        >
          <MoreHorizontal size={18} />
        </button>
        <button
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#182237] text-[#9AA7BA]"
          type="button"
        >
          16
        </button>
        <button
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#182237] text-[#9AA7BA]"
          type="button"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

export default function ChallengesPage() {
  return (
    <DashboardLayout
      navItems={navItems}
      activeIndex={1}
      bottomPanel={null}
      topbar={<Topbar />}
    >
      <motion.main
        className="mx-auto max-w-[1460px] px-4 py-8 sm:px-8 lg:px-10 xl:py-10"
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

        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div>
            <h2 className="text-[32px] font-extrabold leading-tight text-white lg:text-[38px]">
              Browse Challenges
            </h2>
            <p className="mt-3 max-w-[760px] text-[17px] leading-7 text-[#9AA7BA]">
              Discover and solve real business problems from Africa's top
              companies.
            </p>
          </div>
          <div className="flex h-11 w-fit items-center gap-3 rounded-full bg-[#182237] px-5 text-[14px] font-semibold text-[#AAB4C3]">
            <Zap className="text-[#F59E0B]" size={18} />
            142 challenges live right now
          </div>
        </div>

        <div className="mt-8">
          <SearchFilters />
        </div>

        <div className="mt-8 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map(([category, count], index) => (
            <button
              className={`flex h-11 shrink-0 items-center gap-2 rounded-full px-5 text-[14px] font-bold transition ${
                index === 0
                  ? "bg-[#8B5CF6] text-white shadow-[0_12px_28px_rgba(139,92,246,0.28)]"
                  : "bg-[#182237] text-[#A6B1C4] hover:bg-[#202B43] hover:text-white"
              }`}
              key={category}
              type="button"
            >
              {category}
              {count && (
                <span className="rounded-full bg-white/15 px-2 py-0.5 text-[12px]">
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="mt-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-[14px] text-[#9AA7BA]">Showing 9 challenges</p>
          <div className="flex items-center gap-3">
            <button
              className="flex h-10 items-center gap-2 rounded-full bg-[#182237] px-4 text-[14px] text-[#9AA7BA]"
              type="button"
            >
              Sort by:
              <strong className="text-white">Newest</strong>
              <ChevronDown size={15} />
            </button>
            <button
              aria-label="Grid view"
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#8B5CF6] text-white"
              type="button"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              aria-label="List view"
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#182237] text-[#9AA7BA]"
              type="button"
            >
              <List size={18} />
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 min-[1240px]:grid-cols-3">
          {challenges.map((challenge) => (
            <ChallengeCard challenge={challenge} key={challenge.title} />
          ))}
        </div>

        <div className="mt-9">
          <FeaturedChallenge />
        </div>

        <div className="mt-9">
          <Pagination />
        </div>
      </motion.main>
    </DashboardLayout>
  );
}
