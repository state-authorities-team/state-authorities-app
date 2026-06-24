import type { AgencyType } from "../../types/agency";
import { Icon } from "../ui/Icon";
import styles from "./AdminToolbar.module.css";

type AdminToolbarProps = {
  agencyTypes: AgencyType[];
  searchQuery: string;
  selectedType: string;
  sortBy: string;
  onSearchChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onResetFilters: () => void;
  onAddInstitution: () => void;
  onImportCsv: () => void;
  onExportCsv: () => void;
  isImporting: boolean;
  isExporting: boolean;
  isMutating: boolean;
};

export function AdminToolbar({
  agencyTypes,
  searchQuery,
  selectedType,
  sortBy,
  onSearchChange,
  onTypeChange,
  onSortChange,
  onResetFilters,
  onAddInstitution,
  onImportCsv,
  onExportCsv,
  isImporting,
  isExporting,
  isMutating,
}: AdminToolbarProps) {
  return (
    <div className={styles.filtersPanel}>
      <div className={styles.filtersHeader}>
        <Icon name="Filter" />
        <h2 className={styles.filterTitle}>Фільтри</h2>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.toolbarBtn}
          onClick={onAddInstitution}
          disabled={isMutating}
        >
          <Icon name="Plus" />
          {isMutating ? "Додавання..." : "Додати установу"}
        </button>

        <button
          type="button"
          className={styles.toolbarBtn}
          onClick={onImportCsv}
          disabled={isImporting}
        >
          <Icon name="Upload" />
          {isImporting ? "Імпорт..." : "Імпорт CSV"}
        </button>

        <button
          type="button"
          className={styles.toolbarBtn}
          onClick={onExportCsv}
          disabled={isExporting}
        >
          <Icon name="Download" />
          {isExporting ? "Експорт..." : "Експорт CSV"}
        </button>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.labelTitle}>Пошук</label>

        <div className={styles.inputWrapper}>
          <input
            type="text"
            placeholder="Пошук за назвою..."
            className={styles.input}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />

          <div className={styles.searchIcon}>
            <Icon name="Search" />
          </div>
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <h3 className={styles.labelTitle}>Категорії</h3>

        <select
          className={styles.select}
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
        >
          <option value="">Усі категорії</option>

          {agencyTypes.map((type) => (
            <option key={type.id} value={type.slug}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.fieldGroup}>
        <h3 className={styles.labelTitle}>Типи</h3>

        <select className={styles.select}>
          <option>Усі типи</option>
        </select>
      </div>

      <div className={styles.fieldGroup}>
        <h3 className={styles.labelTitle}>Сортування</h3>

        <select
          className={styles.select}
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="name">За назвою</option>
          <option value="createdAt_desc">Спочатку нові</option>
          <option value="createdAt_asc">Спочатку старі</option>
        </select>
      </div>

      <button
        type="button"
        className={styles.resetButton}
        onClick={onResetFilters}
      >
        Скинути фільтри
      </button>
    </div>
  );
}