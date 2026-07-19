import { createContext } from "react";

// Central shared AuthContext used across useAuth and AuthProvider
export const AuthContext = createContext(null);

export default AuthContext;
