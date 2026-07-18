import {
  ChevronRight,
  ClipboardList,
  FileText,
  Plus,
  UserPlus,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, Navigate, useParams } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import Topbar from "../layout/Topbar";
import { studentDashboardNavItems } from "../../data/studentDashboard";
import { fetchChallengeBySlug } from "../../services/challengeService";

function HeroCard({ challenge }) {
  return (
    <section className="relative overflow-hidden rounded-[22px] border border-violet-300/10 bg-[radial-gradient(circle_at_88%_18%,rgba(139,92,246,0.34)_0%,transparent_42%),linear-gradient(135deg,#141D30_0%,#171B3A_100%)] p-7 shadow-[0_20px_55px_rgba(0,0,0,0.2)]">
      <div className="flex items-start justify-between gap-5">
        <div className="flex min-w-0 gap-4">
          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-[24px] font-extrabold ${challenge.color}`}
          >
            {challenge.initials}
          </div>
          <div>
            <p className="text-[13px] text-[#9AA7BA]">
              Posted by {challenge.company.legalName}
            </p>
            <h2 className="mt-1 text-[24px] font-extrabold leading-tight text-white md:text-[28px]">
              {challenge.title}
            </h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {[...challenge.tags, challenge.level].map((tag, index) => (
                <span
                  className={`rounded-xl px-3 py-1.5 text-[12px] font-semibold ${
                    index === challenge.tags.length
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
      </div>
      <p className="mt-7 max-w-[720px] text-[15px] leading-7 text-[#AAB4C3]">
        {challenge.description}
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

function ApplyCard({ challenge }) {
  const applyRows = [
    [
      "Reward",
      challenge.cash_prize ? `$${challenge.cash_prize}` : "No cash prize",
      ChevronRight,
    ],
    ["Deadline", challenge.deadline || "Flexible", ClipboardList],
    ["Format", challenge.level || "Open", FileText],
  ];

  return (
    <aside className="rounded-[22px] border border-white/[0.07] bg-[#131C2E] p-6 shadow-[0_18px_46px_rgba(0,0,0,0.16)]">
      <h2 className="text-[18px] font-extrabold text-white">
        Ready to Compete?
      </h2>
      <div className="mt-5 divide-y divide-white/[0.06]">
        {applyRows.map(([label, value, Icon]) => (
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
      <Link
        className="mt-5 flex h-12 w-full items-center justify-center rounded-2xl bg-[#8B5CF6] text-[14px] font-extrabold text-white shadow-[0_14px_32px_rgba(139,92,246,0.35)]"
        to={`/challenges/${challenge.slug}/submit`}
      >
        Submit Solution
      </Link>
      <p className="mt-4 text-center text-[12px] text-[#9AA7BA]">
        {challenge.time}
      </p>
    </aside>
  );
}

function CompanyCard({ company }) {
  return (
    <aside className="rounded-[22px] border border-white/[0.07] bg-[#131C2E] p-6 shadow-[0_18px_46px_rgba(0,0,0,0.16)]">
      <h2 className="text-[16px] font-extrabold text-white">
        About the Company
      </h2>
      <div className="mt-5 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[22px] font-extrabold text-[#1E1B4B]">
          {company.name.charAt(0)}
        </div>
        <div>
          <h3 className="font-extrabold text-white">{company.name}</h3>
          <p className="text-[12px] text-[#9AA7BA]">{company.industry}</p>
        </div>
      </div>
      <p className="mt-5 text-[13px] leading-6 text-[#9AA7BA]">
        {company.description}
      </p>
    </aside>
  );
}

export default function ChallengeDetailsPage() {
  const [invitee, setInvitee] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();

  useEffect(() => {
    let mounted = true;
    fetchChallengeBySlug(slug).then((data) => {
      if (mounted) {
        setChallenge(data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) {
    return <p className="p-8 text-white">Loading challenge details...</p>;
  }

  if (!challenge) {
    return <Navigate to="/challenges" replace />;
  }

  return (
    <DashboardLayout
      navItems={studentDashboardNavItems}
      activeIndex={2}
      bottomPanel={null}
      topbar={<Topbar />}
      workspace="student"
    >
      <motion.main
        className="mx-auto max-w-[1180px] px-4 py-8 sm:px-8 lg:px-10"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        <div className="mb-7 flex items-center gap-2 text-[13px] font-semibold text-[#9AA7BA]">
          <Link className="transition hover:text-white" to="/challenges">
            Challenges
          </Link>
          <ChevronRight size={15} />
          <span className="text-white">{challenge.title}</span>
        </div>

        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-7">
            <HeroCard challenge={challenge} />

            <Panel icon={FileText} title="Challenge Description">
              <div className="space-y-5 text-[14px] leading-7 text-[#AAB4C3]">
                {challenge.brief.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </Panel>

            <Panel
              icon={ClipboardList}
              title="Requirements"
              iconColor="text-[#F59E0B]"
            >
              <div className="space-y-3">
                {challenge.requirements.map((item, index) => (
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
                This challenge supports teams of up to{" "}
                {challenge.collaboration.maxMembers} members. Invite
                collaborators by email or username.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <div className="flex -space-x-3">
                  {challenge.collaboration.currentMembers.map((member) => (
                    <img
                      alt={member.name}
                      className="h-10 w-10 rounded-full border-2 border-[#131C2E] object-cover"
                      key={member.name}
                      src={member.avatar}
                    />
                  ))}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#131C2E] bg-[#182237] text-[#8B5CF6]">
                    <Plus size={18} />
                  </div>
                </div>
                <p className="text-[13px] font-semibold text-[#AAB4C3]">
                  {challenge.collaboration.note}
                </p>
              </div>
              <div className="mt-6 flex gap-3">
                <input
                  className="h-11 min-w-0 flex-1 rounded-full bg-[#0D1626] px-4 text-[13px] text-white placeholder:text-[#8E9AAF] outline-none"
                  placeholder="Invite by username or email..."
                  onChange={(event) => setInvitee(event.target.value)}
                  value={invitee}
                />
                <button
                  className="flex h-11 items-center gap-2 rounded-2xl bg-[#1C273A] px-4 text-[13px] font-bold text-white"
                  onClick={() => {
                    const value = invitee.trim();
                    if (value) {
                      setInviteMessage(`Invitation sent to ${value}.`);
                      setInvitee("");
                    }
                  }}
                  type="button"
                >
                  <UserPlus size={16} />
                  Invite
                </button>
              </div>
              {inviteMessage ? (
                <p className="mt-3 text-[13px] font-semibold text-emerald-400">
                  {inviteMessage}
                </p>
              ) : null}
            </Panel>
          </div>

          <div className="space-y-7 lg:sticky lg:top-24 lg:self-start">
            <ApplyCard challenge={challenge} />
            <CompanyCard company={challenge.company} />
          </div>
        </div>
      </motion.main>
    </DashboardLayout>
  );
}
