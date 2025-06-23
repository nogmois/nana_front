// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const hasSub = localStorage.getItem("hasSubscription") === "true";
  const trialEnd = localStorage.getItem("trialEnd");
  const location = useLocation();

  // 1) Se não estiver logado, manda pra /login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2) Fluxo de Onboarding
  const onboarded = localStorage.getItem("onboardingComplete") === "true";

  // 2a) Se não fez onboarding e não está já em /onboarding, força lá
  if (!onboarded && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }
  // 2b) Se já fez onboarding e tenta ir pra /onboarding, manda pro dashboard
  if (onboarded && location.pathname === "/onboarding") {
    return <Navigate to="/dashboard" replace />;
  }

  // 3) Verificação de assinatura/trial
  const trialStillValid = trialEnd && new Date(trialEnd).getTime() > Date.now();
  const protectedRoutes = ["/dashboard", "/review", "/charts", "/settings"];
  const mustHaveSub = protectedRoutes.includes(location.pathname);

  if (mustHaveSub && !hasSub && !trialStillValid) {
    return <Navigate to="/plans" replace />;
  }

  // 4) Tudo ok, libera a rota
  return children;
}
