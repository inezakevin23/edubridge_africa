// Mock response for GET /api/challenges and GET /api/challenges/categories
import {
  BriefcaseBusiness,
  Grid2X2,
  Medal,
  MessageSquare,
  TrendingUp,
  UserRound,
} from "lucide-react";
import { challengeList } from "./challengeDetails";

export const challengesPageNavItems = [
  ["Dashboard", Grid2X2],
  ["Challenges", BriefcaseBusiness],
  ["My Passport", UserRound],
  ["Leaderboard", Medal],
  ["Career Insights", TrendingUp],
  ["Community", MessageSquare],
];

export const challengeCategories = [
  ["All", "9"],
  ["Business"],
  ["Technology"],
  ["Design"],
  ["Social Impact"],
  ["Finance"],
  ["Healthcare"],
];

export { challengeList };
