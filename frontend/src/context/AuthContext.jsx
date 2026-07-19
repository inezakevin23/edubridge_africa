import { useEffect, useState } from "react";
import { getCurrentUser } from "../services/authService";
import { normalizeUser } from "./authUtils";
import {
  getInitialStoredUser,
  logoutAndClearTokens,
} from "./authContextShared";
import { AuthContext } from "./AuthContextCore";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getInitialStoredUser(normalizeUser));
  const [isHydrating, setIsHydrating] = useState(true);

  const persistUser = (nextUser) => {
    if (nextUser) {
      localStorage.setItem("edubridge_user", JSON.stringify(nextUser));
      setUser(nextUser);
      return nextUser;
    }
    localStorage.removeItem("edubridge_user");
    setUser(null);
    return null;
  };

  const logout = () => logoutAndClearTokens(setUser);

  const login = async (fallbackRole, email, nextUserData = null) => {
    const backendPayload = nextUserData?.data?.data || nextUserData;
    const backendUser = backendPayload?.user || backendPayload;

    // Safety check: prioritize the actual role returned by the backend
    const activeRole = backendUser?.role || fallbackRole || "intern";
    const username = email.split("@")[0];

    const nextUser = normalizeUser(
      backendUser || null,
      activeRole.toLowerCase(),
      backendUser?.email || email,
      backendUser?.first_name || username,
    );
    return persistUser(nextUser);
  };

  const syncUser = async () => {
    try {
      const currentUser = await getCurrentUser();

      const currentUserPayload =
        currentUser?.data?.data?.user || currentUser?.data?.data || currentUser;

      if (!currentUserPayload) return null;

      const nextUser = normalizeUser(
        currentUserPayload,
        currentUserPayload?.role || "intern",
        currentUserPayload?.email || "",
        currentUserPayload?.first_name || "",
      );
      return persistUser(nextUser);
    } catch (error) {
      logout();
      throw error;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem("edubridge_access_token");
      if (!accessToken) {
        setIsHydrating(false);
        return;
      }
      try {
        await syncUser();
      } catch {
        localStorage.removeItem("edubridge_user");
        setUser(null);
      } finally {
        setIsHydrating(false);
      }
    };
    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isHydrating,
        login,
        logout,
        syncUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
