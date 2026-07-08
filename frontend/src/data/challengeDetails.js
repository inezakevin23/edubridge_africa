// Mock response for GET /api/challenges/:challengeId/details
import {
  BriefcaseBusiness,
  CheckSquare,
  ChartPie,
  Coins,
  Clock3,
  Users,
  BarChart3,
  UserRound,
} from "lucide-react";

export const challengeDetailsNavItems = [
  ["Dashboard", ChartPie],
  ["Manage Challenges", BriefcaseBusiness],
  ["Talent Discovery", UserRound],
  ["Analytics", ChartPie],
  ["Submissions", CheckSquare],
];

export const challengeDetailsTags = [
  "Logistics",
  "Data Analysis",
  "Strategy",
  "Advanced",
];

export const challengeDetailsRequirements = [
  "Analyze the provided dataset (CSV + GeoJSON) covering 6 months of delivery records across 3 cities",
  "Identify the top 3 bottlenecks causing delivery delays and cost overruns",
  "Propose a scalable optimization framework with at least 3 concrete interventions",
  "Build a visual dashboard prototype (Figma or equivalent) to present your findings",
  "Provide a written report (max 2,000 words) summarizing your methodology",
  "Include projected ROI calculations for each proposed intervention",
];

export const challengeDetailsFeedback = [
  {
    label: "Problem Framing",
    score: "85/100",
    value: "85%",
    color: "bg-[#22C55E]",
    note: "Good clarity on scope. Consider narrowing the geographic focus for greater depth.",
  },
  {
    label: "Data Methodology",
    score: "72/100",
    value: "72%",
    color: "bg-[#F59E0B]",
    note: "Strong use of quantitative analysis. Add a qualitative component for balance.",
  },
  {
    label: "Proposed Solution",
    score: "91/100",
    value: "91%",
    color: "bg-[#22C55E]",
    note: "Excellent ROI framing and realistic implementation timeline.",
  },
];

export const challengeDetailsLeaderboard = [
  ["1", "Amina B.", "98%", "https://i.pravatar.cc/100?img=47"],
  ["2", "Kwame O.", "95%", "https://i.pravatar.cc/100?img=12"],
  ["3", "Adebayo O.", "91%", "https://i.pravatar.cc/100?img=32"],
];

export const challengeDetailsApplyRows = [
  ["Reward", "1,200 XP", Coins],
  ["Deadline", "Oct 24, 2024", Clock3],
  ["Participants", "142", Users],
  ["Difficulty", "Advanced", BarChart3],
];

export const challengeDetailsCompany = {
  name: "Jumia Inc.",
  industry: "E-Commerce - Pan-African",
  description:
    "Africa's #1 online marketplace, operating across 11 countries with 3M+ active customers and a mission to transform commerce across the continent.",
  challengesPosted: 12,
  averageRating: 4.9,
};
