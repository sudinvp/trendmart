import { createContext, useState } from "react";
import API from "../axios";

const AuthContext = createContext({
  user: null,
  token: null,
  isAdmin: false,
  isAuthenticated: false,
  authError: "",
  login: async (username, password) => false,
  register: async (payload) => false,
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [authError, setAuthError] = useState("");

  const persistSession = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const login = async (username, password) => {
    setAuthError("");
    try {
      const response = await API.post("/auth/login", { username, password });
      const { token: newToken, username: uname, email, role } = response.data;
      persistSession(newToken, { username: uname, email, role });
      return true;
    } catch (error) {
      setAuthError(
        (error.response && error.response.data) || "Login failed. Please try again."
      );
      return false;
    }
  };

  const register = async ({ username, email, password, role, adminCode }) => {
    setAuthError("");
    try {
      const response = await API.post("/auth/register", {
        username,
        email,
        password,
        role,
        adminCode,
      });
      const { token: newToken, username: uname, email: uemail, role: urole } = response.data;
      persistSession(newToken, { username: uname, email: uemail, role: urole });
      return true;
    } catch (error) {
      setAuthError(
        (error.response && error.response.data) || "Registration failed. Please try again."
      );
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const isAuthenticated = !!token;
  const isAdmin = user?.role === "ADMIN";

  return (
    <AuthContext.Provider
      value={{ user, token, isAdmin, isAuthenticated, authError, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
