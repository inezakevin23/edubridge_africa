import { apiRequest } from "./apiClient.js";

export async function fetchNotifications(params = {}) {
  const config = {};
  if (params && Object.keys(params).length) config.params = params;
  return apiRequest("get", "/api/notifications/", null, config);
}
