import { Bell, Flame } from "lucide-react";

export default function Topbar({ xp = "2,450 XP" }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/[0.07] bg-[#0B1020]/92 px-4 py-4 backdrop-blur-xl sm:px-8 xl:px-10">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4">
        <div className="flex shrink-0 items-center gap-4">
          <button
            aria-label="Notifications"
            className="relative hidden h-11 w-11 items-center justify-center rounded-full text-[#B5C0D2] transition hover:bg-white/[0.06] hover:text-white sm:flex"
            type="button"
          >
            <Bell size={21} />
            <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-[#F59E0B]" />
          </button>
          <div className="flex h-11 items-center gap-2 rounded-full bg-[#182237] px-5 text-[15px] font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <Flame className="text-[#F59E0B]" size={18} />
            {xp}
          </div>
        </div>
      </div>
    </header>
  );
}
