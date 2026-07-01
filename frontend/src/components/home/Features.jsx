import { Briefcase, GraduationCap, Award, Building2 } from "lucide-react";

const features = [
  {
    icon: GraduationCap,
    title: "Real-World Learning",
    description:
      "Solve genuine business challenges instead of theoretical assignments.",
  },
  {
    icon: Award,
    title: "Skill Passport",
    description:
      "Earn verifiable reputation credits that showcase your practical abilities.",
  },
  {
    icon: Briefcase,
    title: "Career Opportunities",
    description:
      "Outstanding submissions can lead directly to internships and jobs.",
  },
  {
    icon: Building2,
    title: "Business Innovation",
    description:
      "Companies receive creative solutions while discovering talented future employees.",
  },
];

export default function Features() {
  return (
    <section className="py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center">
          <p className="text-violet-400 font-semibold">Why EduBridge</p>

          <h2 className="text-5xl font-bold mt-4">
            Bridging Education and Employment
          </h2>

          <p className="text-gray-400 mt-6 max-w-3xl mx-auto">
            We connect ambitious students with organizations seeking innovative
            solutions, creating value for both education and business.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="bg-[#121A2F] border border-[#25334D] rounded-2xl p-8 hover:border-violet-500 transition"
              >
                <div className="w-14 h-14 rounded-xl bg-violet-600 flex items-center justify-center mb-6">
                  <Icon />
                </div>

                <h3 className="text-xl font-bold">{feature.title}</h3>

                <p className="text-gray-400 mt-4 leading-7">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
