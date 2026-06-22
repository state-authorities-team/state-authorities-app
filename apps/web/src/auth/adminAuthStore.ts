import { createContext } from "react";
import type { AdminAuthContextValue } from "../types/auth";

export const AdminAuthContext = createContext<AdminAuthContextValue | null>(
  null,
);