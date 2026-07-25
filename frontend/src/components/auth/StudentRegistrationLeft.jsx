import { motion } from "framer-motion";
import EduBridgeLogo from "../layout/Logo";

export default function StudentRegistrationLeft() {
  return (
    <motion.aside
      className="relative hidden min-h-screen overflow-hidden bg-[linear-gradient(120deg,#20194E_0%,#162338_52%,#0F172A_100%)] px-8 py-10 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:px-[53px] lg:py-14"
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
      </div>
    </motion.aside>
  );
}
