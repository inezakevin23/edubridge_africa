import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  AtSign,
  BriefcaseBusiness,
  Building2,
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
import { useAuth } from "../../context/AuthContext";
import {
  companyRegistrationBusinessTypes,
  companyRegistrationDocuments,
  companyRegistrationIndustries,
  companyRegistrationStepLabels,
} from "../../data/companyRegistration";
import { africanCountries } from "../../data/studentRegistration";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[0-9\s()-]{7,20}$/;

function RequiredMark() {
  return <span className="text-[#F43F5E]">*</span>;
}

function Label({ children, optional, required }) {
  return (
    <span className="mb-2 flex items-center gap-1 text-[13px] font-semibold text-white/90">
      <span>{children}</span>
      {required ? <RequiredMark /> : null}
      {optional ? (
        <span className="font-medium text-[#8D99AE]">(Optional)</span>
      ) : null}
    </span>
  );
}

function Field({
  label,
  icon,
  name,
  onChange,
  optional = false,
  pattern,
  placeholder,
  required = false,
  rightIcon,
  type = "text",
  value,
}) {
  return (
    <label className="block">
      <Label optional={optional} required={required}>
        {label}
      </Label>
      <span className="flex h-12 items-center gap-3 rounded-[24px] border border-white/[0.04] bg-[#182237]/95 px-4 text-[#93A0B5] shadow-inner shadow-white/[0.02] transition focus-within:border-amber-400/60 focus-within:ring-2 focus-within:ring-amber-500/15">
        <span className="shrink-0">{icon}</span>
        <input
          className="auth-input h-full min-w-0 flex-1 bg-transparent text-[14px] text-white placeholder:text-[#8E9AAF] outline-none"
          name={name}
          onChange={onChange}
          pattern={pattern}
          placeholder={placeholder}
          required={required}
          type={type}
          value={value}
        />
        {rightIcon ? <span className="shrink-0">{rightIcon}</span> : null}
      </span>
    </label>
  );
}

function SelectField({
  label,
  name,
  onChange,
  optional = false,
  options,
  placeholder,
  required = false,
  value,
}) {
  return (
    <label className="block">
      <Label optional={optional} required={required}>
        {label}
      </Label>
      <span className="flex h-12 items-center gap-3 rounded-[24px] border border-white/[0.04] bg-[#182237]/95 px-4 text-[#93A0B5] shadow-inner shadow-white/[0.02] transition focus-within:border-amber-400/60 focus-within:ring-2 focus-within:ring-amber-500/15">
        <select
          className={`auth-input h-full min-w-0 flex-1 appearance-none bg-transparent text-[14px] outline-none ${
            value ? "text-white" : "text-[#8E9AAF]"
          }`}
          name={name}
          onChange={onChange}
          required={required}
          value={value}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown size={17} />
      </span>
    </label>
  );
}

