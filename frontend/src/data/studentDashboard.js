// Mock response for GET /api/student/dashboard
import {
  BriefcaseBusiness,
  Grid2X2,
  Inbox,
  MessageSquareText,
  Trophy,
  UserCheck,
  UserRound,
} from "lucide-react";

export const studentDashboardNavItems = [
  ["Dashboard", Grid2X2],
  ["Challenges", BriefcaseBusiness],
  ["Feedback", MessageSquareText],
  ["Profile", UserRound],
];

export const studentDashboardStats = [
  {
    label: "Active Challenges",
    value: "3",
    icon: BriefcaseBusiness,
    color: "text-[#9B6CFF]",
  },
  { label: "My Submissions", value: "6", icon: Inbox, color: "text-[#60A5FA]" },
  {
    label: "Total Score Points",
    value: "842",
    icon: Trophy,
    color: "text-[#F59E0B]",
  },
  {
    label: "Times Shortlisted",
    value: "1",
    icon: UserCheck,
    color: "text-[#22C55E]",
  },
];

export const studentDashboardChallenges = [
  {
    title: "Supply Chain Optimization",
    company: "Jumia",
    tags: ["Logistics", "Data"],
    cash_prize: "R 12,000",
    time: "2 days left",
    initials: "SC",
  },
  {
    title: "Fintech App Onboarding UX",
    company: "Flutterwave",
    tags: ["UI/UX", "Research"],
    cash_prize: "R 8,000",
    time: "5 days left",
    initials: "UX",
  },
  {
    title: "Sustainable Agri-Tech Model",
    company: "Nourish Africa",
    tags: ["Strategy", "Impact"],
    cash_prize: null,
    time: "1 week left",
    initials: "AG",
  },
];
