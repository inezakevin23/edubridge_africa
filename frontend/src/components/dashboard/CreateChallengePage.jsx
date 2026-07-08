import { useState } from "react";
import {
  Award,
  Bell,
  Calendar,
  ChevronDown,
  ClipboardList,
  Eye,
  Globe2,
  Link as LinkIcon,
  Megaphone,
  Plus,
  Save,
  Search,
  Send,
  Trash2,
  Upload,
  UsersRound,
  WalletCards,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import {
  createChallengeSteps,
  createChallengeInitialForm,
  createChallengeFormatOptions,
  createChallengeNavItems,
} from "../../data/createChallenge";

// Keep existing variable names used throughout the component
const steps = createChallengeSteps;
const initialForm = createChallengeInitialForm;
const formatOptions = createChallengeFormatOptions;
const navItems = createChallengeNavItems;

function CompanyTopbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/[0.07] bg-[#0B1020]/92 px-4 py-4 backdrop-blur-xl sm:px-8 xl:px-10">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4">
        <div className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-full border border-white/[0.06] bg-[#172136] px-5 text-[#9AA7BA] shadow-inner shadow-white/[0.02] sm:max-w-[560px]">
          <Search size={19} />
          <input
            className="min-w-0 flex-1 bg-transparent text-[14px] text-white placeholder:text-[#8E9AAF] outline-none"
            placeholder="Search students, submissions..."
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
            <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-[#8B5CF6]" />
          </button>
          <Link
            className="flex h-11 items-center gap-2 rounded-full bg-[#182237] px-5 text-[14px] font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:bg-[#22304A]"
            to="/create-challenge"
          >
            <Plus className="text-[#9B6CFF]" size={18} />
            Post Challenge
          </Link>
        </div>
      </div>
    </header>
  );
}

function FormField({ label, children, helper }) {
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

function SelectInput({ children, ...props }) {
  return (
    <div className="relative">
      <select
        className="h-12 w-full appearance-none rounded-full bg-[#1A2639] px-4 pr-11 text-[14px] font-semibold text-[#D6DEEA] outline-none ring-1 ring-white/[0.03] focus:ring-[#8B5CF6]/45"
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#8E9AAF]"
        size={17}
      />
    </div>
  );
}

function SectionCard({ children, icon: Icon, title, accent = "violet" }) {
  const accentClass =
    accent === "amber"
      ? "bg-amber-500/10 text-[#F59E0B]"
      : accent === "emerald"
        ? "bg-emerald-500/10 text-[#22C55E]"
        : "bg-violet-500/12 text-[#8B5CF6]";

  return (
    <section className="rounded-[22px] border border-white/[0.07] bg-[#131C2E] p-5 shadow-[0_18px_46px_rgba(0,0,0,0.16)] sm:p-7 lg:p-8">
      <h2 className="mb-7 flex items-center gap-4 text-[18px] font-extrabold text-white">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-2xl ${accentClass}`}
        >
          <Icon size={20} />
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function CreateChallengePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [newSkill, setNewSkill] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const toggleFormat = (format) => {
    setForm((current) => ({
      ...current,
      formats: current.formats.includes(format)
        ? current.formats.filter((item) => item !== format)
        : [...current.formats, format],
    }));
  };

  const addSkill = () => {
    const skill = newSkill.trim();

    if (!skill || form.skills.includes(skill)) {
      return;
    }

    setForm((current) => ({
      ...current,
      skills: [...current.skills, skill],
    }));
    setNewSkill("");
  };

  const removeSkill = (skill) => {
    setForm((current) => ({
      ...current,
      skills: current.skills.filter((item) => item !== skill),
    }));
  };

  const updateRequirement = (index, value) => {
    setForm((current) => ({
      ...current,
      requirements: current.requirements.map((item, itemIndex) =>
        itemIndex === index ? value : item,
      ),
    }));
  };

  const removeRequirement = (index) => {
    setForm((current) => ({
      ...current,
      requirements:
        current.requirements.length === 1
          ? [""]
          : current.requirements.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const updateFormatDetail = (format, field, value) => {
    setForm((current) => ({
      ...current,
      formatDetails: {
        ...current.formatDetails,
        [format]: {
          ...current.formatDetails[format],
          [field]: value,
        },
      },
    }));
  };

  const completedRequirements = form.requirements.filter(Boolean).length;
  const incompleteFields = [
    !form.category ? "Category" : null,
    !form.deadline ? "Deadline" : null,
  ].filter(Boolean);
  const selectedFormats = formatOptions.filter((option) =>
    form.formats.includes(option.label),
  );

  return (
    <DashboardLayout
      navItems={navItems}
      activeIndex={1}
      bottomPanel={null}
      topbar={<CompanyTopbar />}
    >
      <motion.main
        className="mx-auto max-w-[1040px] px-4 py-8 sm:px-8 lg:px-10 xl:py-10"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 flex items-center gap-2 text-[13px] font-bold text-[#7F8EA5]">
              <Link
                className="transition hover:text-white"
                to="/company-dashboard"
              >
                Challenges
              </Link>
              <ChevronDown className="-rotate-90" size={14} />
              <span className="text-white">Create New Challenge</span>
            </p>
            <h1 className="text-[32px] font-extrabold leading-tight text-white sm:text-[38px]">
              Create a Challenge
            </h1>
            <p className="mt-2 text-[16px] font-medium text-[#9AA7BA]">
              Fill in the details below to post a real-world challenge for
              students to solve.
            </p>
          </div>
          <button
            className="flex h-11 w-fit items-center gap-2 rounded-full bg-[#182237] px-5 text-[14px] font-bold text-[#B9C5D7] transition hover:bg-[#22304A] hover:text-white"
            onClick={() => setIsPreviewOpen(true)}
            type="button"
          >
            <Eye size={17} />
            Preview
          </button>
        </div>

        <div className="mb-6 rounded-[18px] border border-white/[0.07] bg-[#131C2E] p-4">
          <div className="grid gap-3 md:grid-cols-4">
            {steps.map((step, index) => {
              const isActive = currentStep === step.id;
              const isDone = currentStep > step.id;

              return (
                <button
                  className={`flex min-h-12 items-center gap-3 rounded-2xl px-3 text-left text-[13px] font-extrabold transition ${
                    isActive
                      ? "bg-violet-500/12 text-[#9B6CFF]"
                      : isDone
                        ? "text-white"
                        : "text-[#7F8EA5] hover:bg-white/[0.035] hover:text-white"
                  }`}
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  type="button"
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[13px] ${
                      isActive
                        ? "border-[#8B5CF6] text-[#9B6CFF]"
                        : isDone
                          ? "border-emerald-400/40 bg-emerald-400/10 text-[#22C55E]"
                          : "border-white/[0.08] text-[#7F8EA5]"
                    }`}
                  >
                    {step.id}
                  </span>
                  <span className="truncate">{step.label}</span>
                  {index < steps.length - 1 ? (
                    <span className="ml-auto hidden h-px flex-1 bg-white/[0.05] lg:block" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <form
          className="space-y-6"
          onSubmit={(event) => event.preventDefault()}
        >
          {currentStep === 1 ? (
            <SectionCard icon={ClipboardList} title="Basic Information">
              <div className="space-y-6">
                <FormField label="Challenge Title">
                  <TextInput
                    icon={Megaphone}
                    onChange={(event) =>
                      updateField("title", event.target.value)
                    }
                    placeholder="e.g. Supply Chain Optimization for Last-Mile Delivery"
                    value={form.title}
                  />
                </FormField>

                <FormField
                  helper="Tip: Well-described challenges attract 3x more quality submissions."
                  label="Challenge Description"
                >
                  <div className="rounded-[22px] bg-[#1A2639] p-4 ring-1 ring-white/[0.03] focus-within:ring-[#8B5CF6]/45">
                    <textarea
                      className="min-h-[120px] w-full resize-none bg-transparent text-[14px] font-semibold leading-6 text-white placeholder:text-[#8390A5] outline-none"
                      maxLength={1500}
                      onChange={(event) =>
                        updateField("description", event.target.value)
                      }
                      placeholder="Describe the real-world problem, context, and what you expect participants to solve. Be specific about the business challenge, background, and scope..."
                      value={form.description}
                    />
                    <p className="text-right text-[12px] font-bold text-[#7F8EA5]">
                      {form.description.length}/1500
                    </p>
                  </div>
                </FormField>

                <div className="grid gap-5 md:grid-cols-2">
                  <FormField label="Category">
                    <SelectInput
                      onChange={(event) =>
                        updateField("category", event.target.value)
                      }
                      value={form.category}
                    >
                      <option value="">e.g. Business Strategy</option>
                      <option>Business Strategy</option>
                      <option>Data Analytics</option>
                      <option>Product Design</option>
                    </SelectInput>
                  </FormField>
                  <FormField label="Industry">
                    <SelectInput
                      onChange={(event) =>
                        updateField("industry", event.target.value)
                      }
                      value={form.industry}
                    >
                      <option value="">e.g. E-Commerce</option>
                      <option>E-Commerce</option>
                      <option>Fintech</option>
                      <option>Logistics</option>
                    </SelectInput>
                  </FormField>
                </div>

                <FormField label="Required Skills">
                  <div className="flex min-h-16 flex-wrap items-center gap-2 rounded-[22px] bg-[#1A2639] px-4 py-3 ring-1 ring-white/[0.03]">
                    {form.skills.map((skill) => (
                      <span
                        className="inline-flex items-center gap-2 rounded-full bg-[#35266A] px-3 py-2 text-[12px] font-extrabold text-[#A78BFA]"
                        key={skill}
                      >
                        {skill}
                        <button
                          aria-label={`Remove ${skill}`}
                          className="rounded-full transition hover:text-white"
                          onClick={() => removeSkill(skill)}
                          type="button"
                        >
                          <X size={13} />
                        </button>
                      </span>
                    ))}
                    <input
                      className="h-9 min-w-[180px] flex-1 bg-transparent px-2 text-[14px] font-semibold text-white placeholder:text-[#8390A5] outline-none"
                      onChange={(event) => setNewSkill(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          addSkill();
                        }
                      }}
                      placeholder="Add skill..."
                      value={newSkill}
                    />
                    <button
                      aria-label="Add skill"
                      className="inline-flex h-9 items-center gap-2 rounded-full bg-[#35266A] px-3 text-[13px] font-extrabold text-[#A78BFA] transition hover:bg-[#44317F] hover:text-white"
                      onClick={addSkill}
                      type="button"
                    >
                      <Plus size={16} />
                      Add
                    </button>
                  </div>
                </FormField>

                <div className="grid gap-5 md:grid-cols-2">
                  <FormField label="Difficulty Level">
                    <SelectInput
                      onChange={(event) =>
                        updateField("difficulty", event.target.value)
                      }
                      value={form.difficulty}
                    >
                      <option value="">Select level</option>
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </SelectInput>
                  </FormField>
                  <FormField label="Expected Duration">
                    <SelectInput
                      onChange={(event) =>
                        updateField("duration", event.target.value)
                      }
                      value={form.duration}
                    >
                      <option value="">e.g. 1-2 weeks</option>
                      <option>1-2 weeks</option>
                      <option>3-4 weeks</option>
                      <option>1-2 months</option>
                    </SelectInput>
                  </FormField>
                </div>
              </div>
            </SectionCard>
          ) : null}

          {currentStep === 2 ? (
            <SectionCard
              accent="amber"
              icon={ClipboardList}
              title="Requirements & Deliverables"
            >
              <div className="space-y-7">
                <p className="text-[14px] font-medium text-[#9AA7BA]">
                  List what participants must submit. Be clear and specific.
                </p>
                <div className="space-y-4">
                  {form.requirements.map((requirement, index) => (
                    <div className="flex items-center gap-3" key={index}>
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#35266A] text-[12px] font-extrabold text-[#A78BFA]">
                        {index + 1}
                      </span>
                      <TextInput
                        onChange={(event) =>
                          updateRequirement(index, event.target.value)
                        }
                        placeholder="Describe requirement..."
                        value={requirement}
                      />
                      <button
                        aria-label={`Remove requirement ${index + 1}`}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#8E9AAF] transition hover:bg-white/[0.06] hover:text-white"
                        onClick={() => removeRequirement(index)}
                        type="button"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-[#35266A] px-4 text-[14px] font-extrabold text-[#A78BFA] transition hover:bg-[#44317F]"
                  onClick={() =>
                    updateField("requirements", [...form.requirements, ""])
                  }
                  type="button"
                >
                  <Plus size={17} />
                  Add Requirement
                </button>

                <div>
                  <h3 className="mb-4 text-[15px] font-extrabold text-white">
                    Accepted Submission Formats
                  </h3>
                  <div className="grid gap-3 md:grid-cols-3">
                    {formatOptions.map((option) => {
                      const Icon = option.icon;
                      const selected = form.formats.includes(option.label);

                      return (
                        <button
                          className={`flex min-h-[66px] items-center gap-3 rounded-[22px] border px-4 text-left transition ${
                            selected
                              ? "border-[#8B5CF6]/55 bg-[#2B285A] text-[#A78BFA]"
                              : "border-white/[0.04] bg-[#1A2639] text-[#9AA7BA] hover:border-white/[0.12] hover:text-white"
                          }`}
                          key={option.label}
                          onClick={() => toggleFormat(option.label)}
                          type="button"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/12">
                            <Icon size={18} />
                          </span>
                          <span>
                            <span className="block text-[13px] font-extrabold">
                              {option.label}
                            </span>
                            <span className="block text-[12px] font-semibold opacity-75">
                              {option.sublabel}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {selectedFormats.length ? (
                    <div className="mt-5 space-y-3">
                      {selectedFormats.map((option) => {
                        const Icon = option.icon;
                        const details = form.formatDetails[option.label] || {};

                        return (
                          <div
                            className="rounded-[20px] border border-white/[0.05] bg-[#0E1728] p-4"
                            key={option.label}
                          >
                            <div className="mb-3 flex items-center gap-3 text-white">
                              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/12 text-[#A78BFA]">
                                <Icon size={18} />
                              </span>
                              <div>
                                <h4 className="text-[14px] font-extrabold">
                                  {option.label}
                                </h4>
                                <p className="text-[12px] font-semibold text-[#7F8EA5]">
                                  {option.sublabel}
                                </p>
                              </div>
                            </div>

                            <div
                              className={`grid gap-3 ${
                                option.mode === "fileOrLink"
                                  ? "md:grid-cols-2"
                                  : ""
                              }`}
                            >
                              {option.mode === "fileOrLink" ? (
                                <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-full bg-[#1A2639] px-4 text-[13px] font-bold text-[#9AA7BA] ring-1 ring-white/[0.03] transition hover:text-white">
                                  <Upload size={17} />
                                  <span className="min-w-0 flex-1 truncate">
                                    {details.fileName || "Upload sample file"}
                                  </span>
                                  <input
                                    accept={option.accept}
                                    className="sr-only"
                                    onChange={(event) =>
                                      updateFormatDetail(
                                        option.label,
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
                                  updateFormatDetail(
                                    option.label,
                                    "link",
                                    event.target.value,
                                  )
                                }
                                placeholder={
                                  option.label === "Video Walkthrough"
                                    ? "Paste video link"
                                    : "Paste submission link"
                                }
                                type="url"
                                value={details.link || ""}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              </div>
            </SectionCard>
          ) : null}

          {currentStep === 3 ? (
            <SectionCard
              accent="emerald"
              icon={Award}
              title="Rewards & Access Control"
            >
              <div className="space-y-6">
                <div className="grid gap-5 md:grid-cols-2">
                  <FormField label="XP Reward">
                    <TextInput
                      icon={LinkIcon}
                      onChange={(event) =>
                        updateField("xpReward", event.target.value)
                      }
                      placeholder="e.g. 1200"
                      value={form.xpReward}
                    />
                  </FormField>
                  <FormField label="Submission Deadline">
                    <TextInput
                      icon={Calendar}
                      onChange={(event) =>
                        updateField("deadline", event.target.value)
                      }
                      type="date"
                      value={form.deadline}
                    />
                  </FormField>
                  <FormField label="Max Team Size (Optional)">
                    <TextInput
                      icon={UsersRound}
                      onChange={(event) =>
                        updateField("maxTeamSize", event.target.value)
                      }
                      placeholder="e.g. 3 (leave blank for solo)"
                      value={form.maxTeamSize}
                    />
                  </FormField>
                  <FormField label="Target Participant Status (Optional)">
                    <SelectInput
                      onChange={(event) =>
                        updateField("participantStatus", event.target.value)
                      }
                      value={form.participantStatus}
                    >
                      <option value="">All levels</option>
                      <option>Students</option>
                      <option>Graduates</option>
                      <option>Top performers</option>
                    </SelectInput>
                  </FormField>
                </div>

                <div>
                  <h3 className="mb-3 text-[15px] font-extrabold text-white">
                    Challenge Access Type
                  </h3>
                  <div className="flex min-h-[86px] items-center gap-4 rounded-[22px] border border-[#8B5CF6]/65 bg-[#2B285A] p-4 text-left text-[#A78BFA]">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-500/12">
                      <Globe2 size={18} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-extrabold">
                        Open Challenge
                      </span>
                      <span className="mt-1 block text-[12px] font-semibold text-[#C4B5FD]">
                        Visible to all students on EduBridge.
                      </span>
                    </span>
                    <span className="h-4 w-4 rounded-full border border-[#8B5CF6] bg-[#8B5CF6]" />
                  </div>
                </div>

                <FormField label="Cash / Physical Prize (Optional)">
                  <TextInput
                    icon={WalletCards}
                    onChange={(event) =>
                      updateField("prize", event.target.value)
                    }
                    placeholder="e.g. $500 stipend for top 3 submissions"
                    value={form.prize}
                  />
                </FormField>
              </div>
            </SectionCard>
          ) : null}

          {currentStep === 4 ? (
            <SectionCard icon={Send} title="Review & Publish">
              <div className="rounded-[22px] border border-white/[0.05] bg-[#0E1728] p-5">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <h3 className="text-[15px] font-extrabold text-white">
                    Challenge Preview
                  </h3>
                  <span className="rounded-full bg-amber-400/10 px-3 py-1.5 text-[12px] font-extrabold text-[#F59E0B]">
                    Draft
                  </span>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  {[
                    ["Title", form.title || "Supply Chain Optimization..."],
                    ["Category", form.category || "Not set"],
                    ["Difficulty", form.difficulty || "Advanced"],
                    ["Deadline", form.deadline || "Not set"],
                    [
                      "XP Reward",
                      form.xpReward ? `${form.xpReward} XP` : "1,200 XP",
                    ],
                    [
                      "Requirements",
                      `${completedRequirements || form.requirements.length} added`,
                    ],
                  ].map(([label, value]) => (
                    <div
                      className="flex min-h-12 items-center justify-between gap-3 rounded-xl bg-[#1A2639] px-4"
                      key={label}
                    >
                      <span className="text-[12px] font-bold text-[#7F8EA5]">
                        {label}
                      </span>
                      <span
                        className={`truncate text-right text-[13px] font-extrabold ${
                          value === "Not set" ? "text-[#FB7185]" : "text-white"
                        }`}
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 rounded-[20px] border border-amber-400/20 bg-amber-400/5 p-4 text-[13px] font-semibold text-[#9AA7BA]">
                <span className="font-extrabold text-[#F59E0B]">
                  {incompleteFields.length} fields
                </span>{" "}
                are incomplete. Please set{" "}
                {incompleteFields.length
                  ? incompleteFields.join(" and ")
                  : "all required fields"}{" "}
                before publishing. Incomplete challenges will be saved as
                drafts.
              </div>
            </SectionCard>
          ) : null}

          <div className="flex flex-col-reverse gap-3 rounded-[22px] border border-white/[0.07] bg-[#131C2E] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {currentStep > 1 ? (
                <button
                  className="h-12 w-full rounded-full bg-[#1A2639] px-7 text-[15px] font-extrabold text-white transition hover:bg-[#24324A] sm:w-auto"
                  onClick={() =>
                    setCurrentStep((step) => Math.max(1, step - 1))
                  }
                  type="button"
                >
                  Back
                </button>
              ) : null}
            </div>

            {currentStep < 4 ? (
              <button
                className="h-12 rounded-full bg-[#8B5CF6] px-9 text-[15px] font-extrabold text-white shadow-[0_14px_30px_rgba(139,92,246,0.26)] transition hover:bg-[#9568ff]"
                onClick={() => setCurrentStep((step) => Math.min(4, step + 1))}
                type="button"
              >
                Next
              </button>
            ) : (
              <div className="grid gap-3 sm:grid-cols-3">
                <button
                  className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#1A2639] px-5 text-[14px] font-extrabold text-white transition hover:bg-[#24324A]"
                  type="button"
                >
                  <Save size={17} />
                  Save as Draft
                </button>
                <button
                  className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#1A2639] px-5 text-[14px] font-extrabold text-white transition hover:bg-[#24324A]"
                  onClick={() => setIsPreviewOpen(true)}
                  type="button"
                >
                  <Eye size={17} />
                  Preview Challenge
                </button>
                <button
                  className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#F59E0B] px-5 text-[14px] font-extrabold text-white shadow-[0_14px_30px_rgba(245,158,11,0.24)] transition hover:bg-[#F97316]"
                  type="submit"
                >
                  <Send size={17} />
                  Publish Challenge
                </button>
              </div>
            )}
          </div>
        </form>

        {isPreviewOpen ? (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#020617]/80 px-4 py-8 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-[760px] overflow-y-auto rounded-[24px] border border-white/[0.08] bg-[#111A2A] p-5 shadow-[0_28px_80px_rgba(0,0,0,0.45)] sm:p-7">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <span className="mb-3 inline-flex rounded-full bg-emerald-500/10 px-3 py-1.5 text-[12px] font-extrabold text-[#22C55E]">
                    Open Challenge
                  </span>
                  <h2 className="text-[26px] font-extrabold leading-tight text-white">
                    {form.title || "Untitled Challenge"}
                  </h2>
                  <p className="mt-2 text-[14px] font-medium leading-6 text-[#9AA7BA]">
                    {form.description ||
                      "Add a challenge description to show students what they will solve."}
                  </p>
                </div>
                <button
                  aria-label="Close preview"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-[#B9C5D7] transition hover:bg-white/[0.1] hover:text-white"
                  onClick={() => setIsPreviewOpen(false)}
                  type="button"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["Category", form.category || "Not set"],
                  ["Industry", form.industry || "Not set"],
                  ["Difficulty", form.difficulty || "Not set"],
                  ["Duration", form.duration || "Not set"],
                  ["Deadline", form.deadline || "Not set"],
                  [
                    "XP Reward",
                    form.xpReward ? `${form.xpReward} XP` : "Not set",
                  ],
                ].map(([label, value]) => (
                  <div className="rounded-2xl bg-[#1A2639] p-4" key={label}>
                    <p className="text-[12px] font-bold text-[#7F8EA5]">
                      {label}
                    </p>
                    <p className="mt-1 text-[14px] font-extrabold text-white">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <h3 className="mb-3 text-[15px] font-extrabold text-white">
                    Required Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {form.skills.length ? (
                      form.skills.map((skill) => (
                        <span
                          className="rounded-full bg-[#35266A] px-3 py-2 text-[12px] font-extrabold text-[#A78BFA]"
                          key={skill}
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-[13px] font-semibold text-[#9AA7BA]">
                        No skills added yet.
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-[15px] font-extrabold text-white">
                    Requirements
                  </h3>
                  <div className="space-y-2">
                    {form.requirements.filter(Boolean).length ? (
                      form.requirements
                        .filter(Boolean)
                        .map((requirement, index) => (
                          <p
                            className="rounded-2xl bg-[#1A2639] px-4 py-3 text-[14px] font-semibold text-[#D6DEEA]"
                            key={`${requirement}-${index}`}
                          >
                            {index + 1}. {requirement}
                          </p>
                        ))
                    ) : (
                      <p className="text-[13px] font-semibold text-[#9AA7BA]">
                        No requirements added yet.
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-[15px] font-extrabold text-white">
                    Accepted Submission Formats
                  </h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {selectedFormats.map((format) => {
                      const details = form.formatDetails[format.label] || {};

                      return (
                        <div
                          className="rounded-2xl bg-[#1A2639] p-4"
                          key={format.label}
                        >
                          <p className="text-[14px] font-extrabold text-white">
                            {format.label}
                          </p>
                          <p className="mt-1 text-[12px] font-semibold text-[#9AA7BA]">
                            {details.fileName || details.link
                              ? [details.fileName, details.link]
                                  .filter(Boolean)
                                  .join(" | ")
                              : format.sublabel}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </motion.main>
    </DashboardLayout>
  );
}
