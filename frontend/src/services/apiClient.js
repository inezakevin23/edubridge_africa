import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const storage = typeof window !== "undefined" ? window.localStorage : null;

const getStoredToken = (key) => {
  if (!storage) return null;

  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
};

const setStoredToken = (key, value) => {
  if (!storage) return;

  try {
    if (value) {
      storage.setItem(key, value);
    } else {
      storage.removeItem(key);
    }
  } catch {
    // Ignore storage write issues.
  }
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = getStoredToken("edubridge_access_token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    if (typeof config.headers?.delete === "function") {
      config.headers.delete("Content-Type");
    } else {
      delete config.headers["Content-Type"];
    }
  }

  return config;
});

let isRefreshing = false;
let pendingRequests = [];

const processQueue = (error, token = null) => {
  pendingRequests.forEach((promise) => {
    if (error) {
      promise.reject(error);
      return;
    }

    promise.resolve(token);
  });
  pendingRequests = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingRequests.push({ resolve, reject });
        }).then(() => apiClient(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getStoredToken("edubridge_refresh_token");
        if (!refreshToken) {
          throw new Error("Missing refresh token");
        }

        const refreshResponse = await apiClient.post(
          "/api/auth/token/refresh/",
          {
            refresh: refreshToken,
          },
        );

        const nextAccessToken =
          refreshResponse?.data?.data?.access || refreshResponse?.data?.access;
        if (nextAccessToken) {
          setStoredToken("edubridge_access_token", nextAccessToken);
          processQueue(null, nextAccessToken);
          originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;
          return apiClient(originalRequest);
        }

        throw new Error("Refresh response missing access token");
      } catch (refreshError) {
        setStoredToken("edubridge_access_token", null);
        setStoredToken("edubridge_refresh_token", null);
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export function normalizeApiResponse(response) {
  const payload = response?.data;

  if (!payload || typeof payload !== "object") {
    return null;
  }

  if (payload.success === false) {
    const error = new Error(payload.message || "Request failed");
    error.fieldErrors = payload.errors || null;
    throw error;
  }

  return payload.data ?? null;
}

export function toFormData(payload) {
  const formData = new FormData();

  Object.entries(payload || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(key, item));
      return;
    }

    formData.append(key, value);
  });

  return formData;
}

export function buildApiError(error) {
  const responseData = error?.response?.data;
  const fieldErrors = error?.fieldErrors || responseData?.errors || null;

  let message = responseData?.message || null;

  if (
    !message &&
    responseData &&
    typeof responseData === "object" &&
    !Array.isArray(responseData)
  ) {
    const values = Object.values(responseData);
    const firstValue = values[0];
    if (firstValue) {
      if (Array.isArray(firstValue)) {
        message = firstValue[0] || null;
      } else if (typeof firstValue === "string") {
        message = firstValue;
      }
    }
  }

  message = message || error?.message || "Request failed";
  const apiError = new Error(message);
  apiError.fieldErrors = fieldErrors;
  apiError.status = error?.response?.status || null;
  return apiError;
}

export async function apiRequest(method, url, data = null, config = {}) {
  const isFormData = data instanceof FormData;
  const requestConfig = {
    ...config,
    method,
    url,
    ...(data !== null ? { data } : {}),
  };

  if (!isFormData && requestConfig.headers?.["Content-Type"] === undefined) {
    requestConfig.headers = {
      ...requestConfig.headers,
      "Content-Type": "application/json",
    };
  }

  try {
    const response = await apiClient(requestConfig);
    return normalizeApiResponse(response);
  } catch (error) {
    throw buildApiError(error);
  }
}

export default apiClient;
