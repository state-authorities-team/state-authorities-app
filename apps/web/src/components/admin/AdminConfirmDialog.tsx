import styles from "./AdminConfirmDialog.module.css";

type AdminConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function AdminConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Видалити",
  cancelText = "Скасувати",
  isLoading = false,
  onConfirm,
  onCancel,
}: AdminConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.backdrop}>
      <div className={styles.dialog}>
        <h2 className={styles.title}>{title}</h2>

        <p className={styles.message}>{message}</p>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className={styles.deleteButton}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Видалення..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}