import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext({
  token: null,
  hasSubscription: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [hasSubscription, setHasSubscription] = useState(false);

  // Carrega dados do localStorage ao montar
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("nanaAuth"));
    if (saved?.token) {
      setToken(saved.token);
      setHasSubscription(saved.hasSubscription);
    }
  }, []);

  const login = ({ access_token, has_active_subscription }) => {
    setToken(access_token);
    setHasSubscription(has_active_subscription);
    localStorage.setItem(
      "nanaAuth",
      JSON.stringify({
        token: access_token,
        hasSubscription: has_active_subscription,
      })
    );
  };

  const logout = () => {
    localStorage.removeItem("nanaAuth");
    setToken(null);
    setHasSubscription(false);
    window.location.href = "/login";
  };

  // injeta header automaticamente
  useEffect(() => {
    api.interceptors.request.use((config) => {
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, hasSubscription, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