function TextAreaField({
  label,
  maxLength,
  name,
  onChange,
  placeholder,
  required,
  value,
}) {
  return (
    <label className="block md:col-span-2">
      <Label required={required}>{label}</Label>
      <span className="block rounded-[22px] border border-white/[0.04] bg-[#182237]/95 p-4 text-[#93A0B5] shadow-inner shadow-white/[0.02] transition focus-within:border-amber-400/60 focus-within:ring-2 focus-within:ring-amber-500/15">
        <textarea
          className="auth-input h-20 w-full resize-none bg-transparent text-[14px] text-white placeholder:text-[#8E9AAF] outline-none"
          maxLength={maxLength}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          value={value}
        />
        <span className="block text-right text-[12px] text-[#8D99AE]">
          {value.length}/{maxLength}
        </span>
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

function DocumentUpload({ file, onChange, optional, required, title }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-[18px] border border-white/[0.04] bg-[#182237]/95 p-4 transition hover:border-amber-400/35">
      <div className="flex min-w-0 items-center gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[#0F172A]/80 text-[#A6B1C4]">
          <FileText size={19} />
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-[14px] font-bold text-white">
            {title} {required ? <RequiredMark /> : null}
          </h3>
          <p className="mt-1 truncate text-[12px] text-[#8D99AE]">
            {file?.name ||
              (optional ? "Optional document" : "PDF, JPG, or PNG required")}
          </p>
        </div>
      </div>
      <span className="inline-flex h-9 shrink-0 items-center gap-2 rounded-[18px] bg-white/[0.07] px-3 text-[12px] font-bold text-white transition hover:bg-white/[0.11]">
        <Upload size={14} />
        Upload
      </span>
      <input
        accept="application/pdf,image/png,image/jpeg,image/jpg"
        className="sr-only"
        onChange={onChange}
        required={required}
        type="file"
      />
    </label>
  );
}

const initialForm = {
  organizationName: "",
  businessType: "Corporation",
  industry: "",
  otherIndustry: "",
  country: "",
  city: "",
  website: "",
  email: "",
  username: "",
  phone: "",
  description: "",
  representativeName: "",
  representativeTitle: "",
  representativeUsername: "",
  representativePhone: "",
  password: "",
  confirmPassword: "",
};

function getPasswordStrength(password) {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (!password) {
    return {
      label: "Password strength will appear as you type.",
      color: "text-[#8D99AE]",
      activeBars: 0,
    };
  }

  if (score <= 1) {
    return {
      label:
        "Weak password - use at least 8 characters, numbers, and a symbol.",
      color: "text-[#F43F5E]",
      activeBars: 1,
    };
  }

  if (score === 2 || score === 3) {
    return {
      label:
        "Medium strength - add uppercase letters or a symbol to strengthen.",
      color: "text-[#F59E0B]",
      activeBars: 3,
    };
  }

  return {
    label: "Strong password - ready for account setup.",
    color: "text-[#22C55E]",
    activeBars: 4,
  };
}

export default function CompanyRegistrationForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [documents, setDocuments] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [fileInputResetKey, setFileInputResetKey] = useState(0);

  const passwordStrength = useMemo(
    () => getPasswordStrength(form.password),
    [form.password],
  );

  const updateForm = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const updateDocument = (document, file) => {
    setDocuments((current) => ({ ...current, [document]: file }));
  };

  const validateStep = (step) => {
    if (step === 1) {
      const hasAccountDetails =
        form.email &&
        emailRegex.test(form.email) &&
        form.password &&
        form.confirmPassword &&
        form.password === form.confirmPassword &&
        form.password.length >= 8;

      setFormMessage(
        hasAccountDetails
          ? ""
          : "Enter a valid email and make sure the password matches before continuing.",
      );
      return Boolean(hasAccountDetails);
    }

    if (step === 2) {
      const hasIndustry =
        form.industry && (form.industry !== "Other" || form.otherIndustry);
      const hasOrganizationDetails =
        form.organizationName &&
        form.businessType &&
        hasIndustry &&
        form.country &&
        form.city &&
        form.username &&
        form.phone &&
        phoneRegex.test(form.phone) &&
        form.description;

      setFormMessage(
        hasOrganizationDetails
          ? ""
          : "Complete all required organization fields with a valid username and phone number before continuing.",
      );
      return Boolean(hasOrganizationDetails);
    }

    if (step === 3) {
      const hasRequiredDocuments =
        documents["Business Registration Certificate"] &&
        documents["Tax Registration Document (TIN)"];

      setFormMessage(
        hasRequiredDocuments
          ? ""
          : "Upload the business registration certificate and tax registration document.",
      );
      return Boolean(hasRequiredDocuments);
    }

    if (step === 4) {
      const hasRepresentativeDetails =
        form.representativeName &&
        form.representativeTitle &&
        form.representativeUsername &&
        form.representativePhone &&
        phoneRegex.test(form.representativePhone);

      setFormMessage(
        hasRepresentativeDetails
          ? ""
          : "Complete all authorized representative information before continuing.",
      );
      return Boolean(hasRepresentativeDetails);
    }

    return false;
  };

  const goToNextStep = () => {
    if (!validateStep(currentStep)) {
      return;
    }

    setCurrentStep((step) => Math.min(4, step + 1));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateStep(4)) {
      return;
    }

    login("company", form.email);
    navigate("/complete-profile/company");
    setForm(initialForm);
    setDocuments({});
    setShowPassword(false);
    setShowConfirmPassword(false);
    setCurrentStep(1);
    setFileInputResetKey((key) => key + 1);
  };

  return (
    <motion.main
      className="relative h-screen overflow-y-auto bg-[#0B1020] px-5 py-5 text-white sm:px-8 lg:px-12"
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
                {companyRegistrationStepLabels.map((label, index) => (
                  <div key={label} className="min-w-0">
                    <span
                      className={`mb-2 block h-[5px] rounded-full ${
                        index + 1 <= currentStep
                          ? "bg-[#F59E0B] shadow-[0_0_16px_rgba(245,158,11,0.45)]"
                          : "bg-[#1A2438]"
                      }`}
                    />
                    <span
                      className={`block truncate text-[12px] font-semibold ${
                        index + 1 === currentStep
                          ? "text-[#F59E0B]"
                          : "text-[#7F8AA0]"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden space-y-2 whitespace-nowrap text-right text-[12px] text-[#8D99AE] sm:block">
              <p>
                Registering as a student?{" "}
                <Link
                  className="font-semibold text-[#F59E0B]"
                  to="/student-registration"
                >
                  Register Student
                </Link>
              </p>
              <p>
                Already registered?{" "}
                <Link className="font-semibold text-[#9B6CFF]" to="/login">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </header>

        <div className="mt-5 rounded-[18px] border border-amber-400/15 bg-amber-500/[0.06] p-4 text-[13px] text-[#AAB4C3] sm:hidden">
          Registering as a student?{" "}
          <Link className="font-bold text-[#F59E0B]" to="/student-registration">
            Register Student
          </Link>
        </div>

        <form className="py-9" onSubmit={handleSubmit}>
          {currentStep === 2 ? (
            <Section
              step="2"
              title="Organization Information"
              icon={<Building2 size={18} />}
            >
              <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Field
                    label="Organization Name"
                    icon={<Building2 size={17} />}
                    name="organizationName"
                    onChange={updateForm}
                    placeholder="Jumia Inc."
                    required
                    value={form.organizationName}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label required>Business Type</Label>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {companyRegistrationBusinessTypes.map((type) => {
                      const isSelected = form.businessType === type;

                      return (
                        <label
                          key={type}
                          className={`flex h-11 cursor-pointer items-center gap-3 rounded-[22px] border px-4 text-[14px] font-medium transition ${
                            isSelected
                              ? "border-[#F59E0B]/55 bg-amber-500/10 text-[#F8B64C]"
                              : "border-white/[0.04] bg-[#182237]/95 text-[#9AA7BA] hover:border-amber-400/25"
                          }`}
                        >
                          <span
                            className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                              isSelected
                                ? "border-[#F59E0B]"
                                : "border-white/10"
                            }`}
                          >
                            {isSelected ? (
                              <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />
                            ) : null}
                          </span>
                          <input
                            checked={isSelected}
                            className="sr-only"
                            name="businessType"
                            onChange={updateForm}
                            required
                            type="radio"
                            value={type}
                          />
                          {type}
                        </label>
                      );
                    })}
                  </div>
                </div>

                <SelectField
                  label="Industry"
                  name="industry"
                  onChange={updateForm}
                  options={companyRegistrationIndustries}
                  placeholder="Select industry"
                  required
                  value={form.industry}
                />
                <SelectField
                  label="Country"
                  name="country"
                  onChange={updateForm}
                  options={africanCountries}
                  placeholder="Select country"
                  required
                  value={form.country}
                />
                {form.industry === "Other" ? (
                  <Field
                    label="Other Industry"
                    icon={<BriefcaseBusiness size={17} />}
                    name="otherIndustry"
                    onChange={updateForm}
                    placeholder="Enter industry"
                    required
                    value={form.otherIndustry}
                  />
                ) : null}
                <Field
                  label="City"
                  icon={<MapPin size={17} />}
                  name="city"
                  onChange={updateForm}
                  placeholder="Lagos"
                  required
                  value={form.city}
                />
                <Field
                  label="Company Website"
                  icon={<Globe size={17} />}
                  name="website"
                  onChange={updateForm}
                  optional
                  placeholder="https://company.com"
                  type="url"
                  value={form.website}
                />
                <Field
                  label="Organization Username"
                  icon={<AtSign size={17} />}
                  name="username"
                  onChange={updateForm}
                  placeholder="jumia_inc"
                  required
                  value={form.username}
                />
                <Field
                  label="Business Phone Number"
                  icon={<Phone size={17} />}
                  name="phone"
                  onChange={updateForm}
                  placeholder="+234 800 000 0000"
                  required
                  type="tel"
                  value={form.phone}
                />
                <TextAreaField
                  label="Company Description"
                  maxLength={300}
                  name="description"
                  onChange={updateForm}
                  placeholder="Briefly describe your organization, mission, and what kind of challenges you plan to post..."
                  required
                  value={form.description}
                />
              </div>
            </Section>
          ) : null}

          {currentStep === 3 ? (
            <Section
              step="3"
              title="Registration & Verification Documents"
              icon={<FileText size={18} />}
            >
              <p className="mb-5 max-w-[610px] text-[13px] leading-relaxed text-[#9AA7BA]">
                Upload the relevant documents for your business type. All files
                are securely stored and reviewed within 48 hours.
              </p>
              <div className="space-y-3">
                {companyRegistrationDocuments.map((document, index) => (
                  <DocumentUpload
                    file={documents[document]}
                    key={`${document}-${fileInputResetKey}`}
                    onChange={(event) =>
                      updateDocument(document, event.target.files?.[0] || null)
                    }
                    optional={index >= 2}
                    required={index < 2}
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
          ) : null}

          {currentStep === 4 ? (
            <Section
              step="4"
              title="Authorized Representative"
              icon={<Users size={18} />}
            >
              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Full Name"
                  icon={<User size={17} />}
                  name="representativeName"
                  onChange={updateForm}
                  placeholder="Chidi Okeke"
                  required
                  value={form.representativeName}
                />
                <Field
                  label="Job Title"
                  icon={<BriefcaseBusiness size={17} />}
                  name="representativeTitle"
                  onChange={updateForm}
                  placeholder="Head of Talent Acquisition"
                  required
                  value={form.representativeTitle}
                />
                <Field
                  label="Representative Username"
                  icon={<AtSign size={17} />}
                  name="representativeUsername"
                  onChange={updateForm}
                  placeholder="chidi.company"
                  required
                  value={form.representativeUsername}
                />
                <Field
                  label="Phone Number"
                  icon={<Phone size={17} />}
                  name="representativePhone"
                  onChange={updateForm}
                  placeholder="+234 800 000 0000"
                  required
                  type="tel"
                  value={form.representativePhone}
                />
              </div>
              <div className="mt-5 flex gap-3 rounded-[18px] border border-amber-400/15 bg-amber-500/[0.06] p-4 text-[12px] leading-relaxed text-[#9AA7BA]">
                <ShieldCheck
                  className="mt-0.5 shrink-0 text-[#F59E0B]"
                  size={17}
                />
                <p>
                  The authorized representative is legally responsible for all
                  challenges and interactions posted through this account.
                </p>
              </div>
            </Section>
          ) : null}

          {currentStep === 1 ? (
            <Section
              step="1"
              title="Account Information"
              icon={<KeyRound size={18} />}
            >
              <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Field
                    label="Email"
                    icon={<Mail size={17} />}
                    name="email"
                    onChange={updateForm}
                    placeholder="company@example.com"
                    required
                    type="email"
                    value={form.email}
                  />
                </div>
                <Field
                  label="Password"
                  icon={<Lock size={17} />}
                  name="password"
                  onChange={updateForm}
                  placeholder="Create a strong password"
                  required
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  rightIcon={
                    <button
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="transition hover:text-white cursor-pointer"
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
                  name="confirmPassword"
                  onChange={updateForm}
                  optional
                  placeholder="Repeat password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
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
                {[1, 2, 3, 4].map((bar) => (
                  <span
                    className={`h-[5px] rounded-full ${
                      bar <= passwordStrength.activeBars
                        ? bar === 1
                          ? "bg-[#F43F5E]"
                          : bar < 4
                            ? "bg-[#F59E0B]"
                            : "bg-[#22C55E]"
                        : "bg-[#1A2438]"
                    }`}
                    key={bar}
                  />
                ))}
              </div>
              <p
                className={`mt-3 text-[12px] font-semibold ${passwordStrength.color}`}
              >
                {passwordStrength.label}
              </p>

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
                      A 6-digit OTP will be sent to{" "}
                      {form.email || "your official email"} to verify your
                      corporate email.
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-white/[0.06] px-3 py-1 text-[12px] font-medium text-[#9AA7BA]">
                  Pending
                </span>
              </div>

              <div className="mt-6 space-y-4"></div>

              <p className="mt-4 text-center text-[12px] text-[#8D99AE]">
                Account activation takes up to 48 hours after document
                verification.
              </p>
            </Section>
          ) : null}

          {formMessage ? (
            <p className="rounded-[18px] border border-amber-400/15 bg-amber-500/[0.06] p-4 text-[13px] font-semibold text-[#F8D69A]">
              {formMessage}
            </p>
          ) : null}

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {currentStep > 4 ? (
                <button
                  className="flex h-12 w-full items-center justify-center rounded-[24px] bg-[#182237]/95 px-7 text-[14px] font-bold text-white transition hover:bg-white/[0.09] sm:w-auto"
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
                className="flex h-12 items-center justify-center gap-3 rounded-[24px] bg-[#F59E0B] px-8 text-[14px] font-bold text-white shadow-[0_18px_36px_rgba(245,158,11,0.25)] transition hover:bg-[#f7a923]"
                onClick={goToNextStep}
                type="button"
              >
                Next
                <ArrowRight size={18} />
              </button>
            ) : (
              <button
                className="flex h-12 items-center justify-center gap-3 rounded-[24px] bg-[#F59E0B] px-8 text-[14px] font-bold text-white shadow-[0_18px_36px_rgba(245,158,11,0.3)] transition hover:bg-[#f7a923]"
                type="submit"
              >
                Register
                <ArrowRight size={18} />
              </button>
            )}
          </div>
        </form>
      </div>
    </motion.main>
  );
}
