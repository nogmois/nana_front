// src/services/api.js

import axios from "axios";

// Base URL configurada via Vite-env, com fallback para localhost
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8012/api",
});

// Interceptor para adicionar token JWT, se existir
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
