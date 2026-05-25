import { Routes, Route } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { CatalogPage } from "../pages/CatalogPage";
import { InstitutionPage } from "../pages/InstitutionPage";

export function AppRoutes() {
	return (
		<Routes>
			<Route path="/" element={<HomePage />} />
			<Route path="/catalog" element={<CatalogPage />} />
			<Route path="/institutions/:id" element={<InstitutionPage />} />
		</Routes>
	);
}
