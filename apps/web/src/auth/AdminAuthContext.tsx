import { useMemo, useState, type ReactNode } from "react";
import { loginAdmin, logoutAdmin } from "../api/auth";
import { AdminAuthContext } from "./adminAuthStore";

const ADMIN_AUTH_KEY = "admin_authenticated";

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean>(
    () => localStorage.getItem(ADMIN_AUTH_KEY) === "true",
  );

  const login = async (email: string, password: string) => {
    try {
      await loginAdmin({ email, password });

      localStorage.setItem(ADMIN_AUTH_KEY, "true");
      setIsAdmin(true);

      return true;
    } catch (error) {
      localStorage.removeItem(ADMIN_AUTH_KEY);
      setIsAdmin(false);

      console.warn("Admin login failed:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await logoutAdmin();
    } catch (error) {
      console.warn("Admin logout failed:", error);
    } finally {
      localStorage.removeItem(ADMIN_AUTH_KEY);
      setIsAdmin(false);
    }
  };

  const value = useMemo(
    () => ({
      isAdmin,
      login,
      logout,
    }),
    [isAdmin],
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}