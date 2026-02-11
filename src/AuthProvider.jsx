import { createContext, useEffect, useState } from "react";
import { apiGet, apiPost } from "./api";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  // user = null (loading), false (logged out), or object (logged in)
  const [user, setUser] = useState(null);

  const refreshUser = async () => {
    try {
      const { res, data } = await apiGet("/api/me/");
      if (res.ok) setUser(data);
      else setUser(false);
    } catch {
      setUser(false);
    }
  };

  const logout = async () => {
    try {
      await apiPost("/api/logout/", {});
    } catch {}
    setUser(false);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
