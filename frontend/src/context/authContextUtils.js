// Shared pure utilities for AuthContext.
// Kept in a separate module so Fast Refresh/ESLint react-refresh/only-export-components
// does not complain about non-component exports from AuthContext.jsx.

export function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}
