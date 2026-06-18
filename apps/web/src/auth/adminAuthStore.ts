import { createContext } from "react";

export type AdminAuthContextValue = {
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

export const AdminAuthContext = createContext<AdminAuthContextValue | null>(
  null,
);