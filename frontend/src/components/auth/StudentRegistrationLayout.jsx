import StudentRegistrationForm from "./StudentRegistrationForm";
import StudentRegistrationLeft from "./StudentRegistrationLeft";

export default function StudentRegistrationLayout() {
  return (
    <div className="grid min-h-screen bg-[#0B1020] text-white lg:grid-cols-[minmax(390px,544px)_1fr]">
      <StudentRegistrationLeft />
      <StudentRegistrationForm />
    </div>
  );
}
