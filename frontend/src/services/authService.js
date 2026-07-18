import { apiRequest, toFormData } from "./apiClient.js";

export async function loginUser({ email, password }) {
  const response = await apiRequest("post", "/api/auth/login/", {
    email,
    password,
  });
  return response;
}

export async function registerStudent(payload) {
  const body = {
    email: payload.email,
    first_name: payload.fullName?.split(" ")[0] || "",
    last_name: payload.fullName?.split(" ").slice(1).join(" ") || "",
    phone_number: payload.phone,
    username: payload.username,
    role: "intern",
    password: payload.password,
    confirm_password: payload.confirmPassword,
  };

  return apiRequest("post", "/api/auth/register/", body);
}

export async function registerCompany(payload) {
  const body = {
    email: payload.email,
    first_name: payload.representativeName?.split(" ")[0] || "",
    last_name: payload.representativeName?.split(" ").slice(1).join(" ") || "",
    phone_number: payload.phone,
    username: payload.username,
    role: "company",
    password: payload.password,
    confirm_password: payload.confirmPassword,
  };

  return apiRequest("post", "/api/auth/register/", body);
}

export async function getCurrentUser() {
  return apiRequest("get", "/api/auth/me/");
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

export async function createSubmission(payload) {
  const formData = toFormData(payload);
  return apiRequest("post", "/api/submissions/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function getChallenges() {
  return apiRequest("get", "/api/challenges/");
}

export async function getChallengeById(id) {
  return apiRequest("get", `/api/challenges/${id}/`);
}

export async function getDashboardStats() {
  return apiRequest("get", "/api/dashboard/intern/");
}
