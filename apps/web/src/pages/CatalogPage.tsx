import { useEffect, useState, useCallback } from "react";
import { PageContainer } from "../components/layout/PageContainer";
import { CatalogFilters } from "../components/catalog/CatalogFilters";
import { CatalogToolbar } from "../components/catalog/CatalogToolbar";
import { InstitutionList } from "../components/catalog/InstitutionList";
import { Pagination } from "../components/catalog/Pagination";
import type { AgencyType } from "../types/agency";
import { getAgencyTypes } from "../api/agencyTypes";
import css from "./CatalogPage.module.css";

import { LoadingState } from "../components/ui/LoadingState";
import { ErrorState } from "../components/ui/ErrorState";
import { EmptyState } from "../components/ui/EmptyState";

import { getAgencies } from "../api/agencies";
import type { Agency } from "../types/agency";
import type { Institution } from "../types/institution";

export function CatalogPage() {
  const [institutions, setInstitutions] = useState<Agency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  const loadInstitutions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAgencies();
      setInstitutions(data);
    } catch (err) {
      setError("Не вдалося завантажити список установ. Перевірте з'єднання.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleClearFilters = useCallback(() => {
    loadInstitutions();
  }, [loadInstitutions]);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      if (isMounted) {
        await loadInstitutions();
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [loadInstitutions]);

  const mappedInstitutions: Institution[] = institutions.map((agency) => ({
    id: agency.id,
    name: agency.name,
    description: agency.description || "",
    region: agency.region || "Не вказано",
    phone: "-",
    type: "Державна установа",
    headName: "-",
    headTitle: "-",
    address: "-",
    website: agency.website || "",
    email: agency.email || "",
  }));

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

          <section className="catalog-content">
            {isLoading ? (
              <LoadingState message="Оновлюємо каталог установ..." />
            ) : error ? (
              <ErrorState message={error} onRetry={loadInstitutions} />
            ) : institutions.length === 0 ? (
              <EmptyState
                title="Каталог порожній"
                message="Наразі немає зареєстрованих державних установ за обраними критеріями."
                onClearFilters={handleClearFilters}
              />
            ) : (
              <>
                <CatalogToolbar count={mappedInstitutions.length} />
                <InstitutionList institutions={mappedInstitutions} />
                <Pagination />
              </>
            )}
          </section>
        </div>
      </PageContainer>
    </main>
  );
}
