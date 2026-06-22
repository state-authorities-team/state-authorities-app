import { useEffect, useState } from "react";
import { PageContainer } from "../components/layout/PageContainer";
import styles from "../styles/AdminPage.module.css";
import type { Agency } from "../types/agency";
import { getAgencies } from "../api/agencies";
import { getAgencyTypes } from "../api/agencyTypes";
import type { AgencyType } from "../types/agency";
import { useDebounce } from "../hooks/useDebounce";
import { Pagination } from "../components/catalog/Pagination";
import { AdminToolbar } from "../components/admin/AdminToolbar";
import { AdminCard } from "../components/admin/AdminCard";
import { AdminHero } from "../components/admin/AdminHero";
import { EmptyState } from "../components/ui/EmptyState";

export function AdminPage() {
  const [institutions, setInstitutions] = useState<Agency[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [agencyTypes, setAgencyTypes] = useState<AgencyType[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const debouncedSearch = useDebounce(searchQuery, 500);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };
  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    setCurrentPage(1);
  };
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedType("");
    setSortBy("name");
    setCurrentPage(1);
  };

  useEffect(() => {
    async function fetchTypes() {
      try {
        const data = await getAgencyTypes();
        setAgencyTypes(data);
      } catch (error) {
        console.error("Помилка завантаження категорій:", error);
      }
    }

    fetchTypes();
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadAdminData() {
      try {
        const response = await getAgencies({
          page: currentPage,
          limit: 20,
          type: selectedType || undefined,
          search: debouncedSearch || undefined,
        });

        if (isMounted && response.success) {
          setInstitutions(response.data);
          setTotalPages(response.totalPages);
        }
      } catch (error) {
        console.error("Помилка завантаження даних:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadAdminData();

    return () => {
      isMounted = false;
    };
  }, [currentPage, selectedType, debouncedSearch]);

  return (
    <main className={styles.adminPage}>
      <AdminHero total={institutions.length} />

      <PageContainer>
        <div className={styles.catalogLayout}>
          <aside className={styles.sidebarBlock}>
            <AdminToolbar
              agencyTypes={agencyTypes}
              searchQuery={searchQuery}
              selectedType={selectedType}
              sortBy={sortBy}
              onSearchChange={handleSearchChange}
              onTypeChange={handleTypeChange}
              onSortChange={setSortBy}
              onResetFilters={handleResetFilters}
            />
          </aside>

          <section className={styles.catalogContent}>
            {isLoading ? (
              <p className={styles.loadingText}>
                Завантаження списку установ...
              </p>
            ) : institutions.length === 0 ? (
              <EmptyState onClearFilters={handleResetFilters} />
            ) : (
              institutions.map((inst) => (
                <AdminCard key={inst.id} institution={inst} />
              ))
            )}
            {!isLoading && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </section>
        </div>
      </PageContainer>
    </main>
  );
}
