import { Eye, ThumbsUp } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import Topbar from "../layout/Topbar";
import { studentDashboardNavItems } from "../../data/studentDashboard";
import { fetchMySubmissions } from "../../services/submissionService";
import { fetchInternDashboardStats } from "../../services/dashboardService";
import useAuth from "../../context/useAuth";

function StatCard({ stat }) {
  return (
    <article className="rounded-[18px] border border-white/[0.07] bg-[#131C2E] p-5 shadow-[0_18px_46px_rgba(0,0,0,0.14)]">
      <h3 className="text-[30px] font-extrabold leading-none text-white">
        {stat.value}
      </h3>
      <p className="mt-2 text-[13px] font-medium text-[#9AA7BA]">
        {stat.label}
      </p>
    </article>
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

      <div className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#35266A] text-[14px] font-extrabold text-[#A78BFA]">
            {feedback.reviewerInitial}
          </div>
          <div>
            <h3 className="text-[15px] font-extrabold text-white">
              {feedback.reviewer}
            </h3>
            <p className="text-[13px] font-medium text-[#9AA7BA]">
              {feedback.reviewerRole}
            </p>
          </div>
        </div>

        <blockquote className="rounded-[18px] border border-white/[0.04] bg-[#0F1728] p-5 text-[15px] leading-7 text-[#AAB5C7]">
          {feedback.quote}
        </blockquote>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            className="flex h-10 items-center gap-2 rounded-full bg-[#182237] px-4 text-[13px] font-bold text-[#AAB5C7] transition hover:bg-[#22304A] hover:text-white"
            to={`/solution/${feedback.solutionId}`}
          >
            <Eye size={15} />
            View Solution
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function StudentFeedbackPage() {
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    let mounted = true;
    Promise.all([fetchMySubmissions({ page: 1 }), fetchInternDashboardStats()])
      .then(([subResp, statsResp]) => {
        if (!mounted) return;
        const list = Array.isArray(subResp) ? subResp : subResp?.results || [];
        const s = statsResp?.data || statsResp;
        setSubmissions(list);
        setStats(s);
      })
      .catch(() => {
        if (mounted) {
          setSubmissions([]);
          setStats(null);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => (mounted = false);
  }, []);

  // Stats cards from real backend data
  const feedbackStats = stats
    ? [
        {
          label: "Total Reviews",
          value: stats.my_submissions ?? submissions.length ?? 0,
        },
        {
          label: "Score Points",
          value: stats.total_score_points ?? 0,
        },
        {
          label: "Times Shortlisted",
          value: stats.shortlisted_submissions ?? 0,
        },
        {
          label: "Pending Reviews",
          value: submissions.filter(
            (s) => s.status === "submitted" || s.status === "under_review",
          ).length,
        },
      ]
    : [];

  // Build feedback items from submissions
  const feedbackItems = useMemo(() => {
    if (!submissions.length) return [];
    return submissions
      .filter((s) => s.company_score != null || s.feedback)
      .map((s) => {
        const challengeTitle = s.challenge_title || s.title || "Challenge";
        const companyName =
          s.challenge_company_name || s.company?.company_name || "";
        const score = s.company_score ?? 0;
        const scoreTone =
          score >= 90 ? "emerald" : score >= 75 ? "violet" : "amber";
        // For team submissions, check per-member shortlisting via
        // shortlisted_members. For solo submissions, use the submission-level
        // shortlisted flag.
        const isShortlisted = s.team
          ? (s.shortlisted_members || []).includes(String(user?.id))
          : s.shortlisted;

        return {
          solutionId: s.id,
          title: challengeTitle,
          initial: challengeTitle.charAt(0).toUpperCase(),
          company: companyName,
          reviewed: s.updated_at
            ? new Date(s.updated_at).toLocaleDateString()
            : "",
          reviewer: companyName || "Company",
          reviewerRole: "Reviewer",
          reviewerInitial: (companyName || "C").charAt(0).toUpperCase(),
          badge: isShortlisted ? "Shortlisted" : "",
          badgeIcon: ThumbsUp,
          xp: `${score}/100`,
          status: s.status?.replace(/_/g, " ") || "Submitted",
          statusTone: s.status === "reviewed" ? "emerald" : "violet",
          score,
          scoreTone,
          quote: s.feedback || "No detailed feedback provided.",
          breakdown: [
            ["Overall Score", score],
            ["Company Score", score],
            ["Quality", score],
            ["Presentation", score],
          ],
        };
      });
  }, [submissions, user]);

  return (
    <DashboardLayout
      navItems={studentDashboardNavItems}
      activeIndex={3}
      bottomPanel={null}
      topbar={<Topbar />}
      workspace="student"
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
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {feedbackStats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>

        <div className="mt-8 space-y-6">
          {loading ? (
            <p className="text-[14px] font-semibold text-[#9AA7BA]">
              Loading your feedback...
            </p>
          ) : feedbackItems.length === 0 ? (
            <div className="rounded-[22px] border border-white/[0.07] bg-[#131C2E] p-8 text-center">
              <p className="text-[16px] font-semibold text-[#9AA7BA]">
                No reviewed submissions yet. Submit solutions to challenges to
                receive feedback from companies.
              </p>
            </div>
          ) : (
            feedbackItems.map((feedback) => (
              <FeedbackCard feedback={feedback} key={feedback.solutionId} />
            ))
          )}
        </div>
      </motion.main>
    </DashboardLayout>
  );
}
