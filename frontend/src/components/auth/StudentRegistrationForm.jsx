import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  AtSign,
  BookOpen,
  Briefcase,
  Building2,
  ChevronDown,
  Eye,
  EyeOff,
  GraduationCap,
  Image,
  KeyRound,
  Link as LinkIcon,
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
import useAuth from "../../context/useAuth";
import {
  africanCountries,
  graduationYears,
  studentRegistrationStepLabels,
  studentRegistrationStatusOptions,
  studentRegistrationSkills,
} from "../../data/studentRegistration";
import { registerStudent } from "../../services/authService";

const stepLabels = studentRegistrationStepLabels;
const statusOptions = studentRegistrationStatusOptions;
const starterSkills = studentRegistrationSkills;
const genderOptions = ["Male", "Female"];
const emailPattern = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$";
const phonePattern = "^\\+?[0-9\\s()-]{7,20}$";
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
      <span className="flex h-12 items-center gap-3 rounded-[24px] border border-white/[0.04] bg-[#182237]/95 px-4 text-[#93A0B5] shadow-inner shadow-white/[0.02] transition focus-within:border-violet-400/60 focus-within:ring-2 focus-within:ring-violet-500/20">
        {icon ? <span className="shrink-0">{icon}</span> : null}
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
      <span className="flex h-12 items-center gap-3 rounded-[24px] border border-white/[0.04] bg-[#182237]/95 px-4 text-[#93A0B5] shadow-inner shadow-white/[0.02] transition focus-within:border-violet-400/60 focus-within:ring-2 focus-within:ring-violet-500/20">
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

function FileUpload({
  accept,
  fileName,
  helper,
  label,
  onChange,
  preview,
  required,
  title,
}) {
  return (
    <label className="block">
      <Label required={required}>{label}</Label>
      <span className="flex min-h-[168px] cursor-pointer flex-col items-center justify-center rounded-[22px] border border-dashed border-white/10 bg-[#0F172A]/45 px-5 py-8 text-center transition hover:border-violet-400/45">
        {preview ? (
          <img
            alt="Profile preview"
            className="mb-4 h-20 w-20 rounded-full border border-white/10 object-cover"
            src={preview}
          />
        ) : (
          <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.06] text-[#A6B1C4]">
            {accept.includes("image") ? (
              <Image size={24} />
            ) : (
              <UploadCloud size={24} />
            )}
          </span>
        )}
        <span className="text-[14px] font-semibold text-white">
          {fileName || title}
        </span>
        <span className="mt-1 text-[12px] text-[#8D99AE]">{helper}</span>
        <span className="mt-5 inline-flex h-10 items-center rounded-[20px] bg-white/[0.08] px-5 text-[13px] font-bold text-white transition hover:bg-white/[0.12]">
          Choose File
        </span>
        <input
          accept={accept}
          className="sr-only"
          onChange={onChange}
          required={required}
          type="file"
        />
      </span>
    </label>
  );
}

const initialForm = {
  fullName: "",
  username: "",
  email: "",
  phone: "",
  country: "",
  city: "",
  dateOfBirth: "",
  gender: "",
  currentStatus: "Student",
  institution: "",
  fieldOfStudy: "",
  graduationYear: "",
  yearsOfExperience: "",
  portfolio: "",
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
    label: "Strong password - nice and sturdy.",
    color: "text-[#22C55E]",
    activeBars: 4,
  };
}

