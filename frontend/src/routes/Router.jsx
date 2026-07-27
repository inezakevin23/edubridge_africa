import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import CreateChallengePage from "../components/dashboard/CreateChallengePage";
import ChallengeDetailsPage from "../components/dashboard/ChallengeDetailsPage";
import CompanySubmissionsReviewPage from "../components/dashboard/CompanySubmissionsReviewPage";
import InternProfileView from "../components/dashboard/InternProfileView";
import ProfilePage from "../components/dashboard/ProfilePage";
import SolutionDetailPage from "../components/dashboard/SolutionDetailPage";
import StudentFeedbackPage from "../components/dashboard/StudentFeedbackPage";
import SubmitSolutionPage from "../components/dashboard/SubmitSolutionPage";
import CompanyDashboardPage from "../pages/CompanyDashboardPage";
import CompanyRegistration from "../pages/CompanyRegistration";
import Challenges from "../pages/Challenges";
import Landing from "../pages/Landing";
import Login from "../pages/Login";

import StudentDashboardPage from "../pages/StudentDashboardPage";
import StudentRegistration from "../pages/StudentRegistration";
import ProtectedRoute from "./ProtectedRoute";
import useAuth from "../context/useAuth";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/company-registration" element={<CompanyRegistration />} />
        <Route path="/register" element={<StudentRegistration />} />
        <Route path="/student-registration" element={<StudentRegistration />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route
          path="/challenges/:slug/submit"
          element={
            <ProtectedRoute allowedRoles={["intern"]}>
              <SubmitSolutionPage />
            </ProtectedRoute>
          }
        />
        <Route path="/challenges/:slug" element={<ChallengeDetailsPage />} />

        {/* Protected routes */}
        <Route
          path="/create-challenge"
          element={
            <ProtectedRoute allowedRoles={["company"]}>
              <CreateChallengePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-challenge/:id"
          element={
            <ProtectedRoute allowedRoles={["company"]}>
              <CreateChallengePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/company-submissions"
          element={
            <ProtectedRoute allowedRoles={["company"]}>
              <CompanySubmissionsReviewPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/company-dashboard"
          element={
            <ProtectedRoute allowedRoles={["company"]}>
              <CompanyDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/intern-profile/:id"
          element={
            <ProtectedRoute allowedRoles={["company"]}>
              <InternProfileView />
            </ProtectedRoute>
          }
        />

        <Route
          path="/company-profile"
          element={
            <ProtectedRoute allowedRoles={["company"]}>
              <ProfilePage type="company" />
            </ProtectedRoute>
          }
        />

        {/* Intern/Student Workspace Boundaries */}

        <Route
          path="/submit-solution"
          element={
            <ProtectedRoute allowedRoles={["intern"]}>
              <SubmitSolutionPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute allowedRoles={["intern"]}>
              <StudentDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["intern"]}>
              <ProfilePage type="intern" />
            </ProtectedRoute>
          }
        />

        {/* Smart Conditional Hub Router */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {/* If they navigate to /dashboard directly, auto-toggle the page type */}
              <RoleBasedDashboardRedirect />
            </ProtectedRoute>
          }
        />

        <Route
          path="/solution/:id"
          element={
            <ProtectedRoute>
              <SolutionDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/feedback/:id"
          element={
            <ProtectedRoute>
              <StudentFeedbackPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student-feedback"
          element={
            <ProtectedRoute allowedRoles={["intern"]}>
              <StudentFeedbackPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function RoleBasedDashboardRedirect() {
  const { user } = useAuth();
  return user?.role === "company" ? (
    <CompanyDashboardPage />
  ) : (
    <StudentDashboardPage />
  );
}
