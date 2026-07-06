import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Challenges from "../pages/Challenges";
import CreateChallengePage from "../components/dashboard/CreateChallengePage";
import CompanyDashboardPage from "../pages/CompanyDashboardPage";
import CompanyRegistration from "../pages/CompanyRegistration";
import StudentDashboardPage from "../pages/StudentDashboardPage";
import StudentRegistration from "../pages/StudentRegistration";
import ProtectedRoute from "./ProtectedRoute";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/company-dashboard"
          element={
            <ProtectedRoute>
              <CompanyDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-challenge"
          element={
            <ProtectedRoute>
              <CreateChallengePage />
            </ProtectedRoute>
          }
        />
        <Route path="/company-registration" element={<CompanyRegistration />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <StudentDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/register" element={<StudentRegistration />} />
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute>
              <StudentDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/student-registration" element={<StudentRegistration />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
