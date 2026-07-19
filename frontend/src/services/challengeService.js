import { apiRequest } from "./apiClient.js";

function normalizeChallenge(payload) {
  const title = payload.title || "Untitled challenge";
  const companyName =
    payload.company?.company_name || payload.company || "Unknown company";
  const industry = payload.industry || "General";
  const deadline = payload.submission_deadline
    ? new Date(payload.submission_deadline).toLocaleDateString()
    : "Flexible deadline";

  return {
    id: payload.id,
    title,
    slug:
      payload.slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
    company: companyName,
    tags: [industry, payload.status === "published" ? "Open" : "Closed"],
    cash_prize: payload.cash_prize || 0,
    time: deadline,
    initials:
      title
        .split(" ")
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase() || "CH",
    color: "bg-violet-500/15 text-[#A879FF]",
    description: payload.description || "",
    requirements:
      payload.requirements?.map((item) => item.description || item) || [],
    brief: [payload.description || ""],
    collaboration: {
      maxMembers: 4,
      currentMembers: [],
      note: "Team collaboration is enabled for this challenge.",
    },
    companyMeta: payload.company || null,
    deadline: payload.submission_deadline || null,
    summary: payload.description || "",
    level: payload.level || "Intermediate",
  };
}

export async function fetchChallenges(params = {}) {
  const config = {};
  if (params && Object.keys(params).length) config.params = params;
  const response = await apiRequest("get", "/api/challenges/", null, config);
  const payload = Array.isArray(response) ? response : response?.results || [];
  return payload.map(normalizeChallenge);
}

export async function fetchChallengeById(id) {
  const response = await apiRequest("get", `/api/challenges/${id}/`);
  return normalizeChallenge(response);
}

export async function fetchChallengeBySlug(slug) {
  const challenges = await fetchChallenges();
  return challenges.find((challenge) => challenge.slug === slug) || null;
}
