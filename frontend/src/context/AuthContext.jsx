import { createContext, useState, useEffect, useCallback } from "react";
import { loginUser, registerUser, getMe } from "../api/authApi";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem("wildshield_token");
    const storedUser = localStorage.getItem("wildshield_user");
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("wildshield_token");
        localStorage.removeItem("wildshield_user");
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await loginUser({ email, password });
    const { token, ...userData } = res.data;
    localStorage.setItem("wildshield_token", token);
    localStorage.setItem("wildshield_user", JSON.stringify(userData));
    setUser(userData);
    return userData;
  }, []);

  const register = useCallback(async (data) => {
    const res = await registerUser(data);
    const { token, ...userData } = res.data;
    localStorage.setItem("wildshield_token", token);
    localStorage.setItem("wildshield_user", JSON.stringify(userData));
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("wildshield_token");
    localStorage.removeItem("wildshield_user");
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await getMe();
      const userData = res.data;
      localStorage.setItem("wildshield_user", JSON.stringify(userData));
      setUser(userData);
    } catch {
      logout();
    }
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
