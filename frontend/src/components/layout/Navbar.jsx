import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import EduBridgeLogo from "./Logo";
import useAuth from "../../context/useAuth";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [redirectTarget, setRedirectTarget] = useState("");
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!notice || !redirectTarget) return;

    const timer = setTimeout(() => {
      setNotice("");
      setRedirectTarget("");
      navigate(redirectTarget, { replace: true });
    }, 1600);

    return () => clearTimeout(timer);
  }, [notice, redirectTarget, navigate]);

  function redirectWithNotice(message, target) {
    setNotice(message);
    setRedirectTarget(target);
  }

  function handleInternsClick(e) {
    e.preventDefault();
    if (!isAuthenticated) {
      redirectWithNotice(
        "Please sign in to access the intern dashboard; redirecting you to login...",
        "/login",
      );
      return;
    }
    if (user?.role && user.role !== "intern") {
      redirectWithNotice(
        "You do not have access to the intern dashboard; redirecting you to your company dashboard...",
        "/company-dashboard",
      );
      return;
    }
    navigate("/student-dashboard");
  }

  function handleCompaniesClick(e) {
    e.preventDefault();
    if (!isAuthenticated) {
      redirectWithNotice(
        "Please sign in to access the company dashboard; redirecting you to login...",
        "/login",
      );
      return;
    }
    if (user?.role && user.role !== "company") {
      redirectWithNotice(
        "You do not have access to the company dashboard; redirecting you to your intern dashboard...",
        "/student-dashboard",
      );
      return;
    }
    navigate("/company-dashboard");
  }

  return (
    <>
      {/* Notice Overlay */}
      {notice && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0B1020]/70 backdrop-blur-sm">
          <div className="mx-auto max-w-xl p-6 text-center">
            <p className="rounded-md bg-amber-500/10 px-4 py-3 text-sm font-semibold text-amber-300 border border-amber-500/20">
              {notice}
            </p>
          </div>
        </div>
      )}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0B1020]/80 border-b border-white/5">
        <nav className="max-w-7xl mx-auto flex justify-between items-center px-6 lg:px-10 py-5">
          <EduBridgeLogo />
          <ul className="hidden lg:flex gap-10 text-gray-400">
            <li>
              <a
                className="hover:text-white cursor-pointer transition"
                href="#"
                onClick={handleInternsClick}
              >
                For Interns
              </a>
            </li>
            <li>
              <a
                className="hover:text-white cursor-pointer transition"
                href="#"
                onClick={handleCompaniesClick}
              >
                For Companies
              </a>
            </li>
            <li>
              <Link
                className="hover:text-white cursor-pointer transition"
                to="/challenges"
              >
                Challenges
              </Link>
            </li>
          </ul>
          <div className="hidden lg:flex items-center gap-5">
            {isAuthenticated && user ? (
              <>
                <span className="text-gray-200">
                  Hello,{" "}
                  {user.role === "company" && user.company_name
                    ? user.company_name
                    : user.first_name || user.username || user.email}
                </span>
                <button
                  onClick={() => {
                    logout();
                    navigate("/", { replace: true });
                  }}
                  className="text-gray-300 hover:text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="text-gray-300 hover:text-white" to="/login">
                  Sign In
                </Link>
                <Link
                  className="bg-violet-600 hover:bg-violet-500 rounded-xl px-6 py-3 transition"
                  to="/register"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
          <button onClick={() => setOpen(!open)} className="lg:hidden">
            {open ? <X /> : <Menu />}
          </button>
        </nav>
        {open && (
          <div className="lg:hidden bg-[#111827] border-t border-white/10">
            <div className="flex flex-col p-6 space-y-4">
              {/* Main navigation links - always visible on mobile */}
              <a
                className="hover:text-white text-gray-400 cursor-pointer transition"
                href="#"
                onClick={handleInternsClick}
              >
                For Interns
              </a>
              <a
                className="hover:text-white text-gray-400 cursor-pointer transition"
                href="#"
                onClick={handleCompaniesClick}
              >
                For Companies
              </a>
              <Link
                className="hover:text-white text-gray-400 transition"
                to="/challenges"
              >
                Challenges
              </Link>

              {/* Auth section */}
              <div className="border-t border-white/10 pt-4 mt-4">
                {isAuthenticated && user ? (
                  <>
                    <span className="block font-semibold text-white mb-3">
                      Hello,{" "}
                      {user.role === "company" && user.company_name
                        ? user.company_name
                        : user.first_name || user.username || user.email}
                    </span>
                    <button
                      onClick={() => {
                        logout();
                        navigate("/", { replace: true });
                      }}
                      className="text-left text-gray-300 hover:text-white"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link
                      className="text-center text-gray-300 hover:text-white"
                      to="/login"
                    >
                      Sign In
                    </Link>
                    <Link
                      className="bg-violet-600 hover:bg-violet-500 rounded-xl py-3 text-center text-white"
                      to="/register"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
