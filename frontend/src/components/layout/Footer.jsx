import { Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-32">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-4 gap-14">
          {/* Brand */}

          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-violet-600 flex justify-center items-center">
                <Globe size={20} />
              </div>

              <h2 className="text-2xl font-bold">EduBridge</h2>
            </div>

            <p className="text-gray-400 mt-6 leading-8">
              Bridging education and employment through real-world business
              challenges.
            </p>
          </div>

          {/* Platform */}

          <div>
            <h3 className="font-semibold mb-5">Platform</h3>

            <ul className="space-y-3 text-gray-400">
              <li>Challenges</li>

              <li>Companies</li>

              <li>Interns</li>

              <li>Credits</li>
            </ul>
          </div>

          {/* Company */}

          <div>
            <h3 className="font-semibold mb-5">Company</h3>

            <ul className="space-y-3 text-gray-400">
              <li>About</li>

              <li>Careers</li>

              <li>Contact</li>

              <li>Privacy</li>
            </ul>
          </div>

          {/* Contact */}

          <div>
            <h3 className="font-semibold mb-5">Contact</h3>

            <p className="text-gray-400">inezakevin23@gmail.com</p>

            <p className="text-gray-400 mt-2">Kigali, Rwanda</p>
          </div>
        </div>

        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between text-gray-500">
          <p>© 2026 EduBridge Africa</p>

          <p>Built by Ineza Kevin</p>
        </div>
      </div>
    </footer>
  );
}
