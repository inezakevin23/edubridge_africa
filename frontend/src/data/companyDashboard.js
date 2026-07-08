// Mock response for GET /api/company/dashboard
import {
  BriefcaseBusiness,
  ChartPie,
  CheckSquare,
  Inbox,
  Star,
  TrendingUp,
  UsersRound,
} from "lucide-react";

export const companyDashboardNavItems = [
  ["Dashboard", ChartPie],
  ["Manage Challenges", BriefcaseBusiness],
  ["Talent Discovery", UsersRound],
  ["Analytics", ChartPie],
  ["Submissions", CheckSquare],
];

export const companyDashboardMetrics = [
  {
    label: "Active Challenges",
    value: "4",
    trend: "+1",
    icon: BriefcaseBusiness,
    color: "text-[#9B6CFF]",
  },
  {
    label: "Total Submissions",
    value: "142",
    trend: "+24%",
    icon: Inbox,
    color: "text-[#60A5FA]",
  },
  {
    label: "Avg. Submission Quality",
    value: "92%",
    trend: "+5%",
    icon: Star,
    color: "text-[#F59E0B]",
  },
  {
    label: "Talent Pipeline",
    value: "38",
    trend: "+12",
    icon: UsersRound,
    color: "text-[#22C55E]",
  },
];

export const companyDashboardChartData = [
  ["Mon", 28, 12],
  ["Tue", 34, 28],
  ["Wed", 30, 16],
  ["Thu", 35, 48],
  ["Fri", 35, 31],
  ["Sat", 33, 61],
  ["Sun", 35, 42],
];

export const companyDashboardReviewItems = [
  {
    name: "Amina B.",
    project: "Supply Chain Model",
    score: "98%",
    avatar: "https://i.pravatar.cc/100?img=47",
  },
  {
    name: "Kwame O.",
    project: "UX Audit",
    score: "95%",
    avatar: "https://i.pravatar.cc/100?img=12",
  },
  {
    name: "Sarah T.",
    project: "Growth Strategy",
    score: "91%",
    avatar: "https://i.pravatar.cc/100?img=32",
  },
];

export const companyDashboardActiveChallenges = [
  ["Supply Chain Optimization", "Open", "45", "Oct 24", "Active"],
  ["Q4 Growth Strategy", "Private", "12", "Oct 28", "Active"],
  ["UX Audit: Checkout Flow", "Open", "85", "Oct 15", "Reviewing"],
];

export const companyDashboardTalent = [
  {
    name: "Adebayo O.",
    role: "Product Designer",
    level: "Lvl 12",
    badges: "8",
  },
  {
    name: "Fatima S.",
    role: "Data Analyst",
    level: "Lvl 15",
    badges: "12",
  },
];
