import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import EduBridgeLogo from "./Logo";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0B1020]/80 border-b border-white/5">
      <nav className="max-w-7xl mx-auto flex justify-between items-center px-6 lg:px-10 py-5">
        <EduBridgeLogo />

        {/* Desktop Menu */}

        <ul className="hidden lg:flex gap-10 text-gray-400">
          <li>
            <Link
              className="hover:text-white cursor-pointer transition"
              to="/register"
            >
              For Students
            </Link>
          </li>

          <li>
            <Link
              className="hover:text-white cursor-pointer transition"
              to="/company-registration"
            >
              For Companies
            </Link>
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
          <Link className="text-gray-300 hover:text-white" to="/login">
            Sign In
          </Link>

          <Link
            className="bg-violet-600 hover:bg-violet-500 rounded-xl px-6 py-3 transition"
            to="/register"
          >
            Get Started
          </Link>
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
            <Link to="/register">For Students</Link>

            <Link to="/company-registration">For Companies</Link>

            <Link to="/challenges">Challenges</Link>

            <Link
              className="bg-violet-600 rounded-xl py-3 text-center"
              to="/register"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
