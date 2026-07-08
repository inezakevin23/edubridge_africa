import {
  ChevronRight,
  ClipboardList,
  FileText,
  Plus,
  Sparkles,
  Trophy,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import Topbar from "../layout/Topbar";
import {
  challengeDetailsNavItems,
  challengeDetailsTags,
  challengeDetailsRequirements,
  challengeDetailsFeedback,
  challengeDetailsLeaderboard,
  challengeDetailsApplyRows,
  challengeDetailsCompany,
} from "../../data/challengeDetails";

function HeroCard() {
  return (
    <section className="relative overflow-hidden rounded-[22px] border border-violet-300/10 bg-[radial-gradient(circle_at_88%_18%,rgba(139,92,246,0.34)_0%,transparent_42%),linear-gradient(135deg,#141D30_0%,#171B3A_100%)] p-7 shadow-[0_20px_55px_rgba(0,0,0,0.2)]">
      <div className="flex items-start justify-between gap-5">
        <div className="flex min-w-0 gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-[24px] font-extrabold text-[#1E1B4B]">
            J
          </div>
          <div>
            <p className="text-[13px] text-[#9AA7BA]">Posted by Jumia Inc.</p>
            <h2 className="mt-1 text-[24px] font-extrabold leading-tight text-white md:text-[28px]">
              Supply Chain Optimization Challenge
            </h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {challengeDetailsTags.map((tag, index) => (
                <span
                  className={`rounded-xl px-3 py-1.5 text-[12px] font-semibold ${
                    index === 3
                      ? "bg-violet-500/15 text-[#A879FF]"
                      : "bg-[#0F172A] text-[#AAB4C3]"
                  }`}
                  key={tag}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-emerald-500/10 px-3 py-1.5 text-[12px] font-extrabold text-[#22C55E]">
          OPEN
        </span>
      </div>
      <p className="mt-7 max-w-[720px] text-[15px] leading-7 text-[#AAB4C3]">
        Jumia is Africa's leading e-commerce platform, operating across 11
        countries. We are facing operational inefficiencies in our last-mile
        delivery supply chain that result in increased costs and delayed
        deliveries. We need fresh analytical and strategic perspectives from the
        next generation of African talent.
      </p>
    </section>
  );
}

function Panel({ icon: Icon, title, iconColor = "text-[#8B5CF6]", children }) {
  return (
    <section className="rounded-[22px] border border-white/[0.07] bg-[#131C2E] p-7 shadow-[0_18px_46px_rgba(0,0,0,0.16)]">
      <h2 className="mb-6 flex items-center gap-3 text-[20px] font-extrabold text-white">
        <Icon className={iconColor} size={22} />
        {title}
      </h2>
      {children}
    </section>
  );
}

function ApplyCard() {
  return (
    <aside className="rounded-[22px] border border-white/[0.07] bg-[#131C2E] p-6 shadow-[0_18px_46px_rgba(0,0,0,0.16)]">
      <h2 className="text-[18px] font-extrabold text-white">
        Ready to Compete?
      </h2>
      <div className="mt-5 divide-y divide-white/[0.06]">
        {challengeDetailsApplyRows.map(([label, value, Icon]) => (
          <div
            className="flex items-center justify-between gap-4 py-4"
            key={label}
          >
            <span className="flex items-center gap-3 text-[13px] text-[#9AA7BA]">
              <Icon
                className={label === "Reward" ? "text-[#F59E0B]" : ""}
                size={17}
              />
              {label}
            </span>
            <span
              className={`text-[13px] font-extrabold ${
                label === "Reward" ? "text-[#F59E0B]" : "text-white"
              }`}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
      <button
        className="mt-5 h-12 w-full rounded-2xl bg-[#8B5CF6] text-[14px] font-extrabold text-white shadow-[0_14px_32px_rgba(139,92,246,0.35)]"
        type="button"
      >
        Apply & Start Solving
      </button>
      <Link
        className="mt-3 flex h-11 w-full items-center justify-center rounded-2xl bg-[#1C273A] text-[14px] font-bold text-white"
        to="/challenges/supply-chain-optimization/submit"
      >
        Submit Solution
      </Link>
      <p className="mt-4 text-center text-[12px] text-[#9AA7BA]">
        2 days, 14 hours remaining
      </p>
    </aside>
  );
}

function CompanyCard() {
  return (
    <aside className="rounded-[22px] border border-white/[0.07] bg-[#131C2E] p-6 shadow-[0_18px_46px_rgba(0,0,0,0.16)]">
      <h2 className="text-[16px] font-extrabold text-white">
        About the Company
      </h2>
      <div className="mt-5 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[22px] font-extrabold text-[#1E1B4B]">
          {challengeDetailsCompany.name.charAt(0)}
        </div>
        <div>
          <h3 className="font-extrabold text-white">{challengeDetailsCompany.name}</h3>
          <p className="text-[12px] text-[#9AA7BA]">{challengeDetailsCompany.industry}</p>
        </div>
      </div>
      <p className="mt-5 text-[13px] leading-6 text-[#9AA7BA]">
        {challengeDetailsCompany.description}
      </p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-[#0E1728] p-4 text-center">
          <p className="text-[18px] font-extrabold text-white">{challengeDetailsCompany.challengesPosted}</p>
          <p className="text-[11px] text-[#9AA7BA]">Challenges Posted</p>
        </div>
        <div className="rounded-2xl bg-[#0E1728] p-4 text-center">
          <p className="text-[18px] font-extrabold text-white">{challengeDetailsCompany.averageRating}</p>
          <p className="text-[11px] text-[#9AA7BA]">Avg. Rating</p>
        </div>
      </div>
      <a
        className="mt-5 flex items-center justify-center gap-2 text-[13px] font-extrabold text-[#8B5CF6]"
        href="#"
      >
        View Company Profile
        <ChevronRight size={16} />
      </a>
    </aside>
  );
}

function LeaderboardCard() {
  return (
    <aside className="rounded-[22px] border border-white/[0.07] bg-[#131C2E] p-6 shadow-[0_18px_46px_rgba(0,0,0,0.16)]">
      <h2 className="mb-5 flex items-center gap-2 text-[16px] font-extrabold text-white">
        <Trophy className="text-[#F59E0B]" size={20} />
        Current Leaderboard
      </h2>
      <div className="space-y-4">
        {challengeDetailsLeaderboard.map(([rank, name, score, avatar]) => (
          <div className="flex items-center gap-3" key={name}>
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-extrabold ${
                rank === "1"
                  ? "bg-[#F59E0B] text-white"
                  : "bg-white/[0.07] text-[#9AA7BA]"
              }`}
            >
              {rank}
            </span>
            <img
              alt={name}
              className="h-8 w-8 rounded-full object-cover"
              src={avatar}
            />
            <span className="min-w-0 flex-1 truncate text-[13px] font-bold text-white">
              {name}
            </span>
            <span className="text-[13px] font-extrabold text-[#22C55E]">
              {score}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default function ChallengeDetailsPage() {
  return (
    <DashboardLayout
      navItems={challengeDetailsNavItems}
      activeIndex={1}
      bottomPanel={null}
      topbar={<Topbar />}
    >
      <motion.main
        className="mx-auto max-w-[1180px] px-4 py-8 sm:px-8 lg:px-10"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        <div className="mb-7 flex items-center gap-2 text-[13px] font-semibold text-[#9AA7BA]">
          <span>Challenges</span>
          <ChevronRight size={15} />
          <span className="text-white">Supply Chain Optimization</span>
        </div>

        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-7">
            <HeroCard />

            <Panel icon={FileText} title="Challenge Description">
              <div className="space-y-5 text-[14px] leading-7 text-[#AAB4C3]">
                <p>
                  Participants will analyze Jumia's current delivery network
                  data across Lagos, Nairobi, and Accra, identify key
                  bottlenecks, and propose a data-driven optimization framework
                  that can reduce last-mile delivery costs by at least 20%.
                </p>
                <p>
                  Solutions should include a visual presentation of the problem
                  analysis, a proposed implementation roadmap, and measurable
                  KPIs to track progress. Successful submissions will directly
                  influence Jumia's Q1 2025 logistics strategy.
                </p>
              </div>
            </Panel>

            <Panel
              icon={ClipboardList}
              title="Requirements"
              iconColor="text-[#F59E0B]"
            >
              <div className="space-y-3">
                {challengeDetailsRequirements.map((item, index) => (
                  <div
                    className="flex items-center gap-4 rounded-2xl bg-[#0D1626] p-4 text-[13px] text-[#AAB4C3]"
                    key={item}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-[12px] font-extrabold text-[#8B5CF6]">
                      {index + 1}
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </Panel>

            <Panel icon={Users} title="Team Collaboration">
              <p className="text-[13px] leading-6 text-[#9AA7BA]">
                This challenge supports teams of up to 3 members. Invite
                collaborators by email or username.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <div className="flex -space-x-3">
                  <img
                    alt="Adebayo O."
                    className="h-10 w-10 rounded-full border-2 border-[#131C2E] object-cover"
                    src="https://i.pravatar.cc/100?img=32"
                  />
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#131C2E] bg-[#182237] text-[#8B5CF6]">
                    <Plus size={18} />
                  </div>
                </div>
                <p className="text-[13px] font-semibold text-[#AAB4C3]">
                  Adebayo O., Fatima S. - 1 slot remaining
                </p>
              </div>
              <div className="mt-6 flex gap-3">
                <input
                  className="h-11 min-w-0 flex-1 rounded-full bg-[#0D1626] px-4 text-[13px] text-white placeholder:text-[#8E9AAF] outline-none"
                  placeholder="Invite by username or email..."
                />
                <button
                  className="flex h-11 items-center gap-2 rounded-2xl bg-[#1C273A] px-4 text-[13px] font-bold text-white"
                  type="button"
                >
                  <UserPlus size={16} />
                  Invite
                </button>
              </div>
            </Panel>

            <Panel icon={Sparkles} title="AI Feedback Preview">
              <p className="-mt-5 mb-5 text-[12px] text-[#9AA7BA]">
                Powered by EduBridge AI - instant draft review
              </p>
              <div className="space-y-5">
                {challengeDetailsFeedback.map((item) => (
                  <div
                    className="rounded-2xl bg-[#0D1626] p-4"
                    key={item.label}
                  >
                    <div className="flex items-center justify-between text-[13px] font-extrabold">
                      <span className="text-white">{item.label}</span>
                      <span
                        className={
                          item.color === "bg-[#22C55E]"
                            ? "text-[#22C55E]"
                            : "text-[#F59E0B]"
                        }
                      >
                        {item.score}
                      </span>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#253149]">
                      <div
                        className={`h-full rounded-full ${item.color}`}
                        style={{ width: item.value }}
                      />
                    </div>
                    <p className="mt-3 text-[12px] leading-5 text-[#9AA7BA]">
                      {item.note}
                    </p>
                  </div>
                ))}
              </div>
              <button
                className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-violet-500/14 text-[13px] font-extrabold text-[#A879FF]"
                type="button"
              >
                <Zap size={16} />
                Run Full AI Analysis on My Draft
              </button>
            </Panel>
          </div>

          <div className="space-y-7 lg:sticky lg:top-24 lg:self-start">
            <ApplyCard />
            <CompanyCard />
            <LeaderboardCard />
          </div>
        </div>
      </motion.main>
    </DashboardLayout>
  );
}
