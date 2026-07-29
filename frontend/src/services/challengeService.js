import { apiRequest } from "./apiClient.js";

function normalizeChallenge(payload) {
  const title = payload.title || "Untitled challenge";
  const companyName =
    payload.company?.company_name ||
    (typeof payload.company === "string" ? payload.company : "Unknown company");

  // industry may be a plain string (from list serializer) or an IndustrySerializer object {id, name} (from detail serializer)
  const rawIndustry =
    typeof payload.industry === "object" && payload.industry !== null
      ? payload.industry.name
      : payload.industry;
  const industry = rawIndustry || "General";

  const deadline = payload.submission_deadline
    ? new Date(payload.submission_deadline).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }) +
      " at " +
      new Date(payload.submission_deadline).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    : "Flexible deadline";

  // Helper to extract a string from a field that could be a string or an object with .name
  const extractName = (val, fallback) => {
    if (typeof val === "object" && val !== null) return val.name || fallback;
    return val || fallback;
  };

  // Build company object when the API returns a full company profile
  const companyObj =
    typeof payload.company === "object" && payload.company !== null
      ? {
          name: payload.company.company_name || companyName,
          legalName:
            payload.company.legal_name ||
            payload.company.company_name ||
            companyName,
          industry: extractName(payload.company.industry, industry),
          description:
            payload.company.description ||
            `${payload.company.company_name || companyName} - A challenge partner.`,
          is_verified:
            payload.company.is_verified ||
            payload.company.verification_status === "verified",
        }
      : {
          name: companyName,
          legalName: companyName,
          industry: industry,
          description: `${companyName} - A challenge partner.`,
          is_verified: Boolean(payload.company_is_verified),
        };

  return {
    id: payload.id,
    title,
    status: payload.status || "published",
    submissions: payload.submissions_count || 0,
    slug:
      payload.slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
    company: companyName,
    companyObj,
    tags: [industry],
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
    submission_formats: payload.submission_formats || [],
    max_team_size: payload.max_team_size || 1,
    brief: [payload.description || ""],
    collaboration: {
      maxMembers: payload.max_team_size || 1,
      currentMembers: [],
      note: `Team collaboration is enabled for this challenge (max ${payload.max_team_size || 1} members).`,
    },
    companyMeta: payload.company || null,
    deadline,
    deadline_raw: payload.submission_deadline || null,
    summary: payload.description || "",
  };
}

export async function fetchChallenges(params = {}, signal) {
  const config = {};
  if (params && Object.keys(params).length) config.params = params;
  if (signal) config.signal = signal;
  const response = await apiRequest("get", "/api/challenges/", null, config);

  const payload = Array.isArray(response?.results)
    ? response.results
    : Array.isArray(response)
      ? response
      : [];

  return {
    results: payload.map(normalizeChallenge),
    count: response?.count ?? payload.length,
    page: response?.page ?? 1,
    pages: response?.pages ?? 1,
  };
}

export async function fetchChallengeRawById(id) {
  const response = await apiRequest("get", `/api/challenges/${id}/`);
  return response;
}

export async function fetchChallengeById(id) {
  const response = await apiRequest("get", `/api/challenges/${id}/`);
  return normalizeChallenge(response);
}

export async function fetchChallengeBySlug(slug) {
  // First get the paginated results, destructure to access the results array
  const { results } = await fetchChallenges();
  const match = results.find((c) => c.slug === slug);
  if (!match || !match.id) return null;
  // Fetch full detail data (includes description, requirements, company profile etc.)
  return fetchChallengeById(match.id);
}

export async function createChallenge(payload) {
  return apiRequest("post", "/api/challenges/create/", payload);
}

export async function updateChallenge(id, payload) {
  return apiRequest("patch", `/api/challenges/${id}/update/`, payload);
}

export async function fetchMyChallenges(params = {}) {
  const config = {};
  if (params && Object.keys(params).length) config.params = params;
  const response = await apiRequest("get", "/api/challenges/my/", null, config);
  const payload = Array.isArray(response) ? response : response?.results || [];
  return payload.map(normalizeChallenge);
}

export async function deleteChallenge(id) {
  return apiRequest("delete", `/api/challenges/${id}/delete/`);
}
