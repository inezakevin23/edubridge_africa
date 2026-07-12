import { useState } from "react";
import {
  Bot,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Mail,
  MessageSquare,
  Paperclip,
  Search,
  Send,
  SlidersHorizontal,
  UserPlus,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import DashboardLayout from "../layout/DashboardLayout";
import {
  companySubmissionsNavItems,
  companySubmissionsReviewItems,
  companySubmissionsStats,
} from "../../data/companySubmissionsReview";
import CompanyTopbar from "../layout/CompanyTopbar";

function StatCard({ stat }) {
  const Icon = stat.icon;

  return (
    <article className="rounded-[18px] border border-white/[0.07] bg-[#131C2E] p-5 shadow-[0_18px_46px_rgba(0,0,0,0.14)]">
      <div className="flex items-center gap-4">
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.background} ${stat.color}`}
        >
          <Icon size={21} />
        </span>
        <div>
          <h3 className="text-[28px] font-extrabold leading-none text-white">
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
      className="flex h-12 items-center justify-center gap-2 rounded-full border border-white/[0.05] bg-[#131C2E] px-4 text-[14px] font-semibold text-[#9AA7BA] transition hover:bg-[#19243A] hover:text-white"
      type="button"
    >
      {Icon ? <Icon size={16} /> : null}
      <span className="truncate">{children}</span>
      <ChevronDown size={16} />
    </button>
  );
}

function StatusBadge({ status, tone }) {
  const toneClass =
    tone === "emerald"
      ? "bg-emerald-500/12 text-[#22C55E]"
      : tone === "violet"
        ? "bg-violet-500/16 text-[#A78BFA]"
        : "bg-white/[0.07] text-[#9AA7BA]";

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[12px] font-extrabold ${toneClass}`}
    >
      {status}
    </span>
  );
}

function ScoreRing({ score, tone }) {
  const ringClass =
    tone === "emerald"
      ? "border-[#16A34A] text-[#22C55E]"
      : tone === "amber"
        ? "border-[#B7791F] text-[#F59E0B]"
        : "border-[#6D4FD7] text-[#A78BFA]";

  return (
    <div
      className={`flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-full border-2 bg-[#101A2B] ${ringClass}`}
    >
      <span className="text-[19px] font-extrabold leading-none">{score}</span>
      <span className="text-[11px] font-bold text-[#9AA7BA]">pts</span>
    </div>
  );
}

function SubmissionCard({ item }) {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [sentFeedback, setSentFeedback] = useState("");

  const sendFeedback = () => {
    const trimmedFeedback = feedback.trim();

    if (!trimmedFeedback) {
      return;
    }

    setSentFeedback(trimmedFeedback);
    setFeedback("");
    setIsFeedbackOpen(false);
  };

  return (
    <article className="rounded-[20px] border border-white/[0.07] bg-[#131C2E] p-5 shadow-[0_18px_46px_rgba(0,0,0,0.13)] lg:p-7">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_210px]">
        <div className="min-w-0">
          <div className="flex gap-4">
            <div className="relative shrink-0 pt-8 sm:pt-7">
              <span
                className={`absolute left-3 top-0 flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-extrabold ${
                  item.rank === 1
                    ? "bg-[#F59E0B] text-white"
                    : "bg-[#263247] text-[#9AA7BA]"
                }`}
              >
                {item.rank}
              </span>
              <img
                alt={item.name}
                className="h-12 w-12 rounded-full object-cover ring-2 ring-white/[0.05]"
                src={item.avatar}
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-[17px] font-extrabold text-white">
                  {item.name}
                </h2>
                <StatusBadge status={item.status} tone={item.statusTone} />
              </div>
              <p className="mt-1 text-[13px] font-medium text-[#9AA7BA]">
                {item.university} · Submitted {item.submitted}
              </p>

              <p className="mt-7 max-w-[900px] text-[15px] leading-7 text-[#AAB5C7]">
                {item.summary}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    className="rounded-lg bg-[#0E1728] px-3 py-1.5 text-[12px] font-semibold text-[#9AA7BA]"
                    key={tag}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-[13px] font-semibold">
                {item.files.map((file) => (
                  <a
                    className="inline-flex items-center gap-2 text-[#A78BFA] underline decoration-[#A78BFA]/40 underline-offset-2 transition hover:text-white"
                    href="#"
                    key={file}
                  >
                    <Paperclip className="text-[#8EA0B8]" size={15} />
                    {file}
                  </a>
                ))}
                <span className="inline-flex items-center gap-2 text-[#9AA7BA]">
                  <Bot className="text-[#8B5CF6]" size={16} />
                  AI Score:
                  <strong className="text-white">{item.aiScore}/100</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:items-stretch">
          <div className="flex items-center justify-between gap-4 lg:block">
            <ScoreRing score={item.score} tone={item.scoreTone} />
            <div className="min-w-[150px] lg:mt-4">
              <label className="mb-2 block text-[12px] font-semibold text-[#9AA7BA]">
                Award XP Credits
              </label>
              <button
                className="flex h-10 w-full items-center justify-between gap-3 rounded-full border border-white/[0.05] bg-[#0F1728] px-4 text-[14px] font-extrabold text-white"
                type="button"
              >
                <span className="text-[#F59E0B]">∞</span>
                {item.xp}
                <ChevronDown size={14} className="text-[#8EA0B8]" />
              </button>
            </div>
          </div>

          <button
            className="flex h-11 items-center justify-center gap-2 rounded-full bg-[#1A2639] px-4 text-[13px] font-extrabold text-white transition hover:bg-[#24324A]"
            type="button"
          >
            <UserPlus size={16} />
            Shortlist Intern
          </button>
          <button
            className="flex h-11 items-center justify-center gap-2 rounded-full bg-[#2B215A] px-4 text-[13px] font-extrabold text-[#A78BFA] transition hover:bg-[#382877] hover:text-white"
            onClick={() => setIsFeedbackOpen(true)}
            type="button"
          >
            <MessageSquare size={16} />
            {sentFeedback ? "Edit Feedback" : "Give Feedback"}
          </button>
          <button
            className="flex h-11 items-center justify-center gap-2 rounded-full bg-[#0E1728] px-4 text-[13px] font-bold text-[#9AA7BA] transition hover:bg-[#182237] hover:text-white"
            type="button"
          >
            <Eye size={16} />
            View Full Solution
          </button>
        </div>
      </div>

      {isFeedbackOpen ? (
        <div className="mt-6 rounded-[18px] border border-violet-400/20 bg-[#0F1728] p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-[15px] font-extrabold text-white">
              Feedback for {item.name}
            </h3>
            <button
              aria-label="Close feedback box"
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#9AA7BA] transition hover:bg-white/[0.06] hover:text-white"
              onClick={() => setIsFeedbackOpen(false)}
              type="button"
            >
              <X size={16} />
            </button>
          </div>
          <textarea
            className="min-h-[120px] w-full resize-y rounded-2xl border border-white/[0.06] bg-[#131C2E] p-4 text-[14px] leading-6 text-white outline-none transition placeholder:text-[#7F8EA5] focus:border-violet-400/45"
            onChange={(event) => setFeedback(event.target.value)}
            placeholder="Write clear, constructive feedback for the student's submission..."
            value={feedback}
          />
          <div className="mt-4 flex flex-wrap justify-end gap-3">
            <button
              className="h-10 rounded-full bg-[#182237] px-5 text-[13px] font-bold text-[#B9C5D7] transition hover:bg-[#22304A] hover:text-white"
              onClick={() => setIsFeedbackOpen(false)}
              type="button"
            >
              Cancel
            </button>
            <button
              className="flex h-10 items-center gap-2 rounded-full bg-[#8B5CF6] px-5 text-[13px] font-extrabold text-white shadow-[0_12px_26px_rgba(139,92,246,0.24)] transition hover:bg-[#9568ff]"
              onClick={sendFeedback}
              type="button"
            >
              <Send size={15} />
              Send Feedback
            </button>
          </div>
        </div>
      ) : null}

      {sentFeedback ? (
        <div className="mt-5 rounded-2xl border border-emerald-400/15 bg-emerald-500/10 p-4 text-[14px] leading-6 text-[#B9F6D3]">
          <strong className="text-white">Feedback sent:</strong> {sentFeedback}
        </div>
      ) : null}
    </article>
  );
}

