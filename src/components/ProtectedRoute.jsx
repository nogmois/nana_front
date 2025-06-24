// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

// Rotas que devem ficar PUBLICAS (não entram no fluxo de onboarding / subscription)
const PUBLIC_PATHS = ["/", "/login", "/register"];

const PROTECTED_ROUTES = ["/dashboard", "/review", "/charts", "/settings"];

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const onboarded = localStorage.getItem("onboardingComplete") === "true";
  const hasSub = localStorage.getItem("hasSubscription") === "true";
  const trialEnd = localStorage.getItem("trialEnd");
  const location = useLocation();
  const path = location.pathname;

  const skipOnboard = !!location.state?.skipOnboarding;

  // Se for uma rota pública, nem checa token nem onboarding
  if (PUBLIC_PATHS.includes(path)) {
    return children;
  }

  // 1) Se não tiver token, manda pra /login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2) Fluxo de Onboarding
  // Se não fez onboarding e não está em /onboarding, força lá
  if (!onboarded && path !== "/onboarding" && !skipOnboard) {
    return <Navigate to="/onboarding" replace />;
  }
  // Se já fez e tá tentando /onboarding, manda pra /dashboard
  if (onboarded && path === "/onboarding") {
    return <Navigate to="/dashboard" replace />;
  }

  // 3) Verificação de assinatura/trial
  const trialStillValid = trialEnd && new Date(trialEnd).getTime() > Date.now();
  const mustHaveSub = PROTECTED_ROUTES.includes(path);
  if (mustHaveSub && !hasSub && !trialStillValid) {
    return <Navigate to="/plans" replace />;
  }

  // 4) Tudo ok
  return children;
}
