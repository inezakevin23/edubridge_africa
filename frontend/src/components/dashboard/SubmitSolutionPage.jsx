import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronRight,
  Circle,
  Link as LinkIcon,
  Send,
  Users,
  Zap,
  Pencil,
  Paperclip,
  Plus,
  FileText,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link, Navigate, useParams } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import Topbar from "../layout/Topbar";
import { studentDashboardNavItems } from "../../data/studentDashboard";
import { createChallengeFormatOptions } from "../../data/createChallenge";
import { fetchChallengeBySlug } from "../../services/challengeService";
import { createSubmission } from "../../services/authService";
import useAuth from "../../context/useAuth";
import {
  createChallengeTeam,
  fetchMyTeams,
  inviteTeamMember,
  removeTeamMember,
  updateTeamMemberRole,
} from "../../services/teamService";

function Panel({ accent = "violet", children, icon: Icon, title }) {
  const iconClass =
    accent === "amber"
      ? "bg-amber-500/10 text-[#F59E0B]"
      : accent === "emerald"
        ? "bg-emerald-500/10 text-[#22C55E]"
        : "bg-violet-500/12 text-[#8B5CF6]";

  return (
    <section className="rounded-[22px] border border-white/[0.07] bg-[#131C2E] p-5 shadow-[0_18px_46px_rgba(0,0,0,0.16)] sm:p-7">
      <h2 className="mb-7 flex items-center gap-4 text-[18px] font-extrabold text-white">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-2xl ${iconClass}`}
        >
          <Icon size={20} />
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function TextInput({ icon: Icon, ...props }) {
  return (
    <div className="flex h-12 items-center gap-3 rounded-full bg-[#1A2639] px-4 text-[#8E9AAF] ring-1 ring-white/[0.03] focus-within:ring-[#8B5CF6]/45">
      {Icon ? <Icon size={18} /> : null}
      <input
        className="min-w-0 flex-1 bg-transparent text-[14px] font-semibold text-white placeholder:text-[#8390A5] outline-none"
        {...props}
      />
    </div>
  );
}

function FormField({ children, helper, label }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[13px] font-extrabold text-[#D6DEEA]">
        {label}
      </span>
      {helper ? (
        <span className="mb-2 block text-[12px] font-semibold text-[#7F8EA5]">
          {helper}
        </span>
      ) : null}
      {children}
    </label>
  );
}

function ProgressBar({ color = "bg-[#8B5CF6]", value }) {
  return (
    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#253149]">
      <div
        className={`h-full rounded-full ${color}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export default function SubmitSolutionPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: "",
    summary: "",
    deliverables: {},
    reviewerNote: "",
  });
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const [team, setTeam] = useState(null);
  const [teamLoading, setTeamLoading] = useState(true);
  const [invitee, setInvitee] = useState("");
  const [teamMessage, setTeamMessage] = useState("");
  const [teamSaving, setTeamSaving] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const canUpdateBeforeDeadline = true;

  const resetSolutionForm = () => {
    setForm({
      title: "",
      summary: "",
      deliverables: {},
      reviewerNote: "",
    });
    setIsSubmitted(false);
    setTeam(null);
    setInvitee("");
    setTeamMessage("");
    setSubmitSuccess("");
    setSubmitError("");
  };
  const { slug } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [challengeLoading, setChallengeLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchChallengeBySlug(slug)
      .then((data) => {
        if (mounted) {
          setChallenge(data);
          setChallengeLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setChallenge(null);
          setChallengeLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, [slug]);

  useEffect(() => {
    if (!challenge?.id) return;
    const loadTeam = () => {
      setTeamLoading(true);
      return fetchMyTeams()
        .then((teams) =>
          setTeam(
            teams.find((item) => item.challenge === challenge.id) || null,
          ),
        )
        .catch(() => setTeam(null))
        .finally(() => setTeamLoading(false));
    };
    loadTeam();
    window.addEventListener("focus", loadTeam);
    return () => window.removeEventListener("focus", loadTeam);
  }, [challenge?.id]);

  const acceptedFormatOptions = createChallengeFormatOptions.filter((option) =>
    challenge?.submission_formats?.includes(option.label),
  );
  const deliverables = acceptedFormatOptions.map((option) => ({
    key: option.label,
    title: option.label,
    copy: option.sublabel,
    linkOnly: option.mode === "linkOnly",
    icon: option.mode === "linkOnly" ? LinkIcon : Paperclip,
    accept: option.accept,
    placeholder:
      option.mode === "linkOnly" ? "Paste link" : "Paste link (optional)",
  }));

  const completedChecklist = useMemo(() => {
    const deliverablesFilled = deliverables
      .filter((d) => d.key)
      .some((d) =>
        Boolean(
          form.deliverables[d.key]?.fileName || form.deliverables[d.key]?.link,
        ),
      );

    return [
      Boolean(form.title.trim()),
      Boolean(form.summary.trim()),
      deliverablesFilled,
      deliverablesFilled,
      Boolean(form.title && form.summary && deliverablesFilled),
    ];
  }, [form, deliverables]);

  const readiness = completedChecklist.filter(Boolean).length;

  if (slug && !challengeLoading && !challenge) {
    return <Navigate to="/challenges" replace />;
  }

  if (challengeLoading) {
    return <p className="p-8 text-white">Loading challenge...</p>;
  }

  const maxTeamSize = challenge.max_team_size || 1;
  const teamMembers = team?.members || [];
  const isTeamLeader = team?.leader === user?.id;

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateDeliverable = (key, field, value) => {
    setForm((current) => ({
      ...current,
      deliverables: {
        ...current.deliverables,
        [key]: {
          ...current.deliverables[key],
          [field]: value,
        },
      },
    }));
  };

  const createTeam = async () => {
    try {
      setTeamSaving(true);
      const result = await createChallengeTeam(challenge.id);
      setTeam(result);
      setTeamMessage("Team created. You are the first member.");
    } catch (error) {
      setTeamMessage(error.message || "Unable to create team.");
    } finally {
      setTeamSaving(false);
    }
  };

  const inviteMember = async () => {
    if (!team || !invitee.trim()) return;
    try {
      setTeamSaving(true);
      await inviteTeamMember(team.id, invitee.trim());
      setInvitee("");
      setTeamMessage("Invitation sent. The member appears after accepting it.");
    } catch (error) {
      setTeamMessage(error.message || "Unable to send invitation.");
    } finally {
      setTeamSaving(false);
    }
  };

  const changeMemberRole = async (member, role) => {
    try {
      setTeamSaving(true);
      setTeam(await updateTeamMemberRole(team.id, member.id, role));
    } catch (error) {
      setTeamMessage(error.message || "Unable to update the member role.");
    } finally {
      setTeamSaving(false);
    }
  };

  const removeMember = async (member) => {
    if (!team || member.user_id === team?.leader) return;
    try {
      setTeamSaving(true);
      const updatedTeam = await removeTeamMember(team.id, member.id);
      setTeam(updatedTeam?.data || updatedTeam || null);
      setTeamMessage("Member removed from the team.");
    } catch (error) {
      setTeamMessage(error.message || "Unable to remove the member.");
    } finally {
      setTeamSaving(false);
    }
  };

  const submitSolution = async () => {
    if (!acceptedFormatOptions.length) {
      setSubmitError(
        "This challenge does not have an accepted submission format.",
      );
      return;
    }

    const hasAcceptedDeliverable = deliverables.some((item) => {
      const details = form.deliverables[item.key];
      return details?.file || details?.link;
    });
    if (!hasAcceptedDeliverable) {
      setSubmitError(
        "Add a deliverable in one of the company's accepted formats.",
      );
      return;
    }

    try {
      const payload = {
        challenge: challenge?.id,
        title: form.title,
        summary: form.summary,
        report_file: form.deliverables["Written Report"]?.file || null,
        slides_file: form.deliverables["Slide Deck"]?.file || null,
        spreadsheet_file: form.deliverables["Spreadsheet"]?.file || null,
        other_file: form.deliverables["Design File"]?.file || null,
        report_link: form.deliverables["Written Report"]?.link || "",
        design_link: form.deliverables["Design File"]?.link || "",
        github_repository: form.deliverables["Code Repository"]?.link || "",
        slides_link: form.deliverables["Slide Deck"]?.link || "",
        video_link: form.deliverables["Video Walkthrough"]?.link || "",
        spreadsheet_link: form.deliverables["Spreadsheet"]?.link || "",
      };

      const response = await createSubmission(payload);
      resetSolutionForm();
      setIsSubmitted(true);
      setSubmitSuccess(response?.message || "Submission sent successfully.");
      setSubmitError("");

      // Reload teams so the team section starts fresh
      if (challenge?.id) {
        fetchMyTeams()
          .then((teams) =>
            setTeam(
              teams.find((item) => item.challenge === challenge.id) || null,
            ),
          )
          .catch(() => setTeam(null));
      }
    } catch (error) {
      setSubmitError(error.message || "Unable to submit solution now.");
      setSubmitSuccess("");
    }
  };

  return (
    <DashboardLayout
      navItems={studentDashboardNavItems}
      activeIndex={1}
      bottomPanel={null}
      topbar={<Topbar />}
      workspace="student"
    >
      <motion.main
        className="mx-auto max-w-[1180px] px-4 py-8 sm:px-8 lg:px-10 xl:py-10"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="mb-7 flex items-center gap-2 text-[13px] font-semibold text-[#9AA7BA]">
          <Link className="transition hover:text-white" to="/challenges">
            Challenges
          </Link>
          <ChevronRight size={15} />
          <span>{challenge.title}</span>
          <ChevronRight size={15} />
          <span className="text-white">Submit Solution</span>
        </div>

        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-7">
            <section className="flex flex-col gap-5 rounded-[22px] border border-white/[0.07] bg-[#131C2E] p-5 shadow-[0_18px_46px_rgba(0,0,0,0.16)] sm:p-6">
              <div className="flex items-center justify-between gap-5">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-[24px] font-extrabold text-[#1E1B4B]">
                    {challenge.initials}
                  </div>
                  <div className="min-w-0">
                    <h1 className="truncate text-[18px] font-extrabold text-white sm:text-[20px]">
                      {challenge.title} Challenge
                    </h1>
                    <p className="mt-1 text-[13px] font-semibold text-[#9AA7BA]">
                      {challenge.company.legalName} - Deadline:{" "}
                      {challenge.deadline}
                    </p>
                  </div>
                </div>
                <span className="flex shrink-0 items-center gap-2 text-[15px] font-extrabold text-[#F59E0B]">
                  <Zap size={17} />
                  {challenge.cash_prize
                    ? `Cash prize: R ${challenge.cash_prize}`
                    : "No cash prize"}
                </span>
              </div>
              <p className="text-[14px] leading-7 text-[#AAB4C3]">
                {challenge.summary}
              </p>
            </section>

            <Panel icon={Pencil} title="Solution Overview">
              <div className="space-y-6">
                <FormField label="Solution Title">
                  <TextInput
                    icon={LinkIcon}
                    onChange={(event) =>
                      updateField("title", event.target.value)
                    }
                    placeholder="e.g. Data-Driven Route Optimization via Clustering"
                    value={form.title}
                  />
                </FormField>

                <FormField
                  helper="Briefly summarize your approach, key findings, and proposed solution (max 300 words)."
                  label="Executive Summary"
                >
                  <div className="rounded-[22px] bg-[#1A2639] p-4 ring-1 ring-white/[0.03] focus-within:ring-[#8B5CF6]/45">
                    <textarea
                      className="min-h-[112px] w-full resize-none bg-transparent text-[14px] font-semibold leading-6 text-white placeholder:text-[#8390A5] outline-none"
                      maxLength={300}
                      onChange={(event) =>
                        updateField("summary", event.target.value)
                      }
                      placeholder="Describe your overall approach and what you discovered..."
                      value={form.summary}
                    />
                    <p className="text-right text-[12px] font-bold text-[#7F8EA5]">
                      {form.summary.length}/300
                    </p>
                  </div>
                </FormField>
              </div>
            </Panel>

            <Panel accent="amber" icon={Paperclip} title="Upload Deliverables">
              <div className="space-y-4">
                {deliverables.length ? (
                  deliverables.map((item) => {
                    const Icon = item.icon;
                    const details = form.deliverables[item.key] || {};

                    return (
                      <div
                        className={`rounded-[22px] border p-4 transition ${
                          item.primary
                            ? "border-[#8B5CF6]/55 bg-violet-500/10"
                            : "border-white/[0.06] bg-[#0E1728]"
                        }`}
                        key={item.key}
                      >
                        <div className="mb-3 flex items-center gap-3">
                          <span
                            className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                              item.primary
                                ? "bg-[#35266A] text-[#A78BFA]"
                                : "bg-[#1A2639] text-[#9AA7BA]"
                            }`}
                          >
                            <Icon size={19} />
                          </span>
                          <div>
                            <h3 className="text-[15px] font-extrabold text-white">
                              {item.title}
                            </h3>
                            <p className="text-[12px] font-semibold text-[#7F8EA5]">
                              {item.copy}
                            </p>
                          </div>
                        </div>

                        <div
                          className={`grid gap-3 ${
                            item.linkOnly ? "" : "md:grid-cols-2"
                          }`}
                        >
                          {!item.linkOnly ? (
                            <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-full bg-[#1A2639] px-4 text-[13px] font-bold text-[#9AA7BA] ring-1 ring-white/[0.03] transition hover:text-white">
                              <Paperclip size={17} />
                              <span className="min-w-0 flex-1 truncate">
                                {details.fileName || "Upload file"}
                              </span>
                              <input
                                accept={item.accept}
                                className="sr-only"
                                onChange={(event) => {
                                  const file = event.target.files?.[0] || null;
                                  updateDeliverable(
                                    item.key,
                                    "fileName",
                                    file?.name || "",
                                  );
                                  updateDeliverable(item.key, "file", file);
                                }}
                                type="file"
                              />
                            </label>
                          ) : null}

                          <TextInput
                            icon={LinkIcon}
                            onChange={(event) =>
                              updateDeliverable(
                                item.key,
                                "link",
                                event.target.value,
                              )
                            }
                            placeholder={item.placeholder}
                            type="url"
                            value={details.link || ""}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-[14px] font-semibold text-[#FBBF24]">
                    This challenge does not currently accept submissions.
                  </p>
                )}
              </div>
            </Panel>

            <Panel accent="emerald" icon={Users} title="Teams">
              <div>
                <h3 className="mb-3 text-[14px] font-extrabold text-[#D6DEEA]">
                  Team Members (max {maxTeamSize})
                </h3>
                {team ? (
                  <p className="mb-3 text-[13px] font-semibold text-[#A78BFA]">
                    Your team has {teamMembers.length} of {maxTeamSize} members.
                  </p>
                ) : null}
                <div className="space-y-3">
                  {teamMembers.map((member) => (
                    <div
                      className="flex items-center gap-4 rounded-[20px] bg-[#0E1728] p-3"
                      key={member.id}
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#35266A] text-[13px] font-extrabold text-[#A78BFA]">
                        {(member.full_name || member.username)
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-extrabold text-white">
                          {member.full_name || member.username}
                          {member.user_id === team?.leader ? (
                            <span className="ml-2 rounded-full bg-[#35266A] px-2 py-0.5 text-[11px] text-[#A78BFA]">
                              Lead
                            </span>
                          ) : null}
                        </p>
                        <p className="text-[12px] font-semibold text-[#7F8EA5]">
                          @{member.username}
                        </p>
                        {isTeamLeader ? (
                          <input
                            aria-label={`Role for ${member.full_name || member.username}`}
                            className="mt-2 h-8 w-full rounded-lg border border-white/[0.08] bg-[#1A2639] px-2 text-[12px] font-semibold text-white outline-none focus:border-violet-400"
                            defaultValue={member.role}
                            disabled={teamSaving}
                            onBlur={(event) => {
                              const nextRole = event.target.value.trim();
                              if (nextRole && nextRole !== member.role) {
                                changeMemberRole(member, nextRole);
                              }
                            }}
                          />
                        ) : (
                          <p className="mt-1 text-[12px] font-semibold text-[#A78BFA]">
                            {member.role}
                          </p>
                        )}
                      </div>
                      {isTeamLeader && member.user_id !== team?.leader ? (
                        <button
                          aria-label={`Remove ${member.full_name || member.username} from team`}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-rose-400/70 transition hover:bg-rose-500/15 hover:text-rose-300"
                          disabled={teamSaving}
                          onClick={() => removeMember(member)}
                          type="button"
                        >
                          <XCircle size={18} />
                        </button>
                      ) : null}
                    </div>
                  ))}
                </div>

                {teamLoading ? (
                  <p className="mt-4 text-[13px] font-semibold text-[#9AA7BA]">
                    Loading your team...
                  </p>
                ) : !team ? (
                  <button
                    className="mt-4 flex h-12 items-center justify-center gap-2 rounded-full bg-[#35266A] px-5 text-[13px] font-extrabold text-[#A78BFA] disabled:opacity-50"
                    disabled={teamSaving}
                    onClick={createTeam}
                    type="button"
                  >
                    <Plus size={16} /> Create team
                  </button>
                ) : (
                  <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
                    <TextInput
                      onChange={(event) => setInvitee(event.target.value)}
                      placeholder="Intern username or email"
                      value={invitee}
                    />
                    <button
                      className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#35266A] px-5 text-[13px] font-extrabold text-[#A78BFA] transition hover:bg-[#44317F] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={teamSaving || teamMembers.length >= maxTeamSize}
                      onClick={inviteMember}
                      type="button"
                    >
                      <Plus size={16} />
                      Invite
                    </button>
                  </div>
                )}
                {teamMessage ? (
                  <p className="mt-3 text-[13px] font-semibold text-[#9AA7BA]">
                    {teamMessage}
                  </p>
                ) : null}
              </div>
            </Panel>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                className="flex h-14 flex-1 items-center justify-center gap-2 rounded-[22px] bg-[#8B5CF6] px-8 text-[16px] font-extrabold text-white shadow-[0_18px_42px_rgba(139,92,246,0.38)] transition hover:bg-[#9568ff]"
                disabled={isSubmitted && !canUpdateBeforeDeadline}
                onClick={submitSolution}
                type="button"
              >
                <Send size={19} />
                {isSubmitted ? "Update Solution" : "Submit Solution"}
              </button>
            </div>
            {submitError ? (
              <p className="pb-2 text-center text-[13px] font-semibold text-rose-300">
                {submitError}
              </p>
            ) : null}
            {submitSuccess ? (
              <p className="pb-2 text-center text-[13px] font-semibold text-emerald-300">
                {submitSuccess}
              </p>
            ) : null}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <section className="rounded-[22px] border border-white/[0.07] bg-[#131C2E] p-6 shadow-[0_18px_46px_rgba(0,0,0,0.16)]">
              <h2 className="mb-5 flex items-center gap-3 text-[17px] font-extrabold text-white">
                <FileText className="text-[#8B5CF6]" size={20} />
                Submission Checklist
              </h2>
              <div className="space-y-3">
                {[
                  "Solution title added",
                  "Executive summary written",
                  "Written report uploaded",
                  "Presentation deck uploaded",
                  "All required fields complete",
                ].map((item, index) => {
                  const checked = completedChecklist[index];

                  return (
                    <div
                      className={`flex items-center gap-3 text-[13px] font-semibold ${
                        checked ? "text-[#D6DEEA]" : "text-[#64748B]"
                      }`}
                      key={item}
                    >
                      {checked ? (
                        <CheckCircle2 className="text-[#22C55E]" size={19} />
                      ) : (
                        <Circle size={19} />
                      )}
                      {item}
                    </div>
                  );
                })}
              </div>
              <div className="mt-6 border-t border-white/[0.06] pt-4">
                <div className="flex items-center justify-between text-[12px] font-extrabold">
                  <span className="text-[#7F8EA5]">Readiness</span>
                  <span className="text-white">{readiness}/5</span>
                </div>
                <ProgressBar value={(readiness / 5) * 100} />
              </div>
            </section>
          </aside>
        </div>
      </motion.main>
    </DashboardLayout>
  );
}
