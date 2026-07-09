import { Star } from "lucide-react";
import { motion } from "framer-motion";
import EduBridgeLogo from "../layout/Logo";

export default function StudentRegistrationLeft() {
  return (
    <motion.aside
      className="relative hidden min-h-screen overflow-hidden bg-[linear-gradient(120deg,#20194E_0%,#162338_52%,#0F172A_100%)] px-8 py-10 lg:flex lg:flex-col lg:px-[53px] lg:py-14"
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
    >
      <div className="relative z-10 flex items-center gap-3">
        <EduBridgeLogo />
      </div>

      <div className="relative z-10 mt-auto pb-12">
        <h2 className="max-w-[430px] text-[29px] font-extrabold leading-[1.18] tracking-normal">
          Your Career Passport Starts Here
        </h2>
        <p className="mt-8 max-w-[420px] text-[17px] leading-[1.65] text-[#A6B1C4]">
          Create your profile, solve real challenges, and get hired by Africa's
          top companies.
        </p>

        <div className="mt-12 grid max-w-[410px] grid-cols-3 gap-8">
          {[
            ["10K+", "Students"],
            ["500+", "Companies"],
            ["2M+", "In Opportunities"],
          ].map(([value, label]) => (
            <div key={value}>
              <h3 className="text-[25px] font-extrabold leading-none text-[#F59E0B]">
                {value}
              </h3>
              <p className="mt-2 text-[13px] text-[#A6B1C4]">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 rounded-[16px] border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/10 backdrop-blur-xl">
        <div className="mb-4 flex gap-1">
          {[...Array(5)].map((_, index) => (
            <Star key={index} size={15} fill="#F59E0B" color="#F59E0B" />
          ))}
        </div>
        <p className="text-[15px] leading-[1.6] text-white">
          "EduBridge helped me land a role at Flutterwave right after
          graduation. My reputation passport did the talking."
        </p>
        <div className="mt-5 flex items-center gap-3">
          <img
            alt="Amina Bello"
            className="h-10 w-10 rounded-full border border-white/20 object-cover"
            src="https://i.pravatar.cc/100?img=32"
          />
          <div>
            <h3 className="text-[14px] font-bold leading-tight">Amina Bello</h3>
            <p className="mt-1 text-[12px] text-[#A6B1C4]">
              Product Designer, Flutterwave
            </p>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
