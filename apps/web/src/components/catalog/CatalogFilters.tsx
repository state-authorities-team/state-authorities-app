import { Icon } from "../ui/Icon";
import styles from "../../styles/CatalogFilters.module.css";

export function CatalogFilters() {
  return (
    <form onSubmit={(e) => e.preventDefault()} className={styles.filtersForm}>
      {/* 1. Пошук  */}
      <label>
        <span>Пошук</span>
        <div className={styles.searchInputWrapper}>
          <Icon name="Search" className={styles.searchIcon} />
          <input type="text" placeholder="Назва установи..." />
        </div>
      </label>

      {/* 2. Категорія */}
      <label>
        <span>Категорія</span>
        <select>
          <option value="">Усі категорії</option>
        </select>
      </label>

      {/* 3. Тип установи */}
      <label>
        <span>Тип установи</span>
        <select disabled>
          <option value="">Усі типи</option>
          <option value="central">Центральний орган</option>
          <option value="local">Місцевий орган</option>
        </select>
      </label>

      {/* 4. Регіон */}
      <label>
        <span>Регіон</span>
        <select>
          <option value="">Усі регіони</option>
        </select>
      </label>

      {/* 5. Сортування */}
      <label>
        <span>Сортування</span>
        <select disabled>
          <option value="name_asc">За назвою (А-Я)</option>
        </select>
      </label>

      {/* 6. Кнопка */}
      <button type="button" className={styles.resetButton}>
        Скинути фільтри
      </button>
    </form>
  );
}
