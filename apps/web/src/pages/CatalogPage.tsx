import { useEffect, useState, useCallback } from "react";
import { PageContainer } from "../components/layout/PageContainer";
import { CatalogFilters } from "../components/catalog/CatalogFilters";
import { CatalogToolbar } from "../components/catalog/CatalogToolbar";
import { InstitutionList } from "../components/catalog/InstitutionList";
import { Pagination } from "../components/catalog/Pagination";

import { LoadingState } from "../components/ui/LoadingState";
import { ErrorState } from "../components/ui/ErrorState";
import { EmptyState } from "../components/ui/EmptyState";

import { getAgencies } from "../api/agencies";
import type { Agency } from "../types/agency";
import type { Institution } from "../types/institution";

const mockAgencies: Agency[] = [
  {
    id: 1,
    name: "Державна митна служба України",
    description:
      "Центральний орган виконавчої влади, який реалізує державну митну політику у сфері митної справи.",
    region: "Київ",
    website: "https://customs.gov.ua",
    email: "customs@gov.ua",
    typeId: 1,
    type: { id: 1, name: "Державна служба", slug: "state-service" },
  },
  {
    id: 2,
    name: "Міністерство цифрової трансформації України",
    description:
      "Формування та реалізація державної політики у сфері цифровізації, відкритих даних та електронного урядування.",
    region: "Київська обл.",
    website: "https://thedigital.gov.ua",
    email: "info@mintsyfra.gov.ua",
    typeId: 2,
    type: { id: 2, name: "Міністерство", slug: "ministry" },
  },
];

export function CatalogPage() {
  const [institutions, setInstitutions] = useState<Agency[]>(mockAgencies);
  const [isLoading, setIsLoading] = useState(false);
  const [error] = useState<string | null>(null);

  const loadInstitutions = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAgencies();
      console.log("Дані з бекенду:", data);

      if (data && data.length > 0) {
        setInstitutions(data);
      } else {
        setInstitutions(mockAgencies);
      }
    } catch (err) {
      console.error("Бекенд відпочиває, працюємо на моках:", err);
      setInstitutions(mockAgencies);
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
    type:
      typeof agency.type === "object" && agency.type !== null
        ? agency.type.name
        : "Державна установа",
    headName: "-",
    headTitle: "-",
    address: "-",
    website: agency.website || "",
    email: agency.email || "",
  }));

  return (
    <main className="section">
      <PageContainer>
        <p className="eyebrow">Довідник установ</p>
        <h1>Каталог державних установ</h1>

        <div className="catalog-layout">
          <CatalogFilters />

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
