import { ArrowRight, Banknote, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";

export default function ChallengeCard({ challenge, compact = false }) {
  return (
    <article
      className={`group flex flex-col rounded-[20px] border border-white/[0.07] bg-[linear-gradient(135deg,#111A2C_0%,#171B38_100%)] p-6 shadow-[0_18px_45px_rgba(0,0,0,0.18)] transition hover:-translate-y-1 hover:border-violet-400/25 hover:shadow-[0_24px_65px_rgba(0,0,0,0.26)] ${
        compact ? "min-h-[270px]" : "min-h-[292px]"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[17px] font-extrabold ${challenge.color}`}
          >
            {challenge.initials}
          </div>
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-[16px] font-extrabold leading-snug text-white">
              {challenge.title}
            </h3>
            <p className="mt-1 truncate text-[13px] text-[#9AA7BA]">
              {challenge.company}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {challenge.tags.map((tag) => (
          <span
            className="rounded-xl border border-white/[0.05] bg-[#0F172A] px-3 py-1.5 text-[12px] font-semibold text-[#AAB4C3]"
            key={tag}
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-white/[0.07] pt-5">
        <div className="flex items-center gap-2 text-[15px] font-extrabold text-[#F59E0B]">
          <Banknote size={18} />
          {challenge.cash_prize ? `Cash prize: ${challenge.cash_prize}` : "No cash prize"}
        </div>
        <div className="flex items-center gap-3 text-[12px] font-semibold text-[#9AA7BA]">
          <span className="flex items-center gap-1">
            <Clock3 size={15} />
            {challenge.time}
          </span>
        </div>
      </div>

      <Link
        className="mt-5 flex h-10 items-center justify-center gap-2 rounded-2xl border border-violet-400/10 bg-violet-500/12 text-[13px] font-extrabold text-[#A879FF] transition group-hover:bg-violet-500/18"
        to={`/challenges/${challenge.slug}`}
      >
        View Challenge
        <ArrowRight size={16} />
      </Link>
    </article>
  );
}
