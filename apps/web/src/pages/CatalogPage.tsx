import { PageContainer } from "../components/layout/PageContainer";
import { mockInstitutions } from "../data/mockInstitutions";
import { CatalogFilters } from "../components/catalog/CatalogFilters";
import { CatalogToolbar } from "../components/catalog/CatalogToolbar";
import { InstitutionList } from "../components/catalog/InstitutionList";
import { Pagination } from "../components/catalog/Pagination";
import { useEffect, useState } from "react";
import type { AgencyType } from "../types/agency";
import { getAgencyTypes } from "../api/agencyTypes";
import css from "./CatalogPage.module.css";

export function CatalogPage() {
  const [agencyTypes, setAgencyTypes] = useState<AgencyType[]>([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState<boolean>(true);
  const [typesError, setTypesError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>("");

  useEffect(() => {
    async function fetchTypes() {
      try {
        setIsLoadingTypes(true);
        const data = await getAgencyTypes();
        setAgencyTypes(data);
      } catch (err) {
        console.error("Помилка завантаження типів агенцій:", err);
        setTypesError("Не вдалося завантажити категорії");
      } finally {
        setIsLoadingTypes(false);
      }
    }
    fetchTypes();
  }, []);

  const handleResetFilters = () => {
    setSelectedType("");
  };
  return (
    <main className="section">
      <PageContainer>
        <div className={css.headerBlock}>
          <h1 className={css.title}>Каталог державних установ</h1>
        </div>

        <div className={css.catalogLayout}>
          <CatalogFilters
            agencyTypes={agencyTypes}
            isLoading={isLoadingTypes}
            error={typesError}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            onReset={handleResetFilters}
          />

          <section className={css.catalogContent}>
            <CatalogToolbar count={mockInstitutions.length} />
            <InstitutionList institutions={mockInstitutions} />
            <Pagination />
          </section>
        </div>
      </PageContainer>
    </main>
  );
}
