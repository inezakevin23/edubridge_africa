import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import ChallengeCard from "../challenges/ChallengeCard";
import { useEffect, useState } from "react";
import { fetchChallenges } from "../../services/challengeService";

export default function LatestChallenges() {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    let mounted = true;
    fetchChallenges({ page: 1 })
      .then((list) => {
        if (!mounted) return;
        setChallenges(list.slice(0, 3));
      })
      .catch(() => {
        if (mounted) setChallenges([]);
      });
    return () => (mounted = false);
  }, []);

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/12 px-4 py-2 text-[13px] font-extrabold text-[#A879FF]">
              <Sparkles size={16} />
              Latest Opportunities
            </span>
            <h2 className="text-[32px] font-extrabold leading-tight text-white md:text-[42px]">
              Challenges interns can solve now
            </h2>
            <p className="mt-3 max-w-2xl text-[16px] leading-7 text-[#9AA7BA]">
              Explore fresh real-world briefs from partner companies and start
              building proof of your skills.
            </p>
          </div>
          <Link
            className="flex h-12 w-fit items-center gap-2 rounded-full bg-[#8B5CF6] px-5 text-[14px] font-extrabold text-white shadow-[0_14px_30px_rgba(139,92,246,0.3)] transition hover:bg-[#9568ff]"
            to="/challenges"
          >
            Browse all
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {challenges.map((challenge) => (
            <ChallengeCard
              challenge={challenge}
              compact
              key={challenge.id || challenge.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
