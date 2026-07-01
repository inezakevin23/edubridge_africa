import { useState } from "react";
import {
  ArrowRight,
  AtSign,
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  GraduationCap,
  KeyRound,
  Link,
  Lock,
  Mail,
  MapPin,
  Phone,
  Plus,
  ShieldCheck,
  UploadCloud,
  User,
  X,
} from "lucide-react";
import { motion } from "framer-motion";

const stepLabels = ["Personal", "Professional", "Account", "Verify"];
const statusOptions = [
  "Student",
  "Intern",
  "Graduate",
  "Freelancer",
  "Job Seeker",
  "Professional",
];
const skills = ["UI/UX Design", "Python", "Data Analysis", "Product Strategy"];

function Field({ label, icon, placeholder, type = "text", rightIcon }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[13px] font-semibold text-white/90">
        {label}
      </span>
      <span className="flex h-12 items-center gap-3 rounded-[24px] border border-white/[0.04] bg-[#182237]/95 px-4 text-[#93A0B5] shadow-inner shadow-white/[0.02] transition focus-within:border-violet-400/60 focus-within:ring-2 focus-within:ring-violet-500/20">
        <span className="shrink-0">{icon}</span>
        <input
          className="h-full min-w-0 flex-1 bg-transparent text-[14px] text-white placeholder:text-[#8E9AAF] outline-none"
          placeholder={placeholder}
          type={type}
        />
        {rightIcon ? <span className="shrink-0">{rightIcon}</span> : null}
      </span>
    </label>
  );
}

function SelectField({ label, icon, placeholder }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[13px] font-semibold text-white/90">
        {label}
      </span>
      <span className="flex h-12 items-center gap-3 rounded-[24px] border border-white/[0.04] bg-[#182237]/95 px-4 text-[#93A0B5] shadow-inner shadow-white/[0.02] transition focus-within:border-violet-400/60 focus-within:ring-2 focus-within:ring-violet-500/20">
        {icon ? <span className="shrink-0">{icon}</span> : null}
        <select
          className="h-full min-w-0 flex-1 appearance-none bg-transparent text-[14px] text-[#8E9AAF] outline-none"
          defaultValue=""
        >
          <option value="" disabled>
            {placeholder}
          </option>
        </select>
        <ChevronDown size={17} />
      </span>
    </label>
  );
}

