//src/utils/auth.js

export const getToken = () => localStorage.getItem("token");
export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};
