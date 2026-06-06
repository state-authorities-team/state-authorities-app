interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = "Щось пішло не так при завантаженні даних.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="error-state card">
      <div className="error-icon">⚠️</div>
      <h3>Помилка завантаження</h3>
      <p>{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="retry-button">
          Повторити спробу
        </button>
      )}
    </div>
  );
}
