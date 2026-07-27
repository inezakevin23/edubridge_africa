import { apiRequest } from "./apiClient.js";

export async function fetchNotifications(params = {}) {
  const config = {};
  if (params && Object.keys(params).length) config.params = params;
  return apiRequest("get", "/api/notifications/", null, config);
}

export async function sendJobOffer(recipientId, jobLink) {
  return apiRequest("post", "/api/notifications/send-job-offer/", {
    recipient_id: recipientId,
    job_link: jobLink,
  });
}
