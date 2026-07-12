import CompanyRegistrationForm from "./CompanyRegistrationForm";
import CompanyRegistrationLeft from "./CompanyRegistrationLeft";

export default function CompanyRegistrationLayout() {
  return (
    <div className="grid h-screen overflow-hidden bg-[#0B1020] text-white lg:grid-cols-[minmax(390px,544px)_1fr]">
      <CompanyRegistrationLeft />
      <CompanyRegistrationForm />
    </div>
  );
}
