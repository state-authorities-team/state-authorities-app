import { PageContainer } from "../components/layout/PageContainer";
import { mockInstitutions } from "../data/mockInstitutions";
import { CatalogFilters } from "../components/catalog/CatalogFilters";
import { CatalogToolbar } from "../components/catalog/CatalogToolbar";
import { InstitutionList } from "../components/catalog/InstitutionList";
import { Pagination } from "../components/catalog/Pagination";

export function CatalogPage() {
	return (
		<main className="section">
			<PageContainer>
				<p className="eyebrow">Довідник установ</p>
				<h1>Каталог державних установ</h1>

				<div className="catalog-layout">
					<CatalogFilters />

					<section className="catalog-content">
						<CatalogToolbar count={mockInstitutions.length} />
						<InstitutionList institutions={mockInstitutions} />
						<Pagination />
					</section>
				</div>
			</PageContainer>
		</main>
	);
}
