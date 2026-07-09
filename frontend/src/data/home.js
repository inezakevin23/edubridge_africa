// Mock response for GET /api/home/stats and GET /api/home/features
import { Award, Building2, Briefcase, GraduationCap } from "lucide-react";

export const statsData = [
  {
    number: "10K+",
    label: "Active Students",
  },
  {
    number: "500+",
    label: "Partner Companies",
  },
  {
    number: "$2M+",
    label: "In Opportunities",
  },
];

export const featuresData = [
  {
    icon: GraduationCap,
    title: "Real-World Learning",
    description:
      "Solve genuine business challenges instead of theoretical assignments.",
  },
  {
    icon: Award,
    title: "Reputation Credits",
    description:
      "Earn verifiable reputation credits that showcase your practical abilities.",
  },
  {
    icon: Briefcase,
    title: "Career Opportunities",
    description:
      "Outstanding submissions can lead directly to being shortlisted for future employment opportunities",
  },
  {
    icon: Building2,
    title: "Business Innovation",
    description:
      "Companies receive creative solutions while discovering talented future employees.",
  },
];
