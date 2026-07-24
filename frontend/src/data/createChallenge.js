// Mock response for GET /api/challenges/form-config
import {
  BriefcaseBusiness,
  CheckSquare,
  Code2,
  FileArchive,
  FileText,
  LayoutDashboard,
  UserRound,
  Video,
  WalletCards,
} from "lucide-react";

export const createChallengeNavItems = [
  ["Dashboard", LayoutDashboard],
  ["Manage Challenges", BriefcaseBusiness],
  ["Submissions", CheckSquare],
  ["Profile", UserRound],
];

export const createChallengeSteps = [
  { id: 1, label: "Basic Info" },
  { id: 2, label: "Requirements" },
  { id: 3, label: "Rewards & Access" },
  { id: 4, label: "Review & Publish" },
];

export const createChallengeInitialForm = {
  title: "",
  description: "",
  category: "",
  industry: "",
  skills: ["Data Analysis", "Strategy", "Logistics"],
  difficulty: "",
  duration: "",
  requirements: ["", "", ""],
  formats: ["Written Report", "Design File", "Code Repository"],
  cash_prize: "",
  deadline: "",
  maxTeamSize: "",
  participantStatus: "",
  accessType: "open",
  prize: "",
};

export const createChallengeFormatOptions = [
  {
    label: "Written Report",
    sublabel: "PDF / DOCX",
    icon: FileText,
    mode: "fileOrLink",
    accept: ".pdf,.doc,.docx",
  },
  {
    label: "Design File",
    sublabel: "Figma file or link",
    icon: FileArchive,
    mode: "fileOrLink",
    accept: ".fig,.sketch,.pdf,.png,.jpg,.jpeg",
  },
  {
    label: "Code Repository",
    sublabel: "GitHub link",
    icon: Code2,
    mode: "linkOnly",
  },
  {
    label: "Slide Deck",
    sublabel: "PPT / PDF",
    icon: LayoutDashboard,
    mode: "fileOrLink",
    accept: ".ppt,.pptx,.pdf",
  },
  {
    label: "Video Walkthrough",
    sublabel: "Video link",
    icon: Video,
    mode: "linkOnly",
  },
  {
    label: "Spreadsheet",
    sublabel: "Excel / CSV",
    icon: WalletCards,
    mode: "fileOrLink",
    accept: ".xls,.xlsx,.csv",
  },
];
