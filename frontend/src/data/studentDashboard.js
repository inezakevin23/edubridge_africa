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

export const studentDashboardFilters = [
  "All Challenges",
  "Technology",
  "Design & UX",
  "Business Strategy",
  "Social Impact",
];

export const studentDashboardStats = [
  { label: "Active Challenges", value: "3", icon: BriefcaseBusiness, color: "text-[#9B6CFF]" },
  { label: "My Submissions", value: "6", icon: Inbox, color: "text-[#60A5FA]" },
  { label: "Total Score Points", value: "842", icon: Trophy, color: "text-[#F59E0B]" },
  { label: "Times Shortlisted", value: "1", icon: UserCheck, color: "text-[#22C55E]" },
];

export const studentDashboardChallenges = [
  {
    title: "Supply Chain Optimization",
    company: "Jumia",
    tags: ["Logistics", "Data", "Advanced"],
    xp: "1200 XP",
    time: "2 days left",
    initials: "SC",
  },
  {
    title: "Fintech App Onboarding UX",
    company: "Flutterwave",
    tags: ["UI/UX", "Research", "Intermediate"],
    xp: "800 XP",
    time: "5 days left",
    initials: "UX",
  },
  {
    title: "Sustainable Agri-Tech Model",
    company: "Nourish Africa",
    tags: ["Strategy", "Impact", "Beginner"],
    xp: "450 XP",
    time: "1 week left",
    initials: "AG",
  },
];
