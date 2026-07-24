import { motion } from "framer-motion";
import EduBridgeLogo from "../layout/Logo";

export default function LoginLeft() {
  return (
    <motion.section
      className="relative overflow-hidden bg-[#182236]/90 px-8 py-10 sm:px-12 lg:min-h-screen lg:px-[53px] lg:py-14"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.8,
      }}
    >
      <div className="absolute -left-56 -top-64 h-[720px] w-[720px] rounded-full bg-violet-600/20 blur-[150px]" />

      <div className="absolute bottom-[-140px] right-[-190px] h-[560px] w-[560px] rounded-full bg-indigo-700/10 blur-[140px]" />
      <div className="absolute -left-56 -top-56 h-[600px] w-[600px] rounded-full bg-violet-700/20 blur-[120px]" />

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <EduBridgeLogo />
        </div>

        <h2 className="mt-[86px] max-w-[510px] text-[44px] font-extrabold leading-[1.22] tracking-normal sm:text-[48px]">
          Build Your Future
          <br />
          with Real Challenges
        </h2>

        <p className="mt-9 max-w-[500px] text-[20px] leading-[1.55] text-[#A6B1C4]">
          Join thousands of African students and companies solving real problems
          together.
        </p>
      </div>
    </motion.section>
  );
}