export default function CompanySubmissionsReviewPage() {
  return (
    <DashboardLayout
      navItems={companySubmissionsNavItems}
      activeIndex={4}
      topbar={<CompanyTopbar />}
    >
      <motion.main
        className="mx-auto max-w-[1500px] px-4 py-8 sm:px-8 lg:px-10 xl:py-10"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
          <div>
            <p className="mb-3 flex items-center gap-2 text-[13px] font-bold text-[#7F8EA5]">
              <span>Submissions</span>
              <ChevronRight size={14} />
              <span className="text-white">Supply Chain Optimization</span>
            </p>
            <h1 className="text-[32px] font-extrabold leading-tight text-white sm:text-[38px]">
              Review Submissions
            </h1>
            <p className="mt-2 text-[16px] font-medium text-[#9AA7BA]">
              Evaluate, score, and shortlist top participants for this
              challenge.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              className="flex h-12 items-center gap-2 rounded-full bg-[#F59E0B] px-5 text-[14px] font-extrabold text-white shadow-[0_14px_30px_rgba(245,158,11,0.26)] transition hover:bg-[#f8a91f]"
              type="button"
            >
              <Mail size={17} />
              Notify Shortlisted
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {companySubmissionsStats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>

        <div className="mt-8 grid gap-3 lg:grid-cols-[minmax(0,1fr)_160px_160px_180px]">
          <div className="flex h-12 items-center gap-3 rounded-full border border-white/[0.05] bg-[#131C2E] px-5 text-[#9AA7BA]">
            <Search size={18} />
            <input
              className="min-w-0 flex-1 bg-transparent text-[14px] text-white placeholder:text-[#8E9AAF] outline-none"
              placeholder="Search by student name, university, skill..."
              type="search"
            />
          </div>
          <FilterButton>All Challenges</FilterButton>
          <FilterButton>All Statuses</FilterButton>
          <FilterButton icon={SlidersHorizontal}>Highest Score</FilterButton>
        </div>

        <div className="mt-8 space-y-5">
          {companySubmissionsReviewItems.map((item) => (
            <SubmissionCard item={item} key={item.name} />
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-5 text-[14px] font-medium text-[#9AA7BA] sm:flex-row">
          <p>Showing 1-5 of 142 submissions</p>
          <div className="flex items-center gap-2">
            <button
              aria-label="Previous page"
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#182237] text-[#9AA7BA] transition hover:bg-[#22304A] hover:text-white"
              type="button"
            >
              <ChevronLeft size={18} />
            </button>
            {["1", "2", "3", "...", "29"].map((page) => (
              <button
                className={`h-10 min-w-10 rounded-2xl px-3 text-[14px] font-extrabold transition ${
                  page === "1"
                    ? "bg-[#F59E0B] text-white"
                    : "bg-[#182237] text-[#9AA7BA] hover:bg-[#22304A] hover:text-white"
                }`}
                type="button"
                key={page}
              >
                {page}
              </button>
            ))}
            <button
              aria-label="Next page"
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#182237] text-[#9AA7BA] transition hover:bg-[#22304A] hover:text-white"
              type="button"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </motion.main>
    </DashboardLayout>
  );
}
