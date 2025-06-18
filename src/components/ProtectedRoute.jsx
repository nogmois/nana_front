// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const hasSub = localStorage.getItem("hasSubscription") === "true";
  const trialEnd = localStorage.getItem("trialEnd");
  const loc = useLocation();

  if (!token) return <Navigate to="/login" replace />;

  const trialStillValid = trialEnd && new Date(trialEnd).getTime() > Date.now();

  // Rotas que exigem assinatura ou trial válido
  const protectedRoutes = ["/dashboard", "/review", "/charts", "/settings"];
  const mustHaveSub = protectedRoutes.includes(loc.pathname);

  if (mustHaveSub && !hasSub && !trialStillValid) {
    return <Navigate to="/plans" replace />;
  }

  return children;
}
