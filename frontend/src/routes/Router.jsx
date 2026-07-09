import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Challenges from "../pages/Challenges";
import CreateChallengePage from "../components/dashboard/CreateChallengePage";
import SubmitSolutionPage from "../components/dashboard/SubmitSolutionPage";
import CompanySubmissionsReviewPage from "../components/dashboard/CompanySubmissionsReviewPage";
import StudentFeedbackPage from "../components/dashboard/StudentFeedbackPage";
import CompanyDashboardPage from "../pages/CompanyDashboardPage";
import CompanyRegistration from "../pages/CompanyRegistration";
import StudentDashboardPage from "../pages/StudentDashboardPage";
import StudentRegistration from "../pages/StudentRegistration";
import ChallengeDetailsPage from "../components/dashboard/ChallengeDetailsPage";
// import ProtectedRoute from "./ProtectedRoute";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* protected route */}
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/challenges/:slug" element={<ChallengeDetailsPage />} />
        <Route path="/login" element={<Login />} />
        {/* protected route */}
        <Route path="/company-dashboard" element={<CompanyDashboardPage />} />
        {/* protected route */}
        <Route path="/create-challenge" element={<CreateChallengePage />} />
        {/* protected route */}
        <Route
          path="/company-submissions"
          element={<CompanySubmissionsReviewPage />}
        />
        {/* protected route */}
        <Route path="/submit-solution" element={<SubmitSolutionPage />} />
        {/* protected route */}
        <Route path="/challenges/:slug/submit" element={<SubmitSolutionPage />} />
        <Route path="/company-registration" element={<CompanyRegistration />} />
        {/* protected route */}
        <Route path="/dashboard" element={<StudentDashboardPage />} />
        <Route path="/register" element={<StudentRegistration />} />
        {/* protected route */}
        <Route path="/student-dashboard" element={<StudentDashboardPage />} />
        {/* protected route */}
        <Route path="/student-feedback" element={<StudentFeedbackPage />} />
        <Route path="/student-registration" element={<StudentRegistration />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
