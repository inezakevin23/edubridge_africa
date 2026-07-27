import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  FileText,
  MessageSquare,
  Send,
  UserRound,
  UserPlus,
  UserCheck,
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardLayout from "../layout/DashboardLayout";
import Topbar from "../layout/Topbar";
import CompanyTopbar from "../layout/CompanyTopbar";
import useAuth from "../../context/useAuth";
import { studentDashboardNavItems } from "../../data/studentDashboard";
import { companyDashboardNavItems } from "../../data/companyDashboard";
import {
  fetchSubmissionById,
  reviewSubmission,
  toggleShortlistMember,
} from "../../services/submissionService";
import { useEffect, useMemo, useState } from "react";

export default function SolutionDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const isCompany = user?.role === "company";
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorNotice, setErrorNotice] = useState("");
  const [shortlistedMembers, setShortlistedMembers] = useState([]);
  const [shortlistLoading, setShortlistLoading] = useState(false);
  const [brokenImages, setBrokenImages] = useState({});
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewFeedback, setReviewFeedback] = useState("");
  const [reviewScore, setReviewScore] = useState(0);
  const [reviewCashPrize, setReviewCashPrize] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const handleImageError = (memberId) => {
    setBrokenImages((prev) => ({ ...prev, [memberId]: true }));
  };

  const saveReview = async () => {
    const trimmedFeedback = reviewFeedback.trim();
    if (
      !trimmedFeedback ||
      Number(reviewScore) < 0 ||
      Number(reviewScore) > 100
    )
      return;

    setIsSaving(true);
    try {
      await reviewSubmission(id, {
        feedback: trimmedFeedback,
        company_score: Number(reviewScore),
        status: "reviewed",
        shortlisted: submission?.shortlisted || shortlistedMembers.length > 0,
        cash_prize_awarded: reviewCashPrize ? parseFloat(reviewCashPrize) : 0,
      });
      setIsReviewOpen(false);
      // Refresh submission data
      const resp = await fetchSubmissionById(id);
      const payload = resp?.data || resp;
      if (payload) setSubmission(payload);
    } catch {
      // silent
    }
    setIsSaving(false);
  };

  // Build list of file/link objects from the submission payload
  const submissionFiles = useMemo(() => {
    if (!submission) return [];
    const files = [];
    const fileFields = [
      { key: "report_file", name: "Solution Report", type: "REPORT" },
      { key: "slides_file", name: "Presentation Deck", type: "SLIDES" },
      { key: "spreadsheet_file", name: "Spreadsheet", type: "SPREADSHEET" },
      { key: "other_file", name: "Other File", type: "OTHER" },
    ];
    const linkFields = [
      { key: "report_link", name: "Report Link", type: "LINK" },
      { key: "design_link", name: "Design Link", type: "LINK" },
      { key: "github_repository", name: "GitHub Repository", type: "GITHUB" },
      { key: "slides_link", name: "Slides Link", type: "LINK" },
      { key: "video_link", name: "Video Walkthrough", type: "VIDEO" },
      { key: "spreadsheet_link", name: "Spreadsheet Link", type: "LINK" },
    ];
    for (const { key, name } of fileFields) {
      const val = submission[key];
      if (val) {
        files.push({ url: val, label: name, type: "FILE" });
      }
    }
    for (const { key, name } of linkFields) {
      const val = submission[key];
      if (val) {
        files.push({ url: val, label: name, type: "LINK" });
      }
    }
    return files;
  }, [submission]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const resp = await fetchSubmissionById(id);
        const payload = resp?.data || resp;
        if (!mounted) return;
        setSubmission(payload || null);
        // Set shortlisted members from the submission data
        if (payload?.shortlisted_members) {
          setShortlistedMembers(payload.shortlisted_members);
        }
      } catch (err) {
        // Handle permission errors explicitly
        if (err && err.status === 403) {
          setErrorNotice(
            "You do not have permission to view this submission. Redirecting...",
          );
          setTimeout(
            () =>
              navigate(
                isCompany ? "/company-submissions" : "/student-feedback",
                { replace: true },
              ),
            1600,
          );
          return;
        }
        setSubmission(null);
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [id, isCompany, navigate]);

  const title =
    submission?.title || submission?.challenge?.title || "Submission";
  // Backend SubmissionSerializer exposes intern_name and intern object
  const internName = submission?.intern_name || "";
  const internObj = submission?.intern;
  const author =
    internName ||
    (internObj?.first_name
      ? `${internObj.first_name} ${internObj.last_name || ""}`.trim()
      : internObj?.username || "Unknown");
  const summary = submission?.summary || submission?.description || "";
  const score = submission?.score ?? submission?.company_score;
  const existingFeedback = submission?.feedback;
  const backTo = isCompany ? "/company-submissions" : "/student-feedback";

  return (
    <DashboardLayout
      navItems={isCompany ? companyDashboardNavItems : studentDashboardNavItems}
      activeIndex={2}
      topbar={isCompany ? <CompanyTopbar /> : <Topbar />}
      workspace={isCompany ? "company" : "student"}
    >
      <motion.main
        className="mx-auto max-w-[1200px] px-4 py-8 sm:px-8 lg:px-10 xl:py-10"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <Link
          className="inline-flex items-center gap-2 text-[14px] font-bold text-[#A78BFA] transition hover:text-white"
          to={backTo}
        >
          <ArrowLeft size={17} /> Back to{" "}
          {isCompany ? "submissions" : "feedback"}
        </Link>
        <div className="mt-6 flex flex-col justify-between gap-5 border-b border-white/[0.07] pb-7 sm:flex-row sm:items-start">
          <div>
            <p className="text-[13px] font-bold text-[#9AA7BA]">
              {isCompany ? `Submitted by ${author}` : "Your submitted solution"}
            </p>
            <h1 className="mt-2 text-[30px] font-extrabold text-white sm:text-[38px]">
              {title}
            </h1>
          </div>
          {score ? (
            <span className="inline-flex w-fit items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-2 text-[14px] font-extrabold text-[#4ADE80]">
              <CheckCircle2 size={17} /> {score}/100 score
            </span>
          ) : null}
        </div>
        <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <section className="rounded-[18px] border border-white/[0.07] bg-[#131C2E] p-5 shadow-[0_18px_46px_rgba(0,0,0,0.14)] sm:p-7">
            <h2 className="text-[19px] font-extrabold text-white">
              Solution overview
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-[#B4C0D1]">
              {errorNotice ? (
                <span className="text-amber-300">{errorNotice}</span>
              ) : loading ? (
                "Loading submission..."
              ) : (
                summary
              )}
            </p>
            {existingFeedback ? (
              <div className="mt-7 rounded-xl border border-violet-400/20 bg-violet-500/10 p-5">
                <h2 className="text-[15px] font-extrabold text-white">
                  Reviewer feedback
                </h2>
                <p className="mt-3 text-[14px] leading-6 text-[#D6C7FF]">
                  {existingFeedback}
                </p>
              </div>
            ) : null}
          </section>
          <aside className="space-y-6">
            <section className="rounded-[18px] border border-white/[0.07] bg-[#131C2E] p-5 shadow-[0_18px_46px_rgba(0,0,0,0.14)]">
              <h2 className="text-[17px] font-extrabold text-white">
                Submission files
              </h2>
              <div className="mt-4 space-y-3">
                {(submissionFiles || []).map((file) => (
                  <a
                    className="flex items-center justify-between gap-3 rounded-xl bg-[#0D1626] p-3 text-[#B4C0D1] transition hover:bg-[#182237] hover:text-white"
                    href={file.url}
                    key={file.label}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <FileText className="shrink-0 text-[#A78BFA]" size={18} />
                      <span className="truncate text-[13px] font-bold">
                        {file.label}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1 text-[11px] font-bold text-[#8E9AAF]">
                      {file.type}
                      <ExternalLink size={13} />
                    </span>
                  </a>
                ))}
                {(!submissionFiles || submissionFiles.length === 0) && (
                  <p className="text-[13px] font-semibold text-[#9AA7BA]">
                    No files attached to this submission.
                  </p>
                )}
              </div>
            </section>

            {isCompany && (
              <section className="rounded-[18px] border border-white/[0.07] bg-[#131C2E] p-5 shadow-[0_18px_46px_rgba(0,0,0,0.14)]">
                <h2 className="text-[17px] font-extrabold text-white mb-3">
                  Review & Score
                </h2>
                {submission?.status === "reviewed" ? (
                  <button
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-emerald-500/10 px-4 text-[13px] font-extrabold text-[#22C55E] cursor-not-allowed opacity-70"
                    type="button"
                    disabled
                  >
                    <CheckCircle2 size={16} />
                    Completed Review
                  </button>
                ) : !isReviewOpen ? (
                  <button
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#2B215A] px-4 text-[13px] font-extrabold text-[#A78BFA] transition hover:bg-[#382877] hover:text-white"
                    onClick={() => setIsReviewOpen(true)}
                    type="button"
                  >
                    <MessageSquare size={16} />
                    Review Submission
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-[13px] font-semibold text-[#9AA7BA]">
                        Shortlist team members
                      </label>
                      <div className="space-y-2 mt-2">
                        {submission?.team_members &&
                        submission.team_members.length > 0 ? (
                          submission.team_members.map((member) => {
                            const isShortlisted = shortlistedMembers.includes(
                              member.id,
                            );
                            const isAuthor =
                              member.id === submission?.intern?.id ||
                              member.email === submission?.intern?.email;
                            return (
                              <div
                                key={member.id}
                                className="flex items-center justify-between gap-2 rounded-lg bg-[#0D1626] p-2.5"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  {member.profile_picture &&
                                  !brokenImages[member.id] ? (
                                    <img
                                      src={member.profile_picture}
                                      alt={member.first_name}
                                      className="h-8 w-8 rounded-full object-cover ring-2 ring-white/[0.08]"
                                      onError={() =>
                                        handleImageError(member.id)
                                      }
                                    />
                                  ) : (
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-[#C5A8FF]">
                                      <UserRound size={15} />
                                    </span>
                                  )}
                                  <div className="min-w-0">
                                    <p className="truncate text-[13px] font-bold text-white">
                                      {member.first_name} {member.last_name}
                                      {isAuthor && (
                                        <span className="ml-1 text-[10px] font-medium text-[#9AA7BA]">
                                          (submitter)
                                        </span>
                                      )}
                                    </p>
                                    <p className="text-[10px] font-medium text-[#9AA7BA]">
                                      {member.role}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold transition ${
                                    isShortlisted
                                      ? "bg-emerald-500/15 text-[#22C55E] hover:bg-emerald-500/25"
                                      : "bg-[#1A2639] text-[#9AA7BA] hover:bg-[#24324A] hover:text-white"
                                  }`}
                                  onClick={async () => {
                                    setShortlistLoading(true);
                                    try {
                                      const newShortlisted = !isShortlisted;
                                      await toggleShortlistMember(
                                        id,
                                        member.id,
                                        newShortlisted,
                                      );
                                      setShortlistedMembers((prev) =>
                                        newShortlisted
                                          ? [...prev, member.id]
                                          : prev.filter(
                                              (uid) => uid !== member.id,
                                            ),
                                      );
                                    } catch {
                                      // silent
                                    } finally {
                                      setShortlistLoading(false);
                                    }
                                  }}
                                  type="button"
                                  disabled={shortlistLoading}
                                >
                                  {isShortlisted ? (
                                    <UserCheck size={13} />
                                  ) : (
                                    <UserPlus size={13} />
                                  )}
                                  {isShortlisted ? "Shortlisted" : "Shortlist"}
                                </button>
                              </div>
                            );
                          })
                        ) : (
                          <div className="flex items-center justify-between gap-2 rounded-lg bg-[#0D1626] p-2.5">
                            <div className="flex items-center gap-2.5">
                              {submission?.intern?.profile_picture &&
                              !brokenImages["intern-main"] ? (
                                <img
                                  src={submission.intern.profile_picture}
                                  alt={author}
                                  className="h-8 w-8 rounded-full object-cover ring-2 ring-white/[0.08]"
                                  onError={() =>
                                    handleImageError("intern-main")
                                  }
                                />
                              ) : (
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/15 text-[#C5A8FF]">
                                  <UserRound size={15} />
                                </span>
                              )}
                              <p className="text-[13px] font-bold text-white">
                                {author}
                              </p>
                            </div>
                            <button
                              className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold transition ${
                                submission?.shortlisted ||
                                shortlistedMembers.length > 0
                                  ? "bg-emerald-500/15 text-[#22C55E] hover:bg-emerald-500/25"
                                  : "bg-[#1A2639] text-[#9AA7BA] hover:bg-[#24324A] hover:text-white"
                              }`}
                              onClick={async () => {
                                const newShortlisted = !(
                                  submission?.shortlisted ||
                                  shortlistedMembers.length > 0
                                );
                                try {
                                  await toggleShortlistMember(
                                    id,
                                    submission?.intern?.id,
                                    newShortlisted,
                                  );
                                  if (newShortlisted) {
                                    setShortlistedMembers((prev) =>
                                      submission?.intern?.id
                                        ? [...prev, submission.intern.id]
                                        : prev,
                                    );
                                  } else {
                                    setShortlistedMembers((prev) =>
                                      submission?.intern?.id
                                        ? prev.filter(
                                            (uid) =>
                                              uid !== submission.intern.id,
                                          )
                                        : prev,
                                    );
                                  }
                                  setSubmission((prev) => ({
                                    ...prev,
                                    shortlisted: newShortlisted,
                                  }));
                                } catch {
                                  // silent
                                }
                              }}
                              type="button"
                            >
                              {submission?.shortlisted ||
                              shortlistedMembers.length > 0 ? (
                                <UserCheck size={13} />
                              ) : (
                                <UserPlus size={13} />
                              )}
                              {submission?.shortlisted ||
                              shortlistedMembers.length > 0
                                ? "Shortlisted"
                                : "Shortlist"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-[13px] font-semibold text-[#9AA7BA]">
                        Score (0-100)
                      </label>
                      <input
                        className="h-10 w-full rounded-xl border border-white/[0.06] bg-[#0F1728] px-3 text-white outline-none focus:border-violet-400/45"
                        max="100"
                        min="0"
                        onChange={(e) => setReviewScore(e.target.value)}
                        placeholder="Score"
                        type="number"
                        value={reviewScore}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-[13px] font-semibold text-[#9AA7BA]">
                        Cash prize awarded
                      </label>
                      <input
                        className="h-10 w-full rounded-xl border border-white/[0.06] bg-[#0F1728] px-3 text-white outline-none focus:border-violet-400/45"
                        min="0"
                        onChange={(e) => setReviewCashPrize(e.target.value)}
                        placeholder="Optional amount"
                        type="number"
                        value={reviewCashPrize}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-[13px] font-semibold text-[#9AA7BA]">
                        Feedback
                      </label>
                      <textarea
                        className="min-h-[120px] w-full resize-y rounded-2xl border border-white/[0.06] bg-[#0F1728] p-3 text-[14px] leading-6 text-white outline-none transition placeholder:text-[#7F8EA5] focus:border-violet-400/45"
                        onChange={(e) => setReviewFeedback(e.target.value)}
                        placeholder="Write constructive feedback..."
                        value={reviewFeedback}
                      />
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        className="h-10 rounded-full bg-[#182237] px-5 text-[13px] font-bold text-[#B9C5D7] transition hover:bg-[#22304A] hover:text-white"
                        onClick={() => setIsReviewOpen(false)}
                        type="button"
                      >
                        Cancel
                      </button>
                      <button
                        className="flex h-10 items-center gap-2 rounded-full bg-[#8B5CF6] px-5 text-[13px] font-extrabold text-white shadow-[0_12px_26px_rgba(139,92,246,0.24)] transition hover:bg-[#9568ff] disabled:opacity-50"
                        disabled={isSaving}
                        onClick={saveReview}
                        type="button"
                      >
                        <Send size={15} />
                        {isSaving ? "Saving..." : "Save & Notify"}
                      </button>
                    </div>
                  </div>
                )}
              </section>
            )}
          </aside>
        </div>
      </motion.main>
    </DashboardLayout>
  );
}
