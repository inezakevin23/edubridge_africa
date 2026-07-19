import { apiRequest } from "./apiClient.js";

export async function fetchHomeStats() {
  return apiRequest("get", "/api/home/stats/");
}

export async function fetchHomeFeatures() {
  return apiRequest("get", "/api/home/features/");
}
