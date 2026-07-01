import { Star } from "lucide-react";

export default function TestimonialCard() {
  return (
    <div className="relative z-10 mt-[78px] max-w-[480px] rounded-[20px] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-xl shadow-2xl shadow-black/10 sm:p-7">
      <div className="mb-5 flex gap-1">
        {[...Array(5)].map((_, index) => (
          <Star key={index} size={18} fill="#F59E0B" color="#F59E0B" />
        ))}
      </div>

      <p className="text-[17px] leading-[1.58] text-white">
        "EduBridge helped me land a role at Flutterwave right after graduation.
        My reputation passport did the talking."
      </p>

      <div className="mt-7 flex items-center gap-4">
        <img
          src="https://i.pravatar.cc/100?img=32"
          alt="Student"
          className="h-12 w-12 rounded-full border border-white/20 object-cover"
        />

        <div>
          <h3 className="text-[17px] font-bold leading-tight">Amina Bello</h3>

          <p className="mt-1 text-[14px] text-[#A6B1C4]">
            Product Designer, Flutterwave
          </p>
        </div>
      </div>
    </div>
  );
}
