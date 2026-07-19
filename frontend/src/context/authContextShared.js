export function getInitialStoredUser(normalizeUser) {
  try {
    const storedUser = JSON.parse(localStorage.getItem("edubridge_user"));
    return storedUser ? normalizeUser(storedUser) : null;
  } catch {
    return null;
  }
}

export function logoutAndClearTokens(setUser) {
  localStorage.removeItem("edubridge_user");
  localStorage.removeItem("edubridge_access_token");
  localStorage.removeItem("edubridge_refresh_token");
  setUser(null);
}
