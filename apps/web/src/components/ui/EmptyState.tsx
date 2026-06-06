interface EmptyStateProps {
  title?: string;
  message?: string;
  onClearFilters?: () => void;
}

export function EmptyState({
  title = "Нічого не знайдено",
  message = "За вашим запитом не знайдено жодної державної установи.",
  onClearFilters,
}: EmptyStateProps) {
  return (
    <div className="empty-state card">
      <div className="empty-icon">🔍</div>
      <h3>{title}</h3>
      <p>{message}</p>
      {onClearFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="clear-filters-button"
        >
          Скинути фільтри
        </button>
      )}
    </div>
  );
}
