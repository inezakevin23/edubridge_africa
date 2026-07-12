import { Star } from "lucide-react";

export default function TestimonialCard({
  avatar = "https://i.pravatar.cc/100?img=32",
  className = "mt-[78px] max-w-[480px] p-6 sm:p-7",
  name = "Amina Bello",
  quote = "EduBridge helped me land a role at Flutterwave right after graduation. My reputation passport did the talking.",
  role = "Product Designer, Flutterwave",
  starSize = 18,
}) {
  return (
    <div
      className={`relative z-10 rounded-[20px] border border-white/10 bg-white/[0.055] backdrop-blur-xl shadow-2xl shadow-black/10 ${className}`}
    >
      <div className="mb-5 flex gap-1">
        {[...Array(5)].map((_, index) => (
          <Star key={index} size={starSize} fill="#F59E0B" color="#F59E0B" />
        ))}
      </div>

      <p className="text-[17px] leading-[1.58] text-white">
        "{quote}"
      </p>

      <div className="mt-7 flex items-center gap-4">
        <img
          src={avatar}
          alt={name}
          className="h-12 w-12 rounded-full border border-white/20 object-cover"
        />

        <div>
          <h3 className="text-[17px] font-bold leading-tight">{name}</h3>

          <p className="mt-1 text-[14px] text-[#A6B1C4]">
            {role}
          </p>
        </div>
      </div>
    </div>
  );
}
