import logo from "../../assets/edubridge-logo.png";
import { Link } from "react-router-dom";

export default function EduBridgeLogo({ className = "", showText = true }) {
  return (
    <Link
      to="/"
      className={`flex items-center gap-3 cursor-pointer ${className}`}
    >
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
    </Link>
  );
}
