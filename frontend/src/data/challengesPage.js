// Mock response for GET /api/challenges and GET /api/challenges/categories
import { BriefcaseBusiness, Grid2X2 } from "lucide-react";
import { challengeList } from "./challengeDetails";

export const challengesPageNavItems = [
  ["Dashboard", Grid2X2],
  ["Challenges", BriefcaseBusiness],
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
