import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Mail,
  Paperclip,
  Search,
  UserRound,
  BriefcaseBusiness,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import { companySubmissionsNavItems } from "../../data/companySubmissionsReview";
import CompanyTopbar from "../layout/CompanyTopbar";
import { fetchSubmissions } from "../../services/submissionService";
import { fetchCompanyDashboardStats } from "../../services/dashboardService";
import { fetchMyChallenges } from "../../services/challengeService";

function StatCard({ stat }) {
  return (
    <article className="rounded-[18px] border border-white/[0.07] bg-[#131C2E] p-5 shadow-[0_18px_46px_rgba(0,0,0,0.14)]">
      <h3 className="text-[28px] font-extrabold leading-none text-white">
        {stat.value}
      </h3>
      <p className="mt-2 text-[13px] font-medium text-[#9AA7BA]">
        {stat.label}
      </p>
    </article>
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
      {status.replaceAll("_", " ")}
    </span>
  );
}

function SubmissionCard({ item }) {
  const [avatarError, setAvatarError] = useState(false);
  const hasTeamMembers = item.team_members && item.team_members.length > 0;

  return (
    <article className="rounded-[20px] border border-white/[0.07] bg-[#131C2E] p-5 shadow-[0_18px_46px_rgba(0,0,0,0.13)] lg:p-7">
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
          {item.avatar && !avatarError ? (
            <img
              alt={item.name}
              className="h-12 w-12 rounded-full object-cover ring-2 ring-white/[0.05]"
              src={item.avatar}
              onError={() => setAvatarError(true)}
            />
          ) : (
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/15 text-[#C5A8FF] ring-2 ring-white/[0.05]">
              <UserRound size={22} />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          {item.challenge_title && (
            <p className="mb-2 flex items-center gap-1.5 text-[12px] font-bold text-[#A78BFA]">
              <BriefcaseBusiness size={13} />
              {item.challenge_title}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-[17px] font-extrabold text-white">
              {item.name}
            </h2>
            <StatusBadge
              status={item.status}
              tone={item.status === "reviewed" ? "emerald" : item.statusTone}
            />
          </div>
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
          </div>

          {hasTeamMembers && (
            <div className="mt-5">
              <p className="mb-2 text-[12px] font-bold text-[#9AA7BA]">
                Team members ({item.team_members.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {item.team_members.map((member) => (
                  <span
                    key={member.id}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#1A2639] px-2.5 py-1 text-[11px] font-bold text-[#9AA7BA]"
                  >
                    {member.first_name} {member.last_name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5">
            <Link
              className="inline-flex h-10 items-center gap-2 rounded-full bg-[#2B215A] px-5 text-[13px] font-extrabold text-[#A78BFA] transition hover:bg-[#382877] hover:text-white"
              to={`/solution/${item.id}`}
            >
              <Eye size={15} />
              View Full Solution & Review
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function CompanySubmissionsReviewPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [challengeFilter, setChallengeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("highest_score");
  const [notifyMessage, setNotifyMessage] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [stats, setStats] = useState(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(8);

  useEffect(() => {
    let mounted = true;
    const params = { page };
    if (challengeFilter !== "all") {
      params.challenge = challengeFilter;
    }
    Promise.all([fetchSubmissions(params), fetchCompanyDashboardStats()])
      .then(([subsResp, statsResp]) => {
        if (!mounted) return;
        const list = Array.isArray(subsResp)
          ? subsResp
          : subsResp?.results || [];
        // Capture pagination metadata from the API response
        if (!Array.isArray(subsResp)) {
          setTotalCount(subsResp?.count ?? 0);
          setPageSize(subsResp?.page_size ?? 8);
        }
        const normalized = list.map((item, idx) => ({
          id: item.id,
          name: item.submitter?.first_name
            ? `${item.submitter.first_name} ${item.submitter.last_name || ""}`.trim()
            : item.submitter?.username || item.title || "Unknown",
          challenge_title: item.challenge_title || "",
          challenge_id: item.challenge || null,
          avatar:
            // For team submissions, display team leader's picture; otherwise submitter's picture
            (item.team_members && item.team_members.length > 0
              ? item.team_leader_picture
              : item.submitter_profile_picture) || null,
          university:
            item.submitter?.institution || item.submitter?.organization || "",
          submitted: item.submitted_at
            ? new Date(item.submitted_at).toLocaleDateString()
            : "",
          summary: item.summary || item.abstract || item.description || "",
          tags: item.tags || [],
          files: item.files || [],
          score: item.score ?? item.company_score ?? 0,
          status: item.status || "submitted",
          shortlisted: Boolean(item.shortlisted),
          team_members: item.team_members || [],
          shortlisted_members: item.shortlisted_members || [],
          // Flatten all shortlisted members into separate cards for display
          rank: idx + 1,
        }));
        setSubmissions(normalized);
        setStats(statsResp?.data || statsResp || null);
      })
      .catch(() => {
        if (mounted) {
          setSubmissions([]);
          setStats(null);
        }
      });
    return () => (mounted = false);
  }, [page, challengeFilter]);

  // Load the company's challenges for the filter dropdown
  useEffect(() => {
    let mounted = true;
    fetchMyChallenges()
      .then((list) => {
        if (mounted) setChallenges(list || []);
      })
      .catch(() => {});
    return () => (mounted = false);
  }, []);

  const filteredSubmissions = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const list = submissions.filter(
      (item) =>
        (!needle ||
          [item.name, item.university, ...item.tags, item.challenge_title]
            .join(" ")
            .toLowerCase()
            .includes(needle)) &&
        (statusFilter === "all" || item.status === statusFilter) &&
        (challengeFilter === "all" || item.challenge_id === challengeFilter),
    );
    return list
      .slice()
      .sort((a, b) =>
        sortBy === "lowest_score"
          ? a.score - b.score
          : sortBy === "newest"
            ? a.rank - b.rank
            : b.score - a.score,
      );
  }, [query, statusFilter, sortBy, submissions]);
  const notifyShortlisted = () => {
    const shortlisted = submissions.filter((item) => item.shortlisted);
    // TODO: Post notifications to backend. For now display UI message only.
    setNotifyMessage(
      shortlisted.length
        ? `${shortlisted.length} shortlisted intern notified.`
        : "No shortlisted interns to notify.",
    );
  };
  return (
    <DashboardLayout
      navItems={companySubmissionsNavItems}
      activeIndex={2}
      topbar={<CompanyTopbar />}
      workspace="company"
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
              onClick={notifyShortlisted}
              type="button"
            >
              <Mail size={17} />
              Notify Shortlisted
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {(stats
            ? [
                {
                  label: "Total Submissions",
                  value: stats.total_submissions ?? 0,
                },
                {
                  label: "Reviewed Submissions",
                  value: stats.reviewed_submissions ?? 0,
                },
                {
                  label: "Shortlisted",
                  value: stats.shortlisted_submissions ?? 0,
                },
                {
                  label: "Active Challenges",
                  value: stats.active_challenges ?? 0,
                },
              ]
            : [
                {
                  label: "Total Submissions",
                  value: "—",
                },
                {
                  label: "Reviewed Submissions",
                  value: "—",
                },
                {
                  label: "Shortlisted",
                  value: "—",
                },
                {
                  label: "Active Challenges",
                  value: "—",
                },
              ]
          ).map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-[minmax(0,1fr)_120px_120px_160px] lg:grid-cols-[minmax(0,1fr)_160px_160px_180px]">
          <div className="flex h-12 items-center gap-3 rounded-full border border-white/[0.05] bg-[#131C2E] px-5 text-[#9AA7BA]">
            <Search size={18} />
            <input
              className="min-w-0 flex-1 bg-transparent text-[14px] text-white placeholder:text-[#8E9AAF] outline-none"
              placeholder="Search by student name, university, skill..."
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <select
            aria-label="Filter by challenge"
            className="h-12 rounded-full bg-[#131C2E] px-4 text-[14px] font-semibold text-[#9AA7BA] outline-none"
            onChange={(event) => {
              setChallengeFilter(event.target.value);
              setPage(1);
            }}
            value={challengeFilter}
          >
            <option value="all">All Challenges</option>
            {challenges.map((ch) => (
              <option key={ch.id} value={ch.id}>
                {ch.title}
              </option>
            ))}
          </select>
          <select
            aria-label="Filter submissions"
            className="h-12 rounded-full bg-[#131C2E] px-4 text-[14px] font-semibold text-[#9AA7BA] outline-none"
            onChange={(event) => setStatusFilter(event.target.value)}
            value={statusFilter}
          >
            <option value="all">All statuses</option>
            <option value="reviewed">Reviewed</option>
            <option value="submitted">Submitted</option>
          </select>
          <select
            aria-label="Sort submissions"
            className="h-12 rounded-full bg-[#131C2E] px-4 text-[14px] font-semibold text-[#9AA7BA] outline-none"
            onChange={(event) => setSortBy(event.target.value)}
            value={sortBy}
          >
            <option value="highest_score">Highest score</option>
            <option value="lowest_score">Lowest score</option>
            <option value="newest">Newest</option>
          </select>
        </div>
        {notifyMessage ? (
          <p className="mt-4 text-[13px] font-semibold text-emerald-400">
            {notifyMessage}
          </p>
        ) : null}

        <div className="mt-8 space-y-5">
          {filteredSubmissions.map((item) => {
            const shortlistedCount = item.shortlisted_members?.length || 0;
            const showMembers = item.shortlisted && shortlistedCount > 0;
            if (showMembers) {
              return item.shortlisted_members.map((member) => (
                <SubmissionCard
                  item={{
                    ...item,
                    id: `${item.id}-${member.id}`,
                    name:
                      `${member.first_name} ${member.last_name || ""}`.trim() ||
                      member.username,
                    avatar: member.profile_picture || item.avatar,
                    university:
                      member.institution ||
                      member.organization ||
                      item.university,
                  }}
                  key={`${item.id}-${member.id}`}
                />
              ));
            }
            return <SubmissionCard item={item} key={item.name} />;
          })}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-5 text-[14px] font-medium text-[#9AA7BA] sm:flex-row">
          <p>
            {totalCount > 0
              ? `Showing ${(page - 1) * pageSize + 1}-${Math.min(page * pageSize, totalCount)} of ${totalCount} submission${totalCount !== 1 ? "s" : ""}`
              : "No submissions"}
          </p>
          <div className="flex items-center gap-2">
            <button
              aria-label="Previous page"
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#182237] text-[#9AA7BA] transition hover:bg-[#22304A] hover:text-white"
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              <ChevronLeft size={18} />
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[13px] text-[#9AA7BA]">Page</span>
              <span className="inline-flex items-center justify-center h-10 min-w-[36px] rounded-2xl bg-[#182237] text-[#9AA7BA] px-3">
                {page}
              </span>
            </div>
            <button
              aria-label="Next page"
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#182237] text-[#9AA7BA] transition hover:bg-[#22304A] hover:text-white"
              type="button"
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </motion.main>
    </DashboardLayout>
  );
}
