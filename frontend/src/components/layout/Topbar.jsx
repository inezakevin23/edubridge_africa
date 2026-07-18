import { Trophy } from "lucide-react";
import NotificationMenu from "./NotificationMenu";

export default function Topbar({ scorePoints = "842" }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/[0.07] bg-[#0B1020]/92 px-4 py-4 backdrop-blur-xl sm:px-8 xl:px-10">
      <div className="mx-auto flex max-w-[1500px] items-center justify-start gap-4">
        <div className="flex shrink-0 items-center gap-4">
          <div className="hidden sm:block"><NotificationMenu /></div>
          <div className="flex h-11 items-center gap-2 rounded-full bg-[#182237] px-5 text-[15px] font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <Trophy className="text-[#F59E0B]" size={18} />
            {scorePoints} Score Points
          </div>
        </div>
      </div>
    </header>
  );
}
