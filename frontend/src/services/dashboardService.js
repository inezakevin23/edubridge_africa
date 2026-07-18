import { apiRequest } from "./apiClient.js";

export async function fetchInternDashboardStats() {
  return apiRequest("get", "/api/dashboard/intern/");
}

export async function fetchCompanyDashboardStats() {
  return apiRequest("get", "/api/dashboard/company/");
}
