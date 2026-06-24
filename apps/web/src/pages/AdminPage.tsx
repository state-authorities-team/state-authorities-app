import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { PageContainer } from "../components/layout/PageContainer";
import styles from "../styles/AdminPage.module.css";
import type { Agency, AgencyPayload } from "../types/agency";
import {
  createAgency,
  deleteAgency,
  exportAgenciesCsv,
  getAgencies,
  importAgenciesCsv,
  updateAgency,
} from "../api/agencies";
import { getAgencyTypes } from "../api/agencyTypes";
import type { AgencyType } from "../types/agency";
import { useDebounce } from "../hooks/useDebounce";
import { Pagination } from "../components/catalog/Pagination";
import { AdminToolbar } from "../components/admin/AdminToolbar";
import { AdminCard } from "../components/admin/AdminCard";
import { AdminHero } from "../components/admin/AdminHero";
import { AdminAgencyForm } from "../components/admin/AdminAgencyForm";
import { AdminConfirmDialog } from "../components/admin/AdminConfirmDialog";
import { AdminResultDialog } from "../components/admin/AdminResultDialog";
import { EmptyState } from "../components/ui/EmptyState";

const ITEMS_PER_PAGE = 5;

type ResultDialogState = {
  isOpen: boolean;
  variant: "success" | "error";
  title: string;
  message: string;
  details?: string[];
};

