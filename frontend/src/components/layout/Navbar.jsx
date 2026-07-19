import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import EduBridgeLogo from "./Logo";
import useAuth from "../../context/useAuth";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0B1020]/80 border-b border-white/5">
      <nav className="max-w-7xl mx-auto flex justify-between items-center px-6 lg:px-10 py-5">
        <EduBridgeLogo />

        {/* Desktop Menu */}

        <ul className="hidden lg:flex gap-10 text-gray-400">
          <li>
            <a
              className="hover:text-white cursor-pointer transition"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (isAuthenticated && user?.role && user.role !== "intern") {
                  navigate(
                    user.role === "company"
                      ? "/company-dashboard"
                      : "/dashboard",
                  );
                } else {
                  navigate("/student-dashboard");
                }
              }}
            >
              For Interns
            </a>
          </li>

          <li>
            <a
              className="hover:text-white cursor-pointer transition"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (isAuthenticated && user?.role && user.role !== "company") {
                  navigate(
                    user.role === "intern"
                      ? "/dashboard"
                      : "/company-dashboard",
                  );
                } else {
                  navigate("/company-dashboard");
                }
              }}
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

        {/* Desktop Buttons */}

        <div className="hidden lg:flex items-center gap-5">
          {isAuthenticated && user ? (
            <>
              <span className="text-gray-200">
                Hello, {user.first_name || user.username || user.email}
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

        {/* Mobile Button */}

        <button onClick={() => setOpen(!open)} className="lg:hidden">
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu */}

      {open && (
        <div className="lg:hidden bg-[#111827] border-t border-white/10">
          <div className="flex flex-col p-6 space-y-6">
            {isAuthenticated && user ? (
              <>
                <span className="font-semibold">
                  {user.first_name || user.username}
                </span>
                <button
                  onClick={() => {
                    logout();
                    navigate("/", { replace: true });
                  }}
                  className="bg-transparent text-left text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/register">For Students</Link>

                <Link to="/company-registration">For Companies</Link>

                <Link to="/challenges">Challenges</Link>

                <Link
                  className="bg-violet-600 rounded-xl py-3 text-center"
                  to="/register"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
