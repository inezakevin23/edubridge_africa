import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import NotificationMenu from "./NotificationMenu";

export default function CompanyTopbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/[0.07] bg-[#0B1020]/92 px-4 py-4 backdrop-blur-xl sm:px-8 xl:px-10">
      <div className="mx-auto flex max-w-[1500px] items-center justify-start gap-4">
        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden sm:block"><NotificationMenu tone="violet" /></div>
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
