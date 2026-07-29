import { apiRequest, toFormData } from "./apiClient";

export async function fetchInternProfile() {
  return apiRequest("get", "/api/profiles/intern/me/");
}

export async function updateInternProfile(payload) {
  const formData = toFormData(payload);
  return apiRequest("put", "/api/profiles/intern/me/", formData);
}

export async function fetchCompanyProfile() {
  return apiRequest("get", "/api/profiles/company/me/");
}

export async function updateCompanyProfile(payload) {
  const formData = toFormData(payload);
  return apiRequest("put", "/api/profiles/company/me/", formData);
}

export async function fetchIndustries() {
  return apiRequest("get", "/api/profiles/industries/");
}

export async function fetchInternProfileById(userId) {
  return apiRequest("get", `/api/profiles/intern/${userId}/`);
}