function Section({ step, title, icon, children }) {
  return (
    <section className="border-t border-white/[0.07] py-8 first:border-t-0 first:pt-0">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-violet-400/20 bg-violet-500/10 text-[#8B5CF6] shadow-[0_0_24px_rgba(139,92,246,0.12)]">
            {icon}
          </span>
          <h2 className="text-[17px] font-bold text-white">{title}</h2>
        </div>
        <span className="text-[12px] font-medium text-[#8D99AE]">
          Step {step}/4
        </span>
      </div>
      {children}
    </section>
  );
}

function CheckboxLine({ children }) {
  return (
    <label className="group flex items-center gap-3 text-[13px] text-[#9AA7BA]">
      <input className="peer sr-only" type="checkbox" />
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#182237] text-transparent transition peer-checked:border-violet-400/60 peer-checked:bg-violet-500/15 peer-checked:text-violet-300">
        <Check size={13} strokeWidth={3} />
      </span>
      <span>{children}</span>
    </label>
  );
}

export default function StudentRegistrationForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <motion.main
      className="relative min-h-screen overflow-y-auto bg-[#0B1020] px-5 py-5 text-white sm:px-8 lg:px-12"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.1 }}
    >
      <div className="mx-auto w-full max-w-[770px]">
        <header className="sticky top-0 z-20 -mx-5 border-b border-white/[0.07] bg-[#0B1020]/90 px-5 pb-5 pt-1 backdrop-blur-xl sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-4 flex items-center gap-2 text-[15px] font-bold text-white">
                <GraduationCap size={18} className="text-[#8B5CF6]" />
                Student Registration
              </div>
              <div className="grid w-full min-w-[320px] max-w-[900px] grid-cols-4 gap-2">
                {stepLabels.map((label, index) => (
                  <div key={label} className="min-w-0">
                    <span
                      className={`mb-2 block h-[5px] rounded-full ${
                        index === 0
                          ? "bg-[#8B5CF6] shadow-[0_0_16px_rgba(139,92,246,0.5)]"
                          : index === 1
                            ? "bg-violet-500/45"
                            : "bg-[#1A2438]"
                      }`}
                    />
                    <span
                      className={`block truncate text-[12px] font-semibold ${
                        index === 0 ? "text-[#9B6CFF]" : "text-[#7F8AA0]"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <p className="hidden whitespace-nowrap text-[12px] text-[#8D99AE] sm:block">
              Already have an account?{" "}
              <a className="font-semibold text-[#9B6CFF]" href="/login">
                Sign In
              </a>
            </p>
          </div>
        </header>

        <form className="py-9">
          <Section
            step="1"
            title="Personal Information"
            icon={<User size={18} />}
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Full Name"
                icon={<User size={17} />}
                placeholder="Adebayo Oladipo"
              />
              <Field
                label="Email Address"
                icon={<Mail size={17} />}
                placeholder="you@example.com"
                type="email"
              />
              <Field
                label="Phone Number"
                icon={<Phone size={17} />}
                placeholder="+234 800 000 0000"
                type="tel"
              />
              <SelectField
                label="Country"
                placeholder="Select country"
              />
              <Field
                label="City"
                icon={<MapPin size={17} />}
                placeholder="Lagos"
              />
              <Field
                label="Date of Birth"
                icon={<Calendar size={17} />}
                placeholder="DD / MM / YYYY"
              />
              <div className="md:col-span-2">
                <SelectField label="Gender" placeholder="Select gender" />
              </div>
            </div>
          </Section>

          <Section
            step="2"
            title="Professional Information"
            icon={<Briefcase size={18} />}
          >
            <div className="mb-5">
              <span className="mb-2 block text-[13px] font-semibold text-white/90">
                Current Status
              </span>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {statusOptions.map((status, index) => (
                  <label
                    key={status}
                    className={`flex h-11 items-center gap-3 rounded-[22px] border px-4 text-[14px] font-medium ${
                      index === 0
                        ? "border-[#8B5CF6]/55 bg-violet-500/15 text-[#B894FF]"
                        : "border-white/[0.04] bg-[#182237]/95 text-[#9AA7BA]"
                    }`}
                  >
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                        index === 0 ? "border-[#8B5CF6]" : "border-white/10"
                      }`}
                    >
                      {index === 0 ? (
                        <span className="h-2 w-2 rounded-full bg-[#8B5CF6]" />
                      ) : null}
                    </span>
                    <input
                      className="sr-only"
                      defaultChecked={index === 0}
                      name="current-status"
                      type="radio"
                    />
                    {status}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Institution / University"
                icon={<Building2 size={17} />}
                placeholder="University of Lagos"
              />
              <Field
                label="Field of Study"
                icon={<BookOpen size={17} />}
                placeholder="Computer Science"
              />
              <SelectField label="Graduation Year" placeholder="Select year" />
              <Field
                label="Years of Experience (Optional)"
                icon={<Calendar size={17} />}
                placeholder="e.g. 2"
              />
              <div className="md:col-span-2">
                <span className="mb-2 block text-[13px] font-semibold text-white/90">
                  Skills
                </span>
                <div className="min-h-[92px] rounded-[22px] border border-white/[0.04] bg-[#182237]/95 p-4">
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex h-8 items-center gap-2 rounded-full bg-violet-500/15 px-3 text-[12px] font-semibold text-[#B894FF]"
                      >
                        {skill}
                        <X size={13} />
                      </span>
                    ))}
                  </div>
                  <button
                    className="mt-3 inline-flex items-center gap-2 text-[13px] font-medium text-[#9AA7BA]"
                    type="button"
                  >
                    <Plus size={15} />
                    Add skill...
                  </button>
                </div>
              </div>
              <div className="md:col-span-2">
                <Field
                  label="Portfolio Website (Optional)"
                  icon={<Link size={17} />}
                  placeholder="https://yourportfolio.com"
                  type="url"
                />
              </div>
            </div>
          </Section>

          <Section
            step="3"
            title="Account Information"
            icon={<KeyRound size={18} />}
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <Field
                  label="Username"
                  icon={<AtSign size={17} />}
                  placeholder="@adebayo_o"
                />
              </div>
              <Field
                label="Password"
                icon={<Lock size={17} />}
                placeholder="Create a strong password"
                type={showPassword ? "text" : "password"}
                rightIcon={
                  <button
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="transition hover:text-white"
                    onClick={() => setShowPassword((value) => !value)}
                    type="button"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                }
              />
              <Field
                label="Confirm Password"
                icon={<Lock size={17} />}
                placeholder="Repeat password"
                type={showConfirmPassword ? "text" : "password"}
                rightIcon={
                  <button
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                    className="transition hover:text-white"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    type="button"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                }
              />
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2">
              <span className="h-[5px] rounded-full bg-[#F43F5E]" />
              <span className="h-[5px] rounded-full bg-[#F59E0B]" />
              <span className="h-[5px] rounded-full bg-[#22C55E]" />
              <span className="h-[5px] rounded-full bg-[#1A2438]" />
            </div>
            <p className="mt-3 text-[12px] font-semibold text-[#F59E0B]">
              Medium strength - add a symbol to strengthen.
            </p>
          </Section>

          <Section step="4" title="Verification" icon={<ShieldCheck size={18} />}>
            <div>
              <span className="mb-3 block text-[13px] font-semibold text-white/90">
                Upload National ID or Student ID
              </span>
              <div className="flex min-h-[168px] flex-col items-center justify-center rounded-[22px] border border-dashed border-white/10 bg-[#0F172A]/45 px-5 py-8 text-center">
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.06] text-[#A6B1C4]">
                  <UploadCloud size={24} />
                </span>
                <p className="text-[14px] font-semibold text-white">
                  Drop your file here or click to browse
                </p>
                <p className="mt-1 text-[12px] text-[#8D99AE]">
                  PNG, JPG, PDF - max 5MB
                </p>
                <button
                  className="mt-5 h-10 rounded-[20px] bg-white/[0.08] px-5 text-[13px] font-bold text-white transition hover:bg-white/[0.12]"
                  type="button"
                >
                  Choose File
                </button>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-4 rounded-[18px] border border-white/[0.04] bg-[#182237]/95 p-5">
              <div className="flex min-w-0 items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-[#8B5CF6]">
                  <Mail size={21} />
                </span>
                <div className="min-w-0">
                  <h3 className="text-[14px] font-bold text-white">
                    Email Verification
                  </h3>
                  <p className="mt-1 truncate text-[12px] text-[#8D99AE]">
                    A 6-digit OTP will be sent to you@example.com once you
                    submit.
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-white/[0.06] px-3 py-1 text-[12px] font-medium text-[#9AA7BA]">
                Pending
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <CheckboxLine>
                I accept the Terms and Conditions of EduBridge
              </CheckboxLine>
              <CheckboxLine>
                I accept the Privacy Policy and consent to data processing
              </CheckboxLine>
            </div>

            <button
              className="mt-7 flex h-14 w-full items-center justify-center gap-3 rounded-[26px] bg-[#8B5CF6] text-[15px] font-bold text-white shadow-[0_18px_36px_rgba(76,29,149,0.48)] transition hover:bg-[#9568ff]"
              type="submit"
            >
              Create My Student Account
              <ArrowRight size={18} />
            </button>
            <p className="mt-4 text-center text-[12px] text-[#8D99AE]">
              By registering, you agree to our Terms of Service and Privacy
              Policy.
            </p>
          </Section>
        </form>
      </div>
    </motion.main>
  );
}
