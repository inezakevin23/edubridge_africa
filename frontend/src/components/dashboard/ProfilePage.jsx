import { useMemo, useState, useEffect } from "react";
import {
  Award,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Edit3,
  ExternalLink,
  GraduationCap,
  Link as LinkIcon,
  Mail,
  MapPin,
  Phone,
  Save,
  UserRound,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import DashboardLayout from "../layout/DashboardLayout";
import Topbar from "../layout/Topbar";
import { studentDashboardNavItems } from "../../data/studentDashboard";
import { companyDashboardNavItems } from "../../data/companyDashboard";
import useAuth from "../../context/useAuth";
import {
  updateCompanyProfile,
  updateInternProfile,
  fetchCompanyProfile,
  fetchInternProfile,
} from "../../services/profileService";
import { API_BASE_URL } from "../../services/apiClient";

// Profiles are loaded from the backend. No client-side mock fallbacks.

const titleCase = (value = "") =>
  value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

function Section({ title, icon: Icon, action, children }) {
  return (
    <section className="rounded-[18px] border border-white/[0.07] bg-[#131C2E] p-5 shadow-[0_18px_46px_rgba(0,0,0,0.14)] sm:p-7">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-3 text-[18px] font-extrabold text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] text-[#B894FF]">
            <Icon size={19} />
          </span>
          {title}
        </h2>
        {action}
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

function Input({ label, name, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#98A5B8]">
        {label}
      </span>
      <input
        className="h-11 w-full rounded-xl border border-white/[0.08] bg-[#0D1626] px-3 text-[14px] text-white outline-none transition focus:border-violet-400/70 focus:ring-2 focus:ring-violet-500/20"
        name={name}
        onChange={onChange}
        type={type}
        value={value || ""}
      />
    </label>
  );
}

function StatusBadge({ status }) {
  const isVerified = status === "verified";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold ${isVerified ? "bg-emerald-500/12 text-[#4ADE80]" : "bg-amber-500/12 text-[#FBBF24]"}`}
    >
      {isVerified ? <BadgeCheck size={15} /> : <CalendarDays size={15} />}
      {isVerified ? "Verified profile" : "Verification pending"}
    </span>
  );
}

function InternProfile({ profile, editing, onChange }) {
  const skills =
    profile.skills
      ?.split(",")
      .map((skill) => skill.trim())
      .filter(Boolean) || [];
  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
        <Section title="About" icon={UserRound}>
          {editing ? (
            <div className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#98A5B8]">
                  Biography
                </span>
                <textarea
                  className="min-h-28 w-full rounded-xl border border-white/[0.08] bg-[#0D1626] p-3 text-[14px] text-white outline-none transition focus:border-violet-400/70 focus:ring-2 focus:ring-violet-500/20"
                  name="bio"
                  onChange={onChange}
                  value={profile.bio || ""}
                />
              </label>
              <Input
                label="Portfolio URL"
                name="portfolio_url"
                value={profile.portfolio_url}
                onChange={onChange}
                type="url"
              />
            </div>
          ) : (
            <>
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
                  <LinkIcon size={16} /> View portfolio{" "}
                  <ExternalLink size={14} />
                </a>
              ) : null}
            </>
          )}
        </Section>
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
        <Section title="Education & Work" icon={GraduationCap}>
          {editing ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Institution"
                name="institution"
                value={profile.institution}
                onChange={onChange}
              />
              <Input
                label="Field of study"
                name="field_of_study"
                value={profile.field_of_study}
                onChange={onChange}
              />
              <Input
                label="Graduation year"
                name="graduation_year"
                value={profile.graduation_year}
                onChange={onChange}
                type="number"
              />
              <Input
                label="Years of experience"
                name="years_of_experience"
                value={profile.years_of_experience}
                onChange={onChange}
                type="number"
              />
            </div>
          ) : (
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
          )}
        </Section>
        <Section title="Skills" icon={CheckCircle2}>
          {editing ? (
            <Input
              label="Skills, separated by commas"
              name="skills"
              value={profile.skills}
              onChange={onChange}
            />
          ) : (
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
          )}
        </Section>
      </div>
    </>
  );
}

function CompanyProfile({ profile, editing, onChange }) {
  const representative = profile.representative || {};
  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
        <Section title="Company Overview" icon={Building2}>
          {editing ? (
            <label className="block">
              <span className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.08em] text-[#98A5B8]">
                Description
              </span>
              <textarea
                className="min-h-32 w-full rounded-xl border border-white/[0.08] bg-[#0D1626] p-3 text-[14px] text-white outline-none transition focus:border-violet-400/70 focus:ring-2 focus:ring-violet-500/20"
                name="description"
                onChange={onChange}
                value={profile.description || ""}
              />
            </label>
          ) : (
            <p className="max-w-3xl text-[15px] leading-7 text-[#B4C0D1]">
              {profile.description}
            </p>
          )}
        </Section>
        <Section title="Business Type" icon={BriefcaseBusiness}>
          <p className="text-[26px] font-extrabold text-white">
            {titleCase(profile.business_type)}
          </p>
          <p className="mt-2 text-[14px] text-[#98A5B8]">
            {profile.industry?.name || "Industry not set"}
          </p>
        </Section>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Section title="Organization Details" icon={Building2}>
          {editing ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Company name"
                name="company_name"
                value={profile.company_name}
                onChange={onChange}
              />
              <Input
                label="Business type"
                name="business_type"
                value={profile.business_type}
                onChange={onChange}
              />
              <Input
                label="Website"
                name="website"
                value={profile.website}
                onChange={onChange}
                type="url"
              />
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              <Detail
                icon={Building2}
                label="Company name"
                value={profile.company_name}
              />
              <Detail
                icon={BriefcaseBusiness}
                label="Industry"
                value={profile.industry?.name}
              />
              {profile.website ? (
                <Detail
                  icon={LinkIcon}
                  label="Website"
                  value={profile.website.replace(/^https?:\/\//, "")}
                />
              ) : null}
            </div>
          )}
        </Section>
        <Section title="Authorized Representative" icon={UserRound}>
          {editing ? (
            <div className="grid gap-4">
              <Input
                label="Job title"
                name="representative.job_title"
                value={representative.job_title}
                onChange={onChange}
              />
              <Input
                label="Corporate email"
                name="representative.corporate_email"
                value={representative.corporate_email}
                onChange={onChange}
                type="email"
              />
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              <Detail
                icon={BriefcaseBusiness}
                label="Role"
                value={representative.job_title}
              />
              <Detail
                icon={Mail}
                label="Corporate email"
                value={representative.corporate_email}
              />
            </div>
          )}
        </Section>
      </div>
    </>
  );
}

export default function ProfilePage({ type }) {
  const { user } = useAuth();
  const isCompany = type === "company";
  const storageKey = isCompany
    ? "edubridgeCompanyProfile"
    : "edubridgeInternProfile";
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState("");
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const name = useMemo(() => {
    if (!profile) return "";
    return isCompany
      ? profile.company_name
      : `${profile.first_name || ""} ${profile.last_name || ""}`.trim();
  }, [isCompany, profile]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoadingProfile(true);
        const resp = isCompany
          ? await fetchCompanyProfile()
          : await fetchInternProfile();
        const nextProfile = resp?.data || resp;
        if (!mounted) return;
        if (nextProfile) {
          localStorage.setItem(storageKey, JSON.stringify(nextProfile));
          setProfile(nextProfile);
        } else {
          setProfile({});
        }
      } catch {
        setProfile({});
      } finally {
        setLoadingProfile(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [isCompany, storageKey]);

  const changeProfile = (event) => {
    const { name: field, value } = event.target;
    if (field.startsWith("representative.")) {
      const representativeField = field.split(".")[1];
      setProfile((current) => ({
        ...current,
        representative: {
          ...current.representative,
          [representativeField]: value,
        },
      }));
      return;
    }
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const handleProfilePicChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setProfilePicFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setProfilePicPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = async () => {
    try {
      const basePayload = isCompany
        ? {
            company_name: profile.company_name,
            business_type: profile.business_type,
            industry: profile.industry?.id || profile.industry,
            country: profile.country,
            city: profile.city,
            website: profile.website,
            description: profile.description,
            representative: {
              job_title: profile.representative?.job_title || "",
              corporate_email:
                profile.representative?.corporate_email || profile.email || "",
            },
          }
        : {
            country: profile.country,
            city: profile.city,
            date_of_birth: profile.date_of_birth,
            gender: profile.gender,
            current_status: profile.current_status,
            institution: profile.institution,
            field_of_study: profile.field_of_study,
            graduation_year: profile.graduation_year,
            years_of_experience: profile.years_of_experience,
            skills: profile.skills,
            portfolio_url: profile.portfolio_url,
            bio: profile.bio,
          };

      // Only attach profile_picture if a new file was selected (intern only)
      const payload =
        !isCompany && profilePicFile
          ? { ...basePayload, profile_picture: profilePicFile }
          : basePayload;

      const response = isCompany
        ? await updateCompanyProfile(payload)
        : await updateInternProfile(payload);

      const nextProfile = response?.data || response;
      if (nextProfile) {
        localStorage.setItem(storageKey, JSON.stringify(nextProfile));
        if (!isCompany) localStorage.setItem("edubridgeStudentName", name);
        setProfile(nextProfile);
      }
      setProfilePicFile(null);
      setProfilePicPreview(null);
      setEditing(false);
      setNotice("Profile saved successfully.");
    } catch (error) {
      setNotice(error.message || "Unable to save profile right now.");
    }
  };

  const avatarSrc =
    profilePicPreview ||
    (!isCompany && profile?.profile_picture
      ? profile.profile_picture.startsWith("http")
        ? profile.profile_picture
        : `${API_BASE_URL}${profile.profile_picture}`
      : null);
  const initials = name
    ? name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";
  const email = profile?.email || user?.email;

  return (
    <DashboardLayout
      navItems={isCompany ? companyDashboardNavItems : studentDashboardNavItems}
      activeIndex={3}
      topbar={<Topbar />}
      workspace={isCompany ? "company" : "student"}
    >
      <motion.main
        className="mx-auto max-w-[1500px] px-4 py-8 sm:px-8 lg:px-10 xl:py-10"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {!profile || loadingProfile ? (
          <p className="text-[15px] font-semibold text-[#9AA7BA]">
            Loading profile...
          </p>
        ) : (
          <>
            <div className="flex flex-col justify-between gap-5 border-b border-white/[0.07] pb-7 sm:flex-row sm:items-start">
              <div className="flex min-w-0 gap-4 sm:gap-6">
                {editing && !isCompany ? (
                  <label className="group relative flex h-20 w-20 shrink-0 cursor-pointer items-center justify-center rounded-[18px] border border-violet-400/25 bg-[#0D1626] sm:h-24 sm:w-24">
                    {avatarSrc ? (
                      <img
                        alt={name}
                        className="h-full w-full rounded-[18px] object-cover"
                        src={avatarSrc}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-[18px] bg-[#F59E0B]/15 text-[27px] font-extrabold text-[#FBBF24]">
                        {initials}
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center rounded-[18px] bg-black/50 opacity-0 transition group-hover:opacity-100">
                      <span className="text-[12px] font-bold text-white">
                        Change
                      </span>
                    </div>
                    <input
                      accept="image/png,image/jpeg,image/jpg"
                      className="sr-only"
                      onChange={handleProfilePicChange}
                      type="file"
                    />
                  </label>
                ) : avatarSrc ? (
                  <img
                    alt={name}
                    className="h-20 w-20 shrink-0 rounded-[18px] border border-violet-400/25 object-cover sm:h-24 sm:w-24"
                    src={avatarSrc}
                  />
                ) : (
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[18px] bg-[#F59E0B]/15 text-[27px] font-extrabold text-[#FBBF24] sm:h-24 sm:w-24">
                    {initials}
                  </div>
                )}
                <div className="min-w-0 pt-1">
                  <div className="mb-3">
                    <StatusBadge status={profile.verification_status} />
                  </div>
                  <h1 className="truncate text-[28px] font-extrabold text-white sm:text-[34px]">
                    {name}
                  </h1>
                  <p className="mt-2 text-[15px] text-[#AAB6C8]">
                    {isCompany
                      ? profile.industry?.name
                      : `${titleCase(profile.current_status)}${profile.field_of_study ? ` · ${profile.field_of_study}` : ""}`}
                  </p>
                </div>
              </div>
              {editing ? (
                <div className="flex gap-3">
                  <button
                    aria-label="Cancel profile editing"
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.07] text-white transition hover:bg-white/[0.12]"
                    onClick={() => setEditing(false)}
                    type="button"
                  >
                    <X size={19} />
                  </button>
                  <button
                    className="flex h-11 items-center gap-2 rounded-xl bg-[#8B5CF6] px-4 text-[14px] font-bold text-white transition hover:bg-[#9568FF]"
                    onClick={saveProfile}
                    type="button"
                  >
                    <Save size={17} /> Save changes
                  </button>
                </div>
              ) : (
                <button
                  className="flex h-11 items-center gap-2 rounded-xl bg-white/[0.07] px-4 text-[14px] font-bold text-white transition hover:bg-white/[0.12]"
                  onClick={() => {
                    setEditing(true);
                    setNotice("");
                  }}
                  type="button"
                >
                  <Edit3 size={17} /> Edit profile
                </button>
              )}
            </div>
            {notice ? (
              <p className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-[14px] font-semibold text-[#86EFAC]">
                {notice}
              </p>
            ) : null}
            <div className="mt-6 grid gap-4 rounded-[18px] border border-white/[0.07] bg-[#0D1626] p-5 sm:grid-cols-3">
              <Detail icon={Mail} label="Email" value={email} />
              <Detail icon={Phone} label="Phone" value={profile.phone_number} />
              <Detail
                icon={MapPin}
                label="Location"
                value={[profile.city, profile.country]
                  .filter(Boolean)
                  .join(", ")}
              />
            </div>
            <div className="mt-6">
              {isCompany ? (
                <CompanyProfile
                  profile={profile}
                  editing={editing}
                  onChange={changeProfile}
                />
              ) : (
                <InternProfile
                  profile={profile}
                  editing={editing}
                  onChange={changeProfile}
                />
              )}
            </div>
          </>
        )}
      </motion.main>
    </DashboardLayout>
  );
}
