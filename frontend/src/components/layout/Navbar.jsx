import { useState } from "react";
import { Globe, Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0B1020]/80 border-b border-white/5">
      <nav className="max-w-7xl mx-auto flex justify-between items-center px-6 lg:px-10 py-5">
        {/* Logo */}

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-600 to-purple-500 flex items-center justify-center">
            <Globe size={20} />
          </div>

          <h1 className="text-2xl font-bold">EduBridge</h1>
        </div>

        {/* Desktop Menu */}

        <ul className="hidden lg:flex gap-10 text-gray-400">
          <li className="hover:text-white cursor-pointer transition">
            For Students
          </li>

          <li className="hover:text-white cursor-pointer transition">
            For Companies
          </li>

          <li className="hover:text-white cursor-pointer transition">
            Challenges
          </li>

          <li className="hover:text-white cursor-pointer transition">About</li>
        </ul>

        {/* Desktop Buttons */}

        <div className="hidden lg:flex items-center gap-5">
          <button className="text-gray-300 hover:text-white">Sign In</button>

          <button className="bg-violet-600 hover:bg-violet-500 rounded-xl px-6 py-3 transition">
            Get Started
          </button>
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
            <a href="#">For Students</a>

            <a href="#">For Companies</a>

            <a href="#">Challenges</a>

            <a href="#">About</a>

            <button className="bg-violet-600 rounded-xl py-3">
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