export default function StudentRegistrationForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState(starterSkills);
  const [skillInput, setSkillInput] = useState("");
  const [idFile, setIdFile] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [profilePreview, setProfilePreview] = useState("");
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

  const addSkill = () => {
    const skill = skillInput.trim();

    if (!skill || selectedSkills.includes(skill)) {
      setSkillInput("");
      return;
    }

    setSelectedSkills((current) => [...current, skill]);
    setSkillInput("");
  };

  const removeSkill = (skill) => {
    setSelectedSkills((current) => current.filter((item) => item !== skill));
  };

  const handleProfileUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setProfilePic(file);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      setProfilePreview(result);
      localStorage.setItem("edubridgeStudentProfilePic", result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateStep(4)) {
      return;
    }

    try {
      const payload = {
        ...form,
        skills: selectedSkills.join(", "),
        profile_picture: profilePic,
        national_or_student_id_document: idFile,
      };

      const response = await registerStudent(payload);
      const tokens = response?.tokens || response?.data?.tokens || null;
      if (tokens?.access) {
        localStorage.setItem("edubridge_access_token", tokens.access);
      }
      if (tokens?.refresh) {
        localStorage.setItem("edubridge_refresh_token", tokens.refresh);
      }

      localStorage.setItem("edubridgeStudentName", form.fullName);
      if (profilePreview) {
        localStorage.setItem("edubridgeStudentProfilePic", profilePreview);
      }
      await login(
        "intern",
        form.email,
        response?.user ||
          response?.data?.user || { role: "intern", email: form.email },
      );
      navigate("/complete-profile/intern");
      setForm(initialForm);
      setSelectedSkills([]);
      setSkillInput("");
      setIdFile(null);
      setProfilePic(null);
      setProfilePreview("");
      setShowPassword(false);
      setShowConfirmPassword(false);
      setCurrentStep(1);
      setFileInputResetKey((key) => key + 1);
    } catch (error) {
      setFormMessage(error.message || "Registration failed. Please try again.");
    }
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
          : "Enter a valid email and make sure the password matches the confirmation.",
      );
      return Boolean(hasAccountDetails);
    }

    if (step === 2) {
      const hasRequiredDetails =
        form.fullName &&
        form.username &&
        form.phone &&
        phoneRegex.test(form.phone) &&
        form.country &&
        form.city &&
        form.dateOfBirth &&
        form.gender;

      setFormMessage(
        hasRequiredDetails
          ? ""
          : "Complete all required personal fields with a valid username and phone number before continuing.",
      );
      return Boolean(hasRequiredDetails);
    }

    if (step === 3) {
      const hasProfessionalDetails =
        form.currentStatus && selectedSkills.length > 0;

      setFormMessage(
        hasProfessionalDetails
          ? ""
          : "Select your current status and add at least one skill.",
      );
      return Boolean(hasProfessionalDetails);
    }

    if (step === 4) {
      const hasVerificationFiles = idFile && profilePic;
      setFormMessage(
        hasVerificationFiles
          ? ""
          : "Upload your PDF ID and profile picture to complete registration.",
      );
      return Boolean(hasVerificationFiles);
    }

    return false;
  };

  const goToNextStep = () => {
    if (!validateStep(currentStep)) {
      return;
    }

    setCurrentStep((step) => Math.min(4, step + 1));
  };

  return (
    <motion.main
      className="relative h-screen overflow-y-auto bg-[#0B1020] px-5 py-5 text-white sm:px-8 lg:px-12"
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
                        index + 1 <= currentStep
                          ? "bg-[#8B5CF6] shadow-[0_0_16px_rgba(139,92,246,0.5)]"
                          : "bg-[#1A2438]"
                      }`}
                    />
                    <span
                      className={`block truncate text-[12px] font-semibold ${
                        index + 1 === currentStep
                          ? "text-[#9B6CFF]"
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
                Registering a company?{" "}
                <Link
                  className="font-semibold text-[#9B6CFF]"
                  to="/company-registration"
                >
                  Register Company
                </Link>
              </p>
              <p>
                Already have an account?{" "}
                <Link className="font-semibold text-[#9B6CFF]" to="/login">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </header>

        <div className="mt-5 rounded-[18px] border border-violet-400/15 bg-violet-500/[0.06] p-4 text-[13px] text-[#AAB4C3] sm:hidden">
          Registering a company?{" "}
          <Link className="font-bold text-[#B894FF]" to="/company-registration">
            Register Company
          </Link>
        </div>

        <form className="py-9" onSubmit={handleSubmit}>
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
                    placeholder="you@example.com"
                    required
                    type="email"
                    pattern={emailPattern}
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
                  name="confirmPassword"
                  onChange={updateForm}
                  placeholder="Repeat password"
                  required
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
            </Section>
          ) : null}

          {currentStep === 2 ? (
            <Section
              step="2"
              title="Personal Information"
              icon={<User size={18} />}
            >
              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Full Name"
                  icon={<User size={17} />}
                  name="fullName"
                  onChange={updateForm}
                  placeholder="Adebayo Oladipo"
                  required
                  value={form.fullName}
                />
                <Field
                  label="Username"
                  icon={<AtSign size={17} />}
                  name="username"
                  onChange={updateForm}
                  placeholder="adebayo_o"
                  required
                  value={form.username}
                />
                <Field
                  label="Phone Number"
                  icon={<Phone size={17} />}
                  name="phone"
                  onChange={updateForm}
                  pattern={phonePattern}
                  placeholder="+234 800 000 0000"
                  required
                  type="tel"
                  value={form.phone}
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
                  label="Date of Birth"
                  name="dateOfBirth"
                  onChange={updateForm}
                  required
                  type="date"
                  value={form.dateOfBirth}
                />
                <div className="md:col-span-2">
                  <SelectField
                    label="Gender"
                    name="gender"
                    onChange={updateForm}
                    options={genderOptions}
                    placeholder="Select gender"
                    required
                    value={form.gender}
                  />
                </div>
              </div>
            </Section>
          ) : null}

          {currentStep === 3 ? (
            <Section
              step="3"
              title="Professional Information"
              icon={<Briefcase size={18} />}
            >
              <div className="mb-5">
                <Label required>Current Status</Label>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {statusOptions.map((status) => {
                    const isSelected = form.currentStatus === status;

                    return (
                      <label
                        key={status}
                        className={`flex h-11 cursor-pointer items-center gap-3 rounded-[22px] border px-4 text-[14px] font-medium transition ${
                          isSelected
                            ? "border-[#8B5CF6]/55 bg-violet-500/15 text-[#B894FF]"
                            : "border-white/[0.04] bg-[#182237]/95 text-[#9AA7BA] hover:border-violet-400/25"
                        }`}
                      >
                        <span
                          className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                            isSelected ? "border-[#8B5CF6]" : "border-white/10"
                          }`}
                        >
                          {isSelected ? (
                            <span className="h-2 w-2 rounded-full bg-[#8B5CF6]" />
                          ) : null}
                        </span>
                        <input
                          checked={isSelected}
                          className="sr-only"
                          name="currentStatus"
                          onChange={updateForm}
                          required
                          type="radio"
                          value={status}
                        />
                        {status}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Institution / University"
                  icon={<Building2 size={17} />}
                  name="institution"
                  onChange={updateForm}
                  optional
                  placeholder="University of Lagos"
                  value={form.institution}
                />
                <Field
                  label="Field of Study"
                  icon={<BookOpen size={17} />}
                  name="fieldOfStudy"
                  onChange={updateForm}
                  optional
                  placeholder="Computer Science"
                  value={form.fieldOfStudy}
                />
                <SelectField
                  label="Graduation Year"
                  name="graduationYear"
                  onChange={updateForm}
                  optional
                  options={graduationYears}
                  placeholder="Select year"
                  value={form.graduationYear}
                />
                <Field
                  label="Years of Experience"
                  icon={<Briefcase size={17} />}
                  name="yearsOfExperience"
                  onChange={updateForm}
                  optional
                  placeholder="e.g. 2"
                  type="number"
                  value={form.yearsOfExperience}
                />
                <div className="md:col-span-2">
                  <Label required>Skills</Label>
                  <div className="min-h-[112px] rounded-[22px] border border-white/[0.04] bg-[#182237]/95 p-4">
                    <div className="flex flex-wrap gap-2">
                      {selectedSkills.map((skill) => (
                        <button
                          className="inline-flex h-8 items-center gap-2 rounded-full bg-violet-500/15 px-3 text-[12px] font-semibold text-[#B894FF]"
                          key={skill}
                          onClick={() => removeSkill(skill)}
                          type="button"
                        >
                          {skill}
                          <X size={13} />
                        </button>
                      ))}
                    </div>
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                      <input
                        className="h-10 min-w-0 flex-1 rounded-[20px] bg-[#0F172A]/75 px-4 text-[13px] text-white placeholder:text-[#8E9AAF] outline-none ring-1 ring-white/[0.04] focus:ring-violet-400/45"
                        onChange={(event) => setSkillInput(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            addSkill();
                          }
                        }}
                        placeholder="Add skill..."
                        value={skillInput}
                      />
                      <button
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-[20px] bg-white/[0.08] px-4 text-[13px] font-bold text-white transition hover:bg-white/[0.12]"
                        onClick={addSkill}
                        type="button"
                      >
                        <Plus size={15} />
                        Add
                      </button>
                    </div>
                    {selectedSkills.length === 0 ? (
                      <p className="mt-3 text-[12px] text-[#F43F5E]">
                        Add at least one skill to continue.
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <Field
                    label="Portfolio Website"
                    icon={<LinkIcon size={17} />}
                    name="portfolio"
                    onChange={updateForm}
                    optional
                    placeholder="https://yourportfolio.com"
                    type="url"
                    value={form.portfolio}
                  />
                </div>
              </div>
            </Section>
          ) : null}

          {currentStep === 3 ? (
            <Section
              step="3"
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
                    placeholder="you@example.com"
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
                  name="confirmPassword"
                  onChange={updateForm}
                  placeholder="Repeat password"
                  required
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
            </Section>
          ) : null}

          {currentStep === 4 ? (
            <Section
              step="4"
              title="Verification"
              icon={<ShieldCheck size={18} />}
            >
              <div className="grid gap-5 md:grid-cols-2">
                <FileUpload
                  accept="application/pdf"
                  fileName={idFile?.name}
                  helper="PDF only - max 5MB"
                  key={`id-${fileInputResetKey}`}
                  label="National ID or Student ID"
                  onChange={(event) =>
                    setIdFile(event.target.files?.[0] || null)
                  }
                  required
                  title="Upload a PDF ID document"
                />
                <FileUpload
                  accept="image/png,image/jpeg,image/jpg"
                  fileName={profilePic?.name}
                  helper="PNG or JPG - max 5MB"
                  key={`profile-${fileInputResetKey}`}
                  label="Profile Picture"
                  onChange={handleProfileUpload}
                  preview={profilePreview}
                  required
                  title="Upload your profile photo"
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
                      A 6-digit OTP will be sent to {form.email || "your email"}{" "}
                      once you submit.
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-white/[0.06] px-3 py-1 text-[12px] font-medium text-[#9AA7BA]">
                  Pending
                </span>
              </div>

              <p className="mt-4 text-center text-[12px] text-[#8D99AE]">
                By registering, you agree to our Terms of Service and Privacy
                Policy.
              </p>
            </Section>
          ) : null}

          {formMessage ? (
            <p className="rounded-[18px] border border-violet-400/15 bg-violet-500/[0.06] p-4 text-[13px] font-semibold text-[#C9B8FF]">
              {formMessage}
            </p>
          ) : null}

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {currentStep > 3 ? (
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

            {currentStep < 3 ? (
              <button
                className="flex h-12 items-center justify-center gap-3 rounded-[24px] bg-[#8B5CF6] px-8 text-[14px] font-bold text-white shadow-[0_18px_36px_rgba(76,29,149,0.36)] transition hover:bg-[#9568ff]"
                onClick={goToNextStep}
                type="button"
              >
                Next
                <ArrowRight size={18} />
              </button>
            ) : (
              <button
                className="flex h-12 items-center justify-center gap-3 rounded-[24px] bg-[#8B5CF6] px-8 text-[14px] font-bold text-white shadow-[0_18px_36px_rgba(76,29,149,0.48)] transition hover:bg-[#9568ff]"
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
