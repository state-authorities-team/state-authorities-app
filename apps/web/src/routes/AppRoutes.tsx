import { Routes, Route } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { CatalogPage } from "../pages/CatalogPage";
import { InstitutionPage } from "../pages/InstitutionPage";
import { AdminPage } from "../pages/AdminPage";
import { LoginPage } from "../pages/LoginPage";
import { ProtectedAdminRoute } from "./ProtectedAdminRoute";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/catalog" element={<CatalogPage />} />
      <Route path="/institutions/:id" element={<InstitutionPage />} />

      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedAdminRoute />}>
        <Route path="/admin" element={<AdminPage />} />
      </Route>
    </Routes>
  );
}