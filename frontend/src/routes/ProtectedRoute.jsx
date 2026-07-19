import { Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useAuth from "../context/useAuth";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isAuthenticated, isHydrating } = useAuth();
  const navigate = useNavigate();

  const isUnauthorized =
    !isHydrating &&
    isAuthenticated &&
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user?.role);

  const notice = isUnauthorized
    ? `You do not have access to this page; redirecting you to ${user?.role === "company" ? "company" : "intern"} page...`
    : "";

  useEffect(() => {
    let timer;
    if (isUnauthorized) {
      const target =
        user?.role === "company" ? "/company-dashboard" : "/student-dashboard";

      timer = setTimeout(() => {
        navigate(target, { replace: true });
      }, 1600);
    }
    return () => clearTimeout(timer);
  }, [isUnauthorized, user?.role, navigate]);

  if (isHydrating) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (notice) {
    return (
      <div className="mx-auto max-w-xl p-6 text-center mt-20">
        <p className="rounded-md bg-amber-500/10 px-4 py-3 text-sm font-semibold text-amber-300 border border-amber-500/20">
          {notice}
        </p>
      </div>
    );
  }

  return children;
}
