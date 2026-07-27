import { apiRequest, toFormData } from "./apiClient";

/**
 * Fetch the authenticated intern's profile.
 */
export async function fetchInternProfile() {
  return apiRequest("get", "/api/profiles/intern/me/");
}

/**
 * Create or update the authenticated intern's profile.
 */
export async function updateInternProfile(payload) {
  const formData = toFormData(payload);
  return apiRequest("put", "/api/profiles/intern/me/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

/**
 * Fetch the authenticated company's profile.
 */
export async function fetchCompanyProfile() {
  return apiRequest("get", "/api/profiles/company/me/");
}

/**
 * Create or update the authenticated company's profile.
 */
export async function updateCompanyProfile(payload) {
  const formData = toFormData(payload);
  return apiRequest("put", "/api/profiles/company/me/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

/**
 * Fetch list of industries (for company registration).
 */
export async function fetchIndustries() {
  return apiRequest("get", "/api/profiles/industries/");
}

/**
 * Fetch an intern's public profile by user ID (for company viewing).
 */
export async function fetchInternProfileById(userId) {
  return apiRequest("get", `/api/profiles/intern/${userId}/`);
}
