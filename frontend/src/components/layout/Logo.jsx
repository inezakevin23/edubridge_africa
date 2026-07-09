import logo from "../../assets/edubridge-logo.png";

export default function EduBridgeLogo({ className = "", showText = true }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex h-12 w-12 items-center justify-center">
        <img
          src={logo}
          alt="EduBridge logo"
          className="h-9 w-9 object-contain"
        />
      </div>

      {showText ? (
        <span className="text-lg font-extrabold text-white">EduBridge</span>
      ) : null}
    </div>
  );
}
