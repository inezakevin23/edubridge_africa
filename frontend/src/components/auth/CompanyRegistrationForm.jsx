import { useState } from "react";
import {
  ArrowRight,
  AtSign,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  FileText,
  Globe,
  Info,
  KeyRound,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Upload,
  User,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

const stepLabels = ["Organization", "Documents", "Representative", "Account"];
const businessTypes = [
  "Startup",
  "SME",
  "Corporation",
  "NGO",
  "Government",
  "Educational",
];
const documents = [
  "Business Registration Certificate",
  "Tax Registration Document (TIN)",
  "Operating License",
  "NGO Registration Certificate",
  "Government Accreditation Document",
];

function Field({ label, icon, placeholder, type = "text", rightIcon }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[13px] font-semibold text-white/90">
        {label}
      </span>
      <span className="flex h-12 items-center gap-3 rounded-[24px] border border-white/[0.04] bg-[#182237]/95 px-4 text-[#93A0B5] shadow-inner shadow-white/[0.02] transition focus-within:border-amber-400/60 focus-within:ring-2 focus-within:ring-amber-500/15">
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

function SelectField({ label, placeholder }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[13px] font-semibold text-white/90">
        {label}
      </span>
      <span className="flex h-12 items-center gap-3 rounded-[24px] border border-white/[0.04] bg-[#182237]/95 px-4 text-[#93A0B5] shadow-inner shadow-white/[0.02] transition focus-within:border-amber-400/60 focus-within:ring-2 focus-within:ring-amber-500/15">
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
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-amber-400/20 bg-amber-500/10 text-[#F59E0B] shadow-[0_0_24px_rgba(245,158,11,0.12)]">
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
    <label className="flex items-start gap-3 text-[13px] leading-relaxed text-[#9AA7BA]">
      <input className="peer sr-only" type="checkbox" />
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#182237] text-transparent transition peer-checked:border-amber-400/60 peer-checked:bg-amber-500/15 peer-checked:text-amber-300">
        <Check size={13} strokeWidth={3} />
      </span>
      <span>{children}</span>
    </label>
  );
}

function DocumentUpload({ title, optional }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[18px] border border-white/[0.04] bg-[#182237]/95 p-4">
      <div className="flex min-w-0 items-center gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[#0F172A]/80 text-[#A6B1C4]">
          <FileText size={19} />
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-[14px] font-bold text-white">{title}</h3>
          {optional ? (
            <p className="mt-1 text-[12px] text-[#8D99AE]">If applicable</p>
          ) : null}
        </div>
      </div>
      <button
        className="inline-flex h-9 shrink-0 items-center gap-2 rounded-[18px] bg-white/[0.07] px-3 text-[12px] font-bold text-white transition hover:bg-white/[0.11]"
        type="button"
      >
        <Upload size={14} />
        Upload
      </button>
    </div>
  );
}

export default function CompanyRegistrationForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <motion.main
      className="relative min-h-screen overflow-y-auto bg-[#0B1020] px-5 py-5 text-white sm:px-8 lg:px-12"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.1 }}
    >
      <div className="mx-auto w-full max-w-[720px]">
        <header className="sticky top-0 z-20 -mx-5 border-b border-white/[0.07] bg-[#0B1020]/90 px-5 pb-5 pt-1 backdrop-blur-xl sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-4 flex items-center gap-2 text-[15px] font-bold text-white">
                <Building2 size={18} className="text-[#F59E0B]" />
                Company Registration
              </div>
              <div className="grid w-full min-w-[320px] max-w-[900px] grid-cols-4 gap-2">
                {stepLabels.map((label, index) => (
                  <div key={label} className="min-w-0">
                    <span
                      className={`mb-2 block h-[5px] rounded-full ${
                        index === 0
                          ? "bg-[#F59E0B] shadow-[0_0_16px_rgba(245,158,11,0.45)]"
                          : index === 1
                            ? "bg-amber-500/35"
                            : "bg-[#1A2438]"
                      }`}
                    />
                    <span
                      className={`block truncate text-[12px] font-semibold ${
                        index === 0 ? "text-[#F59E0B]" : "text-[#7F8AA0]"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <p className="hidden whitespace-nowrap text-[12px] text-[#8D99AE] sm:block">
              Already registered?{" "}
              <a className="font-semibold text-[#9B6CFF]" href="/login">
                Sign In
              </a>
            </p>
          </div>
        </header>

        <form className="py-9">
          <Section
            step="1"
            title="Organization Information"
            icon={<Building2 size={18} />}
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <Field
                  label="Organization Name"
                  icon={<Building2 size={17} />}
                  placeholder="Jumia Inc."
                />
              </div>

              <div className="md:col-span-2">
                <span className="mb-2 block text-[13px] font-semibold text-white/90">
                  Business Type
                </span>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {businessTypes.map((type, index) => (
                    <label
                      key={type}
                      className={`flex h-11 items-center gap-3 rounded-[22px] border px-4 text-[14px] font-medium ${
                        index === 2
                          ? "border-[#F59E0B]/55 bg-amber-500/10 text-[#F8B64C]"
                          : "border-white/[0.04] bg-[#182237]/95 text-[#9AA7BA]"
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                          index === 2 ? "border-[#F59E0B]" : "border-white/10"
                        }`}
                      >
                        {index === 2 ? (
                          <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />
                        ) : null}
                      </span>
                      <input
                        className="sr-only"
                        defaultChecked={index === 2}
                        name="business-type"
                        type="radio"
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              <SelectField label="Industry" placeholder="E-Commerce" />
              <SelectField label="Country" placeholder="Select country" />
              <Field label="City" icon={<MapPin size={17} />} placeholder="Lagos" />
              <Field
                label="Company Website"
                icon={<Globe size={17} />}
                placeholder="https://company.com"
                type="url"
              />
              <Field
                label="Official Email Address"
                icon={<Mail size={17} />}
                placeholder="hr@company.com"
                type="email"
              />
              <Field
                label="Business Phone Number"
                icon={<Phone size={17} />}
                placeholder="+234 800 000 0000"
                type="tel"
              />
              <label className="block md:col-span-2">
                <span className="mb-2 block text-[13px] font-semibold text-white/90">
                  Company Description
                </span>
                <span className="block rounded-[22px] border border-white/[0.04] bg-[#182237]/95 p-4 text-[#93A0B5] shadow-inner shadow-white/[0.02] transition focus-within:border-amber-400/60 focus-within:ring-2 focus-within:ring-amber-500/15">
                  <textarea
                    className="h-20 w-full resize-none bg-transparent text-[14px] text-white placeholder:text-[#8E9AAF] outline-none"
                    maxLength="300"
                    placeholder="Briefly describe your organization, mission, and what kind of challenges you plan to post..."
                  />
                  <span className="block text-right text-[12px] text-[#8D99AE]">
                    0/300
                  </span>
                </span>
              </label>
            </div>
          </Section>

          <Section
            step="2"
            title="Registration & Verification Documents"
            icon={<FileText size={18} />}
          >
            <p className="mb-5 max-w-[610px] text-[13px] leading-relaxed text-[#9AA7BA]">
              Upload the relevant documents for your business type. All files
              are securely stored and reviewed within 48 hours.
            </p>
            <div className="space-y-3">
              {documents.map((document, index) => (
                <DocumentUpload
                  key={document}
                  optional={index >= 2}
                  title={document}
                />
              ))}
            </div>
            <div className="mt-5 flex gap-3 rounded-[18px] border border-violet-400/10 bg-violet-500/[0.06] p-4 text-[12px] leading-relaxed text-[#9AA7BA]">
              <Info className="mt-0.5 shrink-0 text-[#8B5CF6]" size={17} />
              <p>
                Accepted formats: PDF, JPG, PNG. Max 10MB per file. NGO and
                government documents are only required for their respective
                organization types.
              </p>
            </div>
          </Section>

          <Section
            step="3"
            title="Authorized Representative"
            icon={<Users size={18} />}
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Full Name"
                icon={<User size={17} />}
                placeholder="Chidi Okeke"
              />
              <Field
                label="Job Title"
                icon={<BriefcaseBusiness size={17} />}
                placeholder="Head of Talent Acquisition"
              />
              <Field
                label="Corporate Email"
                icon={<Mail size={17} />}
                placeholder="chidi@company.com"
                type="email"
              />
              <Field
                label="Phone Number"
                icon={<Phone size={17} />}
                placeholder="+234 800 000 0000"
                type="tel"
              />
            </div>
            <div className="mt-5 flex gap-3 rounded-[18px] border border-amber-400/15 bg-amber-500/[0.06] p-4 text-[12px] leading-relaxed text-[#9AA7BA]">
              <ShieldCheck className="mt-0.5 shrink-0 text-[#F59E0B]" size={17} />
              <p>
                The authorized representative is legally responsible for all
                challenges and interactions posted through this account.
              </p>
            </div>
          </Section>

          <Section step="4" title="Account Information" icon={<KeyRound size={18} />}>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <Field
                  label="Username"
                  icon={<AtSign size={17} />}
                  placeholder="@jumia_inc"
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
                    A 6-digit OTP will be sent to hr@company.com to verify your
                    corporate email.
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-white/[0.06] px-3 py-1 text-[12px] font-medium text-[#9AA7BA]">
                Pending
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <CheckboxLine>
                I confirm that I have legal ownership or am authorized to
                represent this organization on EduBridge
              </CheckboxLine>
              <CheckboxLine>
                I accept the Terms and Conditions including the Challenge
                Posting Guidelines
              </CheckboxLine>
              <CheckboxLine>
                I accept the Privacy Policy and consent to data processing under
                applicable laws
              </CheckboxLine>
            </div>

            <button
              className="mt-7 flex h-14 w-full items-center justify-center gap-3 rounded-[26px] bg-[#F59E0B] text-[15px] font-bold text-white shadow-[0_18px_36px_rgba(245,158,11,0.3)] transition hover:bg-[#f7a923]"
              type="submit"
            >
              Register Company Account
              <ArrowRight size={18} />
            </button>
            <p className="mt-4 text-center text-[12px] text-[#8D99AE]">
              Account activation takes up to 48 hours after document
              verification.
            </p>
          </Section>
        </form>
      </div>
    </motion.main>
  );
}
