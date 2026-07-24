// Mock response for GET /api/submissions/form-config and GET /api/submissions/team
import {
  FileText,
  Monitor,
  Code2,
  PenTool,
  Grid2X2,
  BriefcaseBusiness,
} from "lucide-react";

export const submitSolutionNavItems = [
  ["Dashboard", Grid2X2],
  ["Challenges", BriefcaseBusiness],
];

export const submitSolutionDeliverables = [
  {
    key: "report",
    title: "Written Report",
    copy: "PDF / DOCX upload or link",
    placeholder: "Paste report link",
    icon: FileText,
    accept: ".pdf,.doc,.docx",
    primary: true,
  },
  {
    key: "deck",
    title: "Presentation Deck",
    copy: "PPT / PDF upload or link",
    placeholder: "Paste slide deck link",
    icon: Monitor,
    accept: ".ppt,.pptx,.pdf",
  },
  {
    key: "code",
    title: "Code / Repository",
    copy: "GitHub link or ZIP upload",
    placeholder: "Paste GitHub repository link",
    icon: Code2,
    accept: ".zip",
  },
  {
    key: "prototype",
    title: "Design Prototype",
    copy: "Figma link or file upload",
    placeholder: "Paste prototype link",
    icon: PenTool,
    accept: ".fig,.sketch,.pdf,.png,.jpg,.jpeg",
  },
  {
    key: "video",
    title: "Video Walkthrough",
    copy: "Video link",
    placeholder: "Paste video walkthrough link",
    icon: Monitor,
    linkOnly: true,
  },
];

export const initialSubmissionForm = {
  title: "",
  summary: "",
  methodology: "",
  deliverables: {},
  reviewerNote: "",
};

export const initialTeamMembers = [
  {
    id: 1,
    name: "Adebayo Oladipo",
    role: "Lead Analyst",
    badge: "You",
    avatar: "https://i.pravatar.cc/100?img=32",
  },
  {
    id: 2,
    name: "Fatima Sule",
    role: "Data Visualisation",
    badge: "",
    avatar: "https://i.pravatar.cc/100?img=47",
  },
];