export function AdminPage() {
  const [institutions, setInstitutions] = useState<Agency[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [agencyTypes, setAgencyTypes] = useState<AgencyType[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalInstitutions, setTotalInstitutions] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  const [viewingInstitution, setViewingInstitution] =
    useState<Agency | null>(null);

  const [editingInstitution, setEditingInstitution] =
    useState<Agency | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [deletingInstitution, setDeletingInstitution] =
    useState<Agency | null>(null);

  const [resultDialog, setResultDialog] = useState<ResultDialogState>({
    isOpen: false,
    variant: "success",
    title: "",
    message: "",
  });

  const isAnyModalOpen =
    isFormOpen ||
    Boolean(viewingInstitution) ||
    Boolean(deletingInstitution) ||
    resultDialog.isOpen;

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 500);

  const closeResultDialog = () => {
    setResultDialog((current) => ({
      ...current,
      isOpen: false,
    }));
  };

  const getErrorMessage = (error: unknown) => {
    if (typeof error === "object" && error !== null && "response" in error) {
      const response = (
        error as {
          response?: {
            data?: {
              message?: string;
              errors?: { field?: string; message?: string }[];
            };
          };
        }
      ).response;

      const message = response?.data?.message;
      const errors = response?.data?.errors;

      if (errors?.length) {
        return errors
          .map((item) =>
            item.field ? `${item.field}: ${item.message}` : item.message,
          )
          .join("; ");
      }

      if (message) return message;
    }

    return "Сталася невідома помилка.";
  };

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

  const fetchAdminData = useCallback(
    (page = currentPage) => {
      return getAgencies({
        page,
        limit: ITEMS_PER_PAGE,
        type: selectedType || undefined,
        search: debouncedSearch || undefined,
        sortBy,
      });
    },
    [currentPage, selectedType, debouncedSearch, sortBy],
  );

  const applyAdminData = useCallback(
    (response: Awaited<ReturnType<typeof getAgencies>>) => {
      if (response.success) {
        setInstitutions(response.data);
        setTotalPages(response.totalPages || 1);
        setTotalInstitutions(response.total || 0);
      }
    },
    [],
  );

  const reloadAdminData = useCallback(
    async (page = currentPage) => {
      try {
        const response = await fetchAdminData(page);
        applyAdminData(response);
      } catch (error) {
        console.error("Помилка завантаження даних:", error);
        setInstitutions([]);
        setTotalPages(1);
        setTotalInstitutions(0);
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, fetchAdminData, applyAdminData],
  );

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

    fetchAdminData()
      .then((response) => {
        if (!isMounted) return;
        applyAdminData(response);
      })
      .catch((error) => {
        if (!isMounted) return;

        console.error("Помилка завантаження даних:", error);
        setInstitutions([]);
        setTotalPages(1);
        setTotalInstitutions(0);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [fetchAdminData, applyAdminData]);

  useEffect(() => {
    if (!isAnyModalOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isAnyModalOpen]);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportCsv = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setResultDialog({
        isOpen: true,
        variant: "error",
        title: "Невірний формат файлу",
        message: "Будь ласка, оберіть файл у форматі CSV.",
      });

      event.target.value = "";
      return;
    }

    try {
      setIsImporting(true);

      const result = await importAgenciesCsv(file);

      const { totalRows, imported, skipped } = result.data;

      if (imported === 0) {
        setResultDialog({
          isOpen: true,
          variant: "error",
          title: "CSV не імпортовано",
          message:
            "Файл було оброблено, але жодну установу не було імпортовано. Перевірте назви колонок і типи установ у CSV.",
          details: [
            `Усього рядків: ${totalRows}`,
            `Імпортовано: ${imported}`,
            `Пропущено: ${skipped}`,
          ],
        });

        return;
      }

      setResultDialog({
        isOpen: true,
        variant: "success",
        title: skipped > 0 ? "CSV частково імпортовано" : "CSV файл імпортовано",
        message:
          skipped > 0
            ? "Частину установ було імпортовано, але деякі рядки пропущено."
            : "Файл успішно імпортовано.",
        details: [
          `Усього рядків: ${totalRows}`,
          `Імпортовано: ${imported}`,
          `Пропущено: ${skipped}`,
        ],
      });

      setCurrentPage(1);
      await reloadAdminData(1);
    } catch (error) {
      console.error("CSV import failed:", error);

      setResultDialog({
        isOpen: true,
        variant: "error",
        title: "Не вдалося імпортувати CSV",
        message: getErrorMessage(error),
      });
    } finally {
      setIsImporting(false);
      event.target.value = "";
    }
  };

  const handleExportCsv = async () => {
    try {
      setIsExporting(true);
      await exportAgenciesCsv();
    } catch (error) {
      console.error("CSV export failed:", error);

      setResultDialog({
        isOpen: true,
        variant: "error",
        title: "Не вдалося експортувати CSV",
        message: getErrorMessage(error),
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleAddInstitution = () => {
    setEditingInstitution(null);
    setIsFormOpen(true);
  };

  const handleViewInstitution = (institution: Agency) => {
    setViewingInstitution(institution);
  };

  const handleEditInstitution = (institution: Agency) => {
    setEditingInstitution(institution);
    setIsFormOpen(true);
  };

  const handleSaveInstitution = async (payload: AgencyPayload) => {
    try {
      setIsMutating(true);

      if (editingInstitution) {
        await updateAgency(editingInstitution.id, payload);
        await reloadAdminData();
      } else {
        await createAgency(payload);
        setCurrentPage(1);
        await reloadAdminData(1);
      }

      setIsFormOpen(false);
      setEditingInstitution(null);
    } catch (error) {
      console.error("Save agency failed:", error);

      setResultDialog({
        isOpen: true,
        variant: "error",
        title: "Не вдалося зберегти установу",
        message: getErrorMessage(error),
      });
    } finally {
      setIsMutating(false);
    }
  };

  const handleDeleteInstitution = (institution: Agency) => {
    setDeletingInstitution(institution);
  };

  const handleConfirmDeleteInstitution = async () => {
    if (!deletingInstitution) return;

    try {
      setIsMutating(true);

      await deleteAgency(deletingInstitution.id);

      setDeletingInstitution(null);

      setResultDialog({
        isOpen: true,
        variant: "success",
        title: "Установу видалено",
        message: `Установу "${deletingInstitution.name}" було успішно видалено.`,
      });

      if (institutions.length === 1 && currentPage > 1) {
        const previousPage = currentPage - 1;

        setCurrentPage(previousPage);
        await reloadAdminData(previousPage);
      } else {
        await reloadAdminData();
      }
    } catch (error) {
      console.error("Delete agency failed:", error);

      setResultDialog({
        isOpen: true,
        variant: "error",
        title: "Не вдалося видалити установу",
        message: getErrorMessage(error),
      });
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <main className={styles.adminPage}>
      <AdminHero total={totalInstitutions} />

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
              onAddInstitution={handleAddInstitution}
              onImportCsv={handleImportClick}
              onExportCsv={handleExportCsv}
              isImporting={isImporting}
              isExporting={isExporting}
              isMutating={isMutating}
            />

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              hidden
              onChange={handleImportCsv}
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
                <AdminCard
                  key={inst.id}
                  institution={inst}
                  onView={handleViewInstitution}
                  onEdit={handleEditInstitution}
                  onDelete={handleDeleteInstitution}
                />
              ))
            )}

            {!isLoading && totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </section>
        </div>
      </PageContainer>

      <AdminAgencyForm
        isOpen={Boolean(viewingInstitution)}
        agency={viewingInstitution}
        agencyTypes={agencyTypes}
        isSaving={false}
        readOnly
        onClose={() => setViewingInstitution(null)}
        onSubmit={async () => {}}
      />

      <AdminAgencyForm
        isOpen={isFormOpen}
        agency={editingInstitution}
        agencyTypes={agencyTypes}
        isSaving={isMutating}
        onClose={() => {
          setIsFormOpen(false);
          setEditingInstitution(null);
        }}
        onSubmit={handleSaveInstitution}
      />

      <AdminConfirmDialog
        isOpen={Boolean(deletingInstitution)}
        title="Видалити установу?"
        message={
          deletingInstitution
            ? `Ви дійсно хочете видалити "${deletingInstitution.name}"? Цю дію неможливо скасувати.`
            : ""
        }
        confirmText="Видалити"
        cancelText="Скасувати"
        isLoading={isMutating}
        onConfirm={handleConfirmDeleteInstitution}
        onCancel={() => setDeletingInstitution(null)}
      />

      <AdminResultDialog
        isOpen={resultDialog.isOpen}
        variant={resultDialog.variant}
        title={resultDialog.title}
        message={resultDialog.message}
        details={resultDialog.details}
        onClose={closeResultDialog}
      />
    </main>
  );
}