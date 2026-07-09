import {
  BriefcaseBusiness,
  Eye,
  Filter,
  Share2,
  SlidersHorizontal,
  ThumbsUp,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import Topbar from "../layout/Topbar";
import { studentDashboardNavItems } from "../../data/studentDashboard";
import {
  studentFeedbackItems,
  studentFeedbackStats,
} from "../../data/studentFeedback";

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

function StatCard({ stat }) {
  const Icon = stat.icon;

  return (
    <article className="rounded-[18px] border border-white/[0.07] bg-[#131C2E] p-5 shadow-[0_18px_46px_rgba(0,0,0,0.14)]">
      <div className="flex items-center gap-4">
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.background} ${stat.color}`}
        >
          <Icon size={22} />
        </span>
        <div>
          <h3 className="text-[30px] font-extrabold leading-none text-white">
            {stat.value}
          </h3>
          <p className="mt-2 text-[13px] font-medium text-[#9AA7BA]">
            {stat.label}
          </p>
        </div>
      </div>
    </article>
  );
}

function FilterButton({ children, icon: Icon }) {
  return (
    <button
      className="flex h-12 items-center justify-center gap-2 rounded-full border border-white/[0.05] bg-[#182237] px-5 text-[14px] font-semibold text-[#AAB5C7] transition hover:bg-[#22304A] hover:text-white"
      type="button"
    >
      <Icon size={16} />
      {children}
    </button>
  );
}

function ScoreRing({ score, tone }) {
  const ringClass =
    tone === "emerald"
      ? "border-[#16A34A] text-[#22C55E]"
      : "border-[#6D4FD7] text-[#A78BFA]";

  return (
    <div
      className={`flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-full border-2 bg-[#101A2B] ${ringClass}`}
    >
      <span className="text-[21px] font-extrabold leading-none">{score}</span>
      <span className="text-[12px] font-bold text-[#9AA7BA]">/100</span>
    </div>
  );
}

function FeedbackCard({ feedback }) {
  const BadgeIcon = feedback.badgeIcon;
  const statusClass =
    feedback.statusTone === "emerald"
      ? "bg-emerald-500/12 text-[#22C55E]"
      : "bg-violet-500/16 text-[#A78BFA]";

  return (
    <article className="overflow-hidden rounded-[22px] border border-white/[0.07] bg-[#131C2E] shadow-[0_18px_46px_rgba(0,0,0,0.14)]">
      <div className="flex flex-col justify-between gap-5 border-b border-white/[0.06] p-6 lg:flex-row lg:items-center">
        <div className="flex min-w-0 items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-[18px] font-extrabold text-[#A78BFA]">
            {feedback.initial}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-[18px] font-extrabold text-white">
                {feedback.title}
              </h2>
              {feedback.badge ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1 text-[12px] font-extrabold text-[#F59E0B]">
                  {BadgeIcon ? <BadgeIcon size={14} /> : null}
                  {feedback.badge}
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-[13px] font-medium text-[#9AA7BA]">
              {feedback.company} · Reviewed {feedback.reviewed}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 lg:justify-end">
          <span className="font-extrabold text-[#F59E0B]">{feedback.xp}</span>
          <span
            className={`rounded-full px-3 py-1.5 text-[12px] font-extrabold ${statusClass}`}
          >
            {feedback.status}
          </span>
          <ScoreRing score={feedback.score} tone={feedback.scoreTone} />
        </div>
      </div>

      <div className="grid gap-7 p-6 lg:grid-cols-[minmax(0,1fr)_390px]">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <img
              alt={feedback.reviewer}
              className="h-11 w-11 rounded-full object-cover"
              src={feedback.reviewerAvatar}
            />
            <div>
              <h3 className="text-[15px] font-extrabold text-white">
                {feedback.reviewer}
              </h3>
              <p className="text-[13px] font-medium text-[#9AA7BA]">
                {feedback.reviewerRole} · {feedback.company}
              </p>
            </div>
          </div>

          <blockquote className="rounded-[18px] border border-white/[0.04] bg-[#0F1728] p-5 text-[15px] leading-7 text-[#AAB5C7]">
            {feedback.quote}
          </blockquote>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              className="flex h-10 items-center gap-2 rounded-full bg-[#2B215A] px-4 text-[13px] font-extrabold text-[#A78BFA] transition hover:bg-[#382877] hover:text-white"
              type="button"
            >
              <ThumbsUp size={15} />
              Helpful
            </button>
            <button
              className="flex h-10 items-center gap-2 rounded-full bg-[#182237] px-4 text-[13px] font-bold text-[#AAB5C7] transition hover:bg-[#22304A] hover:text-white"
              type="button"
            >
              <Share2 size={15} />
              Share Feedback
            </button>
            <button
              className="flex h-10 items-center gap-2 rounded-full bg-[#182237] px-4 text-[13px] font-bold text-[#AAB5C7] transition hover:bg-[#22304A] hover:text-white"
              type="button"
            >
              <Eye size={15} />
              View Solution
            </button>
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-[16px] font-extrabold text-white">
            Score Breakdown
          </h3>
          <div className="space-y-4">
            {feedback.breakdown.map(([label, score]) => {
              const barColor =
                score >= 90
                  ? "bg-[#22C55E]"
                  : score < 75
                    ? "bg-[#F59E0B]"
                    : "bg-[#8B5CF6]";

              return (
                <div
                  className="grid grid-cols-[140px_minmax(0,1fr)_36px] items-center gap-4 text-[13px]"
                  key={label}
                >
                  <span className="font-medium text-[#9AA7BA]">{label}</span>
                  <div className="h-2 overflow-hidden rounded-full bg-[#0F1728]">
                    <div
                      className={`h-full rounded-full ${barColor}`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  <span
                    className={`text-right font-extrabold ${
                      score >= 90
                        ? "text-[#22C55E]"
                        : score < 75
                          ? "text-[#F59E0B]"
                          : "text-[#A78BFA]"
                    }`}
                  >
                    {score}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function StudentFeedbackPage() {
  return (
    <DashboardLayout
      navItems={studentDashboardNavItems}
      activeIndex={3}
      bottomPanel={<SidebarBottomPanel />}
      topbar={<Topbar />}
    >
      <motion.main
        className="mx-auto max-w-[1100px] px-4 py-8 sm:px-8 lg:px-10 xl:py-10"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
          <div>
            <h1 className="text-[32px] font-extrabold leading-tight text-white sm:text-[38px]">
              My Feedback
            </h1>
            <p className="mt-2 text-[16px] font-medium text-[#9AA7BA]">
              Reviews and scores from companies on your submitted solutions.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <FilterButton icon={Filter}>All Challenges</FilterButton>
            <FilterButton icon={SlidersHorizontal}>Most Recent</FilterButton>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {studentFeedbackStats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>

        <div className="mt-8 space-y-6">
          {studentFeedbackItems.map((feedback) => (
            <FeedbackCard feedback={feedback} key={feedback.title} />
          ))}
        </div>

        <section className="mt-8 flex flex-col justify-between gap-5 rounded-[22px] border border-violet-400/15 bg-[linear-gradient(135deg,#171B3A_0%,#141C30_100%)] p-7 shadow-[0_18px_46px_rgba(0,0,0,0.14)] sm:flex-row sm:items-center">
          <div>
            <h2 className="text-[20px] font-extrabold text-white">
              Keep building your track record
            </h2>
            <p className="mt-2 max-w-[560px] text-[15px] leading-6 text-[#9AA7BA]">
              Each review adds to your reputation passport. Companies look at
              your feedback history when considering you for roles.
            </p>
          </div>
          <Link
            className="flex h-12 w-fit items-center gap-2 rounded-full bg-[#8B5CF6] px-6 text-[15px] font-extrabold text-white shadow-[0_14px_30px_rgba(139,92,246,0.32)] transition hover:bg-[#9568ff]"
            to="/challenges"
          >
            <BriefcaseBusiness size={18} />
            Browse New Challenges
          </Link>
        </section>
      </motion.main>
    </DashboardLayout>
  );
}
