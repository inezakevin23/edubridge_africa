import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Coins,
  Globe,
  LayoutGrid,
  List,
  MapPin,
  MoreHorizontal,
  Search,
  SlidersHorizontal,
  Users,
  X,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import DashboardLayout from "../layout/DashboardLayout";
import Topbar from "../layout/Topbar";
import ChallengeCard from "../challenges/ChallengeCard";
import {
  challengesPageNavItems,
  challengeCategories,
  challengeList,
} from "../../data/challengesPage";

// Local aliases used by this page.
const categories = challengeCategories;
const challenges = challengeList;

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
      navItems={challengesPageNavItems}
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
