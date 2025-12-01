import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem("token") || "");
  const [role, setRole] = useState(() => sessionStorage.getItem("role") || "");
  const [username, setUsername] = useState(() => sessionStorage.getItem("username") || "");
  const [userId, setUserId] = useState(() => sessionStorage.getItem("userId") || "");

  useEffect(() => {
    token ? sessionStorage.setItem("token", token) : sessionStorage.removeItem("token");
    role ? sessionStorage.setItem("role", role) : sessionStorage.removeItem("role");
    username ? sessionStorage.setItem("username", username) : sessionStorage.removeItem("username");
    userId ? sessionStorage.setItem("userId", userId) : sessionStorage.removeItem("userId");
  }, [token, role, username, userId]);

  const login = ({ user, token: newToken }) => {
    const returnedUser = user || {};
    const id = returnedUser._id || returnedUser.id || "";

    setUsername(returnedUser.username || "");
    setRole(returnedUser.role || "");
    setToken(newToken || "");
    if (id) setUserId(id);
  };

  const logout = () => {
    setToken("");
    setRole("");
    setUsername("");
    setUserId("");
    sessionStorage.clear();
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token, token, role, username, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
