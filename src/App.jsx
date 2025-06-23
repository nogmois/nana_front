import { Routes, Route, useLocation } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DiaryPage from "./pages/DiaryPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import ReviewPage from "./pages/ReviewPage";
import ChartsPage from "./pages/ChartsPage";
import SettingsPage from "./pages/SettingsPage";
import PlanPage from "./pages/PlanPage";
import LoginPage from "./pages/login/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import BottomNavbar from "./components/BottomNavbar";
import OnboardingPage from "./pages/onboarding/OnboardingPage";
import RegisterPage from "./pages/login/RegisterPage";
import SuccessPage from "./pages/successPage";
import { TermsPage, PrivacyPage } from "./pages/LegalPages";

export default function App() {
  const location = useLocation();

  // Ocultar o BottomNavbar nessas rotas:
  const hideNavbarRoutes = [
    "/",
    "/login",
    "/register",
    "/terms",
    "/privacy",
    "/onboarding",
  ];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />

        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/review"
          element={
            <ProtectedRoute>
              <ReviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/charts"
          element={
            <ProtectedRoute>
              <ChartsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/plans"
          element={
            <ProtectedRoute>
              <PlanPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/success"
          element={
            <ProtectedRoute>
              <SuccessPage />
            </ProtectedRoute>
          }
        />
      </Routes>

      {shouldShowNavbar && <BottomNavbar />}
    </>
  );
}
