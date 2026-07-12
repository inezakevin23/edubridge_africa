import { Bell, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function CompanyTopbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/[0.07] bg-[#0B1020]/92 px-4 py-4 backdrop-blur-xl sm:px-8 xl:px-10">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4">
        <div className="flex shrink-0 items-center gap-3">
          <button
            aria-label="Notifications"
            className="relative hidden h-11 w-11 items-center justify-center rounded-full text-[#B5C0D2] transition hover:bg-white/[0.06] hover:text-white sm:flex"
            type="button"
          >
            <Bell size={21} />
            <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-[#8B5CF6]" />
          </button>
          <Link
            className="flex h-11 items-center gap-2 rounded-full bg-[#182237] px-5 text-[14px] font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:bg-[#22304A]"
            to="/create-challenge"
          >
            <Plus className="text-[#9B6CFF]" size={18} />
            Post Challenge
          </Link>
        </div>
      </div>
    </header>
  );
}
