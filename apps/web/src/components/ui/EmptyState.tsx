import css from "../../styles/EmptyState.module.css";

interface EmptyStateProps {
  title?: string;
  message?: string;
  onClearFilters?: () => void;
}

export function EmptyState({
  message = "За вашим запитом нічого не знайдено!",
  onClearFilters,
}: EmptyStateProps) {
  return (
    <div className={css.container}>
      <p className={css.message}>{message}</p>
      {onClearFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className={css.clearButton}
        >
          Скинути фільтри
        </button>
      )}
    </div>
  );
}
