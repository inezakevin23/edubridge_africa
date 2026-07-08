import { useMemo, useState } from "react";
import {
  Bell,
  CheckCircle2,
  ChevronRight,
  Circle,
  Flame,
  Link as LinkIcon,
  Search,
  Send,
  Timer,
  Users,
  X,
  Zap,
  Pencil,
  Paperclip,
  Plus,
  Save,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import { submitSolutionNavItems } from "../../data/submitSolution";

// Keep local state initialized inline; remove unused imported mocks.

function SubmissionTopbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/[0.07] bg-[#0B1020]/92 px-4 py-4 backdrop-blur-xl sm:px-8 xl:px-10">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4">
        <div className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-full border border-white/[0.06] bg-[#172136] px-5 text-[#9AA7BA] shadow-inner shadow-white/[0.02] sm:max-w-[520px]">
          <Search size={19} />
          <input
            className="min-w-0 flex-1 bg-transparent text-[14px] text-white placeholder:text-[#8E9AAF] outline-none"
            placeholder="Search challenges, companies..."
            type="search"
          />
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button
            aria-label="Notifications"
            className="relative hidden h-11 w-11 items-center justify-center rounded-full text-[#B5C0D2] transition hover:bg-white/[0.06] hover:text-white sm:flex"
            type="button"
          >
            <Bell size={21} />
            <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
          </button>
          <div className="flex h-11 items-center gap-2 rounded-full bg-[#182237] px-5 text-[15px] font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <Flame className="text-[#F59E0B]" size={18} />
            2,450 XP
          </div>
        </div>
      </div>
    </header>
  );
}

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
  const [form, setForm] = useState({
    title: "",
    summary: "",
    methodology: "",
    deliverables: {},
    reviewerNote: "",
  });

  const deliverables = [
    {
      key: "report",
      title: "Written Report",
      copy: "Upload your report file or provide a link.",
      linkOnly: false,
      primary: true,
      icon: Paperclip,
      accept: "application/pdf,.pdf",
      placeholder: "Paste report link",
    },
    {
      key: "deck",
      title: "Presentation Deck",
      copy: "Upload slides (PDF) or provide a link.",
      linkOnly: false,
      primary: false,
      icon: Paperclip,
      accept: "application/pdf,.pdf",
      placeholder: "Paste deck link",
    },
    {
      key: "supplement",
      title: "Optional Supplement",
      copy: "Provide additional materials if any.",
      linkOnly: true,
      primary: false,
      icon: LinkIcon,
      accept: "",
      placeholder: "Paste link",
    },
  ];
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: "Adebayo Oladipo",
      role: "Lead Analyst",
      badge: "You",
      avatar: "https://i.pravatar.cc/100?img=32",
    },
    {
      id: 2,
      name: "Fatima Sule",
      role: "Data Visualisation",
      badge: "",
      avatar: "https://i.pravatar.cc/100?img=47",
    },
  ]);
  const [newMember, setNewMember] = useState({ name: "", role: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const canUpdateBeforeDeadline = true;

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

  const addTeamMember = () => {
    const name = newMember.name.trim();
    const role = newMember.role.trim();

    if (!name) {
      return;
    }

    setTeamMembers((current) => [
      ...current,
      {
        id: Date.now(),
        name,
        role: role || "Collaborator",
        badge: "",
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=35266A&color=A78BFA`,
      },
    ]);
    setNewMember({ name: "", role: "" });
  };

  const removeTeamMember = (id) => {
    setTeamMembers((current) =>
      current.filter((member) => member.id !== id || member.badge === "You"),
    );
  };

  const completedChecklist = useMemo(
    () => [
      Boolean(form.title.trim()),
      Boolean(form.summary.trim()),
      Boolean(form.methodology.trim()),
      Boolean(
        form.deliverables.report?.fileName || form.deliverables.report?.link,
      ),
      Boolean(form.deliverables.deck?.fileName || form.deliverables.deck?.link),
      Boolean(form.reviewerNote.trim()),
      Boolean(
        form.title &&
        form.summary &&
        form.methodology &&
        (form.deliverables.report?.fileName || form.deliverables.report?.link),
      ),
    ],
    [form],
  );

  const readiness = completedChecklist.filter(Boolean).length;

  return (
    <DashboardLayout
      navItems={submitSolutionNavItems}
      activeIndex={1}
      bottomPanel={null}
      topbar={<SubmissionTopbar />}
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
          <span>Supply Chain Optimization</span>
          <ChevronRight size={15} />
          <span className="text-white">Submit Solution</span>
        </div>

        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-7">
            <section className="flex items-center justify-between gap-5 rounded-[22px] border border-white/[0.07] bg-[#131C2E] p-5 shadow-[0_18px_46px_rgba(0,0,0,0.16)] sm:p-6">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-[24px] font-extrabold text-[#1E1B4B]">
                  J
                </div>
                <div className="min-w-0">
                  <h1 className="truncate text-[18px] font-extrabold text-white sm:text-[20px]">
                    Supply Chain Optimization Challenge
                  </h1>
                  <p className="mt-1 text-[13px] font-semibold text-[#9AA7BA]">
                    Jumia Inc. - Deadline: Oct 24, 2024
                  </p>
                </div>
              </div>
              <span className="flex shrink-0 items-center gap-2 text-[15px] font-extrabold text-[#F59E0B]">
                <Zap size={17} />
                1,200 XP
              </span>
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

                <FormField
                  helper="Explain the tools, frameworks, and data sources used."
                  label="Methodology"
                >
                  <div className="rounded-[22px] bg-[#1A2639] p-4 ring-1 ring-white/[0.03] focus-within:ring-[#8B5CF6]/45">
                    <textarea
                      className="min-h-[100px] w-full resize-none bg-transparent text-[14px] font-semibold leading-6 text-white placeholder:text-[#8390A5] outline-none"
                      maxLength={600}
                      onChange={(event) =>
                        updateField("methodology", event.target.value)
                      }
                      placeholder="e.g. Used Python (pandas, scikit-learn) to cluster delivery zones by demand density..."
                      value={form.methodology}
                    />
                    <p className="text-right text-[12px] font-bold text-[#7F8EA5]">
                      {form.methodology.length}/600
                    </p>
                  </div>
                </FormField>
              </div>
            </Panel>

            <Panel accent="amber" icon={Paperclip} title="Upload Deliverables">
              <div className="space-y-4">
                {deliverables.map((item) => {
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
                              onChange={(event) =>
                                updateDeliverable(
                                  item.key,
                                  "fileName",
                                  event.target.files?.[0]?.name || "",
                                )
                              }
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
                })}
              </div>
            </Panel>

            <Panel
              accent="emerald"
              icon={Users}
              title="Team & Additional Notes"
            >
              <div>
                <h3 className="mb-3 text-[14px] font-extrabold text-[#D6DEEA]">
                  Team Members
                </h3>
                <div className="space-y-3">
                  {teamMembers.map((member) => (
                    <div
                      className="flex items-center gap-4 rounded-[20px] bg-[#0E1728] p-3"
                      key={member.id}
                    >
                      <img
                        alt={member.name}
                        className="h-11 w-11 rounded-full object-cover"
                        src={member.avatar}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-extrabold text-white">
                          {member.name}
                          {member.badge ? (
                            <span className="ml-2 rounded-full bg-[#35266A] px-2 py-0.5 text-[11px] text-[#A78BFA]">
                              {member.badge}
                            </span>
                          ) : null}
                        </p>
                        <p className="text-[12px] font-semibold text-[#7F8EA5]">
                          {member.role}
                        </p>
                      </div>
                      {!member.badge ? (
                        <button
                          aria-label={`Remove ${member.name}`}
                          className="flex h-9 w-9 items-center justify-center rounded-full text-[#8E9AAF] transition hover:bg-white/[0.06] hover:text-white"
                          onClick={() => removeTeamMember(member.id)}
                          type="button"
                        >
                          <X size={16} />
                        </button>
                      ) : null}
                    </div>
                  ))}
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)_auto]">
                  <TextInput
                    onChange={(event) =>
                      setNewMember((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addTeamMember();
                      }
                    }}
                    placeholder="Collaborator name or email"
                    value={newMember.name}
                  />
                  <TextInput
                    onChange={(event) =>
                      setNewMember((current) => ({
                        ...current,
                        role: event.target.value,
                      }))
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addTeamMember();
                      }
                    }}
                    placeholder="Role"
                    value={newMember.role}
                  />
                  <button
                    className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#35266A] px-5 text-[13px] font-extrabold text-[#A78BFA] transition hover:bg-[#44317F] hover:text-white"
                    onClick={addTeamMember}
                    type="button"
                  >
                    <Plus size={16} />
                    Add
                  </button>
                </div>
              </div>

              <FormField
                helper="Optional: Include anything you want reviewers to know - context, constraints, assumptions."
                label="Message to Reviewers"
              >
                <div className="rounded-[22px] bg-[#1A2639] p-4 ring-1 ring-white/[0.03] focus-within:ring-[#8B5CF6]/45">
                  <textarea
                    className="min-h-[100px] w-full resize-none bg-transparent text-[14px] font-semibold leading-6 text-white placeholder:text-[#8390A5] outline-none"
                    maxLength={300}
                    onChange={(event) =>
                      updateField("reviewerNote", event.target.value)
                    }
                    placeholder="Any additional context, caveats, or notes for the reviewing team..."
                    value={form.reviewerNote}
                  />
                  <p className="text-right text-[12px] font-bold text-[#7F8EA5]">
                    {form.reviewerNote.length}/300
                  </p>
                </div>
              </FormField>
            </Panel>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                className="flex h-14 items-center justify-center gap-2 rounded-[22px] bg-[#1A2639] px-8 text-[15px] font-extrabold text-white transition hover:bg-[#24324A] sm:w-[230px]"
                type="button"
              >
                <Save size={17} />
                Save Draft
              </button>
              <button
                className="flex h-14 flex-1 items-center justify-center gap-2 rounded-[22px] bg-[#8B5CF6] px-8 text-[16px] font-extrabold text-white shadow-[0_18px_42px_rgba(139,92,246,0.38)] transition hover:bg-[#9568ff]"
                disabled={isSubmitted && !canUpdateBeforeDeadline}
                onClick={() => setIsSubmitted(true)}
                type="button"
              >
                <Send size={19} />
                {isSubmitted ? "Update Solution" : "Submit Solution"}
              </button>
            </div>
            <p className="pb-5 text-center text-[12px] font-semibold text-[#7F8EA5]">
              {isSubmitted
                ? "Submission saved. You can keep updating it until the challenge deadline."
                : "Once submitted, you can update your solution until the challenge deadline."}
            </p>
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
                  "Methodology explained",
                  "Written report uploaded",
                  "Presentation deck uploaded",
                  "Reviewer note added",
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
                  <span className="text-white">{readiness}/7</span>
                </div>
                <ProgressBar value={(readiness / 7) * 100} />
              </div>
            </section>

            <section className="rounded-[22px] border border-amber-400/24 bg-amber-400/5 p-6 shadow-[0_18px_46px_rgba(0,0,0,0.16)]">
              <h2 className="mb-4 flex items-center gap-2 text-[16px] font-extrabold text-[#F59E0B]">
                <Timer size={18} />
                Deadline Approaching
              </h2>
              <p className="text-[12px] font-semibold text-[#9AA7BA]">
                This challenge closes on Oct 24, 2024.
              </p>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  ["02", "Days"],
                  ["14", "Hours"],
                  ["33", "Mins"],
                ].map(([value, label]) => (
                  <div
                    className="rounded-2xl bg-[#0E1728] p-3 text-center"
                    key={label}
                  >
                    <p className="text-[22px] font-extrabold text-white">
                      {value}
                    </p>
                    <p className="text-[11px] font-semibold text-[#9AA7BA]">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </motion.main>
    </DashboardLayout>
  );
}
