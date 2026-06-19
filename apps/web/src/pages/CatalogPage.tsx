import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { CatalogFilters } from "../components/catalog/CatalogFilters";
import { InstitutionList } from "../components/catalog/InstitutionList";
import { Pagination } from "../components/catalog/Pagination";
import type { AgencyType } from "../types/agency";
import { getAgencyTypes } from "../api/agencyTypes";
import css from "../styles/CatalogPage.module.css";
import { CatalogToolbar } from "../components/catalog/CatalogToolbar";
import { useDebounce } from "../hooks/useDebounce";

import { LoadingState } from "../components/ui/LoadingState";
import { ErrorState } from "../components/ui/ErrorState";
import { EmptyState } from "../components/ui/EmptyState";

import { getAgencies } from "../api/agencies";
import type { Agency } from "../types/agency";
import type { Institution } from "../types/institution";

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedType = searchParams.get("type") || "";

  const [institutions, setInstitutions] = useState<Agency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("name");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const ITEMS_PER_PAGE = 6;

  const [agencyTypes, setAgencyTypes] = useState<AgencyType[]>([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState<boolean>(true);
  const [typesError, setTypesError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalInstitutions, setTotalInstitutions] = useState<number>(0);

  const debouncedSearch = useDebounce(searchQuery, 500);

  const getSortParams = (sortStr: string) => {
    if (sortStr.includes("_")) {
      const [field, order] = sortStr.split("_");
      return { sortBy: field, sortOrder: order };
    }

    return { sortBy: sortStr, sortOrder: "asc" };
  };

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

  const loadInstitutions = useCallback(
    async (
      page: number,
      typeSlug: string,
      searchStr: string,
      currentSort: string,
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        const sortParams = getSortParams(currentSort);

        const response = await getAgencies({
          page,
          limit: ITEMS_PER_PAGE,
          type: typeSlug || undefined,
          search: searchStr || undefined,
          ...sortParams,
        });

        if (response && response.success) {
          setInstitutions(response.data);
          setTotalPages(response.totalPages || 1);
          setTotalInstitutions(response.total || 0);
        }
      } catch (err) {
        console.error("Помилка під час завантаження установ:", err);
        setError("Не вдалося завантажити дані з сервера");
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      setIsLoading(true);
      setError(null);

      try {
        const sortParams = getSortParams(sortBy);

        const response = await getAgencies({
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          type: selectedType || undefined,
          search: debouncedSearch || undefined,
          ...sortParams,
        });

        if (isMounted && response && response.success) {
          setInstitutions(response.data);
          setTotalPages(response.totalPages || 1);
          setTotalInstitutions(response.total || 0);
        }
      } catch (err) {
        console.error("Помилка під час завантаження установ в ефекті:", err);

        if (isMounted) {
          setError("Не вдалося завантажити дані з сервера");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [currentPage, selectedType, debouncedSearch, sortBy]);

  const handleTypeChange = (type: string) => {
    setCurrentPage(1);

    const nextParams = new URLSearchParams(searchParams);

    if (type) {
      nextParams.set("type", type);
    } else {
      nextParams.delete("type");
    }

    setSearchParams(nextParams);
  };

  const handleResetFilters = useCallback(() => {
    setCurrentPage(1);
    setSearchQuery("");
    setSortBy("name");
    setSearchParams({});
  }, [setSearchParams]);

  const handleClearFilters = useCallback(() => {
    handleResetFilters();
  }, [handleResetFilters]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const mappedInstitutions: Institution[] = institutions.map(
    (agency: Agency): Institution => {
      return {
        id: agency.id,
        name: agency.name,
        shortName: agency.shortName || "",
        description: agency.description || "",
        region: agency.region || "Не вказано",
        type:
          agency.agencyType && typeof agency.agencyType === "object"
            ? agency.agencyType.name
            : "Державна установа",
        website: agency.website || "",
        email: agency.email || "",
        phone: agency.phone || "-",
        headName: agency.headName || "Не вказано",
        headTitle: agency.headTitle || "Керівник",
        address: agency.address || "-",
      };
    },
  );

  return (
    <main className="section">
      <PageContainer>
        <div className={css.headerBlock}>
          <h1 className={css.title}>Каталог державних установ</h1>

          <CatalogToolbar count={totalInstitutions} />
        </div>

        <div className={css.catalogLayout}>
          <aside className={css.sidebarFilters}>
            <CatalogFilters
              agencyTypes={agencyTypes}
              isLoading={isLoadingTypes}
              error={typesError}
              selectedType={selectedType}
              onTypeChange={handleTypeChange}
              onReset={handleResetFilters}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              sortBy={sortBy}
              onSortChange={handleSortChange}
            />
          </aside>

          <section className={css.catalogContent}>
            {isLoading && institutions.length === 0 ? (
              <LoadingState message="Завантажуємо каталог установ..." />
            ) : error ? (
              <div className={css.centerMessage}>
                <ErrorState
                  message={error}
                  onRetry={() =>
                    loadInstitutions(
                      currentPage,
                      selectedType,
                      searchQuery,
                      sortBy,
                    )
                  }
                />
              </div>
              
            ) : institutions.length === 0 ? (
              <div className={css.centerMessage}>
                <EmptyState
                  title="Каталог порожній"
                  message="Наразі немає зареєстрованих державних установ за обраними критеріями."
                  onClearFilters={handleClearFilters}
                />
              </div>
            ) : (
              <div className={isLoading ? css.loadingOverlay : ""}>
                <InstitutionList institutions={mappedInstitutions} />

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </section>
        </div>
      </PageContainer>
    </main>
  );
}