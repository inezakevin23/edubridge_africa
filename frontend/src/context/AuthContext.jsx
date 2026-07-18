import { createContext, useContext, useState } from "react";
import { getCurrentUser } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("edubridge_user"));
    } catch {
      return null;
    }
  });

  const login = async (role, email, nextUserData = null) => {
    const username = email.split("@")[0];
    const nextUser = nextUserData || { role, email, first_name: username };
    localStorage.setItem("edubridge_user", JSON.stringify(nextUser));
    setUser(nextUser);
    return nextUser;
  };

  const syncUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      const nextUser = currentUser?.user || currentUser;
      if (nextUser) {
        localStorage.setItem("edubridge_user", JSON.stringify(nextUser));
        setUser(nextUser);
      }
      return nextUser;
    } catch {
      return user;
    }
  };

  const logout = () => {
    localStorage.removeItem("edubridge_user");
    localStorage.removeItem("edubridge_access_token");
    localStorage.removeItem("edubridge_refresh_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: Boolean(user), login, logout, syncUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
