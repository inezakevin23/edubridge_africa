import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("edubridge_user"));
    } catch {
      return null;
    }
  });

  const login = (role, email) => {
    const username = email.split("@")[0];
    const nextUser = { role, email, first_name: username };
    localStorage.setItem("edubridge_user", JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem("edubridge_user");
    localStorage.removeItem("edubridge_access_token");
    localStorage.removeItem("edubridge_refresh_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: Boolean(user), login, logout }}
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
