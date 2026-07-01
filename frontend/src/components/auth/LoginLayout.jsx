import LoginLeft from "./LoginLeft";
import LoginForm from "./LoginForm";

export default function LoginLayout() {
  return (
    <div className="grid min-h-screen overflow-hidden bg-[#0B1020] text-white lg:grid-cols-[minmax(430px,594px)_1fr]">
      <LoginLeft />

      <LoginForm />
    </div>
  );
}
