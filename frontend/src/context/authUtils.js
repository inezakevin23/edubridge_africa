export function normalizeUser(
  userData,
  fallbackRole = "intern",
  fallbackEmail = "",
  fallbackName = "",
) {
  const innerUser = userData?.user || userData;

  if (!innerUser || typeof innerUser !== "object") {
    return {
      role: fallbackRole,
      email: fallbackEmail,
      first_name: fallbackName,
    };
  }

  return {
    ...innerUser,
    role: innerUser.role || fallbackRole,
    email: innerUser.email || fallbackEmail,
    first_name: innerUser.first_name || innerUser.name || fallbackName,
  };
}
