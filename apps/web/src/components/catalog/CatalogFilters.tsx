import type { AgencyType } from "../../types/agency";
import { Icon } from "../ui/Icon";
import css from "../../styles/CatalogFilters.module.css";

type CatalogFiltersProps = {
  agencyTypes: AgencyType[];
  isLoading: boolean;
  error: string | null;
  selectedType: string;
  onTypeChange: (type: string) => void;
  onReset: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
};

export function CatalogFilters({
  agencyTypes,
  isLoading,
  error,
  selectedType,
  onTypeChange,
  onReset,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}: CatalogFiltersProps) {
  return (
    <aside className={css.filtersPanel}>
      <h2 className={css.filtersHeader}>
        <Icon name="Filter" size={36} className={css.filterIcon} />
        <span className={css.filterTitle}>Фільтри</span>
      </h2>

      <div className={css.fieldGroup}>
        <span className={css.labelTitle}>Пошук</span>
        <div className={css.searchInputWrapper}>
          <input
            id="search"
            type="text"
            className={css.input}
            placeholder="Назва установи..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <Icon name="Search" size={20} className={css.searchIcon} />
        </div>
      </div>

      <div className={css.fieldGroup}>
        <span className={css.labelTitle}>Категорія</span>
        <select
          className={css.select}
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
          disabled={isLoading || !!error}
        >
          {isLoading ? (
            <option>Завантаження категорій...</option>
          ) : error ? (
            <option>Помилка завантаження</option>
          ) : (
            <>
              <option value="">Усі категорії</option>
              {agencyTypes.map((type) => (
                <option key={type.id} value={type.slug}>
                  {type.name}{" "}
                  {type.count !== undefined ? `(${type.count})` : ""}
                </option>
              ))}
            </>
          )}
        </select>
      </div>

      <div className={css.fieldGroup}>
        <span className={css.labelTitle}>Сортування</span>
        <select
          className={css.select}
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="name">За назвою</option>
          <option value="createdAt_desc">Спочатку нові</option>
          <option value="createdAt_asc">Спочатку старі</option>
        </select>
      </div>

      <button type="button" className={css.resetButton} onClick={onReset}>
        Скинути фільтри
      </button>
    </aside>
  );
}
