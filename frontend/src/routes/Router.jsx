import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import CreateChallengePage from "../components/dashboard/CreateChallengePage";
import ChallengeDetailsPage from "../components/dashboard/ChallengeDetailsPage";
import CompanySubmissionsReviewPage from "../components/dashboard/CompanySubmissionsReviewPage";
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
        <Route path="/challenges/:slug" element={<ChallengeDetailsPage />} />

        {/* Protected routes */}
        <Route
          path="/create-challenge"
          element={
            <ProtectedRoute>
              <CreateChallengePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company-submissions"
          element={
            <ProtectedRoute>
              <CompanySubmissionsReviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/submit-solution"
          element={
            <ProtectedRoute>
              <SubmitSolutionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/challenges/:slug/submit"
          element={
            <ProtectedRoute>
              <SubmitSolutionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <StudentDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute>
              <StudentDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company-dashboard"
          element={
            <ProtectedRoute>
              <CompanyDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/company-profile"
          element={
            <ProtectedRoute>
              <ProfilePage type="company" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/complete-profile/company"
          element={
            <ProtectedRoute>
              <ProfilePage type="company" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage type="intern" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/complete-profile/intern"
          element={
            <ProtectedRoute>
              <ProfilePage type="intern" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-feedback"
          element={
            <ProtectedRoute>
              <StudentFeedbackPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/submissions/:id"
          element={
            <ProtectedRoute>
              <SolutionDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
