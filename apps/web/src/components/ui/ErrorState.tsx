import css from "../../styles/ErrorState.module.css";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = "Виникла помилка при завантаженні даних. Спробуйте пізніше!",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className={css.container}>
      <p className={css.message}>{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className={css.retryButton}>
          Повторити спробу
        </button>
      )}
    </div>
  );
}
