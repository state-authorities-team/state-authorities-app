import { useCallback, useMemo, useState, type ReactNode } from "react";
import { loginAdmin, logoutAdmin } from "../api/auth";
import { AdminAuthContext } from "./adminAuthStore";

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const login = useCallback(async (email: string, password: string) => {
    try {
      await loginAdmin({ email, password });
      setIsAdmin(true);

      return true;
    } catch (error) {
      console.warn("Admin login failed:", error);
      setIsAdmin(false);

      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutAdmin();
    } catch (error) {
      console.warn("Admin logout failed:", error);
    } finally {
      setIsAdmin(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      isAdmin,
      login,
      logout,
    }),
    [isAdmin, login, logout],
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}