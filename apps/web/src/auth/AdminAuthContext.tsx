import { useMemo, useState, type ReactNode } from "react";
import { AdminAuthContext } from "./adminAuthStore";

const ADMIN_TOKEN_KEY = "admin_token";

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(ADMIN_TOKEN_KEY),
  );

  const login = async (email: string, password: string) => {
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || "admin@gmail.com";
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";

    if (email === adminEmail && password === adminPassword) {
      const fakeToken = "admin-local-token";

      localStorage.setItem(ADMIN_TOKEN_KEY, fakeToken);
      setToken(fakeToken);

      return true;
    }

    return false;
  };

  const logout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setToken(null);
  };

  const value = useMemo(
    () => ({
      isAdmin: Boolean(token),
      login,
      logout,
    }),
    [token],
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}