import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  FileText,
  UserRound,
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardLayout from "../layout/DashboardLayout";
import Topbar from "../layout/Topbar";
import CompanyTopbar from "../layout/CompanyTopbar";
import useAuth from "../../context/useAuth";
import { studentDashboardNavItems } from "../../data/studentDashboard";
import { companyDashboardNavItems } from "../../data/companyDashboard";
import { fetchSubmissionById } from "../../services/submissionService";
import { useEffect, useMemo, useState } from "react";

export default function SolutionDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const isCompany = user?.role === "company";
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorNotice, setErrorNotice] = useState("");
  const navigate = useNavigate();

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
  const feedback = submission?.feedback;
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
            {feedback ? (
              <div className="mt-7 rounded-xl border border-violet-400/20 bg-violet-500/10 p-5">
                <h2 className="text-[15px] font-extrabold text-white">
                  Reviewer feedback
                </h2>
                <p className="mt-3 text-[14px] leading-6 text-[#D6C7FF]">
                  {feedback}
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
            <section className="rounded-[18px] border border-white/[0.07] bg-[#131C2E] p-5 shadow-[0_18px_46px_rgba(0,0,0,0.14)]">
              <h2 className="text-[17px] font-extrabold text-white">
                {isCompany ? "Intern" : "Submission owner"}
              </h2>
              <div className="mt-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/15 text-[#C5A8FF]">
                  <UserRound size={19} />
                </span>
                <p className="text-[14px] font-bold text-white">{author}</p>
              </div>
            </section>
          </aside>
        </div>
      </motion.main>
    </DashboardLayout>
  );
}
