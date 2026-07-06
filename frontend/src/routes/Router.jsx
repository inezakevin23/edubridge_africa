import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Challenges from "../pages/Challenges";
import CompanyDashboardPage from "../pages/CompanyDashboardPage";
import CompanyRegistration from "../pages/CompanyRegistration";
import StudentDashboardPage from "../pages/StudentDashboardPage";
import StudentRegistration from "../pages/StudentRegistration";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/login" element={<Login />} />
        <Route path="/company-dashboard" element={<CompanyDashboardPage />} />
        <Route path="/company-registration" element={<CompanyRegistration />} />
        <Route path="/dashboard" element={<StudentDashboardPage />} />
        <Route path="/register" element={<StudentRegistration />} />
        <Route path="/student-dashboard" element={<StudentDashboardPage />} />
        <Route path="/student-registration" element={<StudentRegistration />} />
      </Routes>
    </BrowserRouter>
  );
}
