import { apiRequest } from "./apiClient.js";

export async function fetchSubmissions(params = {}) {
  // params: { page, page_size, search, status }
  // Company view - fetches submissions for the company's challenges
  const config = {};
  if (params && Object.keys(params).length) {
    config.params = params;
  }
  return apiRequest("get", "/api/submissions/company/", null, config);
}

export async function fetchMySubmissions(params = {}) {
  // Intern's own submissions (for StudentFeedbackPage and similar)
  const config = {};
  if (params && Object.keys(params).length) {
    config.params = params;
  }
  return apiRequest("get", "/api/submissions/my/", null, config);
}

export async function fetchSubmissionById(id) {
  return apiRequest("get", `/api/submissions/${id}/`);
}

export async function reviewSubmission(id, data) {
  // data: { company_score, feedback, cash_prize_awarded, shortlisted, status }
  return apiRequest("patch", `/api/submissions/company/${id}/review/`, data);
}

export async function fetchCompanySubmissionStats() {
  return apiRequest("get", "/api/submissions/company/statistics/");
}

export async function notifyShortlisted(challengeId) {
  return apiRequest("post", "/api/submissions/company/notify-shortlisted/", {
    challenge_id: challengeId,
  });
}
