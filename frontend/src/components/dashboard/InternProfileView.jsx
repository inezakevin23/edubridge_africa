import {
  ArrowLeft,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  GraduationCap,
  Link as LinkIcon,
  ExternalLink,
  Mail,
  MapPin,
  Award,
  UserRound,
  CheckCircle2,
  Send,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import CompanyTopbar from "../layout/CompanyTopbar";
import { companyDashboardNavItems } from "../../data/companyDashboard";
import { fetchInternProfileById } from "../../services/profileService";
import { sendJobOffer } from "../../services/notificationService";
import { API_BASE_URL } from "../../services/apiClient";

const titleCase = (value = "") =>
  value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

function Section({ title, icon: Icon, children }) {
  return (
    <section className="rounded-[18px] border border-white/[0.07] bg-[#131C2E] p-5 shadow-[0_18px_46px_rgba(0,0,0,0.14)] sm:p-7">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] text-[#B894FF]">
          <Icon size={19} />
        </span>
        <h2 className="text-[18px] font-extrabold text-white">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Detail({ icon: Icon, label, value }) {
  return (
    <div className="flex min-w-0 gap-3">
      <Icon className="mt-0.5 shrink-0 text-[#8492A9]" size={17} />
      <div className="min-w-0">
        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#8492A9]">
          {label}
        </p>
        <p className="mt-1 break-words text-[14px] font-semibold text-white">
          {value || "Not provided"}
        </p>
      </div>
    </div>
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

export default function InternProfileView() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offerMessage, setOfferMessage] = useState("");
  const [avatarError, setAvatarError] = useState(false);
  const [jobOfferSent, setJobOfferSent] = useState(() => {
    const jobs = loadOfferedJobs();
    // Check if this intern has already been offered a job
    return !!jobs[id];
  });
  const [showJobLinkInput, setShowJobLinkInput] = useState(false);
  const [jobLink, setJobLink] = useState("");
  const [sendingOffer, setSendingOffer] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const resp = await fetchInternProfileById(id);
        const data = resp?.data || resp;
        if (mounted) setProfile(data);
      } catch {
        if (mounted) setProfile(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleOfferJob = async () => {
    if (!jobLink.trim()) {
      setShowJobLinkInput(true);
      return;
    }
    setSendingOffer(true);
    try {
      const profileId = profile.user_id || profile.id;
      await sendJobOffer(profileId, jobLink.trim());
      const updated = { ...loadOfferedJobs(), [id]: true };
      saveOfferedJobs(updated);
      setJobOfferSent(true);
      setShowJobLinkInput(false);
      setOfferMessage(
        `Job offer has been sent to ${profile?.first_name || "the intern"}.`,
      );
      setTimeout(() => setOfferMessage(""), 4000);
    } catch {
      setOfferMessage("Failed to send job offer. Please try again.");
      setTimeout(() => setOfferMessage(""), 4000);
    } finally {
      setSendingOffer(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout
        navItems={companyDashboardNavItems}
        activeIndex={0}
        topbar={<CompanyTopbar />}
        workspace="company"
      >
        <motion.main
          className="mx-auto max-w-[1200px] px-4 py-8 sm:px-8 lg:px-10 xl:py-10"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <p className="text-[15px] font-semibold text-[#9AA7BA]">
            Loading profile...
          </p>
        </motion.main>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout
        navItems={companyDashboardNavItems}
        activeIndex={0}
        topbar={<CompanyTopbar />}
        workspace="company"
      >
        <motion.main
          className="mx-auto max-w-[1200px] px-4 py-8 sm:px-8 lg:px-10 xl:py-10"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <p className="text-[15px] font-semibold text-amber-300">
            Intern profile not found.
          </p>
          <Link
            className="mt-4 inline-flex items-center gap-2 text-[14px] font-bold text-[#A78BFA] transition hover:text-white"
            to="/company-dashboard"
          >
            <ArrowLeft size={17} /> Back to Dashboard
          </Link>
        </motion.main>
      </DashboardLayout>
    );
  }

  const name = `${profile.first_name || ""} ${profile.last_name || ""}`.trim();
  const initials = name
    ? name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";
  const avatarSrc = profile.profile_picture?.startsWith("http")
    ? profile.profile_picture
    : profile.profile_picture
      ? `${API_BASE_URL}${profile.profile_picture}`
      : null;
  const skills =
    profile.skills
      ?.split(",")
      .map((s) => s.trim())
      .filter(Boolean) || [];
  const location = [profile.city, profile.country].filter(Boolean).join(", ");

  return (
    <DashboardLayout
      navItems={companyDashboardNavItems}
      activeIndex={0}
      topbar={<CompanyTopbar />}
      workspace="company"
    >
      <motion.main
        className="mx-auto max-w-[1200px] px-4 py-8 sm:px-8 lg:px-10 xl:py-10"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <Link
          className="inline-flex items-center gap-2 text-[14px] font-bold text-[#A78BFA] transition hover:text-white"
          to="/company-dashboard"
        >
          <ArrowLeft size={17} /> Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mt-6 flex flex-col justify-between gap-5 border-b border-white/[0.07] pb-7 sm:flex-row sm:items-start">
          <div className="flex min-w-0 gap-4 sm:gap-6">
            {avatarSrc && !avatarError ? (
              <img
                alt={name}
                className="h-20 w-20 shrink-0 rounded-[18px] border border-violet-400/25 object-cover sm:h-24 sm:w-24"
                src={avatarSrc}
                onError={() => setAvatarError(true)}
              />
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[18px] bg-[#F59E0B]/15 text-[27px] font-extrabold text-[#FBBF24] sm:h-24 sm:w-24">
                {initials}
              </div>
            )}
            <div className="min-w-0 pt-1">
              <div className="mb-3">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold ${profile.is_verified ? "bg-emerald-500/12 text-[#4ADE80]" : "bg-amber-500/12 text-[#FBBF24]"}`}
                >
                  {profile.is_verified ? (
                    <BadgeCheck size={15} />
                  ) : (
                    <CalendarDays size={15} />
                  )}
                  {profile.is_verified
                    ? "Verified profile"
                    : "Verification pending"}
                </span>
              </div>
              <h1 className="flex items-center gap-2 truncate text-[28px] font-extrabold text-white sm:text-[34px]">
                <span className="truncate">{name}</span>
                {profile.is_verified && (
                  <BadgeCheck
                    aria-label="Verified profile"
                    className="shrink-0 text-[#4ADE80]"
                    size={25}
                  />
                )}
              </h1>
              <p className="mt-2 text-[15px] text-[#AAB6C8]">
                {titleCase(profile.current_status)}
                {profile.field_of_study ? ` · ${profile.field_of_study}` : ""}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            {showJobLinkInput && !jobOfferSent && (
              <div className="flex w-full items-center gap-2">
                <input
                  className="h-10 flex-1 rounded-xl border border-white/[0.08] bg-[#0D1626] px-3 text-[14px] text-white outline-none transition focus:border-violet-400/70"
                  placeholder="Paste job link URL..."
                  type="url"
                  value={jobLink}
                  onChange={(e) => setJobLink(e.target.value)}
                />
              </div>
            )}
            <button
              className={`flex h-11 items-center gap-2 rounded-xl px-5 text-[14px] font-bold text-white shadow-[0_12px_28px_rgba(16,185,129,0.28)] transition ${
                jobOfferSent
                  ? "cursor-not-allowed bg-emerald-700 opacity-70"
                  : "bg-emerald-600 hover:bg-emerald-500"
              }`}
              disabled={jobOfferSent || sendingOffer}
              onClick={handleOfferJob}
              type="button"
            >
              {jobOfferSent ? (
                <>
                  <Check size={17} />
                  Offered
                </>
              ) : sendingOffer ? (
                "Sending..."
              ) : (
                <>
                  <Send size={17} />
                  Offer Job
                </>
              )}
            </button>
          </div>
        </div>

        {offerMessage && (
          <p className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-[14px] font-semibold text-[#86EFAC]">
            {offerMessage}
          </p>
        )}

        {/* Contact info row */}
        <div className="mt-6 grid gap-4 rounded-[18px] border border-white/[0.07] bg-[#0D1626] p-5 sm:grid-cols-3">
          <Detail icon={Mail} label="Email" value={profile.email} />
          <Detail icon={MapPin} label="Location" value={location} />
          <Detail
            icon={GraduationCap}
            label="Institution"
            value={profile.institution}
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
          {/* About section */}
          <Section title="About" icon={UserRound}>
            <p className="max-w-3xl text-[15px] leading-7 text-[#B4C0D1]">
              {profile.bio || "No biography has been added yet."}
            </p>
            {profile.portfolio_url ? (
              <a
                className="mt-5 inline-flex items-center gap-2 text-[14px] font-bold text-[#B894FF] hover:text-white"
                href={profile.portfolio_url}
                rel="noreferrer"
                target="_blank"
              >
                <LinkIcon size={16} /> View portfolio <ExternalLink size={14} />
              </a>
            ) : null}
          </Section>

          {/* Recognition section */}
          <Section title="Recognition" icon={Award}>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-[#0D1626] p-4">
                <p className="text-[12px] text-[#98A5B8]">Score points</p>
                <p className="mt-2 text-[27px] font-extrabold text-white">
                  {profile.total_score_points ?? 0}
                </p>
              </div>
              <div className="rounded-xl bg-[#0D1626] p-4">
                <p className="text-[12px] text-[#98A5B8]">Experience</p>
                <p className="mt-2 text-[27px] font-extrabold text-white">
                  {profile.years_of_experience || 0}
                  <span className="ml-1 text-[13px] text-[#98A5B8]">yrs</span>
                </p>
              </div>
            </div>
          </Section>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Education section */}
          <Section title="Education & Work" icon={GraduationCap}>
            <div className="grid gap-6 sm:grid-cols-2">
              <Detail
                icon={Building2}
                label="Institution"
                value={profile.institution}
              />
              <Detail
                icon={GraduationCap}
                label="Field of study"
                value={profile.field_of_study}
              />
              <Detail
                icon={CalendarDays}
                label="Graduation year"
                value={profile.graduation_year}
              />
              <Detail
                icon={BriefcaseBusiness}
                label="Current status"
                value={titleCase(profile.current_status)}
              />
            </div>
          </Section>

          {/* Skills section */}
          <Section title="Skills" icon={CheckCircle2}>
            <div className="flex flex-wrap gap-2">
              {skills.length ? (
                skills.map((skill) => (
                  <span
                    className="rounded-lg border border-violet-400/20 bg-violet-500/10 px-3 py-2 text-[13px] font-semibold text-[#D7C5FF]"
                    key={skill}
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-[14px] text-[#98A5B8]">No skills added.</p>
              )}
            </div>
          </Section>
        </div>
      </motion.main>
    </DashboardLayout>
  );
}
