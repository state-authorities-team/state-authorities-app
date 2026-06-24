import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAdminAuth } from "../auth/useAdminAuth";

export function ProtectedAdminRoute() {
  const { isAdmin } = useAdminAuth();
  const location = useLocation();

  if (!isAdmin) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}