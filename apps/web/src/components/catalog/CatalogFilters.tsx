import type { AgencyType } from "../../types/agency";
import css from "./CatalogFilters.module.css";

type CatalogFiltersProps = {
  agencyTypes: AgencyType[];
  isLoading: boolean;
  error: string | null;
  selectedType: string;
  onTypeChange: (type: string) => void;
  onReset: () => void;
};

export function CatalogFilters({
  agencyTypes,
  isLoading,
  error,
  selectedType,
  onTypeChange,
  onReset,
}: CatalogFiltersProps) {
  return (
    <aside className={`card ${css.filtersPanel}`}>
      <h2 className={css.title}>
        <span className={css.icon}></span>
        Фільтри
      </h2>

      <div className={css.fieldGroup}>
        <span className={css.label}>Пошук</span>
        <div className={css.inputWrapper}>
          <input className={css.input} placeholder="Назва установи..." />
          <span className={css.searchIcon}></span>
        </div>
      </div>

      <div className={css.fieldGroup}>
        <span className={css.label}>Категорія</span>
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
        <span className={css.label}>Регіон</span>
        <select className={css.select}>
          <option>Усі регіони</option>
          <option>Київ</option>
          <option>Львів</option>
        </select>
      </div>

      <button type="button" className={css.resetButton} onClick={onReset}>
        Скинути фільтри
      </button>
    </aside>
  );
}
