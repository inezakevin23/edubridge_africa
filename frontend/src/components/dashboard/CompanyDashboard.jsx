import { Building2, Send, Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import CompanyTopbar from "../layout/CompanyTopbar";
import { companyDashboardNavItems } from "../../data/companyDashboard";
import { fetchMyChallenges } from "../../services/challengeService";
import { fetchCompanyDashboardStats } from "../../services/dashboardService";
import { fetchSubmissions } from "../../services/submissionService";
import { sendJobOffer } from "../../services/notificationService";

function MetricCard({ metric }) {
  return (
    <article className="relative min-h-[132px] overflow-hidden rounded-[18px] border border-white/[0.07] bg-[linear-gradient(145deg,#141D30_0%,#111827_100%)] p-4 shadow-[0_18px_46px_rgba(0,0,0,0.17)]">
      <h3 className="text-[30px] font-extrabold leading-none text-white">
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
                  <Link
                    to={`/create-challenge/${challenge.id}`}
                    className="transition hover:text-[#8B5CF6]"
                  >
                    {challenge.title}
                  </Link>
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
                  <span
                    className={`rounded-full px-3 py-1.5 text-[13px] font-extrabold ${
                      challenge.status === "draft"
                        ? "bg-amber-500/10 text-[#F59E0B]"
                        : challenge.status === "closed"
                          ? "bg-white/[0.08] text-[#9AA7BA]"
                          : "bg-emerald-500/10 text-[#22C55E]"
                    }`}
                  >
                    {challenge.status === "draft"
                      ? "Draft"
                      : challenge.status === "closed"
                        ? "Ended"
                        : "Active"}
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

const OFFERED_JOBS_KEY = "edubridge_offered_jobs";

function loadOfferedJobs() {
  try {
    const raw = localStorage.getItem(OFFERED_JOBS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveOfferedJobs(jobs) {
  try {
    localStorage.setItem(OFFERED_JOBS_KEY, JSON.stringify(jobs));
  } catch {
    // localStorage unavailable
  }
}

function ShortlistedSubmissions({ submissions }) {
  const [offerMessage, setOfferMessage] = useState(null);
  const [offeredJobs, setOfferedJobs] = useState(() => loadOfferedJobs());
  const [activeJobLink, setActiveJobLink] = useState(null);
  const [jobLinkValue, setJobLinkValue] = useState("");
  const [sendingOffer, setSendingOffer] = useState(null);

  const handleOfferJob = async (person) => {
    if (!activeJobLink || activeJobLink !== person.id) {
      setActiveJobLink(person.id);
      setJobLinkValue("");
      return;
    }
    if (!jobLinkValue.trim()) {
      setOfferMessage("Please enter a job link URL.");
      setTimeout(() => setOfferMessage(null), 3000);
      return;
    }
    setSendingOffer(person.id);
    try {
      await sendJobOffer(person.submitter_id, jobLinkValue.trim());
      // Use submitter_id as the key since the View Profile page uses it as the URL param
      const updated = { ...offeredJobs, [person.submitter_id]: true };
      setOfferedJobs(updated);
      saveOfferedJobs(updated);
      setActiveJobLink(null);
      setJobLinkValue("");
      setOfferMessage(`Job offer sent to ${person.name}.`);
      setTimeout(() => setOfferMessage(null), 4000);
    } catch {
      setOfferMessage("Failed to send job offer. Please try again.");
      setTimeout(() => setOfferMessage(null), 4000);
    } finally {
      setSendingOffer(null);
    }
  };

  return (
    <section className="rounded-[22px] border border-violet-400/15 bg-[radial-gradient(circle_at_90%_0%,rgba(139,92,246,0.42)_0%,transparent_38%),linear-gradient(145deg,#171B3A_0%,#111827_100%)] p-7 shadow-[0_22px_62px_rgba(0,0,0,0.22)]">
      <h2 className="mb-7 flex items-center gap-3 text-[22px] font-extrabold text-white">
        <Sparkles className="text-[#9B6CFF]" size={25} />
        Shortlisted Submissions
      </h2>

      {offerMessage && (
        <p className="mb-5 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-[14px] font-semibold text-[#86EFAC]">
          {offerMessage}
        </p>
      )}

      <div className="space-y-5">
        {submissions.length === 0 && (
          <p className="text-[14px] text-[#9AA7BA]">
            No shortlisted submissions yet.
          </p>
        )}
        {submissions.map((person) => (
          <article
            className="rounded-[22px] border border-white/[0.05] bg-[#0D1626] p-5"
            key={person.id || person.name}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[17px] font-extrabold text-white">
                  {person.name}
                </h3>
                <p className="mt-1 text-[14px] font-semibold text-[#9B6CFF]">
                  {person.submitter_role || "Participant"}
                </p>
              </div>
            </div>

            <p className="mt-3 text-[13px] leading-6 text-[#9AA7BA]">
              {person.summary || "Shortlisted for their submission."}
            </p>

            <div className="mt-5 flex flex-col gap-3">
              {activeJobLink === person.id &&
                !offeredJobs[person.submitter_id] && (
                  <input
                    className="h-10 w-full rounded-xl border border-white/[0.08] bg-[#0D1626] px-3 text-[14px] text-white outline-none transition focus:border-violet-400/70"
                    placeholder="Enter job link URL..."
                    type="url"
                    value={jobLinkValue}
                    onChange={(e) => setJobLinkValue(e.target.value)}
                  />
                )}
              <div className="flex items-center gap-3">
                <Link
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#8B5CF6] text-[14px] font-bold text-white shadow-[0_12px_28px_rgba(139,92,246,0.28)] transition hover:bg-[#9568ff]"
                  to={`/intern-profile/${person.submitter_id}`}
                >
                  View Profile
                </Link>
                <button
                  className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl px-4 text-[14px] font-bold text-white shadow-[0_12px_28px_rgba(16,185,129,0.28)] transition ${
                    offeredJobs[person.submitter_id]
                      ? "cursor-not-allowed bg-emerald-700 opacity-70"
                      : "bg-emerald-600 hover:bg-emerald-500"
                  }`}
                  disabled={
                    offeredJobs[person.submitter_id] ||
                    sendingOffer === person.id
                  }
                  onClick={() => handleOfferJob(person)}
                  type="button"
                >
                  {offeredJobs[person.submitter_id] ? (
                    <>
                      <Check size={16} />
                      Offered
                    </>
                  ) : sendingOffer === person.id ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send size={16} />
                      Offer Job
                    </>
                  )}
                </button>
              </div>
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
  const [shortlisted, setShortlisted] = useState([]);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      fetchMyChallenges(),
      fetchCompanyDashboardStats(),
      fetchSubmissions({ shortlisted: true }),
    ]).then(([challengeData, statsData, subsData]) => {
      if (!mounted) return;
      setChallenges(challengeData);
      setStats(statsData?.data || statsData || null);
      const list = Array.isArray(subsData) ? subsData : subsData?.results || [];
      // Filter to only include submissions that are actually shortlisted
      setShortlisted(
        list
          .filter((s) => s.shortlisted === true)
          .map((s, idx) => ({
            id: s.id,
            name:
              s.intern_name || s.intern?.username || `Submission #${idx + 1}`,
            submitter_id: s.submitter?.id || s.intern?.id || null,
            submitter_role: s.intern?.role || "Participant",
            summary: s.summary || s.feedback || "",
          })),
      );
    });
    return () => {
      mounted = false;
    };
  }, []);

  const metrics = stats
    ? [
        {
          label: "Active challenges",
          value: stats.active_challenges ?? 0,
        },
        {
          label: "Total submissions",
          value: stats.total_submissions ?? 0,
        },
        {
          label: "Reviewed",
          value: stats.reviewed_submissions ?? 0,
        },
        {
          label: "Shortlisted",
          value: stats.shortlisted_submissions ?? 0,
        },
      ]
    : [
        {
          label: "Active challenges",
          value: "—",
        },
        {
          label: "Total submissions",
          value: "—",
        },
        {
          label: "Reviewed",
          value: "—",
        },
        {
          label: "Shortlisted",
          value: "—",
        },
      ];

  return (
    <DashboardLayout
      navItems={companyDashboardNavItems}
      activeIndex={0}
      bottomPanel={null}
      topbar={<CompanyTopbar />}
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
              Post Challenge
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </div>

        <div className="mt-9 grid gap-8 min-[1180px]:grid-cols-[minmax(0,1fr)_420px]">
          <div className="space-y-8">
            <ActiveChallengesTable challenges={challenges} />
          </div>
          <div className="space-y-8">
            <ShortlistedSubmissions submissions={shortlisted} />
          </div>
        </div>
      </motion.main>
    </DashboardLayout>
  );
}
