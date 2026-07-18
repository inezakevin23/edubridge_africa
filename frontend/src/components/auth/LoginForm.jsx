import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Mail, Lock, ArrowRight, Eye, EyeOff, Check } from "lucide-react";

import UserToggle from "./UserToggle";
import AuthInput from "./AuthInput";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../services/authService";

export default function LoginForm() {
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get("email") || "";
    const password = formData.get("password") || "";

    try {
      const response = await loginUser({ email, password });
      const tokens = response?.tokens || response?.data?.tokens || null;
      if (tokens?.access) {
        localStorage.setItem("edubridge_access_token", tokens.access);
      }
      if (tokens?.refresh) {
        localStorage.setItem("edubridge_refresh_token", tokens.refresh);
      }

      await login(
        role === "student" ? "intern" : "company",
        email,
        response?.user ||
          response?.data?.user || {
            role: role === "student" ? "intern" : "company",
            email,
          },
      );
      navigate(role === "company" ? "/company-dashboard" : "/dashboard");
    } catch (error) {
      setErrorMessage(error.message || "Unable to sign in right now.");
    }
  };

  return (
    <motion.section
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12 lg:px-10"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.8,
        delay: 0.15,
      }}
    >
      <div className="absolute right-[-130px] top-[-70px] h-[560px] w-[560px] rounded-full bg-violet-700/[0.08] blur-[130px]" />
      <div className="absolute right-[120px] top-[120px] h-[340px] w-[340px] rounded-full bg-violet-700/[0.04] blur-[95px]" />

      <form
        className="relative z-10 w-full max-w-[560px]"
        onSubmit={handleSubmit}
      >
        <h1 className="text-[40px] font-extrabold leading-tight tracking-normal">
          Welcome back
        </h1>

        <p className="mt-3 text-[21px] leading-none text-[#9AA7BA]">
          Sign in to your EduBridge account
        </p>

        <div className="mt-[56px]">
          <UserToggle role={role} setRole={setRole} />
        </div>

        <div className="mt-11">
          <label className="mb-3 block text-[16px] font-semibold text-white">
            Email Address
          </label>

          <AuthInput
            name="email"
            icon={<Mail size={20} />}
            type="email"
            placeholder="you@example.com"
          />
        </div>

        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <label className="text-[16px] font-semibold text-white">
              Password
            </label>

            <a className="text-[15px] font-medium text-[#9B6CFF]" href="#">
              Forgot password?
            </a>
          </div>

          <AuthInput
            name="password"
            type={showPassword ? "text" : "password"}
            icon={<Lock size={20} />}
            placeholder="••••••••"
            rightIcon={
              <button
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="text-[#9AA7BA] transition hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
                type="button"
              >
                {showPassword ? <EyeOff size={21} /> : <Eye size={21} />}
              </button>
            }
          />
        </div>

        {errorMessage ? (
          <p className="mt-5 rounded-[20px] border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-[14px] font-semibold text-rose-200">
            {errorMessage}
          </p>
        ) : null}

        <div className="mt-7 flex items-center gap-4 text-[17px] text-[#A6B1C4]">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg border-2 border-[#8B5CF6] bg-violet-500/10 text-[#8B5CF6]">
            <Check size={16} strokeWidth={3} />
          </span>
          <span>Keep me signed in</span>
        </div>

        <button
          type="submit"
          className="mt-7 flex h-[62px] w-full items-center justify-center gap-3 rounded-[28px] bg-[#8B5CF6] text-[18px] font-semibold text-white shadow-[0_18px_32px_rgba(76,29,149,0.45)] transition hover:bg-[#9568ff]"
        >
          Sign In
          <ArrowRight size={20} />
        </button>

        <div className="my-7 flex items-center gap-5 text-[14px] text-[#8C98AB]">
          <span className="h-px flex-1 bg-white/10" />
          <span>or continue with</span>
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            type="button"
            className="flex h-[58px] items-center justify-center gap-3 rounded-[28px] border border-white/5 bg-[#182237] text-[17px] font-semibold text-white transition hover:bg-[#202B43]"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-[15px] font-bold leading-none">
              G
            </span>
            Google
          </button>

          <button
            type="button"
            className="flex h-[58px] items-center justify-center gap-3 rounded-[28px] border border-white/5 bg-[#182237] text-[17px] font-semibold text-white transition hover:bg-[#202B43]"
          >
            <span className="text-[24px] font-extrabold leading-none">in</span>
            LinkedIn
          </button>
        </div>

        <p className="mt-11 text-center text-[16px] text-[#9AA7BA]">
          Don't have an account?{" "}
          <Link className="font-semibold text-[#9B6CFF]" to="/register">
            Create one — it's free
          </Link>
        </p>
      </form>
    </motion.section>
  );
}
