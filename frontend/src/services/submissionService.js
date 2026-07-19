import { apiRequest } from "./apiClient.js";

export async function fetchSubmissions(params = {}) {
  // params: { page, page_size, search, status }
  const config = {};
  if (params && Object.keys(params).length) {
    config.params = params;
  }
  return apiRequest("get", "/api/submissions/", null, config);
}

export async function fetchSubmissionById(id) {
  return apiRequest("get", `/api/submissions/${id}/`);
}
