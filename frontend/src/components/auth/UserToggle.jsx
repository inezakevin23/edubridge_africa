import { GraduationCap, Building2 } from "lucide-react";

export default function UserToggle({ role, setRole }) {
  return (
    <div className="flex h-[58px] rounded-[28px] border border-white/5 bg-[#1A2338]/90 p-1 shadow-inner shadow-black/20">
      <button
        type="button"
        onClick={() => setRole("student")}
        className={`flex flex-1 items-center justify-center gap-3 rounded-[22px] text-[17px] font-medium transition
          ${
            role === "student"
              ? "bg-[#8B5CF6] text-white shadow-lg shadow-violet-950/30"
              : "text-[#9AA7BA] hover:text-white"
          }`}
      >
        <GraduationCap size={18} />
        Student
      </button>

      <button
        type="button"
        onClick={() => setRole("company")}
        className={`flex flex-1 items-center justify-center gap-3 rounded-[22px] text-[17px] font-medium transition
          ${
            role === "company"
              ? "bg-[#8B5CF6] text-white shadow-lg shadow-violet-950/30"
              : "text-[#9AA7BA] hover:text-white"
          }`}
      >
        <Building2 size={18} />
        Company
      </button>
    </div>
  );
}
