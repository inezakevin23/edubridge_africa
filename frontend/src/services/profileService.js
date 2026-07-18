import { apiRequest, toFormData } from "./apiClient.js";

export async function fetchIndustries() {
  return apiRequest("get", "/api/profiles/industries/");
}

export async function createInternProfile(payload) {
  const formData = toFormData(payload);
  return apiRequest("post", "/api/profiles/intern/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function updateInternProfile(payload) {
  const formData = toFormData(payload);
  return apiRequest("put", "/api/profiles/intern/me/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function createCompanyProfile(payload) {
  const formData = toFormData(payload);
  return apiRequest("post", "/api/profiles/company/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function updateCompanyProfile(payload) {
  const formData = toFormData(payload);
  return apiRequest("put", "/api/profiles/company/me/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}
