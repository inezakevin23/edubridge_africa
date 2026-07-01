import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-60 -left-60 w-[700px] h-[700px] rounded-full bg-violet-700/20 blur-[140px]" />

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-700/10 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-16 pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center"
        >
          {/* Badge */}

          <div className="bg-[#18233D] text-yellow-400 rounded-full px-5 py-2 text-sm mb-8 border border-[#283655]">
            ● The New Reputation Economy for Africa
          </div>

          {/* Heading */}

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight max-w-5xl">
            Transforming Real-World
            <br />
            Challenges into{" "}
            <span className="bg-gradient-to-r from-violet-500 via-purple-400 to-orange-400 bg-clip-text text-transparent">
              Career Opportunities
            </span>
          </h1>

          {/* Description */}

          <p className="text-gray-400 text-lg max-w-3xl mt-10 leading-8">
            Connect with top companies by solving real business problems. Build
            a verifiable skill passport, earn reputation, and fast-track your
            career across the continent.
          </p>

          {/* Buttons */}

          <div className="flex flex-col sm:flex-row gap-5 mt-12">
            <button className="px-10 py-4 rounded-xl bg-violet-600 hover:bg-violet-500 transition font-semibold shadow-lg shadow-violet-700/30">
              Start Solving Challenges
            </button>

            <button className="px-10 py-4 rounded-xl bg-[#1A243D] hover:bg-[#26344F] transition">
              Post a Challenge
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
